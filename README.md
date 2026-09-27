# lishi-xuexi

纯静态交互式网页（GitHub Pages 直接可部署），用于可视化两晋十六国与南北朝（265—589）政权更替、疆域变化、事件与重点战役。

## 目录结构

- `index.html`：页面入口
- `css/style.css`：样式（宣纸风、移动端适配、战役面板与阶段时间条）
- `js/app.js`：地图渲染（读取预生成疆域）、时间轴、事件过滤、战役模式、谱系图与统计图
- `data/land.geojson.js`：东亚陆地轮廓（源自 Natural Earth 海岸线，裁剪至约 E73–135、N15–50，简化后内联）
- `data/regions.js`：州郡治所参考点 + 古水系/山脉/关隘/长城/迁徙路线（治所不再参与疆域计算）
- `data/borders/topology.mjs`：手工边界线拓扑源数据（命名边界线段 + zone ring 组装）
- `data/territories.generated.js`：由 Node 构建脚本预生成的 zone 面与逐年政权面
- `data/states.js`：政权数据（含十六国扩展、族属色系、信息卡字段、谱系边）
- `data/events.js`：事件数据（含类型、坐标、史料字段）
- `data/timeline.js`：29 个关键帧（265—589），按分区分配政权归属
- `data/battles.js`：17 场重点战役的分阶段路线、兵力、态势与结果卡片数据
- `data/cities.js`：80+ 古都、重镇、一般城节点（含今地、坐标、等级、有效时段、都城年份）
- `data/frame_sources.js`：关键年份所参照的图幅/史料说明
- `data/reference_overlay.js`：可选古地图扫描图叠加接口配置
- `tools/build-territories.mjs`：从手工边界拓扑生成 `data/territories.generated.js`，并做闭合/重叠校验
- `tools/check-extent.mjs`：检查疆域是否越出 73–135E / 16–55N 掩膜及西南/中亚排除区
- `vendor/`：本地化依赖（Leaflet 1.9.4、@turf/turf 7.2.0；保留 vendored 依赖，运行时不依赖 CDN）
- `docs/screenshots/`：关键帧与战役模式核对截图

## 疆域几何的构建方式

1. **陆地轮廓**：以 Natural Earth 海岸线数据裁出东亚范围，山东半岛、辽东半岛、雷州半岛、海南、台湾均可辨识；台湾不属于任何政权，不着色。
2. **共享边界线拓扑**：在 `data/borders/topology.mjs` 中维护命名边界线段，重点覆盖淮河、长江、秦岭、大巴山、太行、阴山、南岭、河西走廊南北缘、西南外缘与交州外缘等关键分界。
3. **手工 zone 面**：每个 zone 由若干条边界线段和连接点组装成 ring，再由 `tools/build-territories.mjs` 裁剪陆地外形，生成无运行时 Voronoi 的静态面数据。
4. **逐年政权面**：构建脚本按 `data/timeline.js` 的 zone→state 归属预生成每个关键年份的疆域面，前端直接读取 `data/territories.generated.js`。
5. **校验**：构建时检查 ring 闭合与政权重叠；`tools/check-extent.mjs` 额外检查 73–135E / 16–55N 掩膜与西南/中亚排除区，专门约束成汉不越出巴蜀—汉中—南中范围。

## 使用方法

