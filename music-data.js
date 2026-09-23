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
    },
    {
      "id": "this-is-what-winter-feels-like",
      "title": "this is what winter feels like",
      "artist": "JVKE",
      "cover": "assets/music/this-is-what-winter-feels-like-cover.png",
      "src": "assets/music/this-is-what-winter-feels-like.mp3",
      "lrc": "[00:00.31]this is what winter feels like - JVKE\n[00:01.77]Lyrics by：Jake Lawson/Zac Lawson\n[00:03.13]Composed by：Jake Lawson/Zac Lawson\n[00:16.87]I hope you leave and don't come back\n[00:20.96]Cuz I'm cold\n[00:29.32]Baby I'm cold\n[00:37.63]Baby I'm\n[00:39.93]Still cold\n[00:41.91]Cold like I'm seeing my breath\n[00:44.04]After the season you left\n[00:46.14]Baby I'm stuck in my ways\n[00:47.56]They say the coldest hearts are hardest to break\n[00:49.65]That's prolly how I ended up in this place\n[00:51.88]With no emotion left to process the pain\n[00:54.01]It's better this way\n[00:56.70]Too numb to feel the burn\n[01:00.80]Too numb to let it hurt\n[01:04.95]I stare at my reflection I don't recognize myself\n[01:13.26]Too numb to feel the pain\n[01:17.43]Too numb to feel a thing\n[01:21.63]You watched me bleed\n[01:23.74]I hope you leave\n[01:25.79]And don't come back\n[01:27.50]Cuz I'm cold\n[01:36.01]Baby I'm cold\n[01:40.61]I hope you leave\n[01:42.48]And don't come back\n[01:44.27]Cuz I'm\n[01:47.70]Call me on the phone but I'm outta range\n[01:49.24]When I'm all up in the mountain ranges\n[01:51.12]And I know you won't put this on your playlist\n[01:53.15]Show your friends all mad I'm keeping you nameless\n[01:55.23]I was down bad for you from the jump\n[01:57.05]Thought you the one\n[01:58.14]Now I gotta regain my trust\n[01:59.69]Matter fact I don't trust no one\n[02:01.28]Left me in the dust\n[02:02.33]Got me outta touch with emotions yeah\n[02:05.48]Too numb to feel the pain\n[02:09.66]Too numb to feel a thing\n[02:13.80]You watched me bleed\n[02:15.97]I hope you leave\n[02:18.01]And don't come back\n[02:19.79]Cuz I'm cold\n[02:24.36]I hope you leave\n[02:26.27]And don't come back\n[02:28.31]Cuz I'm cold\n[02:32.76]You watched me freeze you turned your back on me\n[02:37.96]So don't hit my line\n[02:40.18]Don't waste your time\n[02:42.24]I'm too far gone\n[02:44.70]Yeah I swear that I'm cold\n[02:49.35]I hope you leave\n[02:51.27]And don't come back\n[02:53.22]Cuz I'm cold\n[02:57.70]I hope you leave\n[02:59.73]And don't come back\n[03:01.50]Cuz I'm cold\n[03:06.06]I hope you leave\n[03:08.05]And don't come back\n[03:09.84]Cuz I'm",
      "date": "2026-09-23"
    },
    {
      "id": "sacred-play-secret-place",
      "title": "Sacred Play Secret Place",
      "artist": "matryoshka",
      "cover": "assets/music/sacred-play-secret-place-cover.png",
      "src": "assets/music/sacred-play-secret-place.mp3",
      "lrc": "[00:00.00]Sacred Play Secret Place - matryoshka\n[00:30.70]Gracefully sneaking up on me\n[00:36.65]They just want to tear my feathers\n[00:45.61]The golden light of the setting sun\n[00:51.17]Let me be a hypocrite again\n[00:58.46]I will be gone before long\n[01:02.06]I know I'm wrong\n[01:05.65]No matter how far I go they find me out\n[01:14.76]I wish the gusts took away my gloom\n[01:20.83]I can't help this vague feeling\n[01:27.56]I feel so good but I'm worn out\n[01:35.09]We'll be all right don't look so sad\n[01:42.33]Confess my sin conceal them all\n[01:49.74]Night will come soon and swallow everything\n[02:14.20]Quietly hiding in the grass\n[02:19.92]Hearing the leaves rustling\n[02:28.91]They're singing with a burning piano\n[02:34.96]It gives me cheap relief\n[02:41.88]I will be gone before long\n[02:45.44]I know I'm wrong\n[02:49.37]No matter how far I go they find me out\n[02:58.26]I wish the gusts took away my gloom\n[03:04.59]I can't help this vague feeling\n[03:11.21]I feel so good but I'm worn out\n[03:18.36]We'll be all right don't look so sad\n[03:26.01]Confess my sin conceal them all\n[03:33.21]Night will come soon and swallow everything\n[04:39.93]I feel so good\n[04:47.09]We'll be all right\n[04:54.33]Then I give all up",
      "date": "2026-09-23"
    },
    {
      "id": "lemon",
      "title": "Lemon",
      "artist": "米津玄師",
      "cover": "assets/music/lemon-cover.png",
      "src": "assets/music/lemon.mp3",
      "lrc": "[00:00.00]Lemon - 米津玄師 (よねづ けんし)\n[00:00.53]词：米津玄師\n[00:01.06]曲：米津玄師\n[00:01.54]夢ならば\n[00:02.88]どれほどよかったでしょう\n[00:06.88]未だにあなたのことを夢にみる\n[00:12.41]忘れた物を取りに帰るように\n[00:17.91]古びた思い出の埃を払う\n[00:26.27]戻らない幸せがあることを\n[00:31.73]最後にあなたが教えてくれた\n[00:37.25]言えずに隠してた昏い過去も\n[00:42.80]あなたがいなきゃ\n[00:44.92]永遠に昏いまま\n[00:48.57]きっともうこれ以上\n[00:51.36]傷つくことなど\n[00:54.18]ありはしないとわかっている\n[00:58.98]あの日の悲しみさえ\n[01:01.74]あの日の苦しみさえ\n[01:04.52]そのすべてを愛してた\n[01:07.28]あなたとともに\n[01:09.98]胸に残り離れない\n[01:13.07]苦いレモンの匂い\n[01:15.84]雨が降り止むまでは帰れない\n[01:21.39]今でもあなたはわたしの光\n[01:37.98]暗闇であなたの背をなぞった\n[01:43.43]その輪郭を鮮明に覚えている\n[01:48.97]受け止めきれないものと\n[01:52.20]出会うたび\n[01:54.50]溢れてやまないのは涙だけ\n[02:00.32]何をしていたの\n[02:03.16]何を見ていたの\n[02:05.92]わたしの知らない横顔で\n[02:10.69]どこかであなたが今\n[02:13.43]わたしと同じ様な\n[02:16.31]涙にくれ\n[02:17.64]淋しさの中にいるなら\n[02:21.71]わたしのことなどどうか\n[02:24.85]忘れてください\n[02:27.60]そんなことを心から願うほどに\n[02:33.13]今でもあなたはわたしの光\n[02:41.64]自分が思うより\n[02:47.19]恋をしていたあなたに\n[02:52.72]あれから思うように\n[02:58.24]息ができない\n[03:03.33]あんなに側にいたのに\n[03:09.27]まるで嘘みたい\n[03:14.40]とても忘れられない\n[03:20.21]それだけが確か\n[03:30.81]あの日の悲しみさえ\n[03:33.41]あの日の苦しみさえ\n[03:36.22]そのすべてを愛してた\n[03:38.97]あなたとともに\n[03:41.67]胸に残り離れない\n[03:44.77]苦いレモンの匂い\n[03:47.61]雨が降り止むまでは帰れない\n[03:53.09]切り分けた果実の片方の様に\n[03:58.60]今でもあなたはわたしの光",
      "date": "2026-09-23"
    },
    {
      "id": "m-mue6z0q6",
      "title": "奇妙能力歌",
      "artist": "陈粒",
      "cover": "assets/music/m-mue6z0q6-cover.png",
      "src": "assets/music/m-mue6z0q6.mp3",
      "lrc": "[00:00.00]奇妙能力歌 - 陈粒\n[00:06.72]词：陈粒\n[00:13.44]曲：陈粒\n[00:20.16]我看过沙漠下暴雨\n[00:24.48]看过大海亲吻鲨鱼\n[00:29.00]看过黄昏追逐黎明\n[00:32.31]没看过你\n[00:37.51]我知道美丽会老去\n[00:42.05]生命之外还有生命\n[00:46.21]我知道风里有诗句\n[00:49.72]不知道你\n[00:54.95]我听过荒芜变成热闹\n[00:59.44]听过尘埃掩埋城堡\n[01:03.88]听过天空拒绝飞鸟\n[01:07.16]没听过你\n[01:12.43]我明白眼前都是气泡\n[01:16.73]安静的才是苦口良药\n[01:21.22]明白什么才让我骄傲\n[01:24.36]不明白你\n[01:30.11]我拒绝更好更圆的月亮\n[01:34.59]拒绝未知的疯狂\n[01:38.76]拒绝声色的张扬\n[01:42.10]不拒绝你\n[01:47.42]我变成荒凉的景象\n[01:51.70]变成无所谓的模样\n[01:56.15]变成透明的高墙\n[01:59.54]没能变成你\n[02:39.90]我听过空境的回音\n[02:44.30]雨水浇绿孤山岭\n[02:48.57]听过被诅咒的秘密\n[02:52.24]没听过你\n[02:57.22]我抓住散落的欲望\n[03:01.53]缱绻的馥郁让我紧张\n[03:05.93]我抓住世间的假象\n[03:09.29]没抓住你\n[03:14.63]我包容六月清泉结冰\n[03:19.10]包容不老的生命\n[03:23.41]包容世界的迟疑\n[03:26.80]没包容你\n[03:32.06]我忘了置身濒绝孤岛\n[03:36.64]忘了眼泪不过失效药\n[03:40.90]忘了百年无声口号\n[03:44.37]没能忘记你\n[03:49.63]我想要更好更圆的月亮\n[03:54.02]想要未知的疯狂\n[03:58.45]想要声色的张扬\n[04:02.09]我想要你",
      "date": "2026-09-23"
    },
    {
      "id": "m-muefw707",
      "title": "使一颗心免于哀伤",
      "artist": "知更鸟&HOYO-MiX_Chevy",
      "cover": "assets/music/m-muefw707-cover.png",
      "src": "assets/music/m-muefw707.mp3",
      "lrc": "[00:00.00]使一颗心免于哀伤 - 知更鸟/HOYO-MiX/Chevy\n[00:01.46]作曲 Composer：王可鑫 Eli.W (HOYO-MiX)\n[00:02.12]作词 Lyricist：黑金雨\n[00:02.51]编曲 Arranger：王可鑫 Eli.W (HOYO-MiX)\n[00:03.90]制作人 Producer：王可鑫 Eli.W (HOYO-MiX)\n[00:13.25]Birds are born with no shackles\n[00:18.74]Then what fetters my fate\n[00:25.19]Blown away the white petals\n[00:30.39]Leave me trapped in the cage\n[00:36.78]The endless isolation\n[00:39.78]Can't wear down my illusion\n[00:42.69]Someday I'll make a dream unchained\n[00:49.46]Let my heart bravely spread the wings\n[00:53.62]Soaring past the night\n[00:56.34]To trace the bright moonlight\n[01:01.48]Let the clouds heal me of the stings\n[01:05.57]Gently wipe the sorrow off my life\n[01:10.00]I dream\n[01:19.21]What is meant",
      "date": "2026-09-23"
    }
  ]
};
