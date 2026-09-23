/* ============================================================
   music-museum-data.js —— 「音乐博物馆」的**布局**数据源
   ------------------------------------------------------------
   分工（别搞混，这是这个文件存在的全部理由）：

     music-data.js          →  「歌曲**是什么**」（title / artist / cover / src / lrc）
     music-museum-data.js   →  「歌曲在博物馆里**放在哪**」（x / y / scale / rotation / depth）

   所以这里**只存 musicId**，一个字的歌曲信息都不复制。
   标题、歌手、封面、音频地址、歌词全部在运行时从 window.RINSORA_MUSIC 取 ——
   这样在网站上加一首歌、改一个封面，博物馆会自动跟着变，不会出现两份真相。

   字段说明
     records[]     : 唱片列表，顺序 = 从近到远（越靠后越远、越大、越淡）
       musicId     必填；对应 music-data.js 里 tracks[].id。
                   对不上的条目会被跳过（控制台给一条 warn），不会让整个场景挂掉。
       x / y       唱片中心在场景里的位置，单位 %（相对场景可视区）。
                   x: 0 = 左边缘，100 = 右边缘；y: 0 = 顶，100 = 底。
       scale       缩放，1 = 基准尺寸（--mm-disc，见 music-museum.css）
       rotation    初始自转角度（deg），只影响静止姿态
       depth       0~1，越大越远：越远越淡、越模糊（形成纵深层次）
       label?      可选，覆写卡片上的小标签；不写就用 artist

   加一首新歌要在博物馆里出现，就在 records 里加一条，
   同一个 musicId 也可以出现多次（做「同一张唱片的两处陈列」）。
   ============================================================ */
window.RINSORA_MUSIC_MUSEUM = {
  "version": 1,
  "records": [
    {
      /* 第一张摆正中偏左，是进门的视觉重心 —— 给站点主打的欢迎曲 */
      "musicId": "m-muashb2d",
      "x": 27,
      "y": 42,
      "scale": 1.18,
      "rotation": -8,
      "depth": 0.1
    },
    {
      "musicId": "shelter",
      "x": 50,
      "y": 33,
      "scale": 0.98,
      "rotation": 6,
      "depth": 0.28
    },
    {
      "musicId": "i-love-you-so",
      "x": 73,
      "y": 44,
      "scale": 1.1,
      "rotation": -4,
      "depth": 0.12
    },
    {
      /* 后排：更小更淡，制造「往里还有很多」的纵深错觉 */
      "musicId": "shelter",
      "x": 37,
      "y": 68,
      "scale": 0.74,
      "rotation": 12,
      "depth": 0.62
    },
    {
      "musicId": "i-love-you-so",
      "x": 63,
      "y": 72,
      "scale": 0.68,
      "rotation": -14,
      "depth": 0.72
    }
  ]
};
