/* ============================================================
   music-museum.js —— 「音乐博物馆 / MUSIC MUSEUM」场景引擎
   ------------------------------------------------------------
   职责边界（**很重要**，这个文件不该越界）：

     本文件负责                          script.js 负责
     ─────────────────────            ─────────────────────
     Museum 初始化                      页面入口 / 页面状态
     加载层进度驱动                     打开 / 关闭 museum 的时机
     场景渲染（唱片陈列）                与扇形导航接线
     唱片对象与点击播放                  淡出小窝
     资源预加载（真资源，不是 setTimeout） Esc / 路由的收口顺序

   数据来源分工：
     window.RINSORA_MUSIC          → 歌曲是什么（title/artist/cover/src/lrc）
     window.RINSORA_MUSIC_MUSEUM   → 歌曲摆在哪（x/y/scale/rotation/depth）

   ⚠️ 三条绝对不做的事：
     1. 不创建第二个 <audio>、不写第二套播放引擎 ——
        点唱片只是调 window.RinsoraMusic.playIndex(i)，复用现有播放器。
     2. 不修改现有播放器核心逻辑（music.js 一行都不动）。
     3. 不碰 location.href 去开新文档 —— 这是站内浮层，
        换文档会让 <audio> 随旧文档销毁、音乐断掉。

   对外接口 window.RinsoraMuseum：
     enter(opts)   → Promise；打开加载层 → 预加载 → 进场景
     exit()        → 关场景 + 关加载层（幂等）
     isOpen()      → 当前是否在博物馆里
     open()/close() 是 enter/exit 的别名（语义更直白的那组）
     records()     → 渲染后的唱片列表（调试 / 回归装置用）
     state         → 内部状态（只读用途）

   第六轮重构（用户要求：取消分页式唱片墙，改成「左侧无限循环扇形 + 右侧档案轨」）：
     selectedIndex()      → 扇形焦点：**state.records 里的位置**（0 ~ n-1）
     selectIndex(i)       → 把焦点移到第 i **个位置**（走最短路径，无限循环）
     select(rec)          → 按 record 选（内部自动取 rec.order）
     stepBy(dir)          → 焦点前进 / 后退一张（滚轮与 ↑↓ 都落在这里）
     detailOpen()         → 右侧档案面板是否展开（Esc 第一级的落点）
     geometry()           → 当前视口的扇形参数（cx/cy/rx/ry/size/railX）
     layout(focus,n,w,h)  → **纯函数**：任意视口下的完整扇形布局（回归装置 / 几何求解用）
     fanHalf(n)           → 可见窗口半宽（±几 张）
     wrapOffset(d, n)     → 把差值归一到 [-n/2, n/2) —— 无限循环的数学落点
     stepFan()/settleFan(n) → 同步推进扇形动画一帧 / 一次推到位（rAF 在无头下不派发）
     wheel(dy, mode)      → 喂一次滚轮增量（回归装置用，不依赖真实 WheelEvent）
     syncFromPlayer()     → 按播放器真实状态刷新 .playing
     isPlayingIndex(i)    → 该曲目是否正在响（含暂停判定）
     onExitRequest(fn)    → 「退出展厅」交给宿主关（见 requestExit）

   ⚠️ 这一轮**删掉**的东西（别再写回来）：
     · page / pageCount / computePerPage / gotoPage / renderPager / 分页器 DOM
     · 自由摆位（x / y / scale / rotation / depth）—— 位置改由扇形几何按
       「焦点距离」解算；music-museum-data 的 spots 只剩 label / note 覆写
     · 鼠标视差（--mm-px-pos / --mm-depth-x/y / setParallax / stepParallax）
     · 唱片下方的 .mm-disc-label 胶囊（标题归右侧档案面板，扇形上不放字）
     ⚠️ 但「删掉」是指不再有**读取方**，不是把数据抹掉：
        spots 里的 note / label 照旧读（见 collectSpots）。
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const d = document;
  const body = d.body;

  /* ---------------------------------------------------- 小工具 ---- */
  const reduceMotion = () => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, dflt) => {
    const n = parseFloat(v);
    return isFinite(n) ? n : dflt;
  };

  /* ============================================================
     MUSIC 路径解析
     ------------------------------------------------------------
     ⚠️ music-data.js 里的 src / cover 是「相对站点根目录」写的
     （assets/music/xxx）。首页在根目录，直接用没事；但只要有任何一个
     换了目录深度的入口（文章页在 /posts/ 下就是），路径就会 404。
     music.js 里有个 res() 做同样的事 —— 这里再写一份是因为它没导出。
     规则保持和它一致：按当前目录深度补 '../'，且幂等
     （已经是 http(s):/data:/绝对路径 的不动）。
     ============================================================ */
  function res(p) {
    if (!p) return '';
    if (/^(?:[a-z]+:|\/|#|data:)/i.test(p)) return p;
    /* location.pathname 的目录深度 → 需要几层 ../ */
    const segs = location.pathname.split('/').filter(Boolean);
    /* 末段是文件名（index.html / 404.html…）时不算目录 */
    if (segs.length && /\.[a-z0-9]+$/i.test(segs[segs.length - 1])) segs.pop();
    return '../'.repeat(segs.length) + p;
  }

  /* ---------------------------------------------------- 元素 ---- */
  const loadEl = $('#mmLoad');
  const sceneEl = $('#mmScene');
  const stageEl = $('#mmStage');
  const loadBar = $('#mmLoadBar');
  const loadPct = $('#mmLoadPct');
  const loadStatus = $('#mmLoadStatus');
  const sceneCount = $('#mmSceneCount');
  const exitBtn = $('#mmExit');
  const emptyEl = $('#mmEmpty');
  /* 右侧档案轨（第六轮）：详情不再是居中 modal，而是页面右侧常驻的一列。
     ⚠️ 面板**内部**的字段节点 id 全部保留（下面的 detailArt…detailTags）——
        卡片本身没被拆散，只是换了定位方式（.mm-detail 从「全屏居中网格」
        变成「右侧那一列」），fillDetail 一个字都不用改。
     ⚠️ 删掉的是分页器那四个（mmPager/mmPrev/mmNext/mmPage）与遮罩
        detailScrim：分页没有了，modal 遮罩也没有了。 */
  const detailEl = $('#mmDetail');
  const detailArt = $('#mmDetailArt');
  const detailKicker = $('#mmDetailKicker');
  const detailIndex = $('#mmDetailIndex');
  const detailTitle = $('#mmDetailTitle');
  const detailArtist = $('#mmDetailArtist');
  const detailMeta = $('#mmDetailMeta');
  const detailExtra = $('#mmDetailExtra');
  const detailDesc = $('#mmDetailDesc');
  const detailTags = $('#mmDetailTags');
  const detailPlay = $('#mmDetailPlay');
  const detailPlayTxt = $('#mmDetailPlayTxt');
  const detailClose = $('#mmDetailClose');

  /* ---------------------------------------------------- 状态 ---- */
  const state = {
    open: false,          /* 场景是否已进入（含动画中） */
    entering: false,      /* 是否正在预加载 */
    token: 0,             /* 自增令牌：旧一轮的异步收尾不再动 DOM */
    rendered: false,      /* 场景是否已渲染过 */
    records: [],          /* 唱片（一首歌一张）[{musicId, track, index, label, note, order}] */
    loaded: {},           /* 资源缓存标记，避免重复网络请求 */

    /* —— 扇形导航（第六轮）—— */
    selectedIndex: 0,     /* **扇形焦点**：在 state.records 里的**位置**（0 ~ n-1）。这是唯一的选择状态。
                             ⚠️ 是「第几张唱片」而不是「曲目表下标」—— 两者在正常情况下相同，
                                但如果曲库里有条目缺 id 被跳过，位置和下标就会错开。
                                对外播放一律用 rec.index（曲目表下标），别混。 */
    detailOpen: false,    /* 右侧档案面板是否展开（Esc 第一级只关它） */
    selected: null,       /* 派生值：detailOpen ? records[selectedIndex] : null */
    hovered: null,        /* 当前 hover 的 record */
    fanPos: 0,            /* 扇形当前位置（**连续浮点**，单位 = 一个 offset 步） */
    fanTo: 0,             /* 扇形目标位置（同样是连续浮点） */
    pool: {},             /* musicId → 唱片元素（按 id 复用，切歌不重建 DOM） */
    rafId: 0,             /* 扇形动画的 rAF 句柄，0 = 未跑 */
    wheelAcc: 0,          /* 滚轮累加器（px） */
    wheelAt: 0,           /* 滚轮冷却到期时刻（ms） */

    /* —— 播放联动 —— */
    isPlaying: false,     /* 播放器当前是否在响（body.mp-playing 的真实读数） */
    playBlocked: false,   /* 上一次播放被浏览器自动播放策略拦下了（UI 降级用） */
    dataSig: '',          /* 曲库指纹：变了就重建唱片池（上传新歌后能立刻看到） */
    hostExit: null        /* 宿主（script.js）的退出函数；见 requestExit() */
  };

  /* ⚠️⚠️ 为什么扇形位置要两个字段（fanPos / fanTo）而且**都不取模**：
     无限循环要的是「首尾逻辑相连」，也就是 7 首时从第 0 首向上滚要回到第 6 首。
     如果两个数都归一化到 [0, n)，那么从 0 去 n-1 会被插值成「往下穿过整圈」——
     视觉上就是「滚一下倒着转一整圈」。
     所以这里保留**无界连续坐标**：取模只发生在算差值的时候（wrapOffset）。
     两个字段都是浮点，fanPos 由 rAF 逐帧逼近 fanTo。 */


  /* 当前正在响的曲目 index（用来给那张唱片加 .playing）。
     ⚠️ 这不是「本地记的意图」，而是**从播放器读回来的事实** ——
     见 followPlayer() / syncFromPlayer()。 */
  let playingIndex = -1;

  /* ============================================================
     扇形参数（第六轮：取消分页，改成「左侧无限循环扇形」）
     ------------------------------------------------------------
     ⚠️ 这里**没有一组只适合 1440px 的硬编码**：下面是「比例 + 钳制的公式」，
        真正的数值由 fanGeometry(w, h) 按视口算出来。需求第十六条明确要求
        viewport-based 参数，理由很实在 —— 1280×800 和 1440×900 的
        可用高度差了 100px，写死一组数字必然在某一档越界。
     ⚠️ 参数**不在这里拍脑袋定**：由 _mmfancheck.py 在
        1440×900 / 1280×800 / 1152×720 三档上解算并断言（见那边的组 F）。
     ⚠️ 两条不变量是**构造保证**的，不是调参碰出来的运气：
        ① apexX = railX - gap - 选中半径  →  选中那张永远进不了右侧面板
        ② ry    受「可用高度 - 最外那张半径」钳制  →  最外那张永远不被 HUD/页脚裁到
     ============================================================ */
  const FAN_SPAN = Math.PI / 2;          /* 可见窗口恒定跨越 ±90°（一个明显的四分之一弧） */
  const FAN_VIS  = 3;                    /* 最多显示到 ±3（合计 7 张） */
  const FAN_RING = 1.0;                  /* 窗口外再留 1 格做淡出环（透明度恰好走到 0） */

  /* 步角：**可见窗口恒定跨 ±90°**，所以每格的角间隔 = 90° / 半宽。
       half=3（曲库 ≥7）→ 30°（一屏 7 张，和上一版一致）
       half=2（曲库 5~6）→ 45°
       half=1（曲库 2~4）→ 90°
     ⚠️ 为什么不做成「固定 30°」：
        曲库只有 4 首时 half=1，固定 30° 的话三张唱片只跨 ±30° ——
        横向位移 0.134·rx（≈30px），看上去就是**一列竖排**，
        而需求第五条明确要求「垂直扇形 / 椭圆弧，不是竖排列表」。
        把窗口固定成 ±90° 之后，无论曲库多大，轮廓都是同一把扇子，
        而且曲库越小时相邻两张离得越开（不会挤）。
     ⚠️ 步角只和**曲库规模**有关，和视口无关 —— 所以 resize 不会让
        唱片的相对角度变化（只有半径 / 位置变），观感是连续的。 */
  function fanStep(half) {
    const h = Math.max(1, Math.min(FAN_VIS, half || 0));
    return FAN_SPAN / h;
  }

  /* 窗口外淡出环：|offset| 从 half 走到 half + FAN_RING 的这段里，
     缩放继续往最小档收、透明度线性走到 0、模糊走到最深。
     返回 [0,1] 的 f（0 = 还在窗口内，1 = 已经彻底看不见）。 */
  function fanFade(a, half) {
    const over = Math.abs(a) - half;
    if (!(over > 0)) return 0;
    return clamp(over / FAN_RING, 0, 1);
  }
  /* 一张唱片在 |offset| = a 时的「三层观感」（缩放 / 透明度 / 模糊）。
     ⚠️ 唯一的落点：applyFan 与 fanLayout 都调它，几何断言量的也是它。
        别在任何一处另写一遍曲线。 */
  function fanLook(a, half) {
    const vis = clamp(Math.abs(a), 0, half);          /* 窗口内按 |offset| 取档 */
    const f = fanFade(a, half);
    const last = FAN_SCALE.length - 1;
    return {
      scale: sampleLerp(FAN_SCALE, vis) * (1 - f) + FAN_SCALE[last] * f,
      opacity: sampleLerp(FAN_OP, vis) * (1 - f),
      blur: sampleLerp(FAN_BLUR, vis) * (1 - f) + FAN_BLUR[FAN_BLUR.length - 1] * f,
      f: f
    };
  }

  /* 远近层级：|offset| = 0 / 1 / 2 / 3 四档
     （需求第七条给的区间是 1.10~1.20 / 0.82~0.92 / 0.66~0.78 / 0.50~0.62）
     ⚠️ 这三个数组都按**窗口内的 |offset|** 取档（0~3）；窗口外的淡出
         由 fanLook() 用 FAN_RING 那一段补。FAN_BLUR 多一个 14.0 是留给
         淡出环的**最深处**（窗口内取不到它，别删）。 */
  const FAN_SCALE = [1.14, 0.86, 0.70, 0.55];
  const FAN_OP   = [1, 0.92, 0.74, 0.50];
  const FAN_BLUR = [0, 2.6, 6.0, 10.0, 14.0];

  const FAN_EASE = 0.16;                 /* 扇形位移的 lerp 系数（小 = 更黏） */
  const FAN_EPS  = 0.0008;               /* 收敛阈值：到这个精度就停 rAF，静止时零开销 */

  /* 滚轮（需求第八条：累加器 + 阈值 + 冷却）
     ⚠️ 为什么不能「一个 wheel event = 切一张」：
        Windows 精密触控板 / 鼠标惯性一次滑动会吐出**几十个** wheel 事件，
        那样会一口气跳过七八张唱片，浏览根本没法用。
     这里的策略：
        · 累加 deltaY（跨事件），达到 WHEEL_STEP 才算「一格」
        · 切完一张后进入 WHEEL_LOCK 冷却，冷却期内的增量**直接丢弃**
          （丢的是惯性尾巴，不是用户的第二格 —— 180ms 比人手两格的最短间隔还短） */
  const WHEEL_STEP = 42;                 /* 累积到这么多 px 才算一格 */
  const WHEEL_LOCK = 180;                /* 切完一张后的冷却（ms） */

  /* 自转速度：每张唱片按**曲目 id 的 hash** 定一个稳定周期。
     ⚠️ 不要按「当前 offset」定 —— offset 每帧都在变，改 animation-duration
        会让旋转角度当场跳一下（踩过：一暂停就跳回起点那类问题同源）。
        按 id 定则「这张唱片转到哪儿」永远是同一个姿势。 */
  const SPIN_BASE = 34;                  /* 最慢一张转一圈的秒数 */
  const SPIN_NEAR = 20;                  /* 最快一张转一圈的秒数 */


  function trackList() {
    return (window.RinsoraMusic && window.RinsoraMusic.tracks)
      ? (window.RinsoraMusic.tracks() || []) : [];
  }

  /* 读播放器的「当前曲目下标」。⚠️ getState().index 只在 setIndex() 里写，
     所以它反映「曲目」而不反映「播放/暂停」—— 播放态另看 body.mp-playing。 */
  function playerIndexNow() {
    try {
      const s = window.RinsoraMusic && window.RinsoraMusic.getState
        ? window.RinsoraMusic.getState() : null;
      return (s && typeof s.index === 'number') ? s.index : -1;
    } catch (e) { return -1; }
  }

  /* 手动覆写的两种写法都认：
       spots   : { "曲目 id": {note, label} }        ← 推荐
       records : [ { musicId, note, label }, ... ]   ← 老写法
     ⚠️ 第六轮把 x/y/scale/rotation/depth 五个摆位字段**全部作废**了：
        位置由扇形几何按「焦点距离」算，不再是每首歌自己的属性。
        这里仍然会原样收进来（不吃掉别人的数据），但引擎只读 note / label。
     ⚠️ 同一 id 有多条时**只取第一条**：用户反馈 1 就是「表里写重了，
        墙上出现两张」—— 去重这一步放在这里，别放到渲染里去。 */
  function collectSpots(raw) {
    const out = {};
    const put = (id, o) => { if (id && !Object.prototype.hasOwnProperty.call(out, id)) out[id] = o || {}; };
    const sp = raw && raw.spots;
    if (sp && typeof sp === 'object') Object.keys(sp).forEach((id) => put(id, sp[id]));
    ((raw && raw.records) || []).forEach((r) => put(r && r.musicId, r));
    return out;
  }

  /* FNV-1a：用来给「同一首歌」一个稳定的起始角度。
     确定性很重要 —— 用 Math.random() 的话每刷新一次唱片就换个姿势。 */
  function hash(str) {
    const t = String(str == null ? '' : str);
    let h = 2166136261;
    for (let i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function tilt(id, k) { return (hash(id) % (k * 2 + 1)) - k; }

  /* ============================================================
     扇形几何 —— **纯函数**，不碰 DOM、不看时间
     ------------------------------------------------------------
     模型：椭圆弧
        theta = offset * step        （step = 90° / 可见半宽，见 fanStep）
        x     = cx + rx * cos(theta)
        y     = cy + ry * sin(theta)

     offset = 0 是弧的**顶点**（最右、最大、最亮），两侧沿弧向上下展开
     的同时向左收 —— 这就是「垂直扇形」的轮廓，不是一列竖排的唱片。

     ⚠️ 纯函数是有意的：几何对不对**不该靠肉眼看截图**。
        _mmfan.js 直接调 fanLayout() 拿坐标，再做三件事：
          · 边界（不压 HUD / 不被页脚裁 / 不进右侧面板 / 不越出视口左边）
          · 相邻唱片的圆心距（不能被挡到认不出来）
          · 首尾连通（无限循环真的接上了）
        这条流程是上一阶段解扇形导航几何时建立起来的，继续沿用。
     ⚠️ 本机无头 Edge 被沙箱静默拦下（rc=0 且零输出），**真实截图不可用** ——
        所以几何断言 + _fan_preview.html（真 iframe）就是这一轮的验收手段。

     参数来源（比例 + 钳制，不是硬编码）：
        size   168 / 132 / 104    ← 沿用原有三档断点（900 / 560）
        railX  w * .47            ← 右侧档案轨的左边界
        rx     clamp(w * .19, 96, 260)，再被「淡出环最左那张不越出视口」钳一次
        ry     clamp(avail * .40, 60, 244) 再被「可用高度 - 边缘半径」钳一次
        cy     扇区可用段 [bandTop, bandBot] 的**竖直中点**
        step   90° / half —— 可见窗口恒定跨 ±90°，见 fanStep
        band*  由「竖向分区表」一次算清 —— 窄屏要同时让开档案轨与提示条
     ============================================================ */
  function discSize(w) {
    return w <= 560 ? 104 : w <= 900 ? 132 : 168;
  }

  /* ------------------------------------------------------------
     竖向分区表 —— 扇区能用的「上下边界」在这里一次算清
     ------------------------------------------------------------
     ⚠️⚠️ 这张表是**版式契约**：它算出来的 railY / railB / footX / footB
        由 layoutRail() 写成 CSS 变量（--mm-rail-y/-b、--mm-foot-x/-b），
        CSS 只读不猜。所以：
          · 「窄屏档案轨占下方 42%」这件事只在**这一处**定义；
          · CSS 里不再出现 46vh / 96px 这类会和 JS 漂移的数字。
        上一版窄屏是「扇形按 h-126 排、轨道按 46vh 钉底」，两边各算各的，
        结果最下面那张唱片会滑到档案卡底下 —— 修法就是合成一张表。
     ============================================================ */
  const HUD_DESK   = 84;    /* 桌面 HUD 下沿（padding 22 + 内容约 40） */
  const HUD_NARROW = 62;    /* 窄屏 HUD 下沿（padding 16 + 内容约 30） */
  const FOOT_H     = 44;    /* 底部提示条自身高度（含描边余量） */
  const FOOT_GAP   = 12;    /* 提示条与上方扇区 / 下方档案轨之间的呼吸缝 */
  const FOOT_B     = 22;    /* 桌面：提示条离底 */
  const RAIL_TOP   = 96;    /* 桌面：档案轨顶边 */
  const RAIL_BOT   = 78;    /* 桌面：档案轨底边 */
  const RAIL_PAD   = 10;    /* 窄屏：档案轨离底 */
  const RAIL_RATIO = 0.42;  /* 窄屏：档案轨高度占视口比例 */
  const RAIL_MIN = 190, RAIL_MAX = 340;   /* 窄屏轨道高度的钳制区间 */

  /* 扇形几何 —— 纯函数：返回一组 px 数值 + 版式契约（不碰 DOM）。
     ⚠️ 半径、间距全部是**比例 + 钳制的公式**，不是某一档屏的解；
        三档桌面尺寸的验收由 _mmfan.js 断言。

     half = fanHalf(曲库条数)：可见窗口半宽。它参与几何，因为
       · 步角 = 90°/half（见 fanStep）；
       · 最外那张的半径 = size·FAN_SCALE[half]/2 —— 「上边界钳制」要按它算。
     ⚠️ 不传 half 时按 FAN_VIS 保守算（用在还没确定曲库的场合）。 */
  function fanGeometry(w, h, half) {
    const narrow = w <= 900;                 /* 窄屏：档案轨改到底部，扇形独占上半屏 */
    const hf = Math.max(0, Math.min(FAN_VIS, typeof half === 'number' ? half : FAN_VIS));
    const step = fanStep(hf);

    /* ---- 竖向分区：先定「谁占哪一段」，再让扇形待在自己的那一段里 ---- */
    let hudB, railX, railY, railB, footX, footB, bandTop, bandBot;
    if (narrow) {
      const railH = clamp(Math.round(h * RAIL_RATIO), RAIL_MIN, RAIL_MAX);
      railY   = h - RAIL_PAD - railH;                  /* 轨道顶边 */
      railB   = RAIL_PAD;
      footB   = RAIL_PAD + railH + FOOT_GAP;           /* 提示条夹在轨道与扇区之间 */
      footX   = Math.round(w / 2);                     /* 窄屏没有左右分栏 → 居中 */
      railX   = 0;
      hudB    = HUD_NARROW;
      bandTop = hudB;
      bandBot = railY - FOOT_GAP - FOOT_H;             /* 扇区下沿 = 提示条上沿 */
    } else {
      hudB    = HUD_DESK;
      railY   = RAIL_TOP;
      railB   = RAIL_BOT;
      footB   = FOOT_B;
      railX   = Math.round(w * 0.47);
      footX   = Math.round(railX / 2);                 /* 提示条对准左半屏 */
      bandTop = hudB;
      bandBot = h - FOOT_B - FOOT_H - FOOT_GAP;        /* 扇区下沿 = 提示条上沿 */
    }
    const avail = Math.max(150, bandBot - bandTop);

    /* ---- 尺寸：断点给的基准尺寸，再被「密度」钳一次 ----
       ⚠️⚠️ 这一条是本轮实测才发现的真问题，不是过度设计：
          390×640 的手机上曲库涨到 7 首时，half=3、步角 30°，
          104px 的唱片在 243px 高的扇区里相邻圆心距只有 0.44 倍半径和 ——
          七张糊成一坨，「用滚轮浏览」直接失效（实测数据见 _mmfan.js 快照）。
       判据（只算竖直分量，所以是**保守**上限，x 方向的收进是白送的富余）：
          相邻两格的竖直差 = ry · sin(step)，而 ry 最大 = avail/2 - edgeR - 6
          （edgeR = size · FAN_SCALE[half] / 2，见下面的 ryCap）。
          要求   ry · sin(step) ≥ 0.62 · size        （0.62 = 可辨识下限）
          ⇒      size ≤ sin(step)·(avail/2 - 6) / (0.62 + sin(step)·FAN_SCALE[half]/2)
       ⚠️ 桌面三档算下来上限都 > 168，所以**这条只在小屏起效**，
          不会把桌面唱片改小（改小请改 discSize 的断点）。
       ⚠️ 下限 72 是兜底：再小就没有「唱片」的样子了，宁可挤也不做成一堆点。 */
    const edgeK = sampleLerp(FAN_SCALE, Math.max(1, hf)) / 2;
    const vy = Math.abs(Math.sin(step));
    const need = 0.62 * (FAN_SCALE[0] + FAN_SCALE[1]) / 2;
    const sizeCap = Math.floor(vy * (avail / 2 - 6) / (need + vy * edgeK));
    const size = Math.max(72, Math.min(discSize(w), sizeCap));
    const selR = size * FAN_SCALE[0] / 2;             /* 选中那张的半径 */
    const edgeR = size * edgeK;                       /* 窗口边缘那张的半径 */

    /* 竖直：先按比例给 ry，再钳一次保证最外那张不越界。
       ⚠️ 第二条钳制（ryCap）是**构造性保证**：竖直方向的最远点是
          theta = ±90° 那张，其圆心 y = cy ± ry、半径 = edgeR，
          于是 cy ± (ry + edgeR) 必定落在 [bandTop, bandBot] 内 ——
          「7 张唱片被 HUD / 页脚裁掉」不可能发生（不是调参碰出来的）。 */
    const ryCap = Math.max(40, Math.round(avail / 2 - edgeR - 6));
    const ry = Math.min(clamp(Math.round(avail * 0.40), 60, 244), ryCap);
    const cy = Math.round(bandTop + avail / 2);

    /* 水平 */
    let rx = clamp(Math.round(w * 0.19), 96, 260);
    let apexX;
    if (narrow) {
      /* 窄屏没有右侧面板 → 整簇在视口里水平居中：
         横向跨度 = [cx - edgeR, apexX + selR]，令其中心对齐 w/2。 */
      apexX = w / 2 + (rx + edgeR - selR) / 2;
    } else {
      const gap = clamp(Math.round(w * 0.02), 16, 34);
      /* ⚠️ 这条式子就是「选中唱片进不了右侧面板」的**构造性保证**：
         顶点是整个扇形最靠右的一点，把它压到 railX 左边 gap+selR 处，
         扇形的任何一张都不可能越过 railX。改这个式子前先想清楚。 */
      apexX = railX - gap - selR;
    }
    /* ⚠️ 第二条水平钳制：最靠左的那张是窗口外淡出环（|offset| = half+1），
       它的角度 = (half+1)·step（封顶 180°），半径 ≤ edgeR。
       要它整张留在视口内 → apexX - rx·(1 - cos(θmax)) - edgeR ≥ 0。
       ⚠️ 不加这一条的话，曲库只有 4 首时（half=1、步角 90°）淡出环正好落在
          180°，唱片会**半张挂在屏幕左边缘**——而且它在静止时是常驻的，
          不是一闪而过（实测 1440 下左边缘会露出 27px）。 */
    const thMax = Math.min(Math.PI, (hf + 1) * step);
    const rxCap = Math.round((apexX - edgeR - 4) / Math.max(0.35, 1 - Math.cos(thMax)));
    rx = Math.max(60, Math.min(rx, rxCap));
    const cx = apexX - rx;                   /* theta=0 时 x = cx + rx = apexX */

    return {
      narrow: narrow,
      size: size,
      half: hf,
      step: step,
      edgeR: edgeR,
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      apexX: Math.round(apexX),
      /* ---- 版式契约：由 layoutRail() 写成 CSS 变量，CSS 只读 ---- */
      railX: railX,
      railY: railY,
      railB: railB,
      footX: footX,
      footB: footB,
      /* ---- 分区（只给断言用，不参与渲染）---- */
      hudB: hudB,
      bandTop: bandTop,
      bandBot: bandBot,
      avail: avail
    };
  }

  /* 可见窗口半宽：最多 ±3（7 张），但**小曲库不许让两张唱片落到同一个位置**。
     n=5 时 (n-1)/2 = 2 → 正好 5 张全显示；
     n=3 时 → 1（3 张全显示）；n=4 时 → 1（显示 3 张，第 4 张在扇区外）。
     ⚠️ 为什么必须是 (n-1)/2 而不是 n/2：偶数时 n/2 会让「折返点」
        正好落在可见窗口边缘上，那一张会在 ±3.5 处**跳变**（左右互换）。
        取 (n-1)/2 保证折返点始终在窗口外。 */
  function fanHalf(n) {
    if (n <= 1) return 0;
    return Math.max(1, Math.min(FAN_VIS, Math.floor((n - 1) / 2)));
  }

  /* 把任意实数差归一化到 [-n/2, n/2) —— **无限循环就是这一个函数**。
     n = 7、焦点 0 时：
        i=0..3  → 0, +1, +2, +3
        i=4..6  → -3, -2, -1        （首尾真的接上了）
     n = 7、焦点 6（最后一首）向下滚一格 → 焦点 0，差值 0-6 = -6 → 归一成 +1，
     于是「第 0 首从下面进来」，方向是对的（不是把它从屏幕另一头拉过来）。 */
  function wrapOffset(d, n) {
    if (!(n > 0)) return 0;
    let x = ((d % n) + n) % n;               /* → [0, n) */
    if (x >= n / 2) x -= n;                  /* → [-n/2, n/2) */
    return x;
  }

  /* 采样曲线的线性插值：把连续 |offset| 落到 FAN_OP / FAN_BLUR / FAN_SCALE 上 */
  function sampleLerp(arr, a) {
    const k = clamp(Math.abs(a), 0, arr.length - 1);
    const i = Math.min(arr.length - 2, Math.floor(k));
    return arr[i] + (arr[i + 1] - arr[i]) * (k - i);
  }

  /* ------------------------------------------------------------
     fanLayout —— 纯函数：任意「焦点 + 曲库规模 + 视口」下的完整扇形布局
     ------------------------------------------------------------
     返回**全部 n 张**（哪怕远到看不见），因为回归装置要拿它算
     「谁和谁同时可见、有没有互相挡死、首尾接没接上」。
     生产路径只渲染 |offset| ≤ fanHalf+1 的那几张。
     ------------------------------------------------------------ */
  function fanLayout(focus, n, w, h) {
    const half = fanHalf(n);
    const geo = fanGeometry(w, h, half);
    const discs = [];
    if (!(n > 0)) return { geo: geo, half: 0, discs: discs };
    for (let i = 0; i < n; i++) {
      const off = wrapOffset(i - focus, n);
      const th = off * geo.step;
      const look = fanLook(off, half);
      discs.push({
        index: i,
        offset: off,
        x: geo.cx + geo.rx * Math.cos(th),
        y: geo.cy + geo.ry * Math.sin(th),
        scale: look.scale,
        opacity: look.opacity,
        blur: look.blur,
        fade: look.f,
        r: geo.size * look.scale / 2              /* 这一张在屏幕上的半径 */
      });
    }
    return { geo: geo, half: half, discs: discs };
  }


  /* ============================================================
     数据装配 —— 把「曲库」和「博物馆专属元数据」拼起来
     ------------------------------------------------------------
     ⚠️ 只做 join，任何字段都不复制：track 对象直接引用
        RinsoraMusic.tracks() 里的那一份，所以改了 music-data.js，
        标题 / 封面 / 歌词立刻就是新的（单一真相）。
     ⚠️ 一首歌 = 一张唱片（第五轮确立，第六轮继续）。
     ⚠️ 没有 id 的条目跳过（而不是抛错）—— 坏一条不该让整个博物馆打不开。

     第六轮起 records 上**不再有** x / y / scale / rotation / depth：
     位置全部由 fanLayout() 按「焦点 + offset」现算，数据文件里写坐标
     也无效了（这是刻意的 —— 手写坐标和无限循环天生冲突）。
     仍然认的只有两个**博物馆专属**字段：label（覆写标签）与 note（这一处的附注）。
     ============================================================ */
  function records() {
    const spots = collectSpots(window.RINSORA_MUSIC_MUSEUM || {});
    const tracks = trackList();
    const out = [];
    tracks.forEach((t, i) => {
      if (!t || !t.id) return;
      const ov = spots[t.id] || {};
      out.push({
        musicId: t.id,
        track: t,
        index: i,                                  /* → RinsoraMusic.playIndex() */
        note: ov.note || '',
        label: ov.label || t.artist || '',
        order: out.length                          /* 陈列里的唯一身份（DOM 的 dataset.layoutId） */
      });
    });
    return out;
  }


  /* ============================================================
     曲库指纹 —— 「数据变了没有」
     ------------------------------------------------------------
     用户反馈 2：「又上传了一首，博物馆没有同步显示」。
     根因有两条，缺一不可：
       ① 当年的摆位表是手写清单（新歌没有条目 → 上不了墙）
          → 第五轮改成「以曲库为准」；第六轮连坐标也不再需要手写
            （扇形位置由 fanLayout 按 offset 现算），所以新歌必然上墙。
       ② render() 只跑一次（state.rendered 把关）→ 数据变了也不重建
     这一条就是 ② 的解药：把「曲子是什么」压成一个字符串指纹，
     每次进厅 / 每次低频轮询比一下，不等就打回去重建。
     ⚠️ 指纹里带上 title/artist/cover/date：改封面、改歌名也要重建，
        否则扇面上的旧封面会一直留着。
     ============================================================ */
  function syncData() {
    const sig = trackList().map((t) =>
      [t && t.id, t && t.title, t && t.artist, t && t.cover, t && t.date].join('\u0001')
    ).join('\u0002');
    if (sig === state.dataSig) return false;
    state.dataSig = sig;
    return true;
  }


  /* ============================================================
     资源预加载 —— 真正的预加载，不是 setTimeout 假等
     ------------------------------------------------------------
     加载层存在的意义是「让等待可见」。所以这里真的去要资源：
       · 每张唱片的封面 <img>（preload）
     进度以「已完成 / 总数」驱动，并做缓动收尾（不会卡在 97%）。
     ⚠️ 预加载失败不算失败 —— 一张封面挂了不该拦着人进博物馆，
        记下来照常放行。
     ============================================================ */
  function preload(images, onProgress) {
    const total = images.length || 1;
    let done = 0;
    onProgress(0, total);
    if (!images.length) return Promise.resolve({ ok: 0, fail: 0 });

    let ok = 0, fail = 0;
    return Promise.all(images.map((src) => new Promise((resolve) => {
      const img = new Image();
      const finish = (good) => {
        done += 1;
        good ? (ok += 1) : (fail += 1);
        onProgress(done, total);
        resolve();
      };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.src = src;
      /* 已经进过缓存的情况：complete 早就 true，onload 不会再触发 */
      if (img.complete && img.naturalWidth) finish(true);
    }))).then(() => ({ ok: ok, fail: fail }));
  }

  /* ============================================================
     加载层进度 —— 把 0~100 写到 CSS 变量 + 百分比文字
     ============================================================ */
  function setProgress(pct, label) {
    const p = clamp(Math.round(pct), 0, 100);
    /* ⚠️ 进度只有**一个**落点：loadBar 的 width。
       原来这里还顺手写了一个 --mm-p 变量，但 CSS 从来没有 var(--mm-p)
       读它（注释里却写着「进度条由 --mm-p 驱动」）—— 一份没人读的状态
       就是会漂移的第二真相，所以删掉，注释也一并改对。 */
    if (loadBar) loadBar.style.width = p + '%';
    if (loadPct) loadPct.textContent = p + '%';
    if (label && loadStatus) loadStatus.textContent = label;
  }

  /* ============================================================
     render —— 建池 + 摆位
     ------------------------------------------------------------
     ⚠️⚠️ 第六轮的核心改动：**元素按 musicId 复用**（state.pool）。
       为什么不能再「每次重建」：分页时代一页 6 张、翻页重建一次可以接受；
       现在滚轮每转一格焦点就动一张，重建就意味着每格都重新创建 <img>、
       重新 decode 封面 —— 会闪、会卡，滚动完全谈不上顺。
       所以：曲库条数不变时只**搬动**已有元素；条数变了（上传/删除）才丢池重建。
     ============================================================ */
  function render(opts) {
    const o = opts || {};
    if (!stageEl) return;
    const list = records();
    state.records = list;
    const n = list.length;
    if (sceneCount) sceneCount.textContent = String(n);

    if (!n) {
      /* 空场景也要给个说法，不能让人对着一片底发呆。
         ⚠️ 这个提示卡是无条件出现的 —— 只要没有可渲染的唱片就显示，
         站长自己也能看到（不需要任何特殊身份 / hash）。 */
      if (emptyEl) emptyEl.hidden = false;
      stageEl.textContent = '';
      state.pool = {};
      deselect();
      state.rendered = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    /* 首次渲染 / 曲库真的变了（o.rebuild）→ 丢掉元素池重建。
       ⚠️ 为什么「条数没变」也要重建：改了封面 / 歌名同样是数据变化，
          池里的 <img> 还指着旧封面 —— 只按条数判会留下旧图（踩过同类问题）。 */
    if (!state.rendered || o.rebuild) {
      stageEl.textContent = '';
      state.pool = {};
    }
    /* 焦点归位：曲库变了之后旧的位置可能越界 */
    state.selectedIndex = ((Math.round(state.selectedIndex) % n) + n) % n;
    /* ⚠️ 重建时把 fanPos 直接**吸附**到焦点，不要从旧位置滑过来 ——
       曲库换了以后滑动没有意义，还会让新唱片从屏幕外飞进来。 */
    state.fanPos = state.fanTo = state.selectedIndex;

    layoutRail();
    applyFan();
    state.rendered = true;
    /* ⚠️ 这里用 syncFromPlayer 而不是裸 syncPlaying：
       需求第三条要求「进入博物馆时识别正在播放的那首歌」。播放器的
       真相可能在渲染这段时间里变过（比如上一首播完自动接下一首）。 */
    syncFromPlayer();
    syncSelected();
    startFan();
  }

  /* ------------------------------------------------------------
     唱片元素 —— 建一个 / 复用池里的
     ------------------------------------------------------------ */
  function buildDisc(rec, at) {
    const btn = d.createElement('button');
    btn.type = 'button';
    btn.className = 'mm-disc';
    btn.dataset.musicId = rec.musicId;
    btn.dataset.index = String(rec.index);      /* 曲目表下标 → playIndex() */
    btn.dataset.at = String(at);                /* 在 state.records 里的位置 → 扇形算 offset 用 */
    /* ⚠️ layoutId 是「这张唱片在陈列里的唯一身份」，必须有。
       它来自 records() 里的布局序号，天生唯一且稳定。 */
    btn.dataset.layoutId = String(rec.order);

    /* —— 静态参数（只在建的时候写一次）——
       ⚠️ 自转周期按 **id 的 hash** 定，不按当前位置定：
          位置每帧都在变，改 animation-duration 会让角度当场跳一下。
          按 id 定则「这张唱片转到哪儿」永远一致（也和刷新无关）。 */
    const h = hash(rec.musicId) % 1000 / 1000;
    btn.style.setProperty('--mm-spin', (SPIN_NEAR + (SPIN_BASE - SPIN_NEAR) * h).toFixed(1) + 's');
    btn.style.setProperty('--mm-spin-delay', (-(rec.order * 3.7)).toFixed(1) + 's');
    /* 角度：按 id 做的稳定 tilt（FNV-1a），刷新多少次都是同一个姿势 */
    btn.style.setProperty('--mm-rot', tilt(rec.musicId, 7) + 'deg');
    /* 入场错峰：用**位置**，让左右两侧错开（不是一列同时亮起） */
    btn.style.setProperty('--mm-i', String(at % 7));

    const plate = d.createElement('span');
    plate.className = 'mm-disc-plate';

    const cover = res(rec.track.cover);
    if (cover) {
      const art = d.createElement('img');
      art.className = 'mm-disc-art';
      art.src = cover;
      art.alt = '';
      art.decoding = 'async';
      /* 封面挂了退回渐变占位，而不是留一个破图图标 */
      art.addEventListener('error', () => {
        const ph = d.createElement('span');
        ph.className = 'mm-disc-art is-empty';
        art.replaceWith(ph);
      });
      plate.appendChild(art);
    } else {
      const ph = d.createElement('span');
      ph.className = 'mm-disc-art is-empty';
      plate.appendChild(ph);
    }
    const gloss = d.createElement('span');
    gloss.className = 'mm-disc-gloss';
    plate.appendChild(gloss);
    btn.appendChild(plate);

    /* 无障碍：读屏要说清「这是哪首歌、点了会怎样」。
       第六轮语义又变了一次 —— 点击不再直接播放，而是「把它转到扇形中央、
       右侧档案跟着它变」；已经选中的那一张再点一次才播放。 */
    btn.setAttribute('aria-label', '查看《' + (rec.track.title || rec.musicId) + '》的档案');

    /* 整张唱片是一个可点对象。
       ⚠️ stopPropagation 是必须的：场景外层有「点空白收起档案」的逻辑，
          唱片点击若不拦住，一次点击会同时被当成「点空白」，
          刚选上的档案会被立刻收起（症状：点唱片闪一下就没了）。 */
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openRecord(rec);
    });
    /* hover 只记状态（几何交给 CSS 的 :hover），不改位置 */
    btn.addEventListener('pointerenter', () => { state.hovered = rec; });
    btn.addEventListener('pointerleave', () => {
      if (state.hovered === rec) state.hovered = null;
    });
    return btn;
  }

  /* 取元素：池里有就复用，没有就建（**懒建**：没滚到的唱片一个元素都不建） */
  function discEl(rec, at) {
    let el = state.pool[rec.musicId];
    if (el) return el;
    el = buildDisc(rec, at);
    state.pool[rec.musicId] = el;
    stageEl.appendChild(el);
    return el;
  }

  /* 写一个值到内联变量，**值没变就不写**。
     为什么要在意：applyFan 每帧对每张唱片写 5 个变量，7 张就是 35 次
     setProperty。加一层缓存之后，静止时一次都不写（收敛后 rAF 本来也停了，
     但 resize / 单帧补算时这层缓存能省掉整轮样式失效）。 */
  function setVar(el, name, val) {
    const key = '_v' + name;
    if (el[key] === val) return;
    el[key] = val;
    el.style.setProperty(name, val);
  }

  /* ------------------------------------------------------------
     applyFan —— 按当前 fanPos 把每张唱片摆到弧上
     ------------------------------------------------------------
     这是唯一写位置的地方（生产路径由 rAF 每帧调；重建 / resize 时手动调一次）。
     ⚠️ 只写 5 个变量：--mm-fx / --mm-fy（位置）、--mm-scale-data（缩放）、
        --mm-op（透明度）、--mm-blur（模糊）。
        其余（--mm-rot / --mm-spin* / --mm-i）在建元素时写死一次。
     ⚠️ --mm-size 写在 #mmScene 上（一次），让它继承 —— 全站只有一个来源。
     ------------------------------------------------------------ */
  function applyFan() {
    const n = state.records.length;
    if (!stageEl || !n) return;
    const half = fanHalf(n);
    const geo = fanGeometry(vp.w, vp.h, half);
    /* ⚠️ 只渲染 |offset| ≤ half + FAN_RING 的那几张（窗口 + 一圈淡出环）：
       多留的那一圈是为了「进出扇区是渐隐渐显」而不是啪地出现 ——
       但**不超过 half + 1**，因为 fanLook 在 |offset| = half + 1 处
       透明度正好走到 0（再外面渲染就是白建节点）。 */
    const keep = half + FAN_RING;
    const step = geo.step;

    /* ① 先把「该在场」的建出来（懒建；只建窗口内的） */
    for (let i = 0; i < n; i++) {
      const off = wrapOffset(i - state.fanPos, n);
      if (Math.abs(off) > keep) continue;
      discEl(state.records[i], i);
    }

    /* ② 再统一摆位（对象 key 遍历，池子里最多 9 个元素） */
    Object.keys(state.pool).forEach((id) => {
      const el = state.pool[id];
      const at = Number(el.dataset.at);
      const rec = state.records[at];
      if (!rec) return;
      const off = wrapOffset(at - state.fanPos, n);
      const a = Math.abs(off);
      if (a > keep) { el.style.display = 'none'; return; }
      el.style.display = '';
      const th = off * step;
      const x = geo.cx + geo.rx * Math.cos(th);
      const y = geo.cy + geo.ry * Math.sin(th);
      const look = fanLook(off, half);
      const sc = look.scale;
      const op = (at === state.selectedIndex && state.detailOpen)
        ? Math.max(look.opacity, 0.9)              /* 焦点那张不因位移而变淡 */
        : look.opacity;
      setVar(el, '--mm-fx', x.toFixed(1) + 'px');
      setVar(el, '--mm-fy', y.toFixed(1) + 'px');
      setVar(el, '--mm-scale-data', sc.toFixed(3));
      setVar(el, '--mm-op', op.toFixed(3));
      setVar(el, '--mm-blur', look.blur.toFixed(2) + 'px');
      /* z-index：越靠中心越上层（焦点最高）。
         ⚠️⚠️ 写的是 --mm-z-data（内联的自定义属性），**不是 style.zIndex**。
            两个原因：
              ① 内联样式压得过样式表，一旦直接写 style.zIndex，
                 CSS 的 `.mm-disc:hover{z-index}` / `.mm-disc.sel{z-index}`
                 就永远失效（而且没有任何报错，只是「悬停不抬起来」）；
              ② 深度要跟着连续插值变，而「抬一层」是离散状态 ——
                 两者用不同的落点：内联给底值，样式表只加增量。
            最终 z-index 在 CSS 里合成：calc(var(--mm-z-data) + keep 变量)。 */
      setVar(el, '--mm-z-data', String(100 - Math.round(a * 12)));
    });
  }

  /* ------------------------------------------------------------
     layoutRail —— 把「版式契约」写给 CSS（左侧扇形 / 右侧轨道 / 底部提示）
     ------------------------------------------------------------
     ⚠️ 为什么由 JS 算而不是 CSS 写死：
        扇形几何在 JS 里（rx / apexX / band 全是 px），面板边界与提示条位置
        必须和它用**同一份**数字，否则「扇形占 44vw、面板从 47% 起、页脚钉
        46vh」就是三份会漂移的真相，改一个忘一个 —— 症状是「唱片压到面板上」
        或「唱片滑到档案卡底下」，而且改一处永远不够。
     ⚠️ 六个变量一轮写清：
          --mm-rail-x  档案轨左边界（窄屏写 0，窄屏由媒体查询改成左右 16px）
          --mm-rail-y  档案轨顶边
          --mm-rail-b  档案轨底边
          --mm-foot-x  底部提示条的水平中心
          --mm-foot-b  底部提示条离底
          --mm-size    唱片基准尺寸（几何用它算半径，放 CSS 就是第二份真相）
     ============================================================ */
  function layoutRail() {
    if (!sceneEl) return;
    const g = fanGeometry(vp.w, vp.h, fanHalf(state.records.length));
    sceneEl.style.setProperty('--mm-rail-x', g.railX + 'px');
    sceneEl.style.setProperty('--mm-rail-y', g.railY + 'px');
    sceneEl.style.setProperty('--mm-rail-b', g.railB + 'px');
    sceneEl.style.setProperty('--mm-foot-x', g.footX + 'px');
    sceneEl.style.setProperty('--mm-foot-b', g.footB + 'px');
    sceneEl.style.setProperty('--mm-size', g.size + 'px');
  }


  /* ============================================================
     play —— 真正按下「播放」
     ------------------------------------------------------------
     复用现有播放引擎：只调 RinsoraMusic.playIndex()。
     绝不自己 setIndex / 自己 audio.src —— 那会跟 music.js 的状态
     打架（它的 state.index 就不同步了）。

     ⚠️ 第二阶段把「点唱片」和「播这首歌」拆开了：
       点唱片 → select()（打开档案详情，不动音频）
       详情里的播放按钮 → play()（这里）
     这么做是因为「hover 就出声 / 点一下就换歌」在阵列里太容易被误触，
     而且需求本身也要求先有 selectedRecord 再谈播放。
     ============================================================ */
  function play(rec) {
    if (!rec) return;
    if (!window.RinsoraMusic || !window.RinsoraMusic.playIndex) return;
    /* 先标记，让 UI 立刻有反应（哪怕声音晚 200ms 才来） */
    playingIndex = rec.index;
    state.isPlaying = false;           /* 真实状态由 play 事件回填 */
    syncPlaying();
    syncDetailPlayBtn();
    try {
      /* playIndex 内部是 audio.play().catch(()=>{})，所以：
         · 成功 → audio 派发 play 事件 → body 得到 .mp-playing → 我们跟上
         · 被自动播放策略拒绝 → 静默失败，**不抛错**，播放器按钮仍然是「播放」
         两种情况都不该让博物馆报错，所以这里只 try 包一层保险。 */
      const r = window.RinsoraMusic.playIndex(rec.index);
      if (r && typeof r.catch === 'function') r.catch(() => {});
    } catch (e) {
      /* 走到这儿说明 playIndex 本身炸了（比如曲目索引越界）。
         需求原文：「不要因为 autoplay 失败导致整个 Museum 报错」——
         所以这里既不 throw 也不 toast，只把状态摆正，等用户再点一次。 */
      state.isPlaying = false;
      syncPlaying();
    }
    /* ⚠️ 这里**刻意不**再用 setTimeout 猜一次结果（原来有个 320ms 兜底）。
       为什么去掉：猜有两种错法 ——
         · 猜「在播」而其实被拦了 → 唱片空转，用户以为有声音
         · 猜「没播」而其实在播 → 唱片不转，最长要等 1s 轮询才纠正
       现在真实状态由 bindAudio() 直接听 #audio 的 play/pause 事件，
       0 延迟且确定。这里一个定时器都不需要。 */
  }

  /* ============================================================
     syncPlaying —— 给「正在响的那张唱片」打标记
     ------------------------------------------------------------
     ⚠️ 判定的**唯一真相**是 playingIndex（由 syncFromPlayer() 从
        RinsoraMusic.getState().index + body.mp-playing 读回来），
        不是「我上次点了什么」。这样从播放器那边切歌，博物馆立刻跟上。

     「正在播放」这件事要做三样视觉（需求第三/四条）：
       .playing       → 唱片缓慢匀速自转 + 外圈转环 + 呼吸光晕
       .is-paused     → 曾经是当前曲目但暂停了：环停住、不再呼吸
       两者的区别只在 CSS 的 animation-play-state，不重排 DOM。
     ============================================================ */
  function syncPlaying() {
    if (!stageEl) return;
    const playing = !!state.isPlaying;
    Object.keys(state.pool).forEach((id) => {
      const el = state.pool[id];
      const isCur = Number(el.dataset.index) === playingIndex && playingIndex >= 0;
      el.classList.toggle('playing', isCur && playing);
      /* 暂停时也保留「这一首是当前曲目」的底标（弱一点），
         否则暂停一下唱片就完全变回路人，看不出「刚才在放它」。 */
      el.classList.toggle('is-current', isCur);
      el.classList.toggle('is-paused', isCur && !playing);
      /* ⚠️ aria-current 挂在**唱片自己**身上。原来挂在
         `querySelector('.mm-disc-label b')` 上 —— 那个节点第六轮已经不存在了，
         于是 `if (t)` 永远为假，这一行等于从来没执行过（亚健康代码）。 */
      if (isCur) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
    syncDetailPlayBtn();
  }


  /* ============================================================
     视口尺寸缓存
     ------------------------------------------------------------
     ⚠️ 为什么要有缓存：clientWidth / clientHeight 是**布局属性**，
        读它们可能强制一次样式重算 + 布局。现在读它们的地方只有
        「进场景 / resize / 每次 applyFan」——都是低频事件，
        指针移动路径上一个布局读都没有（原来在 pointermove 里读，
        一次拖动就是几百次布局查询）。
     ⚠️ 用 clientWidth 而不是 innerWidth —— 后者含滚动条宽度，
        而 .mm-scene 是 position:fixed（不占滚动条），混用会让
        「正中」偏半个滚动条（这个坑在站里踩过）。 */
  const vp = { w: 0, h: 0 };
  function measureViewport() {
    vp.w = d.documentElement.clientWidth || window.innerWidth || 1;
    vp.h = d.documentElement.clientHeight || window.innerHeight || 1;
  }
  function onResize() {
    measureViewport();
    if (!state.open) return;
    /* ⚠️ 第六轮这里变得非常简单：分页时代要判「跨过 560px 就得重建」，
       现在没有分页，视口变了只要重算几何 + 重摆一次就行，**不用重建 DOM**。 */
    layoutRail();
    applyFan();
    startFan();
  }

  /* ============================================================
     滚轮 —— 浏览，不播放（需求第八 / 第十条）
     ------------------------------------------------------------
     ⚠️⚠️ 「滚轮不要自动播放」是这一轮最重要的行为约束：
        如果滚一下就 playIndex()，用户快速翻看曲库时会一路切歌、
        播放器疯狂重载 src。浏览和聆听必须是**两个动作**：
          滚轮 / ↑↓  → 只移动焦点（右侧档案跟着变）
          点当前这张 / 右侧 PLAY  → 才出声
     ⚠️ preventDefault 必须有（需求第八条）：不要让页面本身跟着滚。
        监听用 { passive: false } 才允许 preventDefault。
     ⚠️ 例外：指针在右侧档案里、而那块**真的能滚**时，把事件让给它。
        否则长描述 / 长歌词会滚不动（那是个更烦人的 bug）。 */
  function wheelDelta(e) {
    let dy = Number(e.deltaY) || 0;
    /* deltaMode: 0=像素 1=行 2=页（Firefox / 部分鼠标会给 1） */
    if (e.deltaMode === 1) dy *= 16;
    else if (e.deltaMode === 2) dy *= (vp.h || 800);
    return dy;
  }
  function canScrollBox(node, dy) {
    if (!node || node.scrollHeight <= node.clientHeight + 1) return false;
    if (dy < 0) return node.scrollTop > 0;
    if (dy > 0) return node.scrollTop + node.clientHeight < node.scrollHeight - 1;
    return false;
  }
  function onWheel(e) {
    if (!state.open) return;
    if (e.ctrlKey) return;                    /* 触控板捏合缩放：放行 */
    const dy = wheelDelta(e);
    if (!dy) return;
    /* 面板自己滚得动 → 交给面板（不 preventDefault） */
    const box = e.target && e.target.closest ? e.target.closest('.mm-archive, .mm-lyrics') : null;
    if (canScrollBox(box, dy)) return;
    if (e.preventDefault) e.preventDefault();

    const now = Date.now();
    /* 冷却期内**直接丢**：丢的是惯性尾巴（一次快滑会吐几十个事件）。
       180ms 比人手连滚两格的最短间隔还短，所以不会吃掉用户真正的第二格。 */
    if (now < state.wheelAt) return;
    state.wheelAcc += dy;
    if (Math.abs(state.wheelAcc) < WHEEL_STEP) return;
    const dir = state.wheelAcc > 0 ? 1 : -1;
    state.wheelAcc = 0;                       /* 一格清一次 → 一次滚动只切一张 */
    state.wheelAt = now + WHEEL_LOCK;
    stepBy(dir);
  }

  /* ------------------------------------------------------------
     stepFan —— 纯计算：把扇形往前推一帧，返回「还要不要继续」
     ------------------------------------------------------------
     ⚠️ 为什么要从 tick() 里拆出来（不是洁癖，是回归装置的需要）：
        无头探针跑在 --virtual-time-budget 下时 **requestAnimationFrame 的回调
        根本不会被派发**（实测：裸 rAF 等 200ms 也不触发，句柄却照发）。
        于是 tick() 永远不执行，「扇形动没动、第几帧到哪儿」完全测不到 ——
        会被误判成「扇形没实现」。
        把「推进一帧」拆成纯函数之后：
          · 生产路径照旧由 rAF 驱动（见 tick）
          · 回归装置可以同步连调 N 次，验证收敛、单调、无限循环的连续性
     ------------------------------------------------------------ */
  function stepFan() {
    if (!stageEl) return false;
    const dlt = state.fanTo - state.fanPos;
    if (Math.abs(dlt) <= FAN_EPS) {
      state.fanPos = state.fanTo;
      applyFan();
      return false;                            /* 收敛 → 停 rAF（静止时零开销） */
    }
    state.fanPos += dlt * FAN_EASE;
    applyFan();
    return true;
  }
  function tick() {
    state.rafId = 0;
    if (!state.open || !stageEl) return;
    if (stepFan()) state.rafId = requestAnimationFrame(tick);
  }
  function startFan() {
    if (state.rafId) return;
    /* 「减少动态」时不做补间：直接落到目标（不是不做，是立刻到位） */
    if (reduceMotion()) { state.fanPos = state.fanTo; applyFan(); return; }
    state.rafId = requestAnimationFrame(tick);
  }
  function stopFan() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
    /* 归零：下次进来从干净的位置开始（不要停在上一次的半路上） */
    state.fanPos = state.fanTo;
  }


  /* ============================================================
     selectIndex / select / openRecord / deselect —— 焦点状态机
     ------------------------------------------------------------
     第六轮把「打开一个居中 modal」换成了「右侧轨道跟着焦点变」，所以状态机
     也简化成两个字段：
        state.selectedIndex  扇形焦点（**永远有效**，0 ~ n-1）
        state.detailOpen     右侧档案面板要不要展开
        state.selected       派生值（面板收起时它是 null）

     ⚠️ 为什么还要保留「收起」这件事（毕竟面板是常驻的）：
        ① 需求里 Esc 的语义没变（先关一层、再退展厅），
           如果面板根本关不掉，Esc 就只剩「退出」一级，
           而「我只是想看看扇形」就没有出口了。
        ② 收起之后**下一次选择会重新展开** —— 所以它不是「功能消失」，
           是「让一让」。
     ============================================================ */
  function focusTo(i) {
    const n = state.records.length;
    if (!n) return false;
    const cur = Math.round(state.fanTo);
    /* 走**最短路径**：click 第 6 张时从第 0 张过去，应该往回滚一格，
       而不是正着穿过 1..5（后者会「倒着转一整圈」，很怪） */
    const d = wrapOffset(((Math.round(i) - cur) % n + n) % n, n);
    state.fanTo = cur + d;
    state.selectedIndex = ((Math.round(state.fanTo) % n) + n) % n;
    return true;
  }
  function stepBy(dir) {
    const n = state.records.length;
    if (!n || !dir) return false;
    /* 需求第八条给的式子就是这一行。⚠️ fanTo 不取模，见 state 上方的注释：
       取模会让「第 0 首向上滚」变成穿过整圈。 */
    state.fanTo += dir > 0 ? 1 : -1;
    state.selectedIndex = ((Math.round(state.fanTo) % n) + n) % n;
    /* 滚轮浏览**不播放**（需求第十条），但会把面板叫回来 —— 焦点变了，
       右侧没有理由还停在「已收起」状态。 */
    state.detailOpen = true;
    syncSelected();
    startFan();
    return true;
  }
  function selectIndex(i, opts) {
    const n = state.records.length;
    if (!n) return false;
    const o = opts || {};
    focusTo(((Math.round(num(i, 0)) % n) + n) % n);
    state.detailOpen = o.open === false ? false : true;
    syncSelected();
    startFan();
    return true;
  }
  /* 兼容旧的按 record 选中（回归装置 / 外部仍在用）
     ⚠️ 优先用 rec.order（陈列位置）；只有老结构里没这个字段时才退回
        rec.index —— 那条路在「曲目表缺 id」时是错的，所以别依赖它。 */
  function select(rec, opts) {
    if (!rec) return false;
    const at = typeof rec.order === 'number' ? rec.order : rec.index;
    return selectIndex(typeof at === 'number' ? at : 0, opts);
  }

  /* ------------------------------------------------------------
     syncSelected —— 把焦点状态铺到 UI（唯一的落点）
     ------------------------------------------------------------
     ⚠️ 「一条状态只有一个落点」：.sel / .dim / aria-pressed / 面板 .on /
        面板内容 / 播放按钮文案，全部由这一个函数写。别在别处再补一刀。
     ============================================================ */
  function syncSelected() {
    const n = state.records.length;
    if (!n) {
      state.selected = null;
      if (detailEl) { detailEl.classList.remove('on'); detailEl.setAttribute('aria-hidden', 'true'); }
      return;
    }
    /* 焦点跟**目标**走：扇形还在滑的时候，逻辑焦点就已经是新那张了 ——
       这样右侧面板是「立刻」响应的，而不是等 400ms 补间结束。
       ⚠️ 唯一的落点就是这一行：fanTo 是整数目标，所以 round 一下即可；
          别再从 state.selectedIndex 反推一遍（那就是第二份真相）。 */
    state.selectedIndex = ((Math.round(state.fanTo) % n) + n) % n;
    state.selected = state.detailOpen ? state.records[state.selectedIndex] : null;

    Object.keys(state.pool).forEach((id) => {
      const el = state.pool[id];
      const isFocus = Number(el.dataset.at) === state.selectedIndex;
      el.classList.toggle('sel', isFocus);
      el.setAttribute('aria-pressed', isFocus ? 'true' : 'false');
    });

    if (detailEl) {
      detailEl.classList.toggle('on', !!state.selected);
      detailEl.setAttribute('aria-hidden', state.selected ? 'false' : 'true');
    }
    if (state.selected) fillDetail(state.selected);
    syncDetailPlayBtn();
  }

  /* ------------------------------------------------------------
     openRecord —— 点唱片的正式语义（第六轮改）
     ------------------------------------------------------------
     需求第九条：点击任意唱片 → 把它设为 selectedIndex；**不要**立刻
     弹出「全屏中央档案 modal」。需求第十条：播放留给
     「点击当前选中唱片」与「右侧 PLAY 按钮」。
     合起来就是下面两条分支：
       · 点的是**已经选中**的那张 → 再点一次 = 播放 / 暂停（明确的手势）
       · 点的是别的 → 只把它转到中央（浏览动作，不出声）
     ============================================================ */
  function openRecord(rec) {
    if (!rec) return false;
    const n = state.records.length;
    if (!n) return false;
    /* ⚠️ 比的是 rec.order（**陈列位置**），不是 rec.index（曲目表下标）——
       这两个数只有「曲目表没缺 id」时才相等，混用会选错唱片。 */
    const already = (state.selectedIndex === rec.order) && state.detailOpen;
    if (!already) {
      selectIndex(rec.order);
      return true;
    }
    /* 已经选中且面板开着 → 这次点击是「播它」 */
    const isCur = rec.index === playingIndex;
    if (isCur && state.isPlaying) {
      /* ⚠️ 直接 pause()，**不要**用 `if (!a.paused)` 当门 ——
         audio.paused 和 body.mp-playing 是两个来源，一旦有偏差，
         点击就变成哑巴（按了没反应、也没有任何报错）。pause() 本身幂等。 */
      const a = d.getElementById('audio');
      if (a) a.pause();
      return true;
    }
    state.playBlocked = false;
    play(rec);
    return true;
  }

  function deselect() {
    /* ⚠️ 判据不能只看 state.detailOpen：重建 / 外部收尾之后，面板可能还开着
       而 detailOpen 已经是 false —— 那时原来那个早退会让它**永远关不掉**。 */
    const open = !!state.detailOpen || !!(detailEl && detailEl.classList.contains('on'));
    state.detailOpen = false;
    if (open) syncSelected();
    return open;
  }


  /* ============================================================
     fillDetail —— 把 record 填进详情面板
     ------------------------------------------------------------
     ⚠️ 所有文字一律走 textContent，绝不拼 innerHTML ——
        歌名 / 歌手是用户自己填的（可能含 < > &），
        拼字符串就是自找 XSS + 排版事故。
     ============================================================ */
  function fillDetail(rec) {
    if (!rec) return;
    const t = rec.track || {};
    const n = state.records.length || 1;
    if (detailTitle) detailTitle.textContent = t.title || rec.musicId;
    if (detailArtist) detailArtist.textContent = rec.label || t.artist || '—';
    if (detailKicker) detailKicker.textContent = 'MUSIC ARCHIVE';
    if (detailIndex) {
      /* 档案编号：从 01 起，两位补零。总数也报出来，符合「档案馆」的语气。 */
      detailIndex.textContent = String(rec.order + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    }
    if (detailArt) {
      const cover = res(t.cover);
      /* 复用一个 <img>：换封面时先摘 onerror 再换 src，否则上一张的
         error 回调可能把这一张也换成占位图。 */
      detailArt.onerror = null;
      if (cover) {
        detailArt.onerror = function () {
          detailArt.removeAttribute('src');
          detailArt.classList.add('is-empty');
        };
        detailArt.classList.remove('is-empty');
        detailArt.src = cover;
        detailArt.alt = (t.title || '') + ' 封面';
      } else {
        detailArt.removeAttribute('src');
        detailArt.classList.add('is-empty');
        detailArt.alt = '';
      }
    }
    /* ---- 固定资料表（这两行永远在，因为档案馆需要有编号与日期） ---- */
    if (detailMeta) {
      detailMeta.textContent = '';
      const rows = [
        ['ARCHIVE', String(rec.order + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0')],
        ['ADDED', t.date || '—']
      ];
      rows.forEach(([k, v]) => appendRow(detailMeta, k, v));
    }

    /* ---- 可选字段（有才渲染）----
       需求第二条点名支持：album / genre / description / source / tags。
       ⚠️ 「没有字段时不要显示空框」的实现方式：**不创建那一行**，
          而不是创建了再 display:none —— 后者会留下分隔线 / 间距残影，
          而且 DOM 里仍有一堆空 <dt><dd>（读屏会念出来）。 */
    if (detailExtra) {
      detailExtra.textContent = '';
      const block = d.createElement('dl');
      block.className = 'mm-detail-meta mm-detail-meta-extra';
      const opt = [
        ['ALBUM', t.album],
        ['GENRE', t.genre],
        ['SOURCE', t.source],
        /* note 是「这一处陈列」的附注，优先级高于曲目的 description */
        ['NOTE', rec.note]
      ];
      opt.forEach(([k, v]) => {
        if (v == null || String(v).trim() === '') return;   /* 空字段 → 整行不出现 */
        appendRow(block, k, String(v));
      });
      if (block.children.length) detailExtra.appendChild(block);
    }

    /* ---- 描述段：整段文字，长文允许换行（和 meta 的 nowrap 不同） ---- */
    if (detailDesc) {
      detailDesc.textContent = '';
      const text = t.description || '';
      if (String(text).trim()) {
        detailDesc.textContent = String(text).trim();
        detailDesc.hidden = false;
      } else {
        detailDesc.hidden = true;     /* 没描述 → 整块收掉，不留白 */
      }
    }

    /* ---- 标签：有才出胶囊，没有就整块不出现 ---- */
    if (detailTags) {
      detailTags.textContent = '';
      const tags = Array.isArray(t.tags) ? t.tags
        : (typeof t.tags === 'string' && t.tags.trim() ? t.tags.split(/[,\s]+/) : []);
      const clean = tags.map((x) => String(x).trim()).filter(Boolean);
      const uniq = clean.filter((v, i) => clean.indexOf(v) === i);
      uniq.forEach((tg) => {
        const chip = d.createElement('span');
        chip.className = 'mm-tag';
        chip.textContent = tg;
        detailTags.appendChild(chip);
      });
      detailTags.hidden = !uniq.length;
    }
    syncDetailPlayBtn();
  }

  /* 往 <dl> 追加一对 dt/dd（文字一律 textContent，绝不拼 innerHTML） */
  function appendRow(dl, key, value) {
    const dt = d.createElement('dt');
    dt.textContent = key;
    const dd = d.createElement('dd');
    dd.textContent = value;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  /* 详情里的播放按钮要反映「这一首是不是正在响」。
     ⚠️ 三个状态，不是两个：
       正在播放  → 「正在播放」+ 暂停图标
       当前曲目但暂停 → 「继续播放」
       其他曲目  → 「播放这首」
     这样「点了没声」的情况（autoplay 被拦 / 用户手动暂停）文案都对得上。 */
  function syncDetailPlayBtn() {
    if (!detailPlay) return;
    const rec = state.selected;
    const isCur = !!rec && rec.index === playingIndex;
    const playing = isCur && state.isPlaying;
    detailPlay.classList.toggle('is-playing', playing);
    detailPlay.classList.toggle('is-blocked', !!state.playBlocked && isCur);
    const label = playing ? '暂停'
      : (isCur ? '继续播放' : ('播放《' + ((rec && rec.track && rec.track.title) || '') + '》'));
    detailPlay.setAttribute('aria-label', label);
    if (detailPlayTxt) {
      detailPlayTxt.textContent = playing ? '正在播放' : (isCur ? '继续播放' : '播放这首');
    }
  }

  /* 按播放状态读回真实值 —— 不靠「我上次点了什么」猜。
     曲目变了：syncPlaying() 重算 .playing + 详情按钮文案。
     播放 / 暂停切换：只更新详情按钮文案。 */
  function onPlayerTick() {
    if (!state.open) return;
    if (playingIndex !== lastSeenIndex) {
      playingIndex = lastSeenIndex;
      state.isPlaying = lastSeenPlaying;
      state.playBlocked = false;
      syncPlaying();
      return;
    }
    /* 曲目没变，但 play/pause 可能变了 —— 唱片的自转 / 呼吸与详情文案都要跟上 */
    if (lastSeenPlaying !== state.isPlaying) {
      state.isPlaying = lastSeenPlaying;
      syncPlaying();
    }
  }

  let lastSeenIndex = -1;
  let lastSeenPlaying = false;

  /* 详情里的播放按钮：点一次 → 走现有播放引擎。 */
  if (detailPlay) {
    detailPlay.addEventListener('click', () => {
      const rec = state.selected;
      if (!rec) return;
      state.playBlocked = false;
      /* 已经就是当前曲目 → 这次点击的语义变成「暂停 / 继续」。
         ⚠️ 只操作 #audio 这个**已存在的同一个对象**，不新建元素、
           不自己维护第二套播放状态 —— music.js 的 state 才是真相。 */
      const isCur = rec.index === playingIndex;
      if (isCur && state.isPlaying) {
        /* ⚠️ 直接 pause()，**不要**用 `if (!a.paused)` 当门。
           为什么：那个门假设「state.isPlaying 为真 ⇒ a.paused 为假」。
           可这两者来自不同来源（我们希望它们同步，但一旦有偏差，
           点击就会变成哑巴 —— 按了没反应，还没有任何报错，极难查）。
           pause() 本身是幂等的：已经暂停时再调一次是空操作。
           所以拿掉这个门只会更稳，不会更危险。 */
        const a = d.getElementById('audio');
        if (a) a.pause();
        return;
      }
      play(rec);
    });
  }


  /* 外部（播放器自己换歌 / 上一首 / 下一首）导致当前曲目变了时，
     博物馆里那张唱片的 .playing 也要跟上 —— 否则会出现「场景里高亮的
     那张和实际在响的不是同一张」。
     ⚠️ 用 RinsoraMusic.getState().index 读真实状态，不靠猜。
     ⚠️ getState().index 只在 setIndex() 里写，所以「上一首 / 下一首」
        会立刻反映出来，而「播放 / 暂停」不会 —— 后者从 body.mp-playing
        读（music.js 的 play/pause 事件自己维护这个类）。
        两个来源合起来覆盖全部四种变化，且都不需要改 music.js。 */
  function followPlayer() {
    if (!state.open || !window.RinsoraMusic || !window.RinsoraMusic.getState) return;
    /* 站长在展厅里点了「＋ 添加音乐」→ 曲库指纹就变了 → 立刻重建唱片墙。
       低频轮询正好顺手干这件事：最多 1s 后新唱片自己出现在墙上。 */
    if (syncData()) render({ rebuild: true });
    try {
      const s = window.RinsoraMusic.getState();
      lastSeenIndex = s && typeof s.index === 'number' ? s.index : -1;
      lastSeenPlaying = d.body.classList.contains('mp-playing');
      onPlayerTick();
    } catch (e) {}
  }

  /* ============================================================
     syncFromPlayer —— 把「播放器的真实状态」同步进博物馆
     ------------------------------------------------------------
     这是需求第三条「同一个音乐状态」的落点：
       · 进博物馆时先跑一次 —— 如果外面已经在放某首歌，而它正好
         在陈列里，那张唱片立刻显示 PLAYING（**绝不打断 / 不换歌**）
       · 播放器那边切歌 / 播放 / 暂停，也靠它跟上

     两个数据源缺一不可（这是实测结论，别合并成一个）：
       RinsoraMusic.getState().index  ← 换曲目会变；播放/暂停**不变**
       body.mp-playing                ← 播放/暂停才变
     ============================================================ */
  function syncFromPlayer() {
    if (!window.RinsoraMusic || !window.RinsoraMusic.getState) return;
    const idx = playerIndexNow();
    state.isPlaying = body.classList.contains('mp-playing');
    if (idx !== playingIndex) {
      playingIndex = idx;
      /* 换了曲目就清掉「被拦下」的提示，它只对刚点的那一首有意义 */
      state.playBlocked = false;
    }
    lastSeenIndex = idx;
    lastSeenPlaying = state.isPlaying;
    syncPlaying();
  }
  /* 播放器换歌会走 audio 的 play 事件；这里挂一个低频轮询兜底，
     比去 hook music.js 内部函数安全（那个文件我们不动）。
     1s 一次、只在博物馆打开时跑，开销可以忽略。 */
  let followTimer = 0;
  function startFollow() {
    if (followTimer) return;
    followTimer = setInterval(followPlayer, 1000);
  }
  function stopFollow() {
    if (followTimer) { clearInterval(followTimer); followTimer = 0; }
  }

  /* ============================================================
     enter —— 打开博物馆（唯一的进入入口）
     ------------------------------------------------------------
     时序：
       0ms     加载层 .on（淡入）→ 进度从 0 起跑
       ↑       真预加载：封面图 + 短驻留（保证「看得见」而不是一闪而过）
       ✓       加载层 .done（淡出）→ 场景 .open/.on
     opts.instant = true → 跳过加载层，直接进场景
       （回归装置 / 直达链接用；语义跟 script.js 的 enterApp(true) 对齐）
     opts.minMs  可调加载层最短驻留（默认 1000ms —— 需求给的 1000~1600）
     ============================================================ */
  function enter(opts) {
    const o = opts || {};
    if (state.open && !o.force) return Promise.resolve(state.records);
    const token = ++state.token;
    state.entering = true;

    /* 先把数据渲好：预加载要拿封面地址，加载层结束后要立刻能看见内容。
       ⚠️ 每次都问一次 syncData()：曲库可能在上次进厅之后变了（站长刚上传了
          一首），变了就必须重建 —— 原来只渲一次（state.rendered 把关），
          新歌永远等不到那张唱片（用户反馈 2）。 */
    /* ⚠️ 先量视口再算几何：扇形几何全部读 vp.w / vp.h，
       不先量的话手机第一次进厅会按桌面尺寸摆一次，然后白闪一下。 */
    measureViewport();
    const changed = syncData();
    /* 需求三：进厅要能认出「当前正在播的那首」—— 把它放到扇形中央。
       ⚠️⚠️ playerIndexNow() 给的是**曲目表下标**，而 selectedIndex 是
          **陈列里的位置** —— 两者只有在「曲目表里没有缺 id 的条目」时
          才恰好相等。中间隔着 records() 那道 `if (!t.id) return` 过滤，
          所以必须显式换一次。写错不会报错，症状是「一进厅焦点落在了
          另一张唱片上」，看起来完全像是 music-data.js 的数据错，极难查。 */
    const playing = playerIndexNow();
    const playingAt = playing >= 0
      ? state.records.findIndex((r) => r.index === playing) : -1;
    if (playingAt >= 0) state.selectedIndex = playingAt;
    /* ⚠️ 面板默认**展开**：右侧那一列是这个版式的一部分（不是弹窗），
       一进来就该有东西；用户按 Esc 才收起来。 */
    state.detailOpen = true;
    if (changed || !state.rendered) render({ rebuild: changed });
    else { layoutRail(); applyFan(); syncPlaying(); syncSelected(); }

    const imgs = state.records
      .map((r) => res(r.track.cover))
      .filter(Boolean);
    /* 去重：同一张封面出现两次不用下两遍 */
    const uniq = imgs.filter((v, i) => imgs.indexOf(v) === i);

    if (o.instant) {
      setProgress(100);
      return finishEnter(token, o);
    }

    /* —— 加载层上场 —— */
    if (loadEl) {
      loadEl.classList.remove('done');
      /* 上一轮退场帷幕可能还挂着（退出后马上重进）：连 leaving 一起摘，
         否则「离开展厅」的那套装饰会跟着新一轮的加载层一起出现。 */
      loadEl.classList.remove('leaving');
      /* 先让上一轮可能残留的 .done 提交过，再挂 .on，否则 transition 不动 */
      void loadEl.offsetHeight;
      loadEl.classList.add('on');
    }
    const minMs = num(o.minMs, 1000);
    setProgress(0, '正在检索档案');
    const t0 = Date.now();

    return preload(uniq, (done, total) => {
      if (token !== state.token) return;
      /* 进度映射到 0~88：剩下的 12% 留给「加载层退场 + 场景点亮」，
         免得进度条先跑到 100 再干等，那段时间看着像卡住。 */
      const raw = total ? done / total : 1;
      setProgress(raw * 88, done < total ? '正在检索档案' : '正在布置陈列');
      if (done >= total) setProgress(88, '正在点亮展厅');
    }).then(() => {
      if (token !== state.token) return state.records;
      /* 最短驻留：加载再快也让它站够 minMs，否则一闪而过像闪屏 */
      const rest = Math.max(0, minMs - (Date.now() - t0));
      return sleep(reduceMotion() ? Math.min(rest, 180) : rest);
    }).then(() => {
      if (token !== state.token) return state.records;
      setProgress(100, '欢迎来到音乐博物馆');
      return sleep(reduceMotion() ? 60 : 260);
    }).then(() => finishEnter(token, o));
  }

  /* 加载层退场 + 场景上场。幂等，且带无条件兜底（定时器兜底在 enter 里，
     这里只管状态落定）。 */
  function finishEnter(token, o) {
    if (token !== state.token) return state.records;
    state.entering = false;
    state.open = true;

    if (loadEl) loadEl.classList.add('done');
    if (sceneEl) {
      sceneEl.classList.remove('closing');
      sceneEl.classList.add('open');
      /* 先让 display 那一帧提交过，opacity 过渡才会跑 */
      void sceneEl.offsetHeight;
      sceneEl.classList.add('on');
      sceneEl.setAttribute('aria-hidden', 'false');
    }
    if (exitBtn && !reduceMotion()) exitBtn.focus && exitBtn.focus({ preventScroll: true });
    startFollow();
    measureViewport();
    layoutRail();
    applyFan();
    /* ⚠️ 滚轮只在场景里听（需求第八条）——挂在 #mmScene 上而不是 document，
       这样离开展厅后（场景 display:none）不会抢页面的滚动。
       必须 passive:false，否则 preventDefault 无效（浏览器会忽略它）。 */
    if (sceneEl) sceneEl.addEventListener('wheel', onWheel, { passive: false });
    d.addEventListener('resize', onResize, { passive: true });
    startFan();
    return state.records;
  }


  /* ============================================================
     exit —— 关掉场景 + 加载层（幂等）
     ------------------------------------------------------------
     ⚠️ 只收自己这一层的 DOM，**绝不动播放器 / audio / 音乐状态** ——
        音乐继续播是「博物馆」这个功能的卖点之一，不是副作用。
     ============================================================ */
  function exit(opts) {
    const o = opts || {};
    state.token += 1;               /* 让还在跑的预加载回调作废 */
    state.entering = false;
    if (!state.open && !(sceneEl && sceneEl.classList.contains('open')) &&
        !(loadEl && loadEl.classList.contains('on'))) {
      return false;                 /* 本来就没开，当幂等处理 */
    }
    state.open = false;
    stopFollow();
    stopFan();
    if (sceneEl) sceneEl.removeEventListener('wheel', onWheel);
    d.removeEventListener('resize', onResize);
    /* 档案面板跟着场景一起收 —— 否则下次进来会「一开门就有东西摊在桌上」，
       而且 panel 上的内容还指着上一次那张唱片，语义是脏的。 */
    deselect();
    state.wheelAcc = 0;
    state.wheelAt = 0;

    if (sceneEl) {
      sceneEl.classList.remove('on');
      sceneEl.classList.add('closing');
      sceneEl.setAttribute('aria-hidden', 'true');
    }

    /* —— 退场帷幕（用户反馈 4 的另一半）——
       退出时把「加载层」借来当幕布：先亮起来，盖住小窝从模糊里恢复的过程，
       场景在幕布后面淡出，最后幕布和场景一起收掉。
       这样退出是一次**经过**（有交代、有落点），而不是
       「啪一下切回去，页面还糊着」。
       ⚠️ 幕布用的就是同一个 #mmLoad —— 不新增元素、不新增层级，
          所以「全屏遮罩只有一个」这条不变量还成立。 */
    const instant = !!o.instant || reduceMotion();
    if (loadEl) {
      loadEl.classList.remove('done');
      if (instant) {
        loadEl.classList.remove('on', 'leaving');
      } else {
        setProgress(100, '正在离开展厅');
        /* 先把上一次可能残留的 .done 提交掉，再挂 .on，否则 opacity 过渡不动 */
        void loadEl.offsetHeight;
        loadEl.classList.add('on', 'leaving');
      }
    }

    /* ⚠️⚠️ 拆 DOM 的判定用**令牌**，不要用 state.open。
       为什么：enter() 会先把 token 加一、再花 ~1s 预加载，那段时间里
       state.open 还是 false —— 用 state.open 判会把它误当成「还关着」，
       于是把新一轮刚点亮的幕布和场景一起拆掉（症状：退出后马上重进，
       加载层一闪就没了，或者场景刚亮就被收走）。 */
    const tk = state.token;
    const scene = sceneEl;
    setTimeout(() => {
      if (tk !== state.token) return;        /* 中途又进去 / 又退出过了 */
      if (scene) scene.classList.remove('open', 'closing');
      if (loadEl) loadEl.classList.remove('on', 'done', 'leaving');
    }, instant ? 0 : 340 + 420);
    return true;
  }


  /* ============================================================
     requestExit —— 「退出展厅」由谁执行
     ------------------------------------------------------------
     用户反馈 4：点右上角「退出展厅」后页面被一层模糊盖住，要再按一次 Esc
     才恢复。根因是**两套状态各关各的**：
       · 本文件只管自己这一层（场景 + 加载层）
       · 「小窝淡出」（body.museum-open 的模糊）与 URL 里的 #museum
         是 script.js 的 AppState 在管
     按钮原来直接调 exit() → 只关了前者 → 模糊层被留下。
     Esc 之所以正常，是因为那次按键走的是 script.js 的 exitMuseum()，两件都做了。

     所以这里改成：**按钮不自己关，先请宿主来关**（onExitRequest 注册）。
     没有宿主时（单独打开本文件做实验）才退化成自己关。
     ============================================================ */
  function requestExit() {
    if (typeof state.hostExit === 'function') { state.hostExit(); return true; }
    return exit();
  }

  /* ============================================================
     接线：退出按钮 + 键盘 + 面板
     ------------------------------------------------------------
     ⚠️ Esc 的优先级（两层语义，别搞反）：
        档案面板展开时 → 先收起面板（留在展厅），这是最符合直觉的「返回」
        面板已收起    → 交给 script.js 的总收口去退展厅
       所以这里只处理「面板开着」那一种，并且是捕获阶段监听 +
       stopPropagation，避免同一次按键被 script.js 再吃一遍
       （它一吃就直接退展厅了，用户会觉得「按一下跳了两级」）。
     ⚠️ ↑ / ↓ 是滚轮的**键盘等价物**（同一条浏览动作，不是新功能）：
        需求把滚轮定为浏览手段，那键盘用户必须有一条同样的路，
        否则「滚轮能浏览、键盘不能」就是可访问性缺口。
     ============================================================ */
  function onKeydown(e) {
    if (!state.open) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      /* 没开面板 → 不拦，让 script.js 的 exitMuseum 去退展厅 */
      if (!state.detailOpen) return;
      e.stopPropagation();
      e.preventDefault();
      deselect();                      /* Esc 只退**一层** */
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      /* 带修饰键的（Ctrl+↑ 之类）别抢 —— 那是别的功能的快捷键 */
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!state.records.length) return;
      e.preventDefault();
      e.stopPropagation();
      stepBy(e.key === 'ArrowDown' ? 1 : -1);
    }
  }
  /* 捕获阶段：抢在 script.js 的 window 监听之前拿到这次按键 */
  d.addEventListener('keydown', onKeydown, true);

  /* ⚠️ 走 requestExit（= 请宿主关），不要直接 exit() —— 见 requestExit 的注释 */
  if (exitBtn) exitBtn.addEventListener('click', () => requestExit());
  /* 收起档案（面板右上角的 X）：和 Esc 第一级等价，留在展厅 */
  if (detailClose) detailClose.addEventListener('click', (e) => {
    e.stopPropagation();
    deselect();
  });
  /* 需求第七条：「点击外部可以收起档案，但不要误关整个 Museum」。
     落在场景本体的空白处（不是唱片、不是面板、不是 HUD）→ 只收面板。
     ⚠️ 用「点到了 .mm-scene 自己」这一条判空白，而不是「没点到 .mm-disc」——
        后者会把 HUD / 页脚 / 面板的点击也算成空白。 */
  if (sceneEl) {
    sceneEl.addEventListener('click', (e) => {
      if (!state.detailOpen) return;
      if (e.target === sceneEl) deselect();
    });
  }


  /* ============================================================
     bindAudio —— 直接听那唯一的 <audio> 的 play / pause / ended
     ------------------------------------------------------------
     需求第三/四条要的是「博物馆当前的播放状态 = 播放器当前的播放状态」，
     而播放状态的**权威来源**就是 #audio 自己的 play / pause 事件。
     直接听它：0 延迟、确定、不需要猜。

     ⚠️ 这不是「第二套播放引擎」：
        · 没有创建元素（全站仍然只有一个 <audio>）
        · 没有改 src、没有自己写状态机
        · 只是在**同一个** <audio> 上多挂一个监听，
          和 music.js 里那个监听并存，两者互不干扰
        · music.js 一行都不用动（它仍然在同一个事件里维护 body.mp-playing）
     我们读的判据（body.mp-playing）和它写的是同一个类，
     所以「谁先谁后」都不影响正确性。

     ⚠️ 为什么必须有它（而不是只靠 1s 轮询）：
       轮询最坏要 1s 才发现状态变了 —— 点播放后唱片要等近一秒才开始转，
       体感像「卡住」。有了事件，转与停都是立刻的。
     ============================================================ */
  function bindAudio() {
    const a = d.getElementById('audio');
    if (!a) return;
    const onPlay = () => { if (!state.open) return; state.isPlaying = true; syncPlaying(); };
    const onStop = () => { if (!state.open) return; state.isPlaying = false; syncPlaying(); };
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onStop);
    /* 播完一首也算「不在播」（music.js 随后会自动接下一首并再派发 play） */
    a.addEventListener('ended', onStop);
  }
  bindAudio();

  /* 首次交互时预热一下场景渲染（避免第一次点导航时才发现 data 有问题） */
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', () => { records(); });
  } else {
    records();
  }

  window.RinsoraMuseum = {
    enter: enter,
    exit: exit,
    open: enter,
    close: exit,
    isOpen: () => !!state.open,
    isEntering: () => !!state.entering,
    records: () => state.records.slice(),
    resolve: records,
    render: render,
    state: state,
    count: () => state.records.length,

    /* —— 扇形导航（第六轮）—— */
    /* 焦点：**唯一的选择状态**（曲目表下标） */
    selectedIndex: () => state.selectedIndex,
    detailOpen: () => state.detailOpen,
    selectIndex: selectIndex,
    select: select,                 /* 兼容旧的按 record 选中 */
    stepBy: stepBy,
    fan: () => ({ pos: state.fanPos, to: state.fanTo }),
    /* 当前视口的几何参数（含 railX，回归装置拿它核对「唱片没压到面板」） */
    geometry: () => fanGeometry(vp.w, vp.h, fanHalf(state.records.length)),
    fanHalf: () => fanHalf(state.records.length),
    /* 当前曲库下的角间隔（回归装置要拿它算唱片之间的横向 / 纵向位移） */
    fanStep: () => fanStep(fanHalf(state.records.length)),
    look: fanLook,
    wrapOffset: wrapOffset,
    /* ⚠️ 纯函数：任意视口的完整布局。几何对不对靠它断言，不靠肉眼看截图 */
    layout: fanLayout,
    discSize: discSize,
    /* 回归装置用：同步推进一帧 / 一次推到位（rAF 在无头下不派发） */
    stepFan: stepFan,
    settleFan: (maxSteps) => {
      const cap = Math.max(1, maxSteps || 600);
      let n = 0;
      while (n < cap && stepFan()) n++;
      return n;
    },
    /* 回归装置用：喂一次滚轮增量（不依赖真实 WheelEvent / 不依赖 passive） */
    wheel: (dy, mode) => onWheel({
      deltaY: dy, deltaMode: mode || 0,
      ctrlKey: false, target: null, preventDefault: () => {}
    }),

    /* —— 播放 / 选中（第三阶段起的对外契约，保持兼容）—— */
    deselect: deselect,
    openRecord: openRecord,
    play: play,
    syncFromPlayer: () => { syncFromPlayer(); return state.isPlaying; },
    isPlayingIndex: (i) => (i === playingIndex && state.isPlaying),
    playingIndex: () => playingIndex,
    isPlaying: () => state.isPlaying,
    allPlaying: () => $$('.mm-disc.playing', stageEl || d).length,
    isPaused: () => $$('.mm-disc.is-paused', stageEl || d).length,
    selectedMusicId: () => (state.selected ? state.selected.musicId : null),
    selected: () => state.selected,
    /* 点唱片的等价入口：按 musicId 选（可选 index 精确指定**曲目表下标**） */
    selectByMusicId: (id, idx) => {
      const hit = state.records.filter((r) =>
        r.musicId === id && (idx == null || r.index === idx));
      /* ⚠️ 传进去的是 order（陈列位置）—— selectIndex 收的是位置，不是曲目下标 */
      return hit.length ? selectIndex(hit[0].order) : false;
    },
    syncData: syncData,
    /* 把「退出展厅」交给宿主：script.js 才同时管 body.museum-open 与 URL */
    onExitRequest: (fn) => { state.hostExit = (typeof fn === 'function') ? fn : null; },
    requestExit: requestExit
  };
})();
