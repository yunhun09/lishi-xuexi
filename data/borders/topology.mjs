const SEGMENT_CONTROLS = {
  huaihe_tongbai_to_sea: [
    [111.15, 33.18], [112.3, 33.22], [113.7, 33.26], [115.2, 33.25], [116.7, 33.16], [118.1, 33.07], [119.45, 33.0]
  ],
  qinling_longxi_to_wuguan: [
    [104.45, 34.28], [105.2, 34.12], [106.1, 33.98], [107.0, 33.85], [108.1, 33.78], [109.2, 33.72], [110.25, 33.77], [111.2, 33.55]
  ],
  daba_micang_to_east: [
    [104.7, 32.55], [105.6, 32.38], [106.6, 32.15], [107.7, 31.95], [108.8, 31.72], [109.75, 31.55]
  ],
  hanshui_upper_to_jianghan: [
    [106.7, 33.55], [107.6, 33.1], [108.7, 32.65], [109.8, 32.25], [110.9, 31.9], [112.0, 31.5], [112.85, 30.75]
  ],
  yangtze_shu_to_sanxia: [
    [103.9, 30.78], [105.2, 30.72], [106.5, 30.62], [107.8, 30.58], [109.1, 30.52], [110.4, 30.46], [111.6, 30.38]
  ],
  yangtze_sanxia_to_sea: [
    [111.6, 30.38], [112.8, 30.32], [114.0, 30.26], [115.5, 30.27], [117.0, 30.46], [118.6, 30.78], [120.0, 31.1], [121.55, 31.25]
  ],
  nanling_west_to_east: [
    [109.65, 26.1], [110.55, 25.95], [111.4, 25.82], [112.35, 25.7], [113.25, 25.55], [114.2, 25.4]
  ],
  taihang_main_ridge: [
    [113.15, 39.35], [113.22, 38.4], [113.34, 37.45], [113.48, 36.55], [113.62, 35.65]
  ],
  yinshan_south_foot: [
    [105.2, 41.3], [106.8, 41.15], [108.4, 41.05], [110.0, 40.95], [111.7, 40.92], [113.3, 40.92], [115.0, 41.0], [116.8, 40.95]
  ],
  liaoxi_corridor: [
    [118.82, 40.55], [119.55, 40.85], [120.35, 41.05], [121.15, 41.2]
  ],
  hexi_north_foot: [
    [93.8, 40.75], [95.6, 40.55], [97.5, 40.2], [99.3, 39.9], [101.0, 39.65], [102.6, 39.45], [104.0, 39.3]
  ],
  hexi_south_foot: [
    [94.2, 37.75], [96.0, 37.55], [97.9, 37.35], [99.7, 37.18], [101.3, 37.12], [102.9, 37.18], [104.2, 37.35]
  ],
  qinghai_north_rim: [
    [95.3, 37.95], [96.7, 37.85], [98.3, 37.72], [99.8, 37.55], [101.25, 37.35], [102.6, 37.15]
  ],
  qinghai_south_rim: [
    [95.6, 35.05], [97.2, 35.02], [98.9, 35.12], [100.5, 35.28], [102.1, 35.52], [103.2, 35.9]
  ],
  xiyu_east_frontier: [
    [89.0, 43.2], [90.6, 43.1], [92.4, 43.0], [94.2, 42.95], [95.8, 42.8]
  ],
  southwest_frontier: [
    [98.6, 28.6], [99.0, 27.6], [99.25, 26.7], [99.45, 25.8], [99.8, 24.95], [100.5, 24.2], [101.6, 23.6], [102.9, 23.35], [104.4, 23.45], [105.6, 23.6]
  ],
  jiaozhou_outer_frontier: [
    [105.4, 21.05], [106.0, 20.2], [106.45, 19.35], [106.82, 18.55], [107.2, 17.75], [107.55, 16.95]
  ],
  nanzhong_east_edge: [
    [105.8, 28.55], [106.3, 27.7], [106.65, 26.85], [106.88, 26.0], [106.95, 25.1], [106.8, 24.25], [106.55, 23.6]
  ],
  liaodong_koguryo_frontier: [
    [123.95, 39.9], [124.35, 40.8], [124.8, 41.7], [125.3, 42.55]
  ]
};

