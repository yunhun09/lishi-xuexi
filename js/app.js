(function () {
  const map = L.map("map", { zoomSnap: 0.25 }).setView([34.3, 109.6], 5);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 13,
    attribution: "Tiles © Esri"
  }).addTo(map);

  const frameLayers = L.layerGroup().addTo(map);
  const eventLayer = L.layerGroup().addTo(map);
  const routeLayer = L.layerGroup().addTo(map);

  const hydroLayer = L.layerGroup();
  HYDROLOGY.rivers.forEach((r) => L.polyline(r.coords, { color: r.color, weight: 2.5, opacity: 0.8 }).bindTooltip(r.name).addTo(hydroLayer));
  HYDROLOGY.mountains.forEach((m) => L.marker([m[1], m[2]], {
    icon: L.divIcon({ className: "", html: `<span style="font-size:12px;color:#543; font-weight:700; text-shadow:0 0 4px #fff">△${m[0]}</span>` })
  }).addTo(hydroLayer));

  const passLayer = L.layerGroup();
  STRATEGIC_FEATURES.passes.forEach((p) => L.circleMarker([p[1], p[2]], { radius: 4, color: "#000", fillColor: "#f7d97a", fillOpacity: 1 }).bindTooltip(`${p[0]}（关隘）`).addTo(passLayer));
  STRATEGIC_FEATURES.greatWall.forEach((w) => L.polyline(w, { color: "#7a5e39", weight: 2, dashArray: "4 5" }).bindTooltip("长城（示意）").addTo(passLayer));

  const migrationLayer = L.layerGroup();
  STRATEGIC_FEATURES.migrations.forEach((m) => L.polyline(m.coords, {
    color: "#ba5a2d", weight: 2.5, dashArray: "8 4", lineCap: "round"
  }).bindTooltip(m.name).addTo(migrationLayer));

  L.control.layers(null, {
    "古代水系与山脉": hydroLayer,
    "关隘与长城": passLayer,
    "民族迁徙箭头": migrationLayer
  }, { collapsed: false }).addTo(map);
  hydroLayer.addTo(map);
  passLayer.addTo(map);

  const slider = document.getElementById("timelineSlider");
  const yearEl = document.getElementById("year");
  const eraEl = document.getElementById("era");
  const legendEl = document.getElementById("legend");
  const eventsEl = document.getElementById("events");
  const stateCard = document.getElementById("stateCard");
  const playBtn = document.getElementById("playBtn");
  const speedSelect = document.getElementById("speedSelect");
  const battlePanel = document.getElementById("battlePanel");

  slider.max = TIMELINE_FRAMES.length - 1;

  let currentIndex = 0;
  let selectedState = null;
  let timer = null;
  let battleTimers = [];

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

  function safeState(id) {
    return STATES[id] || { name: id || "未知", short: "?", color: "#777", years: "", founder: "", ethnicity: "", capitals: [], rulers: "", fall: "", family: "未知", pattern: "solid" };
  }

  function decorateFlag(state) {
    const base = state.color;
    const border = state.pattern === "border" ? "2px dashed #241" : "1px solid #222";
    const bg = state.pattern === "ribbon"
      ? `linear-gradient(135deg, ${base} 0%, ${base} 60%, #f8e7c8 60%, #f8e7c8 75%, ${base} 75%)`
      : state.pattern === "dot"
        ? `radial-gradient(circle at 35% 35%, #f5e9ca 0 14%, transparent 15%), ${base}`
        : base;
    return { border, bg };
  }

  function zonesToStateMap(frame) {
    const mapRegion = {};
    REGIONS.forEach((r) => {
      mapRegion[r.id] = frame.zones[r.zone] || "xijin";
    });
    return mapRegion;
  }

  function buildStateCard(stateId) {
    const s = safeState(stateId);
    stateCard.innerHTML = `
      <h4 style="margin:0 0 6px">${s.name}</h4>
      <div><b>建立者：</b>${s.founder}</div>
      <div><b>族属：</b>${s.ethnicity}（色系：${s.family}）</div>
      <div><b>都城：</b>${s.capitals.join("、")}</div>
      <div><b>存续：</b>${s.years}</div>
      <div><b>历代君主：</b>${s.rulers}</div>
      <div><b>灭亡原因：</b>${s.fall}</div>
      <div><b>纹样：</b>${s.pattern}</div>
    `;
  }

  function drawLegend(regionStateMap) {
    legendEl.innerHTML = "";
    const used = [...new Set(Object.values(regionStateMap))].filter(Boolean);
    used.sort((a, b) => safeState(a).name.localeCompare(safeState(b).name, "zh"));
    used.forEach((sid) => {
      const s = safeState(sid);
      const d = decorateFlag(s);
      const item = document.createElement("div");
      item.className = `legend-item ${selectedState === sid ? "active" : ""}`;
      item.innerHTML = `<span class="flag" style="background:${d.bg}; border:${d.border}"></span><span class="flag-char">${s.short}</span><span>${s.name}</span>`;
      item.onclick = () => { selectedState = selectedState === sid ? null : sid; renderFrame(currentIndex); buildStateCard(sid); };
      legendEl.appendChild(item);
    });
  }

  function styleRegion(stateId, active) {
    const s = safeState(stateId);
    return {
      color: selectedState && selectedState !== stateId ? "#999" : "#2a2a2a",
      weight: active ? 1.6 : 0.7,
      fillColor: s.color,
      fillOpacity: selectedState && selectedState !== stateId ? 0.14 : active ? 0.68 : 0.48
    };
  }

  function renderFrame(index) {
    currentIndex = Math.max(0, Math.min(TIMELINE_FRAMES.length - 1, index));
    slider.value = currentIndex;
    const frame = TIMELINE_FRAMES[currentIndex];
    const regionStateMap = zonesToStateMap(frame);

    yearEl.textContent = frame.year;
    eraEl.textContent = frame.era;

    frameLayers.clearLayers();
    REGIONS.forEach((r) => {
      const sid = regionStateMap[r.id];
      const poly = L.polygon(r.polygon, styleRegion(sid, selectedState === sid));
      poly.bindTooltip(`${r.name} · ${safeState(sid).name}`);
      poly.on("click", () => buildStateCard(sid));
      poly.addTo(frameLayers);
    });

    drawLegend(regionStateMap);
    renderEvents(frame.year);
    drawTimelineBands();
  }

  function eventMatchesFilter(ev) {
    const type = document.getElementById("eventTypeFilter").value;
    const key = document.getElementById("eventSearch").value.trim();
    const typeMatch = type === "全部" || ev.type === type;
    if (!typeMatch) return false;
    if (!key) return true;
    const text = `${ev.title}${ev.type}${ev.source}`.toLowerCase();
    return text.includes(key.toLowerCase());
  }

  function renderEvents(year) {
    eventLayer.clearLayers();
    eventsEl.innerHTML = "";
    const candidates = EVENTS.filter((e) => e.year <= year && e.year >= year - 12).filter(eventMatchesFilter).slice(-60);
    candidates.forEach((ev) => {
      const style = typeStyle[ev.type] || { color: "#666", icon: "•" };
      const marker = L.marker(ev.coords, {
        icon: L.divIcon({ className: "", html: `<div class="pulse" style="background:${style.color}"></div>`, iconSize: [14, 14] })
      }).addTo(eventLayer).bindPopup(`<b>${ev.year} · ${ev.title}</b><br>${ev.type}<br>${ev.source}`);
      marker.on("click", () => openBattleFromEvent(ev));

      const d = document.createElement("div");
      d.className = `ev ${ev.year === year ? "current" : ""}`;
      d.innerHTML = `<b style="color:${style.color}">${style.icon} ${ev.year} · ${ev.title}</b><br><small>${ev.type}｜${ev.source}</small>`;
      d.onclick = () => {
        map.flyTo(ev.coords, Math.max(map.getZoom(), 6));
        marker.openPopup();
        if (ev.battleId) openBattleFromEvent(ev);
      };
      eventsEl.appendChild(d);
    });
  }

  function openBattleFromEvent(ev) {
    if (!ev.battleId || !BATTLES[ev.battleId]) return;
    const b = BATTLES[ev.battleId];
    battlePanel.classList.remove("hidden");
    battlePanel.innerHTML = `
      <h3 style="margin:0 0 6px">${b.name}</h3>
      <div><b>对阵：</b>${b.sides}</div>
      <div><b>主将：</b>${b.generals}</div>
      <div><b>兵力：</b>${b.troops}</div>
      <div><b>结果：</b>${b.result}</div>
      <div><b>影响：</b>${b.impact}</div>
      <div><b>史料：</b>${b.refs}</div>
      <h4>阶段进程</h4>
      <ol>${b.phases.map((p) => `<li>${p}</li>`).join("")}</ol>
      <button id="battleRoutePlay">播放进军路线</button>
      <button id="battleClose">关闭</button>
    `;
    document.getElementById("battleClose").onclick = () => { battlePanel.classList.add("hidden"); stopBattleAnimation(); };
    document.getElementById("battleRoutePlay").onclick = () => animateBattleRoute(b);
  }

  function stopBattleAnimation() {
    battleTimers.forEach((id) => clearInterval(id));
    battleTimers = [];
    routeLayer.clearLayers();
  }

  function animateBattleRoute(battle) {
    stopBattleAnimation();
    const color = "#9b1e14";
    battle.routes.forEach((route, rIndex) => {
      const animatedLine = L.polyline([route[0]], { color, weight: 3, opacity: 0.88, dashArray: rIndex % 2 ? "7 5" : "" }).addTo(routeLayer);
      let i = 1;
      const id = setInterval(() => {
        const seg = route.slice(0, Math.min(i, route.length));
        animatedLine.setLatLngs(seg);
        if (i >= route.length) {
          clearInterval(id);
          battleTimers = battleTimers.filter((x) => x !== id);
          return;
        }
        i += 1;
      }, 450);
      battleTimers.push(id);
    });
  }

  function initEventFilters() {
    const select = document.getElementById("eventTypeFilter");
    const types = ["全部", ...new Set(EVENTS.map((e) => e.type))];
    types.forEach((t) => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      select.appendChild(o);
    });
    select.onchange = () => renderFrame(currentIndex);
    document.getElementById("eventSearch").oninput = () => renderFrame(currentIndex);
  }

  function drawTimelineBands() {
    const svg = document.getElementById("timelineBands");
    const w = svg.clientWidth || 900;
    const h = 90;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const minY = TIMELINE_FRAMES[0].year;
    const maxY = TIMELINE_FRAMES[TIMELINE_FRAMES.length - 1].year;

    const ranges = {};
    TIMELINE_FRAMES.forEach((f) => {
      const stateIds = new Set(Object.values(f.zones));
      stateIds.forEach((sid) => {
        if (!ranges[sid]) ranges[sid] = { min: f.year, max: f.year };
        ranges[sid].min = Math.min(ranges[sid].min, f.year);
        ranges[sid].max = Math.max(ranges[sid].max, f.year);
      });
    });

    const rows = Object.keys(ranges)
      .sort((a, b) => (ranges[a].min - ranges[b].min) || safeState(a).name.localeCompare(safeState(b).name, "zh"))
      .slice(0, 12);
    if (!rows.length) {
      svg.innerHTML = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff8ea"/><text x="10" y="22" font-size="12" fill="#665">暂无时间带数据</text>`;
      return;
    }
    const rowH = h / rows.length;
    const x = (year) => ((year - minY) / (maxY - minY)) * (w - 100) + 88;

    let html = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff8ea"/>`;
    rows.forEach((sid, i) => {
      const r = ranges[sid];
      const st = safeState(sid);
      html += `<text x="2" y="${i * rowH + rowH * 0.68}" font-size="10" fill="#442">${st.short}</text>`;
      html += `<rect x="${x(r.min)}" y="${i * rowH + 2}" width="${Math.max(1, x(r.max) - x(r.min))}" height="${rowH - 4}" fill="${st.color}" opacity="0.74"/>`;
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
    const lvl = {};
    nodes.forEach((n) => (lvl[n] = 0));
    LINEAGE_EDGES.forEach(([a, b]) => { lvl[b] = Math.max(lvl[b], lvl[a] + 1); });

    const grouped = {};
    nodes.forEach((n) => {
      const l = lvl[n] || 0;
      (grouped[l] ||= []).push(n);
    });

    const pos = {};
    Object.keys(grouped).forEach((k) => {
      const arr = grouped[k];
      arr.forEach((n, i) => {
        pos[n] = {
          x: 80 + Number(k) * 140,
          y: 40 + i * ((height - 80) / Math.max(1, arr.length - 1 || 1))
        };
      });
    });

    let html = `<rect width="${width}" height="${height}" fill="#fff"/>`;
    LINEAGE_EDGES.forEach(([a, b]) => {
      const pa = pos[a], pb = pos[b];
      if (!pa || !pb) return;
      html += `<line x1="${pa.x + 42}" y1="${pa.y}" x2="${pb.x - 42}" y2="${pb.y}" stroke="#865f35" stroke-width="2" marker-end="url(#arr)"/>`;
    });
    html += `<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#865f35"/></marker></defs>`;
    nodes.forEach((n) => {
      const p = pos[n];
      const st = safeState(n);
      if (!p) return;
      html += `<rect x="${p.x - 40}" y="${p.y - 14}" width="80" height="28" rx="4" fill="${st.color}" opacity="0.82"/>`;
      html += `<title>${st.name}，存续${st.years || "未知"}</title>`;
      html += `<text x="${p.x}" y="${p.y + 4}" font-size="11" text-anchor="middle" fill="#fff">${st.name}</text>`;
    });

    svg.innerHTML = html;
  }

  function drawAreaChart() {
    const canvas = document.getElementById("areaCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const countSeries = {};
    TIMELINE_FRAMES.forEach((f) => {
      const temp = {};
      REGIONS.forEach((r) => {
        const sid = f.zones[r.zone] || "xijin";
        temp[sid] = (temp[sid] || 0) + 1;
      });
      Object.keys(temp).forEach((sid) => {
        (countSeries[sid] ||= []).push({ year: f.year, value: temp[sid] });
      });
    });

    const top = Object.keys(countSeries)
      .map((sid) => ({ sid, sum: countSeries[sid].reduce((a, b) => a + b.value, 0) }))
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 8)
      .map((x) => x.sid);

    const minY = TIMELINE_FRAMES[0].year;
    const maxY = TIMELINE_FRAMES[TIMELINE_FRAMES.length - 1].year;
    const maxV = REGIONS.length;
    const x = (v) => 50 + ((v - minY) / (maxY - minY)) * (canvas.width - 70);
    const y = (v) => canvas.height - 32 - (v / maxV) * (canvas.height - 54);

    ctx.strokeStyle = "#665";
    ctx.strokeRect(45, 18, canvas.width - 65, canvas.height - 50);
    top.forEach((sid, idx) => {
      const st = safeState(sid);
      ctx.strokeStyle = st.color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      countSeries[sid].forEach((p, i) => {
        const px = x(p.year), py = y(p.value);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.fillStyle = st.color;
      ctx.fillRect(60 + idx * 105, canvas.height - 24, 10, 10);
      ctx.fillStyle = "#332";
      ctx.font = "12px serif";
      ctx.fillText(st.name, 74 + idx * 105, canvas.height - 14);
    });
  }

  document.getElementById("prevBtn").onclick = () => renderFrame(currentIndex - 1);
  document.getElementById("nextBtn").onclick = () => renderFrame(currentIndex + 1);
  playBtn.onclick = playToggle;
  speedSelect.onchange = () => { if (timer) playToggle(), playToggle(); };
  slider.oninput = () => renderFrame(Number(slider.value));

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    const tag = t && t.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
    if (e.key === "ArrowLeft") renderFrame(currentIndex - 1);
    if (e.key === "ArrowRight") renderFrame(currentIndex + 1);
    if (e.key === " ") { e.preventDefault(); playToggle(); }
    if (e.key === "Escape") {
      document.querySelectorAll(".overlay:not(.hidden)").forEach((panel) => panel.classList.add("hidden"));
      battlePanel.classList.add("hidden");
      stopBattleAnimation();
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

  document.querySelectorAll(".close-overlay").forEach((b) => {
    b.onclick = () => {
      document.getElementById(b.dataset.close).classList.add("hidden");
      stopBattleAnimation();
    };
  });

  initEventFilters();
  buildStateCard("xijin");
  renderFrame(0);
})();
