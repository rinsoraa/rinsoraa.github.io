#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
new-post.py —— 给「空凛 / Rinsora 的小窝」提交一篇新博客。

它会替你做完三件事：
  1. 在 posts/ 下按现有文章的结构生成一个新的文章页
  2. 把摘要卡片按日期倒序插进 index.html 的博客列表
  3. 告诉你还剩哪一步需要自己动手（一般只剩正文）

用法
----
交互式（一路问你，第一次推荐这样用）：
    python new-post.py

命令行：
    python new-post.py "标题" --slug my-post --summary "一句话摘要" --tags "随笔,折腾"
    python new-post.py "标题" --md draft.md          # 正文直接读 Markdown 文件
    python new-post.py "标题" --dry-run              # 只看结果，不写文件

正文支持 Markdown：
    # ## ###            标题（# 渲染成正文里最大的章节标题 h2，依次往下）
    - 列表 / 1. 有序列表
    > 引用
    ``` 代码块 / `行内代码`
    **粗体** *斜体* [文字](网址) ![说明](图片)
"""

import argparse
import datetime
import html as htmllib
import io
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS = os.path.join(ROOT, "posts")
INDEX = os.path.join(ROOT, "index.html")
SITE = "https://rinsora.dpdns.org"

# ---------------------------------------------------------------- 模板 ----

PAGE = """<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#ffb6d5">
  <title>@@TITLE@@ · 空凛 · Rinsora 的小窝</title>
  <meta name="description" content="@@SUMMARY@@">
  <link rel="canonical" href="@@URL@@">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="空凛 · Rinsora 的小窝">
  <meta property="og:title" content="@@TITLE@@ · 空凛 · Rinsora 的小窝">
  <meta property="og:description" content="@@SUMMARY@@">
  <meta property="og:url" content="@@URL@@">
  <meta property="og:image" content="https://rinsora.dpdns.org/apple-touch-icon.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="post.css">
</head>
<body>
  <script>try{if(localStorage.getItem('rinsora-theme')==='night'){document.documentElement.classList.add('night');document.body.classList.add('night')}}catch(e){}</script>

  <div class="bg-decor" aria-hidden="true">
    <span class="blob blob-a"></span><span class="blob blob-b"></span><span class="blob blob-c"></span>
    <span class="spark s1">\u2726</span><span class="spark s2">\u2727</span><span class="spark s3">\u2726</span><span class="spark s4">\u2727</span>
  </div>
  <div class="screen-grain" aria-hidden="true"></div>

  <main class="post-wrap">
    <article class="post-card glass">
      <div class="post-top">
        <a class="post-back" href="../index.html#blog">\u2190 回到博客列表</a>
        <span class="post-brand">空凛 / Rinsora</span>
      </div>

      <p class="post-kicker">@@KICKER@@</p>
      <h1 class="post-title">@@TITLE@@</h1>
      <p class="post-meta">
        <span class="date">@@DATE@@</span>
        <span class="dot"></span><span>\u7a7a\u51db / Rinsora</span>
        <span class="dot"></span><span>@@READING@@</span>
      </p>
      <hr class="post-divider">

      <div class="post-body">
@@BODY@@
      </div>

      <div class="post-footer">
        <div class="post-tags">@@TAGS@@</div>
        <a class="enter-btn" href="../index.html#blog"><span>\u770b\u66f4\u591a\u6587\u7ae0</span><span class="enter-arrow">\u2192</span></a>
      </div>
    </article>
  </main>
</body>
</html>
"""

CARD = (
    '            <article class="blog-card card" data-cat="@@CAT@@" data-min="@@MIN@@">'
    '<span class="date">@@DATE@@</span>'
    '<h4><a class="card-title-link" href="posts/@@SLUG@@.html">@@TITLE@@</a></h4>'
    '<p>@@SUMMARY@@</p>'
    '<div class="blog-foot"><span class="bm-cat">@@CAT@@</span>'
    '<span class="bm-min">@@MIN@@ min</span>'
    '<span class="read-more">READ MORE \u2192</span></div></article>'
)

PLACEHOLDER_BODY = (
    '        <p>\u6b63\u6587\u8fd8\u6ca1\u5199\u3002\u7528\u4f60\u7684\u7f16\u8f91\u5668\u6253\u5f00\u8fd9\u4e2a\u6587\u4ef6\uff0c'
    '\u628a <code>&lt;div class="post-body"&gt;</code> \u91cc\u7684\u5185\u5bb9\u6362\u6389\u5c31\u884c\u3002</p>\n'
    '        <h2>\u5199\u5728\u8fd9\u91cc</h2>\n'
    '        <p>\u6bb5\u843d\u3001\u5217\u8868\u3001\u5f15\u7528\u90fd\u53ef\u4ee5\u76f4\u63a5\u5199\u3002</p>'
)

# ------------------------------------------------------------ Markdown ----


def _inline(t):
    """行内 Markdown -> HTML（先转义，再替换语法）。"""
    t = htmllib.escape(t, quote=False)
    codes = []

    def _save(m):
        codes.append(m.group(1))
        return "\x00%d\x00" % (len(codes) - 1)

    t = re.sub(r"`([^`]+)`", _save, t)
    t = re.sub(r"!\[([^\]]*)\]\(([^)\s]+)\)", r'<img src="\2" alt="\1">', t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![*\w])\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", t)
    t = re.sub(r"\x00(\d+)\x00", lambda m: "<code>" + codes[int(m.group(1))] + "</code>", t)
    return t


CJK = "\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef"


def _join_para(lines):
    """合并段落内的软换行：中文之间不插空格，其余按 Markdown 规则加空格。"""
    s = ""
    for i, x in enumerate(lines):
        if i and not (re.search("[" + CJK + "]$", lines[i - 1])
                      and re.match("^[" + CJK + "]", x)):
            s += " "
        s += x
    return _inline(s)


def _lang_attr(lang):
    return (' class="language-%s"' % lang) if lang else ""


def md_to_html(md):
    """把 Markdown 转成文章页需要的一小撮 HTML（够用即可，不追求全语法）。"""
    lines = md.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    out, buf, mode = [], [], None

    def flush():
        nonlocal mode
        if not buf:
            mode = None
            return
        if mode == "p":
            out.append("<p>" + _join_para(buf).strip() + "</p>")
        elif mode == "ul":
            out.append("<ul>" + "".join("<li>" + x + "</li>" for x in buf) + "</ul>")
        elif mode == "ol":
            out.append("<ol>" + "".join("<li>" + x + "</li>" for x in buf) + "</ol>")
        elif mode == "quote":
            out.append("<blockquote>" + "".join("<p>" + x + "</p>" for x in buf) + "</blockquote>")
        buf.clear()
        mode = None

    in_code, code_buf, code_lang = False, [], ""
    for raw in lines:
        line = raw.rstrip()

        if line.strip().startswith("```"):
            if not in_code:
                flush()
                in_code, code_buf = True, []
                code_lang = re.sub(r"[^\w+-]", "", line.strip()[3:].strip())
            else:
                out.append("<pre><code" + _lang_attr(code_lang) + ">" +
                           htmllib.escape("\n".join(code_buf)) + "</code></pre>")
                in_code = False
                code_lang = ""
            continue
        if in_code:
            code_buf.append(raw)
            continue

        if not line.strip():
            flush()
            continue

        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if m:
            flush()
            lvl = min(len(m.group(1)) + 1, 6)  # # 映射到 h2，h1 留给文章标题
            out.append("<h%d>%s</h%d>" % (lvl, _inline(m.group(2).strip()), lvl))
            continue

        if re.match(r"^\s*([-*+])\s+", line):
            if mode != "ul":
                flush()
                mode = "ul"
            buf.append(_inline(re.sub(r"^\s*[-*+]\s+", "", line)))
            continue

        if re.match(r"^\s*\d+[.)]\s+", line):
            if mode != "ol":
                flush()
                mode = "ol"
            buf.append(_inline(re.sub(r"^\s*\d+[.)]\s+", "", line)))
            continue

        if line.lstrip().startswith(">"):
            if mode != "quote":
                flush()
                mode = "quote"
            buf.append(_inline(line.lstrip()[1:].strip()))
            continue

        if re.match(r"^\s*(-{3,}|\*{3,}|_{3,})\s*$", line):
            flush()
            out.append("<hr>")
            continue

        if mode != "p":
            flush()
            mode = "p"
        buf.append(line.strip())  # 段落存原文，flush 时再整体合并 + 渲染

    if in_code and code_buf:
        out.append("<pre><code" + _lang_attr(code_lang) + ">" +
                   htmllib.escape("\n".join(code_buf)) + "</code></pre>")
    flush()

    return "\n".join("        " + l for l in out)


def plain(md, limit=46):
    """从 Markdown 里抽一句纯文本摘要。"""
    t = re.sub(r"```.*?```", " ", md, flags=re.S)
    t = re.sub(r"^[ \t]*([-*+>]\s+|\d+[.)]\s+|#{1,6}\s+)", "", t, flags=re.M)  # 行首标记
    t = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", t)                          # 链接 / 图片只留文字
    t = re.sub(r"[*`_]", "", t)
    t = re.sub(r"[ \t]+", "", t)
    t = re.sub(r"\s+", "", t).strip()
    if len(t) > limit:
        t = t[:limit] + "\u2026\u2026"
    return t


# ------------------------------------------------------------ 首页卡片 ----


def update_index(slug, title, date, summary, cat="随笔", minutes=1, dry=False):
    s = io.open(INDEX, encoding="utf-8").read()
    m = re.search(r'(<div class="blog-grid">\n)(.*?)(\n\s*</div>)', s, re.S)
    if not m:
        print("!! index.html 里没找到 .blog-grid，卡片需要你自己手动加。")
        return False

    head, inner, tail = m.group(1), m.group(2), m.group(3)
    keep = [l for l in inner.split("\n")
            if l.strip() and ('href="posts/%s.html"' % slug) not in l]

    card = (CARD.replace("@@DATE@@", date)
                .replace("@@SLUG@@", slug)
                .replace("@@TITLE@@", htmllib.escape(title))
                .replace("@@SUMMARY@@", htmllib.escape(summary))
                .replace("@@CAT@@", htmllib.escape(cat))
                .replace("@@MIN@@", str(minutes)))

    def cdate(line):
        mm = re.search(r'<span class="date">(\d{4})\.(\d{2})\.(\d{2})</span>', line)
        return tuple(int(x) for x in mm.groups()) if mm else (0, 0, 0)

    items = [(cdate(l), 0, l) for l in keep] + [(cdate(card), 1, card)]  # 同一天时新写的排最前
    items.sort(key=lambda kv: (kv[0], kv[1]), reverse=True)
    inner_new = "\n".join(l for _, _, l in items)

    s_new = s[:m.start()] + head + inner_new + tail + s[m.end():]
    if not dry:
        io.open(INDEX, "w", encoding="utf-8", newline="\n").write(s_new)
    return True


# ---------------------------------------------------------------- 交互 ----


def ask(prompt, default=""):
    tip = prompt + ("\uff08\u56de\u8f66\u7528\u300c%s\u300d\uff09" % default if default else "")
    try:
        v = input(tip + "\uff1a").strip()
    except EOFError:
        v = ""
    return v or default


def read_body_interactive():
    print()
    print("\u6b63\u6587\u53ef\u4ee5\u7528 Markdown \u5199\uff0c\u7c98\u8d34\u5b8c\u5728\u65b0\u7684\u4e00\u884c\u8f93\u5165 EOF \u7ed3\u675f\u3002")
    print("\uff08\u76f4\u63a5\u8f93 EOF \u8868\u793a\u7a0d\u540e\u81ea\u5df1\u586b\uff09")
    print("-" * 46)
    buf = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line.strip() == "EOF":
            break
        buf.append(line)
    return "\n".join(buf).strip()


def slugify(raw, title, date):
    s = re.sub(r"[^a-zA-Z0-9]+", "-", raw).strip("-").lower()
    if s:
        return s
    ascii_title = re.sub(r"[^a-zA-Z0-9]+", "-", title).strip("-").lower()
    return ascii_title or ("post-" + date.replace(".", "-"))


def estimate_reading(md):
    n = len(re.sub(r"\s+", "", re.sub(r"```.*?```", "", md, flags=re.S)))
    return "\u7ea6 %d \u5206\u949f" % max(1, round(n / 300))


# ---------------------------------------------------------------- main ----


def main():
    ap = argparse.ArgumentParser(
        description="\u5411 Rinsora \u5c0f\u7a9d\u63d0\u4ea4\u4e00\u7bc7\u65b0\u535a\u5ba2",
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("title", nargs="?", help="\u6587\u7ae0\u6807\u9898")
    ap.add_argument("--slug", help="\u6587\u4ef6\u540d\uff08\u82f1\u6587/\u6570\u5b57/\u8fde\u5b57\u7b26\uff09")
    ap.add_argument("--date", help="\u65e5\u671f\uff0c\u5982 2026.09.25\uff0c\u9ed8\u8ba4\u4eca\u5929")
    ap.add_argument("--summary", help="\u4e00\u53e5\u8bdd\u6458\u8981")
    ap.add_argument("--tags", help="\u6807\u7b7e\uff0c\u9017\u53f7\u5206\u9694")
    ap.add_argument("--kicker", help="\u5c0f\u6807\u9898\uff0c\u5982 BLOG / \u968f\u7b14")
    ap.add_argument("--md", help="\u4ece Markdown \u6587\u4ef6\u8bfb\u6b63\u6587")
    ap.add_argument("--dry-run", action="store_true", help="\u53ea\u9884\u89c8\uff0c\u4e0d\u5199\u6587\u4ef6")
    ap.add_argument("--open", action="store_true", help="\u751f\u6210\u540e\u7528\u9ed8\u8ba4\u6d4f\u89c8\u5668\u6253\u5f00")
    args = ap.parse_args()

    print("=" * 46)
    print("  Rinsora \u5c0f\u7a9d \u00b7 \u5199\u4e00\u7bc7\u65b0\u6587\u7ae0")
    print("=" * 46)

    title = args.title or ask("\u6807\u9898")
    if not title:
        print("!! \u6807\u9898\u4e0d\u80fd\u4e3a\u7a7a\u3002")
        return 1

    today = datetime.date.today().strftime("%Y.%m.%d")
    date = args.date or (today if args.title else ask("\u65e5\u671f", today))
    if not re.match(r"^\d{4}\.\d{2}\.\d{2}$", date):
        print("!! \u65e5\u671f\u683c\u5f0f\u5e94\u4e3a 2026.09.25\u3002")
        return 1

    slug = slugify(args.slug or ("" if args.title else ask("\u6587\u4ef6\u540d\uff08\u82f1\u6587\uff0c\u53ef\u7559\u7a7a\u81ea\u52a8\u751f\u6210\uff09")),
                   title, date)

    if args.md:
        md_path = args.md if os.path.isabs(args.md) else os.path.join(os.getcwd(), args.md)
        if not os.path.exists(md_path):
            print("!! \u627e\u4e0d\u5230 Markdown \u6587\u4ef6\uff1a" + md_path)
            return 1
        md = io.open(md_path, encoding="utf-8").read().strip()
    elif args.title:
        md = ""
    else:
        md = read_body_interactive()

    summary = args.summary or ("" if args.title else ask("\u4e00\u53e5\u8bdd\u6458\u8981\uff08\u7559\u7a7a\u5219\u81ea\u52a8\u63d0\u53d6\uff09"))
    tags_raw = args.tags if args.tags is not None else (
        "" if args.title else ask("\u6807\u7b7e\uff08\u9017\u53f7\u5206\u9694\uff0c\u53ef\u7559\u7a7a\uff09"))
    kicker = args.kicker or ("BLOG / \u968f\u7b14" if args.title else ask("\u5c0f\u6807\u9898", "BLOG / \u968f\u7b14"))

    if not summary:
        summary = plain(md) if md else "\u70b9\u8fdb\u6765\u770b\u770b \u2192"
    tags = [t.strip() for t in re.split(r"[,，\s]+", tags_raw) if t.strip()] or ["\u968f\u7b14"]

    body = md_to_html(md) if md else PLACEHOLDER_BODY
    reading = estimate_reading(md) if md else "\u7ea6 1 \u5206\u949f"

    # 分类取 kicker 里斜杠后面那一段（BLOG / 工作流 → 工作流），时长从「约 N 分钟」里抽数字
    cat = kicker.split("/")[-1].strip() or "随笔"
    _m = re.search(r"(\d+)", reading)
    minutes = int(_m.group(1)) if _m else 1

    page = (PAGE.replace("@@TITLE@@", htmllib.escape(title))
                .replace("@@URL@@", "%s/posts/%s.html" % (SITE, slug))
                .replace("@@SUMMARY@@", htmllib.escape(summary))
                .replace("@@KICKER@@", htmllib.escape(kicker))
                .replace("@@DATE@@", date)
                .replace("@@READING@@", reading)
                .replace("@@BODY@@", body)
                .replace("@@TAGS@@", "".join("<span>" + htmllib.escape(t) + "</span>" for t in tags)))

    out_file = os.path.join(POSTS, slug + ".html")
    print()
    print("  \u6807\u9898   " + title)
    print("  \u65e5\u671f   " + date)
    print("  \u6587\u4ef6   posts/%s.html" % slug)
    print("  \u6458\u8981   " + summary)
    print("  \u6807\u7b7e   " + " / ".join(tags))
    print("  \u9884\u8ba1   " + reading)
    print()

    if args.dry_run:
        print("[dry-run] \u672a\u5199\u5165\u4efb\u4f55\u6587\u4ef6\u3002")
        return 0

    if not os.path.isdir(POSTS):
        os.makedirs(POSTS)
    overwrite = os.path.exists(out_file)
    io.open(out_file, "w", encoding="utf-8", newline="\n").write(page)
    print(("  \u5df2\u8986\u76d6 " if overwrite else "  \u5df2\u751f\u6210 ") + "posts/%s.html" % slug)

    if update_index(slug, title, date, summary, cat, minutes):
        print("  \u5df2\u66f4\u65b0 index.html \u7684\u535a\u5ba2\u5217\u8868\uff08\u6309\u65e5\u671f\u5012\u5e8f\uff09")

    print()
    if not md:
        print("\u4e0b\u4e00\u6b65\uff1a\u6253\u5f00 posts/%s.html\uff0c\u628a .post-body \u91cc\u7684\u5360\u4f4d\u5185\u5bb9\u6362\u6210\u4f60\u7684\u6b63\u6587\u3002" % slug)
    else:
        print("\u5b8c\u6210\u4e86\u3002\u672c\u5730\u9884\u89c8\uff1apython -m http.server 8000\uff0c\u7136\u540e\u8bbf\u95ee http://localhost:8000")
    print("\u63d0\u4ea4\u5230 GitHub \u540e\uff0cPages \u4f1a\u81ea\u52a8\u91cd\u65b0\u90e8\u7f72\u3002")

    if args.open:
        try:
            os.startfile(out_file)  # Windows
        except Exception:
            pass
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n\u5df2\u53d6\u6d88\u3002")
        sys.exit(130)