const ZONE_NAMES = {
  hebei_north: "河北北部",
  hebei_south: "河北南部",
  shandong: "青齐山东",
  huaibei: "淮北徐兖",
  shanxi: "并州山西",
  henan: "河南中原",
  huainan: "淮南江北",
  hexi_west: "河西西段",
  hexi_east: "河西东段",
  longyou: "陇右",
  guanzhong: "关中",
  hetao: "河套朔方",
  qinghai: "青海东部",
  xiyu: "西域东段",
  liaodong: "辽西辽东",
  koguryo: "高句丽",
  steppe_east: "漠南东部",
  steppe_west: "漠南西部",
  hanzhong: "汉中",
  bashu: "巴蜀",
  nanzhong: "南中",
  jingbei: "荆北",
  jiangling: "江陵",
  jianghan: "江汉",
  jiangdong: "江东",
  liangzhe: "两浙",
  jiangxi: "江西",
  hunan: "湖南",
  lingnan_east: "岭南东部",
  lingnan_west: "岭南西部",
  jiaozhou: "交州"
};

function densify(points, perSegment = 8) {
  const out = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    for (let step = 0; step < perSegment; step += 1) {
      const t = step / perSegment;
      out.push([
        +(ax + (bx - ax) * t).toFixed(4),
        +(ay + (by - ay) * t).toFixed(4)
      ]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

const BORDER_SEGMENTS = Object.fromEntries(
  Object.entries(SEGMENT_CONTROLS).map(([name, points]) => [name, densify(points)])
);

function segment(name) {
  return BORDER_SEGMENTS[name].map(([lng, lat]) => [lng, lat]);
}

function reverseSegment(name) {
  return segment(name).slice().reverse();
}

function joinParts(...parts) {
  const ring = [];
  parts.forEach((part) => {
    if (!Array.isArray(part) || !part.length) return;
    part.forEach((coord, index) => {
      if (!Array.isArray(coord) || coord.length !== 2) return;
      const prev = ring[ring.length - 1];
      if (index === 0 && prev && prev[0] === coord[0] && prev[1] === coord[1]) return;
      ring.push(coord);
    });
  });
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    ring.push([...first]);
  }
  return ring;
}

const pt = (lng, lat) => [[lng, lat]];

export const ZONE_RING_SPECS = {
  hebei_north: joinParts(
    pt(113.2, 39.35), pt(115.5, 39.45), pt(118.0, 39.95), pt(120.75, 40.5),
    pt(118.9, 40.9), pt(116.0, 40.8), pt(113.8, 40.4), pt(113.2, 39.35)
  ),
  hebei_south: joinParts(
    pt(113.15, 39.35), pt(114.15, 39.85), pt(116.05, 39.95), pt(117.6, 40.15), pt(118.82, 40.55),
    pt(119.1, 38.4), pt(118.95, 37.15), pt(117.85, 35.65), pt(115.7, 35.45), reverseSegment("taihang_main_ridge")
  ),
  shandong: joinParts(
    pt(117.7, 35.65), pt(118.9, 36.2), pt(119.5, 36.8), pt(121.7, 37.2), pt(122.4, 36.5),
    pt(121.8, 35.4), pt(120.7, 34.9), pt(119.2, 34.9), pt(117.6, 35.15), pt(117.7, 35.65)
  ),
  huaibei: joinParts(
    pt(115.7, 35.45), pt(117.85, 35.65), pt(119.2, 34.9), pt(119.1, 33.8),
    reverseSegment("huaihe_tongbai_to_sea"),
    pt(112.2, 33.45), pt(113.4, 34.05), pt(114.4, 34.65), pt(115.7, 35.45)
  ),
  shanxi: joinParts(
    pt(110.6, 39.9), pt(111.6, 39.55), pt(113.15, 39.35), reverseSegment("taihang_main_ridge"),
    pt(112.3, 35.25), pt(111.15, 35.3), pt(110.4, 36.1), pt(110.15, 37.2), pt(110.2, 38.4), pt(110.6, 39.9)
  ),
  henan: joinParts(
    pt(111.15, 35.3), pt(112.3, 35.25), pt(113.62, 35.65), pt(115.7, 35.45),
    pt(115.2, 34.55), pt(114.7, 33.95), pt(113.7, 33.26), pt(112.3, 33.22), pt(111.15, 33.18),
    pt(111.0, 33.9), pt(111.1, 34.6), pt(111.15, 35.3)
  ),
  huainan: joinParts(
    pt(113.7, 33.26), segment("huaihe_tongbai_to_sea").slice(2),
    pt(119.65, 32.2), pt(119.95, 31.5), pt(118.6, 30.78), pt(117.0, 30.46), pt(115.8, 30.3),
    pt(114.6, 30.45), pt(114.1, 31.2), pt(113.9, 32.2), pt(113.7, 33.26)
  ),
  hexi_west: joinParts(
    pt(93.8, 40.75), pt(95.6, 40.55), pt(97.5, 40.2), pt(99.3, 39.9),
    pt(99.7, 39.2), pt(99.8, 38.4), pt(99.5, 37.55), pt(97.9, 37.35), pt(96.0, 37.55), pt(94.2, 37.75),
    pt(93.8, 38.6), pt(93.6, 39.6), pt(93.8, 40.75)
  ),
  hexi_east: joinParts(
    pt(99.3, 39.9), pt(101.0, 39.65), pt(102.6, 39.45), pt(104.0, 39.3), pt(104.2, 37.35),
    reverseSegment("hexi_south_foot").slice(0, 26),
    pt(99.5, 37.55), pt(99.8, 38.4), pt(99.7, 39.2), pt(99.3, 39.9)
  ),
  longyou: joinParts(
    pt(102.0, 37.4), pt(104.2, 37.0), pt(103.95, 35.9), pt(104.1, 35.0), pt(104.45, 34.28),
    pt(102.5, 34.4), pt(101.4, 35.0), pt(100.8, 36.0), pt(100.7, 36.8), pt(101.1, 37.35), pt(102.0, 37.4)
  ),
  guanzhong: joinParts(
    pt(104.2, 37.0), pt(105.4, 37.2), pt(107.0, 37.25), pt(108.8, 37.15), pt(110.2, 36.95),
    pt(110.9, 36.4), pt(111.0, 35.5), pt(111.2, 34.5), reverseSegment("qinling_longxi_to_wuguan"),
    pt(104.1, 35.0), pt(103.95, 35.9), pt(104.2, 37.0)
  ),
  hetao: joinParts(
    pt(103.8, 39.25), segment("yinshan_south_foot").slice(0, 33), pt(112.4, 39.5), pt(111.7, 38.3), pt(110.8, 37.5),
    pt(109.3, 37.1), pt(107.7, 37.15), pt(106.1, 37.4), pt(104.2, 37.35), pt(104.0, 39.3), pt(103.8, 39.25)
  ),
  qinghai: joinParts(
    segment("qinghai_north_rim"), pt(103.2, 35.9), reverseSegment("qinghai_south_rim"),
    pt(95.0, 35.6), pt(94.8, 36.7), pt(95.3, 37.95)
  ),
  xiyu: joinParts(
    pt(81.5, 44.8), segment("xiyu_east_frontier"), pt(95.4, 41.3), pt(93.9, 39.6), pt(91.8, 39.1),
    pt(88.8, 39.0), pt(85.6, 39.4), pt(82.5, 40.3), pt(81.2, 41.6), pt(81.5, 44.8)
  ),
  liaodong: joinParts(
    pt(121.15, 41.2), pt(123.1, 41.6), pt(124.2, 40.9), pt(124.1, 39.8), pt(123.6, 39.3),
    pt(122.5, 39.2), pt(121.4, 39.55), pt(120.6, 40.0), pt(119.9, 40.5), pt(121.15, 41.2)
  ),
  koguryo: joinParts(
    pt(123.95, 39.9), segment("liaodong_koguryo_frontier"), pt(127.8, 42.9), pt(128.5, 41.6),
    pt(128.2, 40.3), pt(127.3, 39.6), pt(126.0, 39.4), pt(124.2, 39.8), pt(123.95, 39.9)
  ),
  steppe_east: joinParts(
    pt(108.0, 47.8), pt(122.2, 47.8), pt(121.6, 44.0), pt(121.15, 41.2),
    reverseSegment("liaoxi_corridor"), pt(118.82, 40.55), pt(116.8, 40.95), pt(115.0, 41.0), pt(113.3, 40.92), pt(111.7, 40.92), pt(108.4, 41.05),
    pt(108.0, 47.8)
  ),
  steppe_west: joinParts(
    pt(82.0, 47.8), pt(108.0, 47.8), pt(108.4, 41.05), pt(106.8, 41.15), pt(105.2, 41.3),
    pt(103.8, 39.25), pt(101.8, 39.7), pt(99.3, 39.9), pt(93.8, 40.75), pt(82.8, 41.5), pt(82.0, 47.8)
  ),
  hanzhong: joinParts(
    pt(104.45, 34.28), pt(105.6, 34.15), pt(107.0, 34.0), pt(108.6, 33.95), pt(110.2, 33.88), pt(111.1, 33.6),
    pt(110.8, 33.1), pt(110.2, 32.6), pt(109.3, 32.25), pt(108.0, 32.18), pt(106.7, 32.2), pt(105.5, 32.35),
    pt(104.7, 32.55), pt(104.4, 33.1), pt(104.35, 33.7), pt(104.45, 34.28)
  ),
  bashu: joinParts(
    pt(102.4, 32.45), segment("daba_micang_to_east"), pt(109.65, 30.9), pt(109.0, 29.9), pt(107.9, 29.25),
    pt(106.5, 28.75), pt(104.8, 28.7), pt(103.3, 29.05), pt(102.3, 29.9), pt(101.9, 31.0), pt(102.4, 32.45)
  ),
  nanzhong: joinParts(
    segment("southwest_frontier"), pt(106.55, 23.6), reverseSegment("nanzhong_east_edge"),
    pt(104.8, 28.7), pt(103.3, 29.05), pt(101.9, 31.0), pt(100.9, 30.4), pt(100.0, 29.4), pt(98.6, 28.6)
  ),
  jingbei: joinParts(
    pt(111.15, 33.18), pt(112.3, 33.22), pt(113.7, 33.26), pt(113.9, 32.2), pt(114.1, 31.2),
    pt(114.0, 30.26), pt(112.8, 30.32), pt(111.6, 30.38), pt(112.0, 31.5), pt(110.9, 31.9), pt(110.7, 32.7), pt(111.15, 33.18)
  ),
  jiangling: joinParts(
    pt(110.4, 30.46), pt(111.6, 30.38), pt(112.8, 30.32), pt(113.2, 30.0),
    pt(112.8, 29.7), pt(111.8, 29.65), pt(111.0, 29.8), pt(110.8, 30.1), pt(110.4, 30.46)
  ),
  jianghan: joinParts(
    pt(110.8, 30.1), pt(111.0, 29.8), pt(111.8, 29.65), pt(112.8, 29.7), pt(114.0, 29.95),
    pt(114.5, 29.4), pt(114.6, 28.7), pt(114.3, 28.1), pt(113.4, 27.9), pt(112.3, 28.0),
    pt(111.2, 28.4), pt(110.4, 29.0), pt(110.3, 29.6), pt(110.8, 30.1)
  ),
  jiangdong: joinParts(
    pt(114.6, 30.45), pt(115.8, 30.3), pt(117.0, 30.46), pt(118.6, 30.78), pt(120.0, 31.1),
    pt(120.0, 30.5), pt(119.6, 29.7), pt(118.8, 29.3), pt(117.7, 29.3), pt(116.5, 29.5),
    pt(115.4, 29.9), pt(114.6, 30.45)
  ),
  liangzhe: joinParts(
    pt(118.8, 29.3), pt(119.6, 29.7), pt(120.0, 30.5), pt(120.0, 31.1), pt(121.55, 31.25),
    pt(122.2, 30.2), pt(121.8, 28.9), pt(121.1, 27.8), pt(120.3, 27.1), pt(119.2, 27.0),
    pt(118.5, 27.8), pt(118.3, 28.6), pt(118.8, 29.3)
  ),
  jiangxi: joinParts(
    pt(113.4, 27.9), pt(114.3, 28.1), pt(114.6, 28.7), pt(114.5, 29.4), pt(115.4, 29.9),
    pt(116.5, 29.5), pt(117.7, 29.3), pt(118.3, 28.6), pt(118.1, 27.6), pt(117.4, 26.7),
    pt(116.5, 26.2), pt(115.4, 25.9), pt(114.3, 25.8), pt(113.4, 26.3), pt(113.0, 27.0), pt(113.4, 27.9)
  ),
  hunan: joinParts(
    segment("nanling_west_to_east").slice(0, 33), pt(112.35, 25.7), pt(112.9, 26.25), pt(113.0, 27.0),
    pt(113.4, 27.9), pt(112.3, 28.0), pt(111.2, 28.4), pt(110.4, 29.0), pt(109.8, 29.1),
    pt(109.4, 28.2), pt(109.3, 27.1), pt(109.65, 26.1)
  ),
  lingnan_east: joinParts(
    pt(112.35, 25.7), pt(114.2, 25.4), pt(114.8, 24.7), pt(115.5, 23.8), pt(116.1, 22.9),
    pt(115.9, 22.2), pt(114.8, 22.0), pt(113.7, 22.15), pt(112.9, 22.45), pt(112.5, 23.2), pt(112.35, 24.3), pt(112.35, 25.7)
  ),
  lingnan_west: joinParts(
    pt(107.2, 21.8), pt(108.2, 21.3), pt(109.5, 21.1), pt(110.8, 21.1), pt(111.9, 21.5), pt(112.9, 22.45),
    pt(112.35, 24.3), pt(112.35, 25.7), pt(109.65, 26.1), pt(109.2, 25.3), pt(108.7, 24.5),
    pt(108.0, 23.7), pt(107.5, 22.8), pt(107.2, 21.8)
  ),
  jiaozhou: joinParts(
    segment("jiaozhou_outer_frontier"), pt(109.2, 17.4), pt(109.6, 18.5), pt(109.8, 20.0), pt(109.5, 21.1),
    pt(108.2, 21.3), pt(107.2, 21.8), pt(105.4, 21.05)
  )
};

export { BORDER_SEGMENTS, ZONE_NAMES };
