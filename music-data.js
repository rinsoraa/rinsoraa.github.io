/* ============================================================
   music-data.js —— 「音乐播放器」的数据源
   ------------------------------------------------------------
   这个文件由网页版「添加音乐」面板（播放器展开后右下角的 ＋）自动维护，
   也可以直接手改：只要保持下面那行赋值语句的形状就行。

   字段说明
     tracks[]  : 曲目列表，播完一首会自动接下一首
        id      内部标识，保存后别改（删除 / 定位靠它认人）
        title   歌名
        artist  作者 / 歌手
        cover   封面图路径，留空则显示一张渐变唱片
        src     音频文件路径（相对本站根目录）
        lrc     歌词原文（LRC 文本，直接内联在这里，不用另外放文件）
        date    添加日期

   说明：音频文件和封面图会被上传到 assets/music/ 目录，
        歌词则以文本形式直接存进本文件的 lrc 字段。
   ============================================================ */
window.RINSORA_MUSIC = {
  "version": 1,
  "tracks": [
    {
      "id": "m-muashb2d",
      "title": "欢迎来到空凛的小窝~",
      "artist": "Rinsora",
      "cover": "assets/music/m-muashb2d-cover.png",
      "src": "assets/music/m-muashb2d.ogg",
      "lrc": "",
      "date": "2026-09-21"
    },
    {
      "id": "shelter",
      "title": "Shelter (乐器版)",
      "artist": "Porter Robinson & Madeon",
      "cover": "assets/music/shelter-cover.png",
      "src": "assets/music/shelter.mp3",
      "lrc": "",
      "date": "2026-09-21"
    },
    {
      "id": "i-love-you-so",
      "title": "I Love You So",
      "artist": "The Walters",
      "cover": "assets/music/i-love-you-so-cover.png",
      "src": "assets/music/i-love-you-so.mp3",
      "lrc": "[00:00.00]I Love You So - The Walters\n[00:13.65]I just need someone in my life to give it structure\n[00:19.55]To handle all the selfish ways I'd spend my time without her\n[00:26.07]You're everything I want but I can't deal with all your lovers\n[00:32.19]You're saying I'm the one but it's your actions that speak louder\n[00:38.69]Giving me love when you are down and need another\n[00:44.83]I've got to get away and let you go I've got to get over\n[00:51.21]But I love you so\n[00:57.81]I love you so\n[01:04.03]I love you so\n[01:10.45]I love you so\n[01:14.61]I'm gonna pack my things and leave you behind\n[01:21.02]This feeling's old and I know that I've made up my mind\n[01:27.32]I hope you feel what I felt when you shattered my soul\n[01:33.56]'Cause you were cruel and I'm a fool\n[01:37.19]So please let me go\n[01:41.88]But I love you so\n[01:45.45]Please let me go\n[01:48.43]I love you so\n[01:51.40]Please let me go\n[01:54.55]I love you so\n[01:58.06]Please let me go\n[02:00.91]I love you so",
      "date": "2026-09-21"
    }
  ]
};
