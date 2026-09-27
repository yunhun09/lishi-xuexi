import { createRequire } from "node:module";
import { generateTerritoryData } from "./build-territories.mjs";

const require = createRequire(import.meta.url);
const turf = require("../vendor/turf/turf-7.2.0.min.js");

const BBOX_LIMITS = { minLng: 73, maxLng: 135, minLat: 16, maxLat: 55 };
const exclusionPolygons = {
  india_myanmar_bangladesh: turf.polygon([[
    [73, 15], [97.5, 15], [97.5, 31.5], [93.5, 30.4], [90.6, 28.8], [88.2, 26.4], [84.2, 27.0], [80.0, 29.8], [73, 28.5], [73, 15]
  ]], { id: "india_myanmar_bangladesh" }),
  himalaya_nepal_bhutan: turf.polygon([[
    [79, 26], [92.5, 26], [92.5, 31.5], [79, 31.5], [79, 26]
  ]], { id: "himalaya_nepal_bhutan" }),
  central_asia: turf.polygon([[
    [73, 35], [80.5, 35], [80.5, 55], [73, 55], [73, 35]
  ]], { id: "central_asia" }),
  west_laos: turf.polygon([[
    [99.5, 16], [105, 16], [105, 22.7], [101.1, 22.7], [99.5, 16]
  ]], { id: "west_laos" })
};

function bboxViolation(feature) {
  const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature);
  return minLng < BBOX_LIMITS.minLng || maxLng > BBOX_LIMITS.maxLng || minLat < BBOX_LIMITS.minLat || maxLat > BBOX_LIMITS.maxLat;
}

function exclusionHits(feature) {
  return Object.entries(exclusionPolygons)
    .map(([id, polygon]) => {
      if (!turf.booleanIntersects(feature, polygon)) return null;
      const overlap = turf.intersect(turf.featureCollection([feature, polygon]));
      const area = overlap ? turf.area(overlap) : 0;
      return area > 1e6 ? { id, area } : null;
    })
    .filter(Boolean);
}

function unionZones(data, zones) {
  const selected = data.zoneFeatures.filter((feature) => zones.includes(feature.properties.zone));
  if (!selected.length) return null;
  if (selected.length === 1) return selected[0];
  return turf.union(turf.featureCollection(selected));
}

function main() {
  const data = generateTerritoryData();
  const failures = [];
  const chenghanMask = unionZones(data, ["bashu", "hanzhong", "nanzhong"]);

  Object.entries(data.territoriesByYear).forEach(([year, features]) => {
    features.forEach((feature) => {
      const stateId = feature.properties.stateId;
      if (bboxViolation(feature)) {
        failures.push(`${year} ${stateId}: bbox out of range ${turf.bbox(feature).join(",")}`);
      }
      exclusionHits(feature).forEach((hit) => {
        failures.push(`${year} ${stateId}: intersects excluded mask ${hit.id} (${hit.area.toFixed(0)} m²)`);
      });
      if (stateId === "chenghan" && chenghanMask) {
        const overflow = turf.difference(turf.featureCollection([feature, chenghanMask]));
        if (overflow && turf.area(overflow) > 1e6) {
          failures.push(`${year} chenghan: exceeds Bashu/Hanzhong/Nanzhong mask (${turf.area(overflow).toFixed(0)} m²)`);
        }
      }
    });
  });

  if (failures.length) {
    console.error("Extent check failed:");
    failures.forEach((entry) => console.error(`- ${entry}`));
    process.exitCode = 1;
    return;
  }

  console.log("Extent check passed.");
  console.log(`Frames checked: ${Object.keys(data.territoriesByYear).length}`);
  console.log(`Territories checked: ${Object.values(data.territoriesByYear).reduce((sum, items) => sum + items.length, 0)}`);
  console.log("Mask: bbox 73–135 / 16–55 + manual exclusions for India/Myanmar/Bangladesh/Nepal/Bhutan/central Asia/west Laos.");
}

main();
