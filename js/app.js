(function () {
  const mapWrap = document.querySelector(".map-wrap");
  const map = L.map("map", { zoomSnap: 0.25, preferCanvas: true }).setView([34.3, 109.6], 5);
  map.createPane("territoryGlowPane");
  map.getPane("territoryGlowPane").style.zIndex = 360;
  map.createPane("stateLabelPane");
  map.getPane("stateLabelPane").style.zIndex = 640;
  map.createPane("cityLabelPane");
  map.getPane("cityLabelPane").style.zIndex = 660;

  const terrainBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 13,
    attribution: "Shaded relief © Esri — Source: Esri, USGS, NOAA"
  });
  const physicalBase = L.layerGroup([
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 13,
      opacity: 0.86,
      attribution: "Shaded relief © Esri — Source: Esri, USGS, NOAA"
    }),
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 9,
      opacity: 0.72,
      attribution: "Physical map © Esri — Source: US National Park Service"
    })
  ]);
  const antiqueBase = L.layerGroup([
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 13,
      className: "antique-tiles",
      attribution: "Terrain © Esri — Source: USGS, Esri"
    }),
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 9,
      opacity: 0.35,
      className: "antique-tiles",
      attribution: "Physical map © Esri — Source: US National Park Service"
    })
  ]);
  const historicalReferenceLayer = L.layerGroup();
  if (window.HISTORICAL_REFERENCE_OVERLAY?.url) {
    L.imageOverlay(window.HISTORICAL_REFERENCE_OVERLAY.url, window.HISTORICAL_REFERENCE_OVERLAY.bounds, {
      opacity: window.HISTORICAL_REFERENCE_OVERLAY.opacity || 0.38,
      attribution: window.HISTORICAL_REFERENCE_OVERLAY.attribution || "历史地图参考图层"
    }).addTo(historicalReferenceLayer);
  }
  terrainBase.addTo(map);

  const landLayer = L.layerGroup().addTo(map);
  const territoryGlowLayer = L.layerGroup().addTo(map);
  const frameLayers = L.layerGroup().addTo(map);
  const stateLabelLayer = L.layerGroup().addTo(map);
  const citiesLayer = L.layerGroup().addTo(map);
  const countyBoundaryLayer = L.layerGroup();
  const eventLayer = L.layerGroup().addTo(map);
  const battleEntryLayer = L.layerGroup().addTo(map);
  const routeLayer = L.layerGroup().addTo(map);
  const battleSiteLayer = L.layerGroup().addTo(map);
  const battleUnitLayer = L.layerGroup().addTo(map);

  const hydroLayer = L.layerGroup();
  HYDROLOGY.rivers.forEach((river) => {
    L.polyline(river.coords, { color: river.color, weight: river.name === "河" || river.name === "江" ? 3.2 : 2.3, opacity: 0.85 }).bindTooltip(river.fullName || river.name).addTo(hydroLayer);
    const mid = river.coords[Math.floor(river.coords.length / 2)];
    L.marker(mid, {
      icon: L.divIcon({ className: "", html: `<span style="font-size:13px;color:${river.color};font-weight:700;text-shadow:0 0 5px #fff,0 0 10px #fff">${river.name}</span>` })
    }).addTo(hydroLayer);
  });
  (HYDROLOGY.lakes || []).forEach((lake) => {
    L.polygon(lake.polygon, {
      color: "#5e97c8",
      weight: 1,
      fillColor: "#8cbce4",
      fillOpacity: 0.38,
      opacity: 0.88
    }).bindTooltip(lake.fullName || lake.name).addTo(hydroLayer);
    L.marker(lake.label, {
      icon: L.divIcon({ className: "", html: `<span style="font-size:12px;color:#346d9f;font-weight:700;text-shadow:0 0 5px #fff,0 0 10px #fff">${lake.name}</span>` })
    }).addTo(hydroLayer);
  });
  HYDROLOGY.mountains.forEach((mountain) => {
    L.marker([mountain[1], mountain[2]], {
      icon: L.divIcon({ className: "", html: `<span style="font-size:12px;color:#543;font-weight:700;text-shadow:0 0 4px #fff">△${mountain[0]}</span>` })
    }).addTo(hydroLayer);
  });

  const passLayer = L.layerGroup();
  STRATEGIC_FEATURES.passes.forEach((pass) => {
    L.circleMarker([pass[1], pass[2]], {
      radius: 4,
      color: "#000",
      fillColor: "#f7d97a",
      fillOpacity: 1
    }).bindTooltip(`${pass[0]}（关隘）`).addTo(passLayer);
  });
  STRATEGIC_FEATURES.greatWall.forEach((segment) => {
    L.polyline(segment, { color: "#7a5e39", weight: 2, dashArray: "4 5" }).bindTooltip("长城（示意）").addTo(passLayer);
  });

  const migrationLayer = L.layerGroup();
  STRATEGIC_FEATURES.migrations.forEach((route) => {
    L.polyline(route.coords, {
      color: "#ba5a2d",
      weight: 2.5,
      dashArray: "8 4",
      lineCap: "round"
    }).bindTooltip(route.name).addTo(migrationLayer);
  });

  const baseMaps = {
    "地形晕渲（默认）": terrainBase,
    "自然地理（水系）": physicalBase,
    "仿古宣纸风格": antiqueBase
  };
  const overlayMaps = {
    "古代水系与山脉": hydroLayer,
    "关隘与长城": passLayer,
    "民族迁徙箭头": migrationLayer,
    "重要城市": citiesLayer,
    "郡级单元边界（默认关）": countyBoundaryLayer
  };
  if (window.HISTORICAL_REFERENCE_OVERLAY?.url) {
    overlayMaps["历史地图参考（自备合法扫描图）"] = historicalReferenceLayer;
  }
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
  hydroLayer.addTo(map);
  passLayer.addTo(map);
  citiesLayer.addTo(map);
  map.on("baselayerchange", (event) => {
    if (mapWrap) mapWrap.classList.toggle("antique-mode", event.name === "仿古宣纸风格");
  });

  const slider = document.getElementById("timelineSlider");
  const yearEl = document.getElementById("year");
  const eraEl = document.getElementById("era");
  const legendEl = document.getElementById("legend");
  const eventsEl = document.getElementById("events");
  const stateCard = document.getElementById("stateCard");
  const playBtn = document.getElementById("playBtn");
  const speedSelect = document.getElementById("speedSelect");
  const battlePanel = document.getElementById("battlePanel");
  const battleJumpBtn = document.getElementById("battleJumpBtn");
  const battleEntryHint = document.getElementById("battleEntryHint");
  const battleYearList = document.getElementById("battleYearList");
  const battleTimeline = document.getElementById("battleTimeline");

  slider.max = TIMELINE_FRAMES.length - 1;

  const typeStyle = {
    战争: { color: "#bb3121", icon: "⚔" },
    建国: { color: "#2e7d4f", icon: "✦" },
    灭亡: { color: "#5f5f5f", icon: "✕" },
    政变: { color: "#8b3a3a", icon: "☗" },
    迁都: { color: "#3759aa", icon: "⇆" },
    改革: { color: "#825a2f", icon: "⚙" },
    文化: { color: "#7a3f8b", icon: "✒" },
    民族迁徙: { color: "#b1672f", icon: "➤" },
    起义: { color: "#922", icon: "⚑" }
  };

  const battleEntries = Object.entries(BATTLES).map(([id, battle]) => ({ id, ...battle }));
  const territoryCache = new Map();
  const frameStateCache = new Map();

  let currentIndex = 0;
  let selectedState = null;
  let timer = null;
  let activeBattleId = null;
  let activePhaseIndex = 0;
  let battleAutoTimer = null;

  const REGION_FEATURES = buildRegionFeatures();
  drawLandOutline();

  function cloneFeature(feature) {
    return JSON.parse(JSON.stringify(feature));
  }

  function buildRegionFeatures() {
    const points = REGION_SEEDS.map((seed) => [seed.lng, seed.lat]);
    const voronoi = d3.Delaunay.from(points).voronoi(LAND_BBOX);
    return REGION_SEEDS.map((seed, index) => {
      const polygon = voronoi.cellPolygon(index);
      if (!polygon || polygon.length < 3) return null;
      const ring = polygon.map(([lng, lat]) => [Number(lng.toFixed(4)), Number(lat.toFixed(4))]);
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (!last || first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
      const cell = turf.polygon([ring], { id: seed.id, name: seed.name, zone: seed.zone, kind: seed.kind, center: [seed.lat, seed.lng] });
      const clipped = turf.intersect(turf.featureCollection([cell, LAND_GEOJSON]));
      if (!clipped) return null;
      clipped.properties = { ...cell.properties };
      return clipped;
    }).filter(Boolean);
  }

  function drawLandOutline() {
    landLayer.clearLayers();
    L.geoJSON(LAND_GEOJSON, {
      style: {
        color: "#49443b",
        weight: 1.05,
        fillColor: "#f6efd9",
        fillOpacity: 0.08,
        opacity: 0.72
      }
    }).addTo(landLayer);
  }

  function safeState(id) {
    return STATES[id] || { name: id || "未知", short: "?", color: "#777", years: "", founder: "", ethnicity: "", capitals: [], rulers: "", fall: "", family: "未知", pattern: "solid", bannerBasis: "暂无说明。" };
  }

  function decorateFlag(state) {
    const border = state.pattern === "border" ? "2px dashed #241" : "1px solid #222";
    const bg = state.pattern === "ribbon"
      ? `linear-gradient(135deg, ${state.color} 0%, ${state.color} 60%, #f8e7c8 60%, #f8e7c8 75%, ${state.color} 75%)`
      : state.pattern === "dot"
        ? `radial-gradient(circle at 35% 35%, #f5e9ca 0 14%, transparent 15%), ${state.color}`
        : state.color;
    return { border, bg };
  }

  function stateDisplayName(state) {
    return (state.name || "").replace(/（.*?）/g, "").replace(/\(.*?\)/g, "");
  }

  function cityPriority(city) {
    return city.level === "capital" ? 0 : city.level === "major" ? 1 : 2;
  }

  function cityVisibleAtZoom(city, zoom) {
    if (city.level === "capital") return zoom >= 4.6;
    if (city.level === "major") return zoom >= 5.2;
    return zoom >= 6.15;
  }

  function cityActiveInYear(city, year) {
    return year >= city.from && year <= city.to;
  }

  function activeCapitalForCity(city, year) {
    return (city.capitalFor || []).find((entry) => year >= entry.from && year <= entry.to) || null;
  }

  function approxLabelBox(latlng, city, zoom) {
    const pt = map.latLngToLayerPoint(latlng);
    const fontSize = city.level === "capital" ? Math.max(13, zoom * 2.1) : city.level === "major" ? Math.max(11, zoom * 1.7) : Math.max(10, zoom * 1.45);
    const labelText = `${city.name}${city.activeCapital ? "【京】" : ""}`;
    const modernWidth = zoom >= 6.8 ? city.modern.length * 6.6 : 0;
    const width = Math.max(labelText.length * (fontSize * 0.92), modernWidth) + 26;
    const height = zoom >= 6.8 ? 32 : 20;
    return {
      left: pt.x,
      right: pt.x + width,
      top: pt.y - 10,
      bottom: pt.y + height
    };
  }

  function boxesOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function buildStateCard(stateId) {
    const s = safeState(stateId);
    stateCard.innerHTML = `
      <h4 style="margin:0 0 6px">${s.name}</h4>
      <div><b>建立者：</b>${s.founder}</div>
      <div><b>族属：</b>${s.ethnicity}（色系：${s.family}）</div>
      <div><b>都城：</b>${(s.capitals || []).join("、")}</div>
      <div><b>存续：</b>${s.years}</div>
      <div><b>历代君主：</b>${s.rulers}</div>
      <div><b>灭亡原因：</b>${s.fall}</div>
      <div><b>纹样：</b>${s.pattern}</div>
      <div><b>旗色依据：</b>${s.bannerBasis}</div>
    `;
  }

  function battleForYear(year) {
    return battleEntries.filter((battle) => battle.years.includes(year));
  }

  function buildStateAssignments(frame) {
    const cached = frameStateCache.get(frame.year);
    if (cached) return cached;
    const mapByRegion = {};
    REGION_FEATURES.forEach((feature) => {
      mapByRegion[feature.properties.id] = frame.zones[feature.properties.zone] || null;
    });
    frameStateCache.set(frame.year, mapByRegion);
    return mapByRegion;
  }

  function buildTerritories(frame) {
    if (territoryCache.has(frame.year)) return territoryCache.get(frame.year);
    const stateByRegion = buildStateAssignments(frame);
    const features = REGION_FEATURES
      .map((feature) => {
        const stateId = stateByRegion[feature.properties.id];
        if (!stateId) return null;
        const clone = cloneFeature(feature);
        clone.properties.stateId = stateId;
        return clone;
      })
      .filter(Boolean);

    const flattened = [];
    features.forEach((feature) => {
      const parts = turf.flatten(feature).features;
      parts.forEach((part) => {
        part.properties = { ...feature.properties };
        flattened.push(part);
      });
    });

    const dissolved = turf.dissolve(turf.featureCollection(flattened), { propertyName: "stateId" }).features.map((feature) => {
      const labelPoint = turf.pointOnFeature(feature).geometry.coordinates;
      const area = turf.area(feature);
      feature.properties = { stateId: feature.properties.stateId, labelPoint, area };
      return feature;
    });

    const payload = { territories: dissolved, stateByRegion };
    territoryCache.set(frame.year, payload);
    return payload;
  }

  function styleTerritory(stateId) {
    const state = safeState(stateId);
    const activeBattle = activeBattleId ? BATTLES[activeBattleId] : null;
    const unrelated = activeBattle && !(activeBattle.polities || []).includes(stateId);
    const dimmedBySelection = selectedState && selectedState !== stateId;
    return {
      color: dimmedBySelection || unrelated ? "#8c8c8c" : "#3e3328",
      weight: selectedState === stateId ? 2.6 : activeBattle && (activeBattle.polities || []).includes(stateId) ? 2.2 : 1.85,
      fillColor: state.color,
      fillOpacity: unrelated ? 0.08 : dimmedBySelection ? 0.12 : selectedState === stateId ? 0.38 : 0.3
    };
  }

  function drawLegend(territories) {
    legendEl.innerHTML = "";
    const used = [...new Set(territories.map((feature) => feature.properties.stateId))].filter(Boolean);
    used.sort((a, b) => safeState(a).name.localeCompare(safeState(b).name, "zh"));
    used.forEach((sid) => {
      const s = safeState(sid);
      const d = decorateFlag(s);
      const item = document.createElement("div");
      item.className = `legend-item ${selectedState === sid ? "active" : ""}`;
      item.innerHTML = `<span class="flag" style="background:${d.bg};border:${d.border}"></span><span class="flag-char">${s.short}</span><span>${s.name}</span>`;
      item.onclick = () => {
        selectedState = selectedState === sid ? null : sid;
        renderFrame(currentIndex, { preserveBattle: true });
        buildStateCard(sid);
      };
      legendEl.appendChild(item);
    });
  }

  function renderStateLabels(territories) {
    stateLabelLayer.clearLayers();
    if (map.getZoom() < 4.8) return;
    territories
      .slice()
      .sort((a, b) => (b.properties.area || 0) - (a.properties.area || 0))
      .forEach((feature) => {
        const sid = feature.properties.stateId;
        const state = safeState(sid);
        const point = feature.properties.labelPoint || turf.pointOnFeature(feature).geometry.coordinates;
        const area = feature.properties.area || turf.area(feature);
        const fontSize = Math.max(15, Math.min(30, 14 + Math.log10(Math.max(area, 1)) * 1.2));
        const short = state.short || stateDisplayName(state).slice(0, 1);
        const name = stateDisplayName(state).split("").join(" ");
        const flagStyle = decorateFlag(state);
        L.marker([point[1], point[0]], {
          pane: "stateLabelPane",
          icon: L.divIcon({
            className: "",
            html: `<div class="state-label">
              <div class="state-flag-wrap">
                <span class="state-pole"></span>
                <span class="state-flag-banner" style="background:${flagStyle.bg};border:${flagStyle.border}">${short}</span>
              </div>
              <span class="state-name" style="font-size:${fontSize}px">${name}</span>
            </div>`,
            iconSize: [fontSize + 28, fontSize * 3.2],
            iconAnchor: [14, fontSize * 1.6]
          })
        }).bindTooltip(`${state.name}｜${state.bannerBasis}`, { direction: "top" }).addTo(stateLabelLayer);
      });
  }

  function renderCities(year) {
    citiesLayer.clearLayers();
    const zoom = map.getZoom();
    const acceptedBoxes = [];
    CITIES
      .filter((city) => cityActiveInYear(city, year) && cityVisibleAtZoom(city, zoom))
      .map((city) => ({ ...city, activeCapital: activeCapitalForCity(city, year) }))
      .sort((a, b) => cityPriority(a) - cityPriority(b) || a.name.localeCompare(b.name, "zh"))
      .forEach((city) => {
        const activeCapital = city.activeCapital;
        const labelText = `${city.name}${activeCapital ? "【京】" : ""}`;
        const bbox = approxLabelBox(L.latLng(city.lat, city.lng), city, zoom);
        if (acceptedBoxes.some((box) => boxesOverlap(box, bbox))) return;
        acceptedBoxes.push(bbox);
        const fontSize = city.level === "capital" ? Math.max(13, zoom * 2.1) : city.level === "major" ? Math.max(11, zoom * 1.75) : Math.max(10, zoom * 1.45);
        const symbolClass = city.level === "capital" ? "capital" : city.level === "major" ? "major" : "minor";
        const capitalStateName = activeCapital ? safeState(activeCapital.state).name : "";
        L.marker([city.lat, city.lng], {
          pane: "cityLabelPane",
          icon: L.divIcon({
            className: "",
            html: `<div class="city-label">
              <span class="city-symbol ${symbolClass}"></span>
              <span>
                <span class="city-name ${activeCapital ? "capital-active" : ""}" style="font-size:${fontSize}px">${labelText}</span>
                ${zoom >= 6.8 ? `<div class="city-modern">${city.modern}${capitalStateName ? `｜${capitalStateName}` : ""}</div>` : ""}
              </span>
            </div>`,
            iconSize: [Math.max(90, fontSize * 6), zoom >= 6.8 ? 34 : 20],
            iconAnchor: [0, 8]
          })
        }).bindTooltip(`${city.name}｜${city.modern}${capitalStateName ? `｜${capitalStateName}都城` : ""}`).addTo(citiesLayer);
      });
  }

  function drawTerritories(frame) {
    territoryGlowLayer.clearLayers();
    frameLayers.clearLayers();
    stateLabelLayer.clearLayers();
    countyBoundaryLayer.clearLayers();
    const { territories, stateByRegion } = buildTerritories(frame);

    L.geoJSON(territories, {
      pane: "territoryGlowPane",
      style: (feature) => {
        const sid = feature.properties.stateId;
        const activeBattle = activeBattleId ? BATTLES[activeBattleId] : null;
        const unrelated = activeBattle && !(activeBattle.polities || []).includes(sid);
        return {
          color: unrelated ? "#dfd4b6" : "#eadfbe",
          weight: 6,
          opacity: unrelated ? 0.08 : 0.5,
          fillOpacity: 0
        };
      }
    }).addTo(territoryGlowLayer);

    L.geoJSON(territories, {
      style: (feature) => styleTerritory(feature.properties.stateId),
      onEachFeature: (feature, layer) => {
        const sid = feature.properties.stateId;
        layer.bindTooltip(safeState(sid).name);
        layer.on("click", () => buildStateCard(sid));
      }
    }).addTo(frameLayers);

    L.geoJSON(REGION_FEATURES, {
      className: "county-boundary",
      style: (feature) => {
        const sid = stateByRegion[feature.properties.id];
        return {
          color: safeState(sid).color,
          weight: 0.6,
          opacity: 0.45,
          fillOpacity: 0
        };
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`${feature.properties.name} · ${safeState(stateByRegion[feature.properties.id]).name}`);
      }
    }).addTo(countyBoundaryLayer);

    drawLegend(territories);
    renderStateLabels(territories);
  }

  function eventMatchesFilter(event) {
    const type = document.getElementById("eventTypeFilter").value;
    const key = document.getElementById("eventSearch").value.trim();
    const typeMatch = type === "全部" || event.type === type;
    if (!typeMatch) return false;
    if (!key) return true;
    const text = `${event.title}${event.type}${event.source}`.toLowerCase();
    return text.includes(key.toLowerCase());
  }

  function renderEvents(year) {
    eventLayer.clearLayers();
    eventsEl.innerHTML = "";
    const candidates = EVENTS.filter((event) => Math.abs(event.year - year) <= 20)
      .filter(eventMatchesFilter)
      .sort((a, b) => a.year - b.year)
      .slice(0, 80);

    candidates.forEach((event) => {
      const style = typeStyle[event.type] || { color: "#666", icon: "•" };
      const markerObj = L.marker(event.coords, {
        icon: L.divIcon({ className: "", html: `<div class="pulse" style="background:${style.color}"></div>`, iconSize: [14, 14] })
      }).addTo(eventLayer).bindPopup(`<b>${event.year} · ${event.title}</b><br>${event.type}<br>${event.source}`);
      markerObj.on("click", () => openBattleFromEvent(event));

      const d = document.createElement("div");
      d.className = `ev ${event.year === year ? "current" : ""}`;
      d.innerHTML = `<b style="color:${style.color}">${style.icon} ${event.year} · ${event.title}</b><br><small>${event.type}｜${event.source}</small>`;
      d.onclick = () => {
        map.flyTo(event.coords, Math.max(map.getZoom(), 6));
        markerObj.openPopup();
        if (event.battleId) openBattle(event.battleId);
      };
      eventsEl.appendChild(d);
    });
  }

  function renderBattleEntries(year) {
    const currentBattles = battleForYear(year);
    battleJumpBtn.classList.toggle("active", currentBattles.length > 0);
    battleEntryHint.textContent = currentBattles.length
      ? `当前年份可打开 ${currentBattles.length} 场战役。地图上的 ⚔ 图标也可直接进入战役模式。`
      : "当前年份暂无战役，可从下方时间轴入口打开其他战役。";

    battleYearList.innerHTML = "";
    battleEntries.forEach((battle) => {
      const chip = document.createElement("button");
      chip.className = `battle-chip ${battle.years.includes(year) ? "active" : ""}`;
      chip.textContent = `${battle.years[0]} · ${battle.name.replace(/（.*$/, "")}`;
      chip.onclick = () => openBattle(battle.id);
      battleYearList.appendChild(chip);
    });

    battleTimeline.innerHTML = "";
    battleEntries.forEach((battle) => {
      const tag = document.createElement("button");
      tag.className = `timeline-battle-tag ${battle.years.includes(year) ? "active" : ""}`;
      tag.textContent = `⚔ ${battle.years[0]} ${battle.name.replace(/（.*$/, "")}`;
      tag.onclick = () => openBattle(battle.id);
      battleTimeline.appendChild(tag);
    });

    battleEntryLayer.clearLayers();
    currentBattles.forEach((battle) => {
      L.marker(battle.marker, {
        icon: L.divIcon({ className: "", html: `<div class="battle-marker">⚔</div>`, iconSize: [22, 22], iconAnchor: [11, 11] })
      }).addTo(battleEntryLayer).bindTooltip(`${battle.name}（点击进入战役模式）`).on("click", () => openBattle(battle.id));
    });
  }

  function drawTimelineBands() {
    const svg = document.getElementById("timelineBands");
    const w = svg.clientWidth || 900;
    const h = 90;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const minY = TIMELINE_FRAMES[0].year;
    const maxY = TIMELINE_FRAMES[TIMELINE_FRAMES.length - 1].year;
    const ranges = {};

    TIMELINE_FRAMES.forEach((frame) => {
      const stateIds = new Set(Object.values(frame.zones));
      stateIds.forEach((sid) => {
        if (!ranges[sid]) ranges[sid] = { min: frame.year, max: frame.year };
        ranges[sid].min = Math.min(ranges[sid].min, frame.year);
        ranges[sid].max = Math.max(ranges[sid].max, frame.year);
      });
    });

    const rows = Object.keys(ranges)
      .sort((a, b) => (ranges[a].min - ranges[b].min) || safeState(a).name.localeCompare(safeState(b).name, "zh"))
      .slice(0, 14);
    if (!rows.length) {
      svg.innerHTML = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff8ea"/><text x="10" y="22" font-size="12" fill="#665">暂无时间带数据</text>`;
      return;
    }
    const rowH = h / rows.length;
    const x = (year) => ((year - minY) / (maxY - minY)) * (w - 100) + 88;
    let html = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff8ea"/>`;
    rows.forEach((sid, i) => {
      const range = ranges[sid];
      const state = safeState(sid);
      html += `<text x="2" y="${i * rowH + rowH * 0.68}" font-size="10" fill="#442">${state.short}</text>`;
      html += `<rect x="${x(range.min)}" y="${i * rowH + 2}" width="${Math.max(1, x(range.max) - x(range.min))}" height="${rowH - 4}" fill="${state.color}" opacity="0.74"/>`;
    });
    html += `<line x1="${x(TIMELINE_FRAMES[currentIndex].year)}" y1="0" x2="${x(TIMELINE_FRAMES[currentIndex].year)}" y2="${h}" stroke="#7a1212" stroke-width="2"/>`;
    svg.innerHTML = html;
  }

  function playToggle() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      playBtn.textContent = "▶ 播放";
      return;
    }
    playBtn.textContent = "⏸ 暂停";
    timer = setInterval(() => {
      if (currentIndex >= TIMELINE_FRAMES.length - 1) return playToggle();
      renderFrame(currentIndex + 1);
    }, Number(speedSelect.value));
  }

  function drawLineage() {
    const svg = document.getElementById("lineageSvg");
    const width = svg.clientWidth || 920;
    const height = 500;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "政权谱系图，展示政权继承、分裂与更替关系");
    const nodes = [...new Set(LINEAGE_EDGES.flat())];
    const level = {};
    nodes.forEach((node) => (level[node] = 0));
    LINEAGE_EDGES.forEach(([a, b]) => { level[b] = Math.max(level[b], level[a] + 1); });
    const grouped = {};
    nodes.forEach((node) => {
      const l = level[node] || 0;
      (grouped[l] ||= []).push(node);
    });
    const pos = {};
    Object.keys(grouped).forEach((key) => {
      const arr = grouped[key];
      arr.forEach((node, i) => {
        pos[node] = {
          x: 80 + Number(key) * 140,
          y: 40 + i * ((height - 80) / Math.max(1, arr.length - 1 || 1))
        };
      });
    });

    let html = `<rect width="${width}" height="${height}" fill="#fff"/>`;
    LINEAGE_EDGES.forEach(([a, b]) => {
      const pa = pos[a];
      const pb = pos[b];
      if (!pa || !pb) return;
      html += `<line x1="${pa.x + 42}" y1="${pa.y}" x2="${pb.x - 42}" y2="${pb.y}" stroke="#865f35" stroke-width="2" marker-end="url(#arr)"/>`;
    });
    html += `<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#865f35"/></marker></defs>`;
    nodes.forEach((node) => {
      const p = pos[node];
      const state = safeState(node);
      if (!p) return;
      html += `<rect x="${p.x - 40}" y="${p.y - 14}" width="80" height="28" rx="4" fill="${state.color}" opacity="0.82"/>`;
      html += `<title>${state.name}，存续${state.years || "未知"}</title>`;
      html += `<text x="${p.x}" y="${p.y + 4}" font-size="11" text-anchor="middle" fill="#fff">${state.name}</text>`;
    });
    svg.innerHTML = html;
  }

  function drawAreaChart() {
    const canvas = document.getElementById("areaCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const countSeries = {};

    TIMELINE_FRAMES.forEach((frame) => {
      const counts = {};
      REGION_FEATURES.forEach((feature) => {
        const sid = frame.zones[feature.properties.zone] || null;
        if (!sid) return;
        counts[sid] = (counts[sid] || 0) + 1;
      });
      Object.keys(counts).forEach((sid) => {
        (countSeries[sid] ||= []).push({ year: frame.year, value: counts[sid] });
      });
    });

    const top = Object.keys(countSeries)
      .map((sid) => ({ sid, sum: countSeries[sid].reduce((acc, item) => acc + item.value, 0) }))
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 8)
      .map((item) => item.sid);

    const minY = TIMELINE_FRAMES[0].year;
    const maxY = TIMELINE_FRAMES[TIMELINE_FRAMES.length - 1].year;
    const maxV = REGION_FEATURES.length;
    const x = (value) => 50 + ((value - minY) / (maxY - minY)) * (canvas.width - 70);
    const y = (value) => canvas.height - 32 - (value / maxV) * (canvas.height - 54);

    ctx.strokeStyle = "#665";
    ctx.strokeRect(45, 18, canvas.width - 65, canvas.height - 50);
    top.forEach((sid, idx) => {
      const state = safeState(sid);
      ctx.strokeStyle = state.color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      countSeries[sid].forEach((point, i) => {
        const px = x(point.year);
        const py = y(point.value);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.fillStyle = state.color;
      ctx.fillRect(60 + idx * 105, canvas.height - 24, 10, 10);
      ctx.fillStyle = "#332";
      ctx.font = "12px serif";
      ctx.fillText(state.name, 74 + idx * 105, canvas.height - 14);
    });
  }

  function sideStyle(battle, side) {
    return battle.legend?.[side] || { label: side, color: side === "a" ? "#b33a2e" : "#2f63b5" };
  }

  function makeUnitIcon(color, label, strength) {
    return L.divIcon({
      className: "",
      html: `<div class="unit-chip" style="background:${color}">${label}${strength ? ` · ${strength}` : ""}</div>`,
      iconSize: [130, 22],
      iconAnchor: [10, 10]
    });
  }

  function makeSiteIcon(marker) {
    const cls = marker.type === "battle" ? "site-chip battle" : marker.type === "ford" ? "site-chip ford" : marker.type === "camp" ? "site-chip camp" : "site-chip";
    return L.divIcon({
      className: "",
      html: `<div class="${cls}">${marker.type === "battle" ? "⚔" : marker.type === "ford" ? "≈" : marker.type === "camp" ? "⛺" : "▣"} ${marker.label}</div>`,
      iconSize: [110, 22],
      iconAnchor: [10, 10]
    });
  }

  function animatePolyline(layer) {
    setTimeout(() => {
      const path = layer._path;
      if (!path) return;
      const length = path.getTotalLength();
      path.classList.add("battle-route-path");
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = String(length);
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 1.1s ease";
      path.style.strokeDashoffset = "0";
    }, 40);
  }

  function renderBattleMap(phaseIndex) {
    routeLayer.clearLayers();
    battleSiteLayer.clearLayers();
    battleUnitLayer.clearLayers();
    if (!activeBattleId) return;
    const battle = BATTLES[activeBattleId];
    const phase = battle.phases[phaseIndex];

    battle.phases.slice(0, phaseIndex + 1).forEach((item, idx) => {
      item.routes.forEach((route) => {
        const style = sideStyle(battle, route.side);
        const isCurrent = idx === phaseIndex;
        const polyline = L.polyline(route.coords, {
          color: style.color,
          weight: isCurrent ? 4 : 3,
          opacity: isCurrent ? 0.95 : 0.28,
          dashArray: route.style === "retreat" ? "9 7" : ""
        }).addTo(routeLayer);
        if (isCurrent) animatePolyline(polyline);
        L.marker(route.coords[route.coords.length - 1], {
          icon: L.divIcon({ className: "", html: `<div class="route-arrow" style="color:${style.color}">${route.style === "retreat" ? "↩" : "➤"}</div>`, iconSize: [20, 20], iconAnchor: [10, 10] })
        }).addTo(routeLayer);
      });
    });

    phase.markers.forEach((entry) => {
      L.marker(entry.latlng, { icon: makeSiteIcon(entry) }).addTo(battleSiteLayer).bindTooltip(entry.text || entry.label);
    });
    phase.units.forEach((entry) => {
      const style = sideStyle(battle, entry.side);
      L.marker(entry.latlng, { icon: makeUnitIcon(style.color, entry.label, entry.strength) }).addTo(battleUnitLayer);
    });
  }

  function stopBattleAutoplay() {
    if (battleAutoTimer) {
      clearInterval(battleAutoTimer);
      battleAutoTimer = null;
    }
  }

  function closeBattle() {
    activeBattleId = null;
    activePhaseIndex = 0;
    stopBattleAutoplay();
    battlePanel.classList.add("hidden");
    routeLayer.clearLayers();
    battleSiteLayer.clearLayers();
    battleUnitLayer.clearLayers();
    renderFrame(currentIndex, { preserveBattle: false });
  }

  function nextBattlePhase(step) {
    if (!activeBattleId) return;
    const battle = BATTLES[activeBattleId];
    activePhaseIndex = Math.max(0, Math.min(battle.phases.length - 1, activePhaseIndex + step));
    renderBattlePanel();
    renderFrame(currentIndex, { preserveBattle: true });
  }

  function toggleBattleAutoplay() {
    if (!activeBattleId) return;
    if (battleAutoTimer) {
      stopBattleAutoplay();
      renderBattlePanel();
      return;
    }
    battleAutoTimer = setInterval(() => {
      const battle = BATTLES[activeBattleId];
      if (activePhaseIndex >= battle.phases.length - 1) {
        stopBattleAutoplay();
        renderBattlePanel();
        return;
      }
      activePhaseIndex += 1;
      renderBattlePanel();
      renderFrame(currentIndex, { preserveBattle: true });
    }, 1800);
    renderBattlePanel();
  }

  function renderBattlePanel() {
    if (!activeBattleId) return;
    const battle = BATTLES[activeBattleId];
    const phase = battle.phases[activePhaseIndex];
    const dots = battle.phases.map((_, index) => `<span class="phase-dot ${index === activePhaseIndex ? "active" : ""}"></span>`).join("");
    battlePanel.classList.remove("hidden");
    battlePanel.innerHTML = `
      <h3>${battle.name}</h3>
      <div class="battle-meta"><b>战区：</b>${battle.summary}</div>
      <div class="battle-summary-card">
        <div><b>阶段：</b>${activePhaseIndex + 1} / ${battle.phases.length}</div>
        <div><b>参战：</b>${Object.values(battle.legend).map((entry) => entry.label).join(" vs ")}</div>
      </div>
      <div class="phase-stepper">${dots}</div>
      <div class="phase-controls">
        <button id="battlePrevBtn">上一步</button>
        <button id="battleNextBtn">下一步</button>
        <button id="battleAutoBtn">${battleAutoTimer ? "停止自动播放" : "自动播放"}</button>
        <button id="battleCloseBtn">关闭战役模式</button>
      </div>
      <div class="phase-card">
        <div class="phase-title">${phase.title}</div>
        <div><b>时间：</b>${phase.date}</div>
        <div>${phase.text}</div>
        ${phase.note ? `<div style="margin-top:4px;color:#7a4c2d"><b>说明：</b>${phase.note}</div>` : ""}
        <div class="phase-source">史料：${phase.source}</div>
      </div>
      ${activePhaseIndex === battle.phases.length - 1 ? `
        <div class="battle-result-card">
          <div><b>结果：</b>${battle.result.winner}</div>
          <div><b>伤亡：</b>${battle.result.casualties}</div>
          <div><b>疆域变化：</b>${battle.result.territory}</div>
          <div><b>历史影响：</b>${battle.result.impact}</div>
        </div>
      ` : ""}
    `;
    document.getElementById("battlePrevBtn").onclick = () => nextBattlePhase(-1);
    document.getElementById("battleNextBtn").onclick = () => nextBattlePhase(1);
    document.getElementById("battleAutoBtn").onclick = toggleBattleAutoplay;
    document.getElementById("battleCloseBtn").onclick = closeBattle;

    renderBattleMap(activePhaseIndex);
  }

  function openBattle(battleId) {
    if (!battleId || !BATTLES[battleId]) return;
    stopBattleAutoplay();
    activeBattleId = battleId;
    activePhaseIndex = 0;
    const battle = BATTLES[battleId];
    map.flyToBounds(battle.bounds, { padding: [26, 26], duration: 0.8 });
    renderFrame(currentIndex, { preserveBattle: true });
    renderBattlePanel();
  }

  function openBattleFromEvent(event) {
    if (!event.battleId || !BATTLES[event.battleId]) return;
    openBattle(event.battleId);
  }

  function initEventFilters() {
    const select = document.getElementById("eventTypeFilter");
    const types = ["全部", ...new Set(EVENTS.map((event) => event.type))];
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      select.appendChild(option);
    });
    select.onchange = () => renderFrame(currentIndex, { preserveBattle: true });
    document.getElementById("eventSearch").oninput = () => renderFrame(currentIndex, { preserveBattle: true });
  }

  function renderFrame(index, options = {}) {
    currentIndex = Math.max(0, Math.min(TIMELINE_FRAMES.length - 1, index));
    slider.value = currentIndex;
    const frame = TIMELINE_FRAMES[currentIndex];
    yearEl.textContent = frame.year;
    eraEl.textContent = frame.era;
    eraEl.title = FRAME_SOURCES?.[frame.year] || "";
    drawTerritories(frame);
    renderCities(frame.year);
    renderEvents(frame.year);
    renderBattleEntries(frame.year);
    drawTimelineBands();
    if (activeBattleId && options.preserveBattle) {
      renderBattleMap(activePhaseIndex);
    }
  }

  document.getElementById("prevBtn").onclick = () => renderFrame(currentIndex - 1);
  document.getElementById("nextBtn").onclick = () => renderFrame(currentIndex + 1);
  playBtn.onclick = playToggle;
  speedSelect.onchange = () => { if (timer) playToggle(), playToggle(); };
  slider.oninput = () => renderFrame(Number(slider.value));
  map.on("zoomend", () => renderFrame(Number(slider.value), { preserveBattle: true }));
  battleJumpBtn.onclick = () => {
    const current = battleForYear(TIMELINE_FRAMES[currentIndex].year);
    if (current.length) openBattle(current[0].id);
  };

  document.addEventListener("keydown", (e) => {
    const target = e.target;
    const tag = target && target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (target && target.isContentEditable)) return;
    if (e.key === "ArrowLeft") renderFrame(currentIndex - 1);
    if (e.key === "ArrowRight") renderFrame(currentIndex + 1);
    if (e.key === " ") { e.preventDefault(); playToggle(); }
    if (e.key === "Escape") {
      document.querySelectorAll(".overlay:not(.hidden)").forEach((panel) => panel.classList.add("hidden"));
      closeBattle();
    }
  });

  document.getElementById("lineageToggle").onclick = () => {
    document.getElementById("lineagePanel").classList.remove("hidden");
    drawLineage();
  };
  document.getElementById("areaToggle").onclick = () => {
    document.getElementById("areaPanel").classList.remove("hidden");
    drawAreaChart();
  };
  document.querySelectorAll(".close-overlay").forEach((button) => {
    button.onclick = () => {
      document.getElementById(button.dataset.close).classList.add("hidden");
    };
  });

  window.__MAP_APP__ = {
    map,
    renderFrame,
    openBattle,
    closeBattle,
    getCurrentYear: () => TIMELINE_FRAMES[currentIndex]?.year
  };

  initEventFilters();
  buildStateCard("xijin");
  renderFrame(0);
})();
