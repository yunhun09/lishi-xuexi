(function () {
  const s = {
    wu: { name: "孙吴", short: "吴", years: "229—280", founder: "孙权", ethnicity: "汉", capitals: ["建业"], rulers: "孙权、孙皓等", fall: "西晋灭吴", color: "#3f7a4b", family: "汉", pattern: "solid" },
    xijin: { name: "西晋", short: "晋", years: "265—316", founder: "司马炎", ethnicity: "汉", capitals: ["洛阳", "长安"], rulers: "武帝、惠帝、怀帝、愍帝", fall: "永嘉之乱后国都失守", color: "#b08a2e", family: "汉", pattern: "solid" },
    dongjin: { name: "东晋", short: "晋", years: "317—420", founder: "司马睿", ethnicity: "汉", capitals: ["建康"], rulers: "元帝至恭帝", fall: "刘裕受禅", color: "#c59d33", family: "汉", pattern: "solid" },
    song: { name: "刘宋", short: "宋", years: "420—479", founder: "刘裕", ethnicity: "汉", capitals: ["建康"], rulers: "武帝、文帝、孝武帝等", fall: "萧道成受禅", color: "#b13b37", family: "汉", pattern: "solid" },
    nanqi: { name: "南齐", short: "齐", years: "479—502", founder: "萧道成", ethnicity: "汉", capitals: ["建康"], rulers: "高帝、武帝、明帝", fall: "萧衍代齐", color: "#c44a67", family: "汉", pattern: "solid" },
    liang: { name: "梁", short: "梁", years: "502—557", founder: "萧衍", ethnicity: "汉", capitals: ["建康", "江陵（西梁）"], rulers: "武帝、简文帝、元帝", fall: "侯景之乱及西魏攻江陵后衰亡", color: "#d47a32", family: "汉", pattern: "solid" },
    xiliang: { name: "西梁（后梁）", short: "梁", years: "555—587", founder: "萧詧", ethnicity: "汉", capitals: ["江陵"], rulers: "宣帝、明帝、后主", fall: "为隋兼并", color: "#9a6a35", family: "汉", pattern: "ribbon" },
    chen: { name: "陈", short: "陈", years: "557—589", founder: "陈霸先", ethnicity: "汉", capitals: ["建康"], rulers: "武帝、文帝、宣帝、后主", fall: "隋灭陈", color: "#d13f3f", family: "汉", pattern: "solid" },
    sui: { name: "隋", short: "隋", years: "581—618", founder: "杨坚", ethnicity: "汉化关陇集团", capitals: ["大兴城", "洛阳"], rulers: "文帝、炀帝", fall: "隋末群雄并起", color: "#9c7a1d", family: "汉", pattern: "solid" },

    chenghan: { name: "成汉", short: "成", years: "304—347", founder: "李雄", ethnicity: "賨/巴氐集团", capitals: ["成都"], rulers: "李雄、李期、李势", fall: "桓温灭成汉", color: "#b56143", family: "汉", pattern: "solid" },
    qianzhao: { name: "前赵（汉赵）", short: "赵", years: "304—329", founder: "刘渊", ethnicity: "匈奴", capitals: ["平阳", "长安"], rulers: "刘渊、刘聪", fall: "后赵击灭", color: "#8c3f2f", family: "匈奴", pattern: "solid" },
    houzhao: { name: "后赵", short: "赵", years: "319—351", founder: "石勒", ethnicity: "羯", capitals: ["襄国", "邺"], rulers: "石勒、石虎", fall: "冉魏与内乱", color: "#5d3a2e", family: "羯", pattern: "solid" },
    qianliang: { name: "前凉", short: "凉", years: "314—376", founder: "张轨", ethnicity: "汉", capitals: ["姑臧"], rulers: "张氏诸君", fall: "前秦灭前凉", color: "#3f89a3", family: "汉", pattern: "solid" },
    qianyan: { name: "前燕", short: "燕", years: "337—370", founder: "慕容皝", ethnicity: "鲜卑", capitals: ["龙城", "邺"], rulers: "慕容皝、慕容俊、慕容暐", fall: "前秦灭前燕", color: "#2d8f57", family: "鲜卑", pattern: "solid" },
    qianqin: { name: "前秦", short: "秦", years: "351—394", founder: "苻健", ethnicity: "氐", capitals: ["长安"], rulers: "苻健、苻坚", fall: "淝水后崩解", color: "#a06a2a", family: "氐", pattern: "solid" },
    houyan: { name: "后燕", short: "燕", years: "384—407", founder: "慕容垂", ethnicity: "鲜卑", capitals: ["中山", "龙城"], rulers: "慕容垂、慕容宝", fall: "内乱并被北魏削弱", color: "#4cb073", family: "鲜卑", pattern: "border" },
    houqin: { name: "后秦", short: "秦", years: "384—417", founder: "姚苌", ethnicity: "羌", capitals: ["长安"], rulers: "姚苌、姚兴", fall: "刘裕北伐灭后秦", color: "#bf8c3f", family: "羌", pattern: "border" },
    xiqin: { name: "西秦", short: "秦", years: "385—431", founder: "乞伏国仁", ethnicity: "鲜卑化羌", capitals: ["苑川", "枹罕"], rulers: "国仁、乾归、炽磐", fall: "为夏与北魏所并", color: "#d9a86f", family: "羌", pattern: "ribbon" },
    houliang: { name: "后凉", short: "凉", years: "386—403", founder: "吕光", ethnicity: "氐化汉", capitals: ["姑臧"], rulers: "吕光、吕绍", fall: "被后秦兼并", color: "#6c98aa", family: "氐", pattern: "solid" },
    nanliang: { name: "南凉", short: "凉", years: "397—414", founder: "秃发乌孤", ethnicity: "鲜卑", capitals: ["乐都"], rulers: "乌孤、利鹿孤、傉檀", fall: "为西秦并", color: "#4aa7a0", family: "鲜卑", pattern: "ribbon" },
    nanyan: { name: "南燕", short: "燕", years: "398—410", founder: "慕容德", ethnicity: "鲜卑", capitals: ["广固"], rulers: "慕容德、慕容超", fall: "刘裕灭南燕", color: "#59b786", family: "鲜卑", pattern: "ribbon" },
    xiliang_state: { name: "西凉", short: "凉", years: "400—421", founder: "李暠", ethnicity: "汉", capitals: ["酒泉"], rulers: "李暠、李歆", fall: "北凉并吞", color: "#6caec2", family: "汉", pattern: "border" },
    beiliang: { name: "北凉", short: "凉", years: "397—439", founder: "段业/沮渠蒙逊", ethnicity: "卢水胡", capitals: ["张掖", "姑臧"], rulers: "沮渠蒙逊", fall: "北魏灭北凉", color: "#2ea9b2", family: "卢水胡", pattern: "border" },
    huxia: { name: "胡夏", short: "夏", years: "407—431", founder: "赫连勃勃", ethnicity: "匈奴铁弗", capitals: ["统万城"], rulers: "赫连勃勃", fall: "北魏灭夏", color: "#7f2f2a", family: "匈奴", pattern: "solid" },
    beiyan: { name: "北燕", short: "燕", years: "407—436", founder: "冯跋", ethnicity: "汉化鲜卑集团", capitals: ["龙城"], rulers: "冯跋、冯弘", fall: "北魏灭北燕", color: "#2d7d4f", family: "鲜卑", pattern: "dot" },

    ranwei: { name: "冉魏", short: "魏", years: "350—352", founder: "冉闵", ethnicity: "汉化军事集团", capitals: ["邺"], rulers: "冉闵", fall: "前燕灭冉魏", color: "#675a7a", family: "汉", pattern: "solid" },
    xiyan: { name: "西燕", short: "燕", years: "384—394", founder: "慕容泓", ethnicity: "鲜卑", capitals: ["长子"], rulers: "慕容冲等", fall: "后燕兼并", color: "#77b88c", family: "鲜卑", pattern: "dot" },
    diwei: { name: "翟魏", short: "魏", years: "388—392", founder: "翟辽", ethnicity: "丁零", capitals: ["滑台"], rulers: "翟辽、翟钊", fall: "后燕灭翟魏", color: "#6f5e8c", family: "高车", pattern: "solid" },
    qiaoshu: { name: "谯蜀", short: "蜀", years: "405—413", founder: "谯纵", ethnicity: "汉", capitals: ["成都"], rulers: "谯纵", fall: "刘裕部将朱龄石平蜀", color: "#b66c3d", family: "汉", pattern: "solid" },
    daiguo: { name: "代国", short: "代", years: "315—376", founder: "拓跋猗卢", ethnicity: "鲜卑拓跋", capitals: ["盛乐"], rulers: "拓跋氏", fall: "前秦灭代", color: "#6f7f8d", family: "鲜卑", pattern: "solid" },
    qiuchi: { name: "仇池", short: "仇", years: "296—506", founder: "杨茂搜", ethnicity: "氐", capitals: ["仇池山城"], rulers: "杨氏诸王", fall: "为北魏兼并", color: "#99825a", family: "氐", pattern: "solid" },
    tuyuhun: { name: "吐谷浑", short: "吐", years: "4世纪—663", founder: "吐谷浑", ethnicity: "鲜卑", capitals: ["伏俟城（流动）"], rulers: "慕容吐谷浑后裔", fall: "隋唐时期受制", color: "#9a8f67", family: "鲜卑", pattern: "solid" },
    rouran: { name: "柔然", short: "柔", years: "4世纪末—552", founder: "郁久闾社仑", ethnicity: "柔然", capitals: ["漠北牙庭"], rulers: "社仑、阿那瓌", fall: "为突厥所灭", color: "#7a7a7a", family: "草原", pattern: "solid" },
    gaoche: { name: "高车", short: "高", years: "5世纪活跃", founder: "诸部联盟", ethnicity: "高车/丁零", capitals: ["漠北诸部"], rulers: "阿伏至罗等", fall: "受柔然与突厥压制", color: "#8e8fa3", family: "高车", pattern: "solid" },
    tuque: { name: "突厥", short: "突", years: "552起", founder: "土门可汗", ethnicity: "突厥", capitals: ["漠北牙庭"], rulers: "土门、木杆等", fall: "后分裂为东西突厥", color: "#6f6f6f", family: "草原", pattern: "solid" },
    goguryeo: { name: "高句丽", short: "句", years: "前37—668", founder: "朱蒙", ethnicity: "高句丽", capitals: ["国内城", "平壤"], rulers: "长寿王等", fall: "唐与新罗灭之", color: "#3c7040", family: "东北亚", pattern: "solid" },

    beiwei: { name: "北魏", short: "魏", years: "386—534", founder: "拓跋珪", ethnicity: "鲜卑拓跋", capitals: ["平城", "洛阳"], rulers: "道武帝、太武帝、孝文帝等", fall: "分裂为东魏、西魏", color: "#5b4c9e", family: "鲜卑", pattern: "solid" },
    dongwei: { name: "东魏", short: "魏", years: "534—550", founder: "元善见（高欢控制）", ethnicity: "鲜卑-汉混合政权", capitals: ["邺"], rulers: "孝静帝", fall: "北齐代东魏", color: "#6c5fc5", family: "鲜卑", pattern: "border" },
    xiwei: { name: "西魏", short: "魏", years: "535—557", founder: "元宝炬（宇文泰控制）", ethnicity: "关陇集团", capitals: ["长安"], rulers: "文帝、废帝、恭帝", fall: "北周代西魏", color: "#7f5dd3", family: "鲜卑", pattern: "ribbon" },
    beiqi: { name: "北齐", short: "齐", years: "550—577", founder: "高洋", ethnicity: "鲜卑化军事集团", capitals: ["邺"], rulers: "文宣帝等", fall: "北周灭北齐", color: "#2f86cf", family: "鲜卑", pattern: "solid" },
    beizhou: { name: "北周", short: "周", years: "557—581", founder: "宇文觉", ethnicity: "鲜卑宇文", capitals: ["长安"], rulers: "明帝、武帝、宣帝", fall: "隋受禅", color: "#5f7230", family: "鲜卑", pattern: "solid" }
  };

  const requiredSet = [
    "chenghan", "qianzhao", "houzhao", "qianliang", "qianyan", "qianqin", "houyan", "houqin", "xiqin", "houliang",
    "nanliang", "nanyan", "xiliang_state", "beiliang", "huxia", "beiyan", "ranwei", "xiyan", "diwei", "qiaoshu",
    "daiguo", "qiuchi", "tuyuhun", "rouran", "gaoche", "tuque", "goguryeo", "xiliang", "dongwei", "xiwei"
  ];

  const lineage = [
    ["qianyan", "houyan"], ["houyan", "beiyan"], ["houyan", "nanyan"],
    ["beiwei", "dongwei"], ["beiwei", "xiwei"], ["dongwei", "beiqi"], ["xiwei", "beizhou"], ["beizhou", "sui"],
    ["dongjin", "song"], ["song", "nanqi"], ["nanqi", "liang"], ["liang", "chen"], ["liang", "xiliang"],
    ["qianzhao", "houzhao"], ["qianqin", "houqin"]
  ];

  window.STATES = s;
  window.REQUIRED_STATE_IDS = requiredSet;
  window.LINEAGE_EDGES = lineage;
})();
