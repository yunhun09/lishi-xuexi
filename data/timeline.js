(function () {
  const keyframes = [
    {
      year: 265, era: "西晋初建",
      zones: { northChina: "xijin", northEast: "xijin", northWest: "xijin", central: "xijin", hexi: "xijin", guanzhong: "xijin", hanzhong: "xijin", qiang: "xijin", west: "xijin", liaodong: "xijin", koguryo: "goguryeo", jingchu: "wu", jiangdong: "wu", jianghuai: "xijin", jiangnan: "wu", lingnan: "wu", nanzhong: "wu", bashu: "xijin", steppe: "daiguo" }
    },
    {
      year: 280, era: "西晋统一",
      zones: { northChina: "xijin", northEast: "xijin", northWest: "xijin", central: "xijin", hexi: "xijin", guanzhong: "xijin", hanzhong: "xijin", qiang: "xijin", west: "xijin", liaodong: "xijin", koguryo: "goguryeo", jingchu: "xijin", jiangdong: "xijin", jianghuai: "xijin", jiangnan: "xijin", lingnan: "xijin", nanzhong: "xijin", bashu: "xijin", steppe: "daiguo" }
    },
    {
      year: 304, era: "十六国开端",
      zones: { northChina: "qianzhao", northEast: "xijin", northWest: "qianzhao", central: "xijin", hexi: "qianliang", guanzhong: "xijin", hanzhong: "qiuchi", qiang: "tuyuhun", west: "gaoche", liaodong: "qianyan", koguryo: "goguryeo", jingchu: "dongjin", jiangdong: "dongjin", jianghuai: "dongjin", jiangnan: "dongjin", lingnan: "dongjin", nanzhong: "chenghan", bashu: "chenghan", steppe: "daiguo" }
    },
    {
      year: 329, era: "后赵称雄",
      zones: { northChina: "houzhao", northEast: "qianyan", northWest: "houzhao", central: "houzhao", hexi: "qianliang", guanzhong: "houzhao", hanzhong: "dongjin", qiang: "tuyuhun", west: "gaoche", liaodong: "qianyan", koguryo: "goguryeo", jingchu: "dongjin", jiangdong: "dongjin", jianghuai: "dongjin", jiangnan: "dongjin", lingnan: "dongjin", nanzhong: "chenghan", bashu: "chenghan", steppe: "rouran" }
    },
    {
      year: 352, era: "冉魏-前燕",
      zones: { northChina: "ranwei", northEast: "qianyan", northWest: "houzhao", central: "ranwei", hexi: "qianliang", guanzhong: "qianqin", hanzhong: "qiuchi", qiang: "tuyuhun", west: "gaoche", liaodong: "qianyan", koguryo: "goguryeo", jingchu: "dongjin", jiangdong: "dongjin", jianghuai: "dongjin", jiangnan: "dongjin", lingnan: "dongjin", nanzhong: "dongjin", bashu: "dongjin", steppe: "daiguo" }
    },
    {
      year: 376, era: "前秦统一北方",
      zones: { northChina: "qianqin", northEast: "qianqin", northWest: "qianqin", central: "qianqin", hexi: "qianqin", guanzhong: "qianqin", hanzhong: "qianqin", qiang: "qianqin", west: "gaoche", liaodong: "qianqin", koguryo: "goguryeo", jingchu: "dongjin", jiangdong: "dongjin", jianghuai: "dongjin", jiangnan: "dongjin", lingnan: "dongjin", nanzhong: "dongjin", bashu: "dongjin", steppe: "rouran" }
    },
    {
      year: 395, era: "北方再裂",
      zones: { northChina: "houyan", northEast: "houyan", northWest: "huxia", central: "houqin", hexi: "houliang", guanzhong: "houqin", hanzhong: "xiqin", qiang: "xiqin", west: "gaoche", liaodong: "beiyan", koguryo: "goguryeo", jingchu: "dongjin", jiangdong: "dongjin", jianghuai: "dongjin", jiangnan: "dongjin", lingnan: "dongjin", nanzhong: "dongjin", bashu: "dongjin", steppe: "beiwei" }
    },
    {
      year: 407, era: "群雄并立",
      zones: { northChina: "beiwei", northEast: "nanyan", northWest: "huxia", central: "houqin", hexi: "beiliang", guanzhong: "houqin", hanzhong: "qiaoshu", qiang: "tuyuhun", west: "gaoche", liaodong: "beiyan", koguryo: "goguryeo", jingchu: "dongjin", jiangdong: "dongjin", jianghuai: "dongjin", jiangnan: "dongjin", lingnan: "dongjin", nanzhong: "qiaoshu", bashu: "qiaoshu", steppe: "rouran" }
    },
    {
      year: 420, era: "南北朝开始",
      zones: { northChina: "beiwei", northEast: "beiwei", northWest: "huxia", central: "beiwei", hexi: "beiliang", guanzhong: "huxia", hanzhong: "song", qiang: "xiqin", west: "gaoche", liaodong: "beiyan", koguryo: "goguryeo", jingchu: "song", jiangdong: "song", jianghuai: "song", jiangnan: "song", lingnan: "song", nanzhong: "song", bashu: "song", steppe: "rouran" }
    },
    {
      year: 439, era: "北魏统一北方",
      zones: { northChina: "beiwei", northEast: "beiwei", northWest: "beiwei", central: "beiwei", hexi: "beiwei", guanzhong: "beiwei", hanzhong: "song", qiang: "tuyuhun", west: "gaoche", liaodong: "beiwei", koguryo: "goguryeo", jingchu: "song", jiangdong: "song", jianghuai: "song", jiangnan: "song", lingnan: "song", nanzhong: "song", bashu: "song", steppe: "rouran" }
    },
    {
      year: 479, era: "南齐时期",
      zones: { northChina: "beiwei", northEast: "beiwei", northWest: "beiwei", central: "beiwei", hexi: "beiwei", guanzhong: "beiwei", hanzhong: "nanqi", qiang: "tuyuhun", west: "gaoche", liaodong: "beiwei", koguryo: "goguryeo", jingchu: "nanqi", jiangdong: "nanqi", jianghuai: "nanqi", jiangnan: "nanqi", lingnan: "nanqi", nanzhong: "nanqi", bashu: "nanqi", steppe: "rouran" }
    },
    {
      year: 502, era: "梁武帝时期",
      zones: { northChina: "beiwei", northEast: "beiwei", northWest: "beiwei", central: "beiwei", hexi: "beiwei", guanzhong: "beiwei", hanzhong: "beiwei", qiang: "tuyuhun", west: "gaoche", liaodong: "beiwei", koguryo: "goguryeo", jingchu: "liang", jiangdong: "liang", jianghuai: "liang", jiangnan: "liang", lingnan: "liang", nanzhong: "liang", bashu: "liang", steppe: "rouran" }
    },
    {
      year: 535, era: "东魏西魏",
      zones: { northChina: "dongwei", northEast: "dongwei", northWest: "xiwei", central: "dongwei", hexi: "xiwei", guanzhong: "xiwei", hanzhong: "xiwei", qiang: "tuyuhun", west: "gaoche", liaodong: "dongwei", koguryo: "goguryeo", jingchu: "liang", jiangdong: "liang", jianghuai: "liang", jiangnan: "liang", lingnan: "liang", nanzhong: "liang", bashu: "xiwei", steppe: "tuque" }
    },
    {
      year: 557, era: "北周与陈",
      zones: { northChina: "beiqi", northEast: "beiqi", northWest: "beizhou", central: "beiqi", hexi: "beizhou", guanzhong: "beizhou", hanzhong: "beizhou", qiang: "tuyuhun", west: "tuque", liaodong: "beiqi", koguryo: "goguryeo", jingchu: "chen", jiangdong: "chen", jianghuai: "beiqi", jiangnan: "chen", lingnan: "chen", nanzhong: "chen", bashu: "beizhou", steppe: "tuque" }
    },
    {
      year: 577, era: "北周灭北齐",
      zones: { northChina: "beizhou", northEast: "beizhou", northWest: "beizhou", central: "beizhou", hexi: "beizhou", guanzhong: "beizhou", hanzhong: "beizhou", qiang: "tuyuhun", west: "tuque", liaodong: "goguryeo", koguryo: "goguryeo", jingchu: "chen", jiangdong: "chen", jianghuai: "beizhou", jiangnan: "chen", lingnan: "chen", nanzhong: "chen", bashu: "beizhou", steppe: "tuque" }
    },
    {
      year: 589, era: "隋统一",
      zones: { northChina: "sui", northEast: "sui", northWest: "sui", central: "sui", hexi: "sui", guanzhong: "sui", hanzhong: "sui", qiang: "tuyuhun", west: "tuque", liaodong: "goguryeo", koguryo: "goguryeo", jingchu: "sui", jiangdong: "sui", jianghuai: "sui", jiangnan: "sui", lingnan: "sui", nanzhong: "sui", bashu: "sui", steppe: "tuque" }
    }
  ];

  function buildYears() {
    const y = [265, 280];
    for (let i = 304; i <= 439; i += 2) y.push(i);
    for (let i = 440; i <= 522; i += 5) y.push(i);
    for (let i = 523; i <= 589; i += 2) y.push(i);
    return y;
  }

  const years = buildYears();

  function nearestFrame(year) {
    let f = keyframes[0];
    for (const k of keyframes) {
      if (k.year <= year) f = k;
      else break;
    }
    return f;
  }

  const frames = years.map((year) => {
    const key = nearestFrame(year);
    const title = year <= 316 ? "西晋" : year <= 420 ? "东晋与十六国" : year <= 589 ? "南北朝" : "";
    return {
      year,
      era: `${title} · ${key.era}`,
      zones: key.zones
    };
  });

  window.TIMELINE_FRAMES = frames;
})();
