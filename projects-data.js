/* ============================================================
   projects-data.js —— 「项目展示」的数据源
   ------------------------------------------------------------
   这个文件由网页版「项目编辑台」（project-editor.html）自动维护，
   也可以直接手改：只要保持下面那行赋值语句的形状就行。

   字段说明
     categories : 大分类的显示顺序。
                  某个分类下面一个项目都没有时，页面上不会显示它。
     items[]    : 项目列表，每项
                    id       内部标识，保存后别改（删除 / 编辑靠它认人）
                    name     项目名称
                    category 所属大分类（写 categories 里的名字）
                    url      点击跳转的链接，留空则不可点
                    desc     一句话简介
                    tags     小标签数组，会显示在预览卡片上
                    icon     卡片左侧的图标（一个字符）
                    date     添加日期
     status   可选。项目状态，比如 Active / 维护中 / 已归档；留空则不显示徽章
   ============================================================ */
window.RINSORA_PROJECTS = {
  "version": 1,
  "categories": [
    "Github项目",
    "Minecraft",
    "Bot",
    "其他"
  ],
  "items": [
    {
      "id": "bilibili",
      "name": "Bilibili直播间双屏弹幕插件",
      "category": "Github项目",
      "url": "https://github.com/rinsoraa/bili-danmaku-dualscreen",
      "desc": "一个面向「双屏看直播」场景的浏览器扩展：一块屏幕全屏播放 B 站直播间画面，另一块屏幕独立、实时地显示该直播间的弹幕。",
      "tags": [
        "JavaScript"
      ],
      "icon": "📦",
      "date": "2026.09.21",
      "status": "Active"
    },
    {
      "id": "trayhider",
      "name": "TrayHider",
      "category": "Github项目",
      "url": "https://github.com/rinsoraa/TrayHider",
      "desc": "Windows 11 托盘图标管理器 —— 隐藏/显示系统托盘图标",
      "tags": [
        "C#"
      ],
      "icon": "📦",
      "date": "2026.09.21",
      "status": "Active"
    },
    {
      "id": "rinsoraa-rinsoraa-github-io",
      "name": "rinsoraa/rinsoraa.github.io",
      "category": "Github项目",
      "url": "https://github.com/rinsoraa/rinsoraa.github.io",
      "desc": "就是这个网页的源码",
      "tags": [
        "JavaScript",
        "GitHub",
        "rinsoraa"
      ],
      "icon": "📦",
      "date": "2026.09.21",
      "status": "维护中"
    }
  ]
};
