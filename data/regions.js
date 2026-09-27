/*
 * 种子点与自然边界辅助点。
 * 以州郡治所为主，并在秦岭—淮河—长江—太行等关键界线上增设辅助点，
 * 供 d3-delaunay + Turf 在浏览器中重建连续无缝的裁剪疆域单元。
 */
(function () {
  const seats = [["youzhou-jixian", "蓟县", 39.9, 116.4, "hebei_north"], ["youzhou-yuyang", "渔阳", 40.05, 117.2, "hebei_north"], ["youzhou-zhongshan", "中山", 38.52, 114.48, "hebei_south"], ["jizhou-ye", "邺", 36.2, 114.48, "hebei_south"], ["jizhou-wei", "魏郡", 36.68, 115.1, "hebei_south"], ["hebei-xiangguo", "襄国", 37.07, 114.49, "hebei_south"], ["haihe-cangzhou", "沧州", 38.31, 116.83, "hebei_north"], ["qingzhou-linqi", "临淄", 36.82, 118.31, "shandong"], ["qingzhou-jinan", "济南", 36.67, 117.02, "shandong"], ["qingzhou-beihai", "北海", 36.79, 119.12, "shandong"], ["yanzhou-taishan", "泰山", 36.2, 117.09, "shandong"], ["yanzhou-dongping", "东平", 35.94, 116.3, "shandong"], ["xuzhou-pengcheng", "彭城", 34.26, 117.19, "huaibei"], ["xuzhou-xiapi", "下邳", 34.32, 118.0, "huaibei"], ["huaihe-siyang", "泗阳", 33.72, 118.68, "huaibei"], ["bingzhou-jinyang", "晋阳", 37.87, 112.55, "shanxi"], ["bingzhou-shangdang", "上党", 36.2, 113.12, "shanxi"], ["bingzhou-yanmen", "雁门", 39.0, 112.92, "shanxi"], ["sizhou-luoyang", "洛阳", 34.62, 112.45, "henan"], ["sizhou-henei", "河内", 35.03, 113.24, "henan"], ["yuzhou-chenliu", "陈留", 34.8, 114.3, "henan"], ["yuzhou-yingchuan", "颍川", 34.1, 113.48, "henan"], ["henan-bian", "汴州", 34.9, 114.2, "henan"], ["yuzhou-runan", "汝南", 33.0, 114.36, "huainan"], ["yangzhou-shouchun", "寿春", 32.58, 116.78, "huainan"], ["yangzhou-lujiang", "庐江", 31.3, 117.29, "huainan"], ["yangzhou-guangling", "广陵", 32.4, 119.42, "huainan"], ["liangzhou-dunhuang", "敦煌", 40.14, 94.66, "hexi_west"], ["liangzhou-jiuquan", "酒泉", 39.74, 98.49, "hexi_west"], ["liangzhou-zhangye", "张掖", 38.93, 100.45, "hexi_east"], ["liangzhou-guzang", "姑臧", 37.93, 102.64, "hexi_east"], ["liangzhou-wuwei", "武威", 37.93, 102.64, "hexi_east"], ["qinzhou-tianshui", "天水", 34.58, 105.72, "longyou"], ["liangzhou-anding", "安定", 35.73, 107.64, "longyou"], ["hezhou-jincheng", "金城", 36.06, 103.84, "longyou"], ["liangzhou-jiahe", "枹罕", 35.6, 103.21, "longyou"], ["yongzhou-changan", "长安", 34.27, 108.94, "guanzhong"], ["yongzhou-jingzhao", "京兆", 34.38, 109.0, "guanzhong"], ["yongzhou-fufeng", "扶风", 34.37, 107.86, "guanzhong"], ["liangzhou-shuofang", "朔方", 38.84, 106.54, "hetao"], ["liangzhou-wuyuan", "五原", 40.8, 108.8, "hetao"], ["liangzhou-yunzhong", "云中", 40.0, 111.5, "hetao"], ["liangzhou-huhe", "河套", 40.7, 110.2, "hetao"], ["liangzhou-xihai", "西海", 36.82, 100.87, "qinghai"], ["hezhou-xiping", "西平", 36.62, 101.77, "qinghai"], ["qinghai-tuyuhun", "吐谷浑", 36.22, 97.37, "qinghai"], ["xizhou-shanshan", "鄯善", 42.87, 89.54, "xiyu"], ["xizhou-gaochang", "高昌", 42.82, 89.2, "xiyu"], ["xizhou-yiwu", "伊吾", 43.25, 93.52, "xiyu"], ["youzhou-liaoxi", "辽西", 41.3, 120.3, "liaodong"], ["youzhou-liaodong", "辽东", 41.8, 123.43, "liaodong"], ["youzhou-xuantu", "玄菟", 42.4, 124.6, "liaodong"], ["hebei-yingzhou", "营州", 41.1, 121.8, "liaodong"], ["gaogouli-guonei", "国内城", 41.1, 126.19, "koguryo"], ["north-steppe-rouran", "柔然牙庭", 47.5, 108.8, "steppe_east"], ["north-steppe-gaoche", "高车部", 47.1, 90.8, "steppe_west"], ["north-steppe-tujue", "突厥牙庭", 47.3, 86.2, "steppe_west"], ["yongzhou-hanzhong", "汉中", 33.07, 107.02, "hanzhong"], ["yizhou-hanzhong-west", "阴平", 32.0, 104.7, "hanzhong"], ["longxi-wudu", "武都", 33.4, 104.9, "hanzhong"], ["longxi-qiuchi", "仇池", 33.7, 104.0, "hanzhong"], ["yizhou-chengdu", "成都", 30.67, 104.07, "bashu"], ["yizhou-guanghan", "广汉", 31.01, 104.28, "bashu"], ["yizhou-jiangzhou", "江州", 29.56, 106.57, "bashu"], ["yizhou-shu", "蜀郡", 30.5, 103.94, "bashu"], ["yizhou-baidi", "白帝", 31.04, 109.56, "bashu"], ["ningzhou-jianning", "建宁", 25.04, 102.72, "nanzhong"], ["ningzhou-yongchang", "永昌", 25.11, 99.16, "nanzhong"], ["ningzhou-zangke", "牂牁", 26.58, 106.71, "nanzhong"], ["jingzhou-xiangyang", "襄阳", 32.01, 112.12, "jingbei"], ["jingzhou-jiangling", "江陵", 30.35, 112.19, "jiangling"], ["jingzhou-nanjun", "南郡", 30.6, 112.0, "jiangling"], ["jingzhou-wuling", "武陵", 29.0, 110.7, "jianghan"], ["yangzhou-jiankang", "建康", 32.05, 118.78, "jiangdong"], ["yangzhou-danyang", "丹阳", 31.99, 119.57, "jiangdong"], ["jiangnan-wuhu", "芜湖", 31.35, 118.43, "jiangdong"], ["jiangnan-jiankang-south", "建康南", 31.6, 118.9, "jiangdong"], ["yangzhou-kuaiji", "会稽", 30.0, 120.58, "liangzhe"], ["yangzhou-wu", "吴郡", 31.3, 120.62, "liangzhe"], ["yangzhou-poyang", "鄱阳", 28.99, 116.68, "jiangxi"], ["yangzhou-yuzhang", "豫章", 28.68, 115.85, "jiangxi"], ["jingzhou-changsha", "长沙", 28.23, 112.94, "hunan"], ["guangzhou-panyu", "番禺", 23.13, 113.27, "lingnan_east"], ["guangzhou-shixing", "始兴", 24.95, 114.07, "lingnan_east"], ["jingzhou-guilin", "桂林", 25.27, 110.29, "lingnan_west"], ["jiaozhou-hepu", "合浦", 21.68, 109.2, "lingnan_west"], ["jiaozhou-jiaozhi", "交趾", 21.03, 105.85, "jiaozhou"], ["jiaozhou-ri-nan", "日南", 16.47, 107.58, "jiaozhou"]].map(([id, name, lat, lng, zone]) => ({ id, name, lat, lng, zone, kind: "seat" }));
  const helpers = [];

  function addPair(prefix, zoneA, zoneB, path, offsetLat, offsetLng) {
    path.forEach(([lat, lng], index) => {
      helpers.push({ id: `${prefix}-a-${index}`, name: `${prefix}北界${index + 1}`, lat: +(lat + offsetLat).toFixed(3), lng: +(lng + offsetLng).toFixed(3), zone: zoneA, kind: "helper" });
      helpers.push({ id: `${prefix}-b-${index}`, name: `${prefix}南界${index + 1}`, lat: +(lat - offsetLat).toFixed(3), lng: +(lng - offsetLng).toFixed(3), zone: zoneB, kind: "helper" });
    });
  }

  function addLine(prefix, zone, points) {
    points.forEach(([lat, lng], index) => {
      helpers.push({ id: `${prefix}-${index}`, name: `${prefix}辅助${index + 1}`, lat, lng, zone, kind: "helper" });
    });
  }

  addPair("qinling", "guanzhong", "hanzhong", [[34.30, 105.90], [34.05, 106.90], [33.95, 108.05], [33.90, 109.25], [33.95, 110.55]], 0.34, 0.00);
  addPair("taihang", "shanxi", "hebei_south", [[39.10, 113.20], [38.25, 113.35], [37.40, 113.45], [36.55, 113.52]], 0.00, 0.34);
  addPair("huaihe", "huaibei", "huainan", [[33.18, 111.20], [33.22, 113.45], [33.24, 115.60], [33.18, 117.70], [33.05, 119.35]], 0.24, 0.00);
  addPair("yangtze-west", "jingbei", "jianghan", [[31.70, 111.20], [31.35, 112.35], [31.10, 113.60]], 0.36, 0.08);
  addPair("yangtze-east", "huainan", "jiangdong", [[31.80, 116.20], [31.60, 117.35], [31.40, 118.55], [31.25, 119.85]], 0.28, 0.10);
  addPair("nanling-east", "hunan", "lingnan_east", [[26.20, 112.00], [25.90, 113.10], [25.60, 114.20]], 0.30, 0.10);
  addPair("nanling-west", "hunan", "lingnan_west", [[26.10, 109.70], [25.90, 110.50], [25.70, 111.30]], 0.30, 0.10);
  addPair("hexi-north", "hetao", "hexi_east", [[39.80, 101.00], [39.45, 102.40], [39.20, 103.55]], 0.32, 0.08);
  addPair("hexi-south", "qinghai", "hexi_east", [[37.60, 99.80], [37.45, 101.20], [37.35, 102.85]], 0.32, 0.05);
  addPair("daba", "hanzhong", "bashu", [[32.55, 106.20], [32.20, 107.60], [31.90, 109.10]], 0.34, 0.10);
  addPair("yinshan", "steppe_east", "hetao", [[41.20, 106.20], [41.10, 108.30], [40.95, 110.55], [40.82, 112.20]], 0.28, 0.00);
  addPair("liaoxi", "hebei_north", "liaodong", [[40.55, 118.85], [40.85, 120.10], [41.05, 121.35]], 0.12, 0.26);
  addLine("shandong-peninsula", "shandong", [[36.95, 119.70], [37.05, 120.60], [37.15, 121.55], [36.85, 122.35]]);
  addLine("liaodong-peninsula", "liaodong", [[39.50, 121.00], [39.90, 121.50], [40.30, 122.10], [40.70, 122.70]]);
  addLine("hainan", "lingnan_west", [[20.00, 110.05], [19.60, 110.50], [19.30, 109.85]]);
  addLine("steppe-west", "steppe_west", [[46.30, 85.80], [45.90, 88.50], [45.80, 91.20], [45.60, 94.40]]);
  addLine("steppe-east", "steppe_east", [[46.20, 106.20], [45.80, 109.20], [45.50, 112.30], [45.00, 115.20]]);
  addLine("xiyu-rim", "xiyu", [[42.20, 87.40], [42.60, 90.30], [42.90, 92.20], [43.10, 94.40]]);

  const regionSeeds = [...seats, ...helpers];

  const hydrology = {
    rivers: [
      { name: "河", fullName: "古黄河", coords: [[35.7, 95.5], [36.4, 100.4], [37.4, 103.9], [38.4, 108.4], [38.1, 111.0], [37.4, 112.8], [36.95, 114.2], [35.72, 115.12], [36.1, 116.2], [37.15, 117.45], [38.15, 118.25], [38.55, 118.9]], color: "#4f87c4" },
      { name: "江", fullName: "长江", coords: [[30.8, 91.0], [30.8, 96.8], [30.7, 100.9], [30.7, 104.2], [30.8, 107.6], [30.6, 111.4], [30.4, 114.6], [30.5, 117.6], [31.1, 121.7]], color: "#2f7db3" },
      { name: "淮", fullName: "淮河", coords: [[33.0, 111.1], [33.1, 113.7], [33.2, 116.0], [33.1, 118.2], [33.0, 119.5]], color: "#5b9cd5" },
      { name: "汉", fullName: "汉水", coords: [[33.6, 106.8], [32.9, 108.9], [32.4, 110.8], [31.8, 112.3], [30.7, 112.8]], color: "#5d99ce" },
      { name: "渭", fullName: "渭水", coords: [[34.8, 104.7], [34.6, 106.8], [34.4, 108.8], [34.5, 110.7]], color: "#6aa2d2" },
      { name: "泗", fullName: "古泗水", coords: [[35.1, 117.2], [34.55, 117.55], [34.05, 117.95], [33.72, 118.35]], color: "#6ea6d8" },
      { name: "济", fullName: "济水", coords: [[35.35, 111.8], [35.15, 113.1], [35.2, 114.35], [35.52, 115.15], [36.0, 116.15]], color: "#78acd8" },
      { name: "汴", fullName: "古汴渠", coords: [[34.72, 112.55], [34.82, 113.45], [34.86, 114.18], [34.5, 115.25], [34.28, 116.0]], color: "#7baed6" },
      { name: "辽", fullName: "辽河", coords: [[42.2, 123.8], [41.5, 123.2], [40.9, 122.7], [40.6, 122.1]], color: "#6aa2d2" }
    ],
    lakes: [
      { name: "震泽", fullName: "震泽（太湖）", polygon: [[31.58, 119.88], [31.5, 120.28], [31.34, 120.62], [31.0, 120.55], [30.85, 120.2], [31.02, 119.9], [31.3, 119.78]], label: [31.2, 120.18] },
      { name: "彭蠡", fullName: "彭蠡（鄱阳湖）", polygon: [[29.35, 115.65], [29.6, 116.0], [29.4, 116.28], [28.95, 116.1], [29.02, 115.72]], label: [29.23, 115.96] },
      { name: "云梦泽", fullName: "云梦泽", polygon: [[30.85, 112.0], [31.05, 112.48], [30.92, 113.0], [30.4, 112.82], [30.32, 112.25]], label: [30.7, 112.55] },
      { name: "巨野泽", fullName: "巨野泽", polygon: [[35.42, 115.85], [35.5, 116.18], [35.22, 116.38], [35.0, 116.08], [35.12, 115.8]], label: [35.26, 116.05] }
    ],
    mountains: [
      ["太行", 37.20, 113.35], ["秦岭", 33.85, 107.60], ["阴山", 40.95, 108.10], ["祁连", 38.25, 99.75],
      ["大别山", 31.20, 115.65], ["南岭", 25.70, 112.00], ["大巴山", 31.90, 108.50], ["燕山", 40.15, 116.45],
      ["岷山", 32.40, 103.75], ["河西南山", 37.60, 100.65]
    ]
  };

  const strategic = {
    passes: [
      ["潼关", 34.57, 110.24], ["函谷关", 34.63, 111.22], ["虎牢关", 34.75, 113.25], ["剑门关", 32.18, 105.52],
      ["居庸关", 40.29, 116.08], ["壶关", 36.12, 113.20], ["武关", 33.69, 110.82], ["散关", 34.02, 106.93],
      ["采石", 31.73, 118.55], ["钟离", 32.86, 117.39], ["瓜步", 32.20, 118.72], ["平阳", 35.98, 111.53]
    ],
    greatWall: [
      [[40.45, 96.00], [40.20, 100.40], [40.18, 103.60], [40.42, 106.20], [40.74, 109.55], [40.72, 112.20], [40.52, 115.70], [40.41, 118.22]]
    ],
    migrations: [
      { name: "永嘉南渡主线", coords: [[34.62, 112.45], [33.20, 113.80], [31.95, 116.10], [32.05, 118.78]] },
      { name: "侨置州郡与江淮迁徙", coords: [[35.00, 114.00], [33.40, 116.20], [31.55, 118.10], [30.10, 120.10]] },
      { name: "六镇流民南下", coords: [[41.00, 112.00], [39.40, 113.40], [37.20, 114.30], [34.70, 112.40]] }
    ]
  };

  window.REGION_SEEDS = regionSeeds;
  window.HYDROLOGY = hydrology;
  window.STRATEGIC_FEATURES = strategic;
})();
