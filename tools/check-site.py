"""Run the site-check workflow locally using Python 3 and Node.js 20+.

No third-party packages, browser launch, Git writes, build, or deployment.
NODE_BINARY may select a Node executable outside PATH.
"""
from pathlib import Path
import os
import re
import shutil
import subprocess
import sys
import textwrap

ROOT = Path(__file__).resolve().parents[1]


def run(args):
    subprocess.run(args, cwd=ROOT, check=True)


def main():
    node = os.environ.get("NODE_BINARY") or shutil.which("node")
    if not node:
        raise SystemExit("Install Node.js 20+ or set NODE_BINARY")
    for source in sorted(ROOT.glob("*.js")):
        run([node, "--check", str(source)])
    tests = sorted((ROOT / "tests").glob("*.test.cjs"))
    if not tests:
        raise SystemExit("No portable regression tests found")
    for test in tests:
        run([node, str(test)])
    run([node, "tools/check-project-lab.cjs"])
    workflow = (ROOT / ".github/workflows/site-check.yml").read_text(encoding="utf-8")
    js = re.search(r"node -e '(.*?)\n          '", workflow, re.S)
    python_checks = re.findall(r"python3 - <<'PY'\n(.*?)\n          PY", workflow, re.S)
    if not js or len(python_checks) != 2:
        raise SystemExit("Workflow format changed; update the local check adapter")
    run([node, "-e", textwrap.dedent(js.group(1))])
    for code in python_checks:
        run([sys.executable, "-c", textwrap.dedent(code)])
    # Optional here: the portable checks also run in a source-only review copy.
    # In the actual repository, check tracked and staged whitespace separately.
    if (ROOT / ".git").exists():
        run(["git", "diff", "--check"])
        run(["git", "diff", "--cached", "--check"])
    print(f"PASS site checks: root JS, {len(tests)} regressions, data, HTML, sitemap, robots")


if __name__ == "__main__":
    main()
