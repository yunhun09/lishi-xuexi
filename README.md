# lishi-xuexi

两晋十六国与南北朝（265—589）静态可视化地图。

## 现状说明（本次重构）

- 疆域生成改为 **单一数据流**：`data/units.topo.json`（行政区单元）→ `data/unit_to_jun.json`（单元到郡）→ `data/control/<year>.json`（郡到政权）→ `tools/build.mjs` 生成 `data/territories.generated.js`。
- 旧的手工拓扑边界（`data/borders/`）与旧构建脚本已移除。
- 前端只渲染合并后的政权疆域；不渲染现代行政区边界。
- 边疆/势力不稳地区带 `frontier: true`，前端以斜线填充 + 虚线边界展示。

## 数据来源与许可证

### 底层单元

- `data/units.topo.json` 由以下公开数据整合并简化生成：
  - geoBoundaries（CHN ADM2, VNM ADM1, PRK ADM1, MNG ADM1）
  - 原始来源：`wmgeolab/geoBoundaries`
  - 许可证：CC BY 4.0（按 geoBoundaries 发布条款）
- 使用 `npx mapshaper` 简化并导出 TopoJSON。

### 历史分配

- `data/unit_to_jun.json`：单元到魏晋南北朝郡级名称映射。
- `data/control/*.json`：关键年份郡到政权控制关系。
- `data/frame_sources.js`：每帧史料依据。

> 现代行政区边界仅作为“内部积木”，页面不展示现代省界/县界/现代国界。

## 构建

```bash
node tools/build.mjs
```

构建时会执行校验（失败即退出）：

1. 核心区域单元逐年必须有归属（无空白缝隙）。
2. 同一年单元不可重复归属。
3. control 文件中的郡名必须存在于 `unit_to_jun.json`。
4. 基于 TopoJSON 邻接弧的抽样拓扑一致性检查。

## 运行

直接打开 `index.html`（纯静态，可部署 GitHub Pages）。

## 截图

验收截图位于 `docs/screenshots/`。
