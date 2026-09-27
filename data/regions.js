/*
 * 州郡级示意区块（近似重建）
 * 数据来源（综合近似）：
 * 1) 谭其骧《中国历史地图集》第三、四册（魏晋南北朝州郡格局）
 * 2) CHGIS（China Historical GIS）公开研究成果的州郡级空间分布
 * 3) 现代地形参考（主要山脉、河流走向）用于手工纠偏
 * 说明：为可视化服务，非严格测绘边界；精度约州郡级。
 */
(function () {
  const seeds = [
    ["youzhou-jixian", "蓟县", 39.9, 116.4, "northChina"],
    ["youzhou-yuyang", "渔阳", 40.0, 117.2, "northChina"],
    ["youzhou-zhongshan", "中山", 38.5, 114.5, "northChina"],
    ["jizhou-ye", "邺", 36.2, 114.5, "northChina"],
    ["jizhou-wei", "魏郡", 36.7, 115.1, "northChina"],
    ["qingzhou-linqi", "临淄", 36.8, 118.3, "northEast"],
    ["qingzhou-jinan", "济南", 36.7, 117.0, "northEast"],
    ["qingzhou-beihai", "北海", 36.9, 119.1, "northEast"],
    ["xuzhou-pengcheng", "彭城", 34.3, 117.2, "northEast"],
    ["xuzhou-xiapi", "下邳", 34.3, 118.1, "northEast"],
    ["bingzhou-jinyang", "晋阳", 37.9, 112.6, "northWest"],
    ["bingzhou-shangdang", "上党", 36.1, 113.1, "northWest"],
    ["bingzhou-yanmen", "雁门", 39.0, 112.9, "northWest"],
    ["sizhou-luoyang", "洛阳", 34.6, 112.4, "central"],
    ["sizhou-henei", "河内", 35.0, 113.2, "central"],
    ["yuzhou-chenliu", "陈留", 34.8, 114.3, "central"],
    ["yuzhou-runan", "汝南", 33.0, 114.4, "central"],
    ["yuzhou-yingchuan", "颍川", 34.1, 113.5, "central"],
    ["yanzhou-taishan", "泰山", 36.2, 117.1, "northEast"],
    ["yanzhou-dongping", "东平", 35.9, 116.3, "northEast"],
    ["liangzhou-guzang", "姑臧", 37.9, 102.6, "hexi"],
    ["liangzhou-zhangye", "张掖", 38.9, 100.4, "hexi"],
    ["liangzhou-jiuquan", "酒泉", 39.7, 98.5, "hexi"],
    ["liangzhou-dunhuang", "敦煌", 40.1, 94.7, "hexi"],
    ["qinzhou-tianshui", "天水", 34.6, 105.7, "guanzhong"],
    ["yongzhou-changan", "长安", 34.3, 108.9, "guanzhong"],
    ["yongzhou-jingzhao", "京兆", 34.4, 109.0, "guanzhong"],
    ["yongzhou-fufeng", "扶风", 34.4, 107.9, "guanzhong"],
    ["yongzhou-hanzhong", "汉中", 33.1, 107.0, "hanzhong"],
    ["liangzhou-anding", "安定", 35.7, 107.6, "guanzhong"],
    ["liangzhou-shuofang", "朔方", 38.8, 106.5, "northWest"],
    ["liangzhou-wuyuan", "五原", 40.8, 108.8, "steppe"],
    ["liangzhou-yunzhong", "云中", 40.0, 111.5, "steppe"],
    ["hezhou-jincheng", "金城", 36.0, 103.8, "guanzhong"],
    ["hezhou-xiping", "西平", 36.7, 101.7, "qiang"],
    ["xizhou-shanshan", "鄯善", 42.8, 89.5, "west"],
    ["xizhou-gaochang", "高昌", 42.8, 89.2, "west"],
    ["xizhou-yiwu", "伊吾", 43.0, 93.5, "west"],
    ["youzhou-liaoxi", "辽西", 41.3, 120.3, "liaodong"],
    ["youzhou-liaodong", "辽东", 41.8, 123.4, "liaodong"],
    ["youzhou-xuantu", "玄菟", 42.4, 124.6, "liaodong"],
    ["gaogouli-guonei", "国内城", 41.1, 126.2, "koguryo"],
    ["jingzhou-xiangyang", "襄阳", 32.0, 112.1, "jingchu"],
    ["jingzhou-jiangling", "江陵", 30.3, 112.2, "jingchu"],
    ["jingzhou-nanjun", "南郡", 30.6, 112.0, "jingchu"],
    ["jingzhou-wuling", "武陵", 29.0, 110.7, "jingchu"],
    ["yangzhou-jiankang", "建康", 32.1, 118.8, "jiangdong"],
    ["yangzhou-danyang", "丹阳", 31.9, 119.0, "jiangdong"],
    ["yangzhou-kuaiji", "会稽", 30.0, 120.6, "jiangdong"],
    ["yangzhou-wu", "吴郡", 31.3, 120.6, "jiangdong"],
    ["yangzhou-guangling", "广陵", 32.4, 119.4, "jianghuai"],
    ["yangzhou-shouchun", "寿春", 32.6, 116.8, "jianghuai"],
    ["yangzhou-lujiang", "庐江", 31.3, 117.3, "jianghuai"],
    ["yangzhou-poyang", "鄱阳", 28.9, 116.7, "jiangnan"],
    ["yangzhou-yuzhang", "豫章", 28.7, 115.9, "jiangnan"],
    ["jingzhou-changsha", "长沙", 28.2, 112.9, "jiangnan"],
    ["jingzhou-guilin", "桂林", 25.3, 110.3, "lingnan"],
    ["jiaozhou-hepu", "合浦", 21.7, 109.2, "lingnan"],
    ["jiaozhou-jiaozhi", "交趾", 21.0, 105.8, "lingnan"],
    ["jiaozhou-ri-nan", "日南", 16.3, 107.4, "lingnan"],
    ["guangzhou-panyu", "番禺", 23.1, 113.3, "lingnan"],
    ["guangzhou-shixing", "始兴", 24.9, 114.0, "lingnan"],
    ["ningzhou-jianning", "建宁", 25.0, 102.7, "nanzhong"],
    ["ningzhou-yongchang", "永昌", 25.2, 99.2, "nanzhong"],
    ["ningzhou-zangke", "牂牁", 26.6, 106.7, "nanzhong"],
    ["yizhou-chengdu", "成都", 30.7, 104.1, "bashu"],
    ["yizhou-guanghan", "广汉", 31.0, 104.3, "bashu"],
    ["yizhou-jiangzhou", "江州", 29.6, 106.6, "bashu"],
    ["yizhou-shu", "蜀郡", 30.5, 103.9, "bashu"],
    ["yizhou-baidi", "白帝", 31.0, 109.6, "bashu"],
    ["yizhou-hanzhong-west", "阴平", 32.0, 104.7, "hanzhong"],
    ["liangzhou-wuwei", "武威", 38.0, 102.1, "hexi"],
    ["liangzhou-xihai", "西海", 36.8, 100.9, "qiang"],
    ["liangzhou-jiahe", "枹罕", 35.6, 103.2, "qiang"],
    ["north-steppe-rouran", "柔然牙庭", 47.5, 108.8, "steppe"],
    ["north-steppe-gaoche", "高车部", 47.1, 90.8, "steppe"],
    ["north-steppe-tujue", "突厥牙庭", 47.3, 86.2, "steppe"],
    ["qinghai-tuyuhun", "吐谷浑", 36.2, 97.4, "qiang"],
    ["longxi-wudu", "武都", 33.4, 104.9, "hanzhong"],
    ["longxi-qiuchi", "仇池", 33.7, 104.0, "hanzhong"],
    ["liangzhou-huhe", "河套", 40.7, 110.2, "steppe"],
    ["henan-bian", "汴", 34.9, 114.2, "central"],
    ["hebei-xiangguo", "襄国", 37.1, 114.5, "northChina"],
    ["hebei-yingzhou", "营州", 41.1, 121.8, "liaodong"],
    ["haihe-cangzhou", "沧州", 38.2, 117.6, "northChina"],
    ["huaihe-siyang", "泗阳", 33.9, 118.7, "jianghuai"],
    ["jiangnan-wuhu", "芜湖", 31.3, 118.4, "jiangdong"],
    ["jiangnan-jiankang-south", "建康南", 31.6, 118.9, "jiangdong"]
  ];

  function buildPolygon(lat, lng, i) {
    const dx = 0.65 + (i % 3) * 0.08;
    const dy = 0.5 + (i % 4) * 0.07;
    return [
      [lat - dy, lng - dx],
      [lat - dy * 0.35, lng + dx],
      [lat + dy, lng + dx * 0.8],
      [lat + dy * 0.42, lng - dx]
    ];
  }

  const regions = seeds.map((s, i) => ({
    id: s[0],
    name: s[1],
    center: [s[2], s[3]],
    zone: s[4],
    polygon: buildPolygon(s[2], s[3], i)
  }));

  const hydrology = {
    rivers: [
      { name: "黄河（古道示意）", coords: [[36.3, 96.0], [37.4, 101.5], [37.8, 106.4], [38.2, 111.0], [37.5, 114.2], [37.8, 118.3], [37.5, 120.8]], color: "#4f87c4" },
      { name: "长江", coords: [[30.7, 91.5], [30.7, 97.0], [30.6, 102.7], [30.8, 106.0], [30.7, 109.0], [30.6, 112.5], [30.7, 116.2], [31.3, 121.8]], color: "#2f7db3" },
      { name: "淮河", coords: [[33.0, 111.0], [33.2, 114.0], [33.3, 117.0], [33.1, 119.6]], color: "#4c8fca" },
      { name: "汉水", coords: [[33.5, 106.7], [32.8, 109.0], [32.2, 111.1], [30.8, 112.8]], color: "#5d99ce" },
      { name: "渭水", coords: [[34.8, 104.8], [34.5, 107.8], [34.3, 109.2], [34.5, 110.6]], color: "#5d99ce" },
      { name: "济水（古）", coords: [[35.5, 112.1], [35.8, 114.1], [36.2, 116.2], [37.2, 118.4]], color: "#76a8d8" }
    ],
    mountains: [
      ["太行", 37.2, 113.3], ["秦岭", 33.8, 107.6], ["阴山", 40.9, 108.0], ["祁连", 38.3, 99.8],
      ["大别山", 31.2, 115.7], ["岷山", 32.3, 103.8], ["武夷", 27.5, 117.9], ["燕山", 40.1, 116.5]
    ]
  };

  const strategic = {
    passes: [
      ["潼关", 34.6, 110.3], ["函谷关", 34.7, 111.0], ["虎牢关", 34.8, 113.3], ["剑门关", 32.2, 105.5],
      ["居庸关", 40.3, 116.1], ["壶关", 36.1, 113.2], ["武关", 33.7, 110.8], ["散关", 34.0, 106.8]
    ],
    greatWall: [
      [[40.5, 96.0], [40.2, 100.4], [40.2, 103.6], [40.5, 106.2], [40.8, 109.6], [40.7, 112.2], [40.5, 115.8], [40.4, 118.3]]
    ],
    migrations: [
      { name: "永嘉南渡主线", coords: [[34.6, 112.4], [33.0, 113.5], [31.8, 116.1], [32.1, 118.8]] },
      { name: "侨置州郡与江淮迁徙", coords: [[35.0, 114.0], [33.2, 116.0], [31.5, 118.0], [30.2, 120.0]] }
    ]
  };

  window.REGIONS = regions;
  window.HYDROLOGY = hydrology;
  window.STRATEGIC_FEATURES = strategic;
})();
