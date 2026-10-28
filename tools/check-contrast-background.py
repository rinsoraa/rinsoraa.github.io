"""Compare actual screenshot pixels in all measured text rectangles, without selecting by ratio."""
import json
import math
import sys
from PIL import Image, ImageChops

elements = json.load(sys.stdin)
first, second = (Image.open(p).convert('RGB') for p in sys.argv[1:3])
if first.size != second.size:
    print(json.dumps({'stable': False, 'reason': 'screenshot dimensions differ'}))
    raise SystemExit(0)
diff = ImageChops.difference(first, second)
width, height = first.size
checks = []
for index, element in enumerate(elements):
    for rect in element['textRects']:
        # DPR 1 is part of the declared test environment.
        box = (max(0, math.floor(rect['x'])), max(0, math.floor(rect['y'])),
               min(width, math.ceil(rect['x'] + rect['width'])),
               min(height, math.ceil(rect['y'] + rect['height'])))
        if box[2] <= box[0] or box[3] <= box[1]:
            continue
        maximum = max(v[1] for v in diff.crop(box).getextrema())
        checks.append({'element': index, 'box': box, 'maxChannelDelta': maximum})
print(json.dumps({'stable': bool(checks) and all(c['maxChannelDelta'] <= 2 for c in checks),
                  'threshold': 2, 'rectangles': checks,
                  'reason': None if checks else 'no visible text rectangles'}))
