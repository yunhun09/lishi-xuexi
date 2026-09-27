import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { BORDER_SEGMENTS, ZONE_NAMES, ZONE_RING_SPECS } from "../data/borders/topology.mjs";

const require = createRequire(import.meta.url);
const turf = require("../vendor/turf/turf-7.2.0.min.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadWindowValue(relativePath, key) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  const code = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  vm.runInContext(code, sandbox, { filename: relativePath });
  return sandbox.window[key];
}

const LAND_GEOJSON = loadWindowValue("data/land.geojson.js", "LAND_GEOJSON");
const TIMELINE_FRAMES = loadWindowValue("data/timeline.js", "TIMELINE_FRAMES");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureClosed(ring) {
  if (!ring.length) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push([...first]);
  return ring;
}

function ringToFeature(id, ring) {
  const closed = ensureClosed(clone(ring));
  const polygon = turf.polygon([closed], { id, zone: id, name: ZONE_NAMES[id] || id });
  const clipped = turf.intersect(turf.featureCollection([polygon, LAND_GEOJSON]));
  if (!clipped) throw new Error(`Zone ${id} produced empty geometry after land clipping.`);
  clipped.properties = { ...polygon.properties };
  return clipped;
}

function checkFeatureValidity(feature, label) {
  const flattened = turf.flatten(feature).features;
  flattened.forEach((part, index) => {
    const ring = part.geometry.coordinates[0];
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
      throw new Error(`${label} part ${index} is not closed.`);
    }
  });
}

function intersectionArea(featureA, featureB) {
  if (!turf.booleanIntersects(featureA, featureB)) return 0;
  const clipped = turf.intersect(turf.featureCollection([featureA, featureB]));
  return clipped ? turf.area(clipped) : 0;
}

function checkNoOverlap(features, label, epsilon = 1e6) {
  for (let i = 0; i < features.length; i += 1) {
    for (let j = i + 1; j < features.length; j += 1) {
      const area = intersectionArea(features[i], features[j]);
      if (area > epsilon) {
        throw new Error(`${label} overlap: ${features[i].properties.id || features[i].properties.stateId} vs ${features[j].properties.id || features[j].properties.stateId} => ${area.toFixed(0)} m²`);
      }
    }
  }
}

function buildZoneFeatures() {
  const rawFeatures = Object.entries(ZONE_RING_SPECS).map(([id, ring]) => ringToFeature(id, ring));
  const features = [];
  let acceptedMask = null;
  rawFeatures.forEach((feature) => {
    let next = feature;
    if (acceptedMask) {
      next = turf.difference(turf.featureCollection([next, acceptedMask]));
      if (!next) {
        throw new Error(`zone:${feature.properties.id} was fully consumed by earlier topology masks.`);
      }
      next.properties = { ...feature.properties };
    }
    checkFeatureValidity(next, `zone:${next.properties.id}`);
    features.push(next);
    acceptedMask = acceptedMask
      ? turf.union(turf.featureCollection([acceptedMask, next]))
      : clone(next);
  });
  checkNoOverlap(features, "zone topology", 5e8);
  return features.map((feature) => {
    const labelPoint = turf.pointOnFeature(feature).geometry.coordinates;
    return {
      ...feature,
      properties: {
        ...feature.properties,
        labelPoint,
        area: turf.area(feature)
      }
    };
  });
}

function buildStateAssignments(frame, zoneFeatures) {
  const mapByZone = {};
  zoneFeatures.forEach((feature) => {
    mapByZone[feature.properties.zone] = frame.zones[feature.properties.zone] || null;
  });
  return mapByZone;
}

function buildTerritoriesForFrame(frame, zoneFeatures) {
  const stateByZone = buildStateAssignments(frame, zoneFeatures);
  const flattened = zoneFeatures
    .map((feature) => {
      const stateId = stateByZone[feature.properties.zone];
      if (!stateId) return null;
      const part = clone(feature);
      part.properties = { ...feature.properties, stateId };
      return turf.flatten(part).features.map((item) => {
        item.properties = { ...part.properties };
        return item;
      });
    })
    .filter(Boolean)
    .flat();

  const dissolved = turf.dissolve(turf.featureCollection(flattened), { propertyName: "stateId" }).features.map((feature) => {
    feature.properties = {
      stateId: feature.properties.stateId,
      labelPoint: turf.pointOnFeature(feature).geometry.coordinates,
      area: turf.area(feature)
    };
    checkFeatureValidity(feature, `territory:${frame.year}:${feature.properties.stateId}`);
    return feature;
  });

  checkNoOverlap(dissolved, `territories:${frame.year}`, 5e5);
  return dissolved;
}

export function generateTerritoryData() {
  const zoneFeatures = buildZoneFeatures();
  const territoriesByYear = {};
  TIMELINE_FRAMES.forEach((frame) => {
    territoriesByYear[frame.year] = buildTerritoriesForFrame(frame, zoneFeatures);
  });
  return {
    generatedAt: new Date().toISOString(),
    borderSegments: BORDER_SEGMENTS,
    zoneFeatures,
    territoriesByYear
  };
}

export function writeGeneratedFile(outputPath = path.join(repoRoot, "data/territories.generated.js")) {
  const payload = generateTerritoryData();
  const js = `(function () {\n  window.MANUAL_BORDER_SEGMENTS = ${JSON.stringify(payload.borderSegments)};\n  window.MANUAL_ZONE_FEATURES = ${JSON.stringify(payload.zoneFeatures)};\n  window.GENERATED_TERRITORIES_BY_YEAR = ${JSON.stringify(payload.territoriesByYear)};\n  window.TERRITORY_GENERATED_AT = ${JSON.stringify(payload.generatedAt)};\n})();\n`;
  fs.writeFileSync(outputPath, js);
  return { outputPath, ...payload };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = writeGeneratedFile();
  console.log(`Generated ${Object.keys(result.territoriesByYear).length} yearly territory sets.`);
  console.log(`Zones: ${result.zoneFeatures.length}`);
  console.log(`Output: ${path.relative(repoRoot, result.outputPath)}`);
}
