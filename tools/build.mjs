import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { feature as topoFeature, merge as topoMerge } from 'topojson-client';

const require = createRequire(import.meta.url);
const turf = require('../vendor/turf/turf-7.2.0.min.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const frontierStates = new Set(['rouran', 'tuque', 'tuyuhun', 'goguryeo', 'gaoche']);

const unitsTopo = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/units.topo.json'), 'utf8'));
const topoObjectName = Object.keys(unitsTopo.objects)[0];
const unitGeometryList = unitsTopo.objects[topoObjectName].geometries;
const unitFeatureCollection = topoFeature(unitsTopo, unitsTopo.objects[topoObjectName]);
const unitFeatures = unitFeatureCollection.features;
const unitToJun = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/unit_to_jun.json'), 'utf8'));
const controlDir = path.join(repoRoot, 'data/control');

function byId(items) {
  return new Map(items.map((item) => [item.properties.id, item]));
}

const unitFeatureById = byId(unitFeatures);
const unitGeomById = byId(unitGeometryList.map((geometry) => ({ properties: geometry.properties, geometry })));

function sortedControlYears() {
  return fs.readdirSync(controlDir)
    .filter((name) => /\d+\.json$/.test(name))
    .map((name) => Number(name.replace('.json', '')))
    .sort((a, b) => a - b);
}

function loadControl(year) {
  const payload = JSON.parse(fs.readFileSync(path.join(controlDir, `${year}.json`), 'utf8'));
  const assign = payload['@assign'] || {};
  const byZone = {};
  const byJun = {};
  Object.entries(assign).forEach(([key, value]) => {
    if (key.startsWith('@zone:')) byZone[key.replace('@zone:', '')] = value;
    else byJun[key] = value;
  });
  return { byZone, byJun };
}

function decodeArc(arcIndex) {
  const index = arcIndex >= 0 ? arcIndex : ~arcIndex;
  const base = unitsTopo.arcs[index];
  return arcIndex >= 0 ? base : base.slice().reverse();
}

function checkAdjacencySample(unitStateMap, year) {
  const arcOwners = new Map();
  unitGeometryList.forEach((geometry) => {
    const id = geometry.properties.id;
    const polygons = geometry.type === 'Polygon' ? [geometry.arcs] : geometry.arcs;
    polygons.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((arcIndex) => {
          const k = Math.abs(arcIndex);
          if (!arcOwners.has(k)) arcOwners.set(k, []);
          arcOwners.get(k).push(id);
        });
      });
    });
  });

  const crossStatePairs = [];
  arcOwners.forEach((owners, absArc) => {
    if (owners.length !== 2) return;
    const [a, b] = owners;
    const sa = unitStateMap.get(a);
    const sb = unitStateMap.get(b);
    if (!sa || !sb || sa === sb) return;
    crossStatePairs.push({ absArc, a, b });
  });

  const sampled = crossStatePairs.slice(0, 300);
  sampled.forEach(({ absArc }) => {
    const arc = unitsTopo.arcs[absArc];
    if (!arc || arc.length < 2) {
      throw new Error(`拓扑抽样校验失败：${year} 年存在异常共享弧。`);
    }
  });
}

function assertControlJunExists(control, allJunSet, year) {
  Object.keys(control.byJun).forEach((jun) => {
    if (!allJunSet.has(jun)) throw new Error(`${year} 年 control 出现未知郡名：${jun}`);
  });
}

function buildYear(year) {
  const control = loadControl(year);
  const allJunSet = new Set(Object.values(unitToJun).map((entry) => entry.jun));
  assertControlJunExists(control, allJunSet, year);

  const byState = new Map();
  const unitStateMap = new Map();
  let missingCore = 0;

  Object.entries(unitToJun).forEach(([unitId, unitMeta]) => {
    const state = control.byJun[unitMeta.jun] || control.byZone[unitMeta.zone] || null;
    if (!state && unitMeta.core) missingCore += 1;
    if (!state) return;
    if (unitStateMap.has(unitId)) {
      throw new Error(`${year} 年单元 ${unitId} 出现重复归属`);
    }
    unitStateMap.set(unitId, state);
    if (!byState.has(state)) byState.set(state, []);
    byState.get(state).push(unitId);
  });

  if (missingCore > 0) {
    throw new Error(`${year} 年核心区域存在 ${missingCore} 个未归属单元（出现空白缝隙）`);
  }

  checkAdjacencySample(unitStateMap, year);

  const territories = [];
  byState.forEach((unitIds, stateId) => {
    const geometries = unitIds.map((id) => unitGeomById.get(id)?.geometry).filter(Boolean);
    const mergedGeom = topoMerge(unitsTopo, geometries);
    const feature = { type: 'Feature', properties: { stateId }, geometry: mergedGeom };
    feature.properties.area = turf.area(feature);
    feature.properties.labelPoint = turf.pointOnFeature(feature).geometry.coordinates;
    feature.properties.frontier = frontierStates.has(stateId) || unitIds.some((id) => unitToJun[id].country !== 'CHN');
    territories.push(feature);
  });

  return {
    territories,
    unitAssignments: Object.fromEntries(unitStateMap)
  };
}

function writeGeneratedFile() {
  const years = sortedControlYears();
  const territoriesByYear = {};
  const assignmentByYear = {};
  years.forEach((year) => {
    const built = buildYear(year);
    territoriesByYear[year] = built.territories;
    assignmentByYear[year] = built.unitAssignments;
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    years,
    territoriesByYear,
    unitMetaById: unitToJun,
    unitAssignmentsByYear: assignmentByYear
  };

  const outputPath = path.join(repoRoot, 'data/territories.generated.js');
  const js = `(function () {\n  window.GENERATED_TERRITORIES_BY_YEAR = ${JSON.stringify(payload.territoriesByYear)};\n  window.UNIT_META_BY_ID = ${JSON.stringify(payload.unitMetaById)};\n  window.UNIT_ASSIGNMENTS_BY_YEAR = ${JSON.stringify(payload.unitAssignmentsByYear)};\n  window.GENERATED_KEYFRAME_YEARS = ${JSON.stringify(payload.years)};\n  window.TERRITORY_GENERATED_AT = ${JSON.stringify(payload.generatedAt)};\n})();\n`;
  fs.writeFileSync(outputPath, js);

  console.log(`构建完成：${years.length} 个年份，${unitFeatures.length} 个单元。`);
  console.log(`输出：${path.relative(repoRoot, outputPath)}`);
  return payload;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeGeneratedFile();
}

export { writeGeneratedFile };