1. 直接打开 `index.html`（Leaflet 与 turf 已本地化；Esri 地形/自然地理瓦片需联网，离线时疆域与数据层仍可正常渲染）。
2. 或启用 GitHub Pages：
   - 仓库 `Settings` → `Pages`
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main` / `root`
   - 保存后等待站点发布

3. 如需重新生成疆域数据：
   - `node tools/build-territories.mjs`
   - `node tools/check-extent.mjs`

4. 如需叠加自有合法获取的历史地图扫描图：
   - 打开 `data/reference_overlay.js`
   - 把 `url` 改为你的图片路径（建议放在 `docs/` 或 `assets/` 下）
   - 把 `bounds` 调整为图片覆盖的经纬范围
   - 刷新页面后，可在图层控制里勾选“历史地图参考（自备合法扫描图）”

## 功能说明

- 地图：默认 Esri `World_Shaded_Relief` 真实晕渲地形底图，可切换自然地理底图与仿古宣纸风格；疆域以半透明着色叠加，保留山脉、盆地、河谷纹理
- 图层开关：古代水系/山脉、关隘与长城、人口南迁路线、重要城市、郡级单元边界（默认关）
- 水系：绘出古黄河、长江、淮河、汉水、渭水、济水、泗水、汴渠，并标注震泽、彭蠡、云梦泽、巨野泽
- 时间轴：滑块、播放/暂停、速度、逐帧、键盘左右键
- 事件流：类型筛选 + 搜索，地图脉冲点同步
- 城市层：80+ 城市/据点按年份和缩放分级显示；都城为双圈红心，重镇为单圈，一般城为小点；当年都城附“【京】”并以金色高亮
- 政权卡：点击政权或图例查看建立者、族属、都城、存续、君主、灭亡原因，以及牙旗配色依据
- 国名与牙旗：疆域内部按面积放置国名和 SVG 牙旗标签，小国亦可在缩放后辨识
- 战役模式：右侧面板与时间轴上的 ⚔ 入口（当年有战役时高亮），点开后自动缩放到战区、其余政权淡化；带箭头的红/蓝进军路线（撤退为虚线）沿河谷驿道绘制，营垒/城池/渡口与交战点脉冲图标；下方阶段时间条支持上一步/下一步/自动播放，每步更新路线、部队旗号与兵力、态势和文字说明（含史料卷次）；最后一步显示胜负、伤亡（史载并注明争议）、疆域变化与历史影响的结果卡片
- 政权谱系图：展示继承、分裂、灭亡关系
- 疆域占比图：按州郡单元数统计的示意占比趋势

## 关键帧核对（对照谭其骧《中国历史地图集》）

以下截图取自浏览器实际渲染，核对要点包括：淝水前前秦与东晋以淮河—汉水—大巴山为界；439 年北魏西至敦煌、北至阴山；469 年后刘宋失淮北；553 年西魏取蜀、554 年立西梁于江陵；陈以长江为界；高句丽、吐谷浑、柔然、突厥出现在边缘。

| 年份 | 大势 | 截图 |
| --- | --- | --- |
| 280 | 西晋统一 | ![280](docs/screenshots/frame-280-main.png) |
| 317 | 东晋立国，北方失陷 | ![317](docs/screenshots/frame-317-main.png) |
| 329 | 后赵称雄 | ![329](docs/screenshots/frame-329-main.png) |
| 350 | 后赵崩解、冉魏 | ![350](docs/screenshots/frame-350-main.png) |
| 370 | 前秦灭前燕 | ![370](docs/screenshots/frame-370-main.png) |
| 376 | 前秦统一北方 | ![376](docs/screenshots/frame-376-main.png) |
| 383 | 淝水之战前后 | ![383](docs/screenshots/frame-383-terrain.png) |
| 395 | 参合陂后北方再裂 | ![395](docs/screenshots/frame-395-main.png) |
| 400 | 河西诸凉并立 | ![400](docs/screenshots/frame-400-main.png) |
| 407 | 胡夏立国 | ![407](docs/screenshots/frame-407-main.png) |
| 417 | 刘裕灭后秦 | ![417](docs/screenshots/frame-417-main.png) |
| 420 | 刘宋代晋 | ![420](docs/screenshots/frame-420-main.png) |
| 439 | 北魏统一北方（西至敦煌、北至阴山） | ![439](docs/screenshots/frame-439-terrain.png) |
| 450 | 元嘉北伐前后 | ![450](docs/screenshots/frame-450-main.png) |
| 469 | 刘宋失淮北 | ![469](docs/screenshots/frame-469-main.png) |
| 494 | 北魏迁都洛阳 | ![494](docs/screenshots/frame-494-main.png) |
| 520 | 南梁与北魏对峙 | ![520](docs/screenshots/frame-520-main.png) |
| 535 | 东西魏分立 | ![535](docs/screenshots/frame-535-main.png) |
| 547 | 侯景之乱前夜 | ![547](docs/screenshots/frame-547-main.png) |
| 552 | 侯景乱后、突厥兴起 | ![552](docs/screenshots/frame-552-main.png) |
| 557 | 陈立国、北周代西魏（西梁在江陵） | ![557](docs/screenshots/frame-557-main.png) |
| 560 | 北齐、北周、陈三分 | ![560](docs/screenshots/frame-560-terrain.png) |
| 562 | 周齐陈三分（陈以长江为界） | ![562](docs/screenshots/frame-562-main.png) |
| 577 | 北周灭北齐 | ![577](docs/screenshots/frame-577-main.png) |
| 581 | 隋代周 | ![581](docs/screenshots/frame-581-main.png) |
| 589 | 隋灭陈、天下一统 | ![589](docs/screenshots/frame-589-terrain.png) |

战役模式示例：

| 战役 | 截图 |
| --- | --- |
| 淝水之战（阶段 2） | ![淝水](docs/screenshots/battle-feishui-phase2.png) |
| 隋灭陈（阶段 3） | ![隋灭陈](docs/screenshots/battle-sui-mie-chen-phase3.png) |
| 关中—汉中地形贴线特写 | ![关中汉中特写](docs/screenshots/zoom-guanzhong-hanzhong.png) |

## 数据来源与精度声明

- 综合参考：
  - 谭其骧《中国历史地图集》第三、四册
  - CHGIS（China Historical GIS）相关公开研究成果
  - 《晋书》《资治通鉴》《宋书》《魏书》《周书》《北齐书》《南史》《北史》等
- 底图与版权：
  - Terrain / Shaded Relief / Physical 底图来自 Esri 在线地图服务，页面内保留 Leaflet attribution 标注
  - 陆地轮廓来自 Natural Earth 海岸线简化裁剪结果
  - 可选历史参考图层默认不附带任何扫描图，须由用户自行放入合法取得的图片
- **精度声明**：边界已从“种子点自动拼图”改为“手工边界拓扑 + 预生成政权面”，但仍属于基于史图与现代地形的示意重建，约州郡级，不等同于考古测绘成果。
- 战役兵力等争议数字在卡片中标注“史载”并提示存在争议。

## 扩展数据

- 新增政权：在 `data/states.js` 增加条目并设置 `color/family/pattern`。
- 新增时间帧：在 `data/timeline.js` 的 `keyframes` 中按分区（zone）指定政权归属。
- 新增/调整边界：优先修改 `data/borders/topology.mjs` 中的命名边界线与 zone ring，然后重新运行 `node tools/build-territories.mjs`。
- 新增事件：在 `data/events.js` 追加事件（年份、类型、标题、坐标、史料）。
- 新增战役详解：在 `data/battles.js` 增加 `phases/routes/refs`。
