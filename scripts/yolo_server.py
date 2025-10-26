"""
Lightweight Flask server to run YOLOv8 detection on incoming frames.
Usage:
  pip install ultralytics flask pillow
  python scripts/yolo_server.py --model yolov8n.pt --host 0.0.0.0 --port 5000

Endpoints:
  GET /ping -> 200 ok
  POST /detect -> accept multipart/form-data 'frame' file and return JSON:
    { left_count, right_count, total_count, boxes: [{x1,y1,x2,y2,conf,label}] }

This script is intentionally minimal for demo purposes. For production, add auth, rate-limits,
GPU support, batching, and robust error handling.
"""

from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
import argparse

app = Flask(__name__)


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--model', default='yolov8n.pt', help='YOLO model path')
    p.add_argument('--host', default='127.0.0.1')
    p.add_argument('--port', type=int, default=5000)
    return p.parse_args()


@app.route('/ping', methods=['GET'])
def ping():
    return 'ok', 200


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


@app.route('/detect', methods=['POST'])
def detect():
    if 'frame' not in request.files:
        return 'missing frame', 400
    file = request.files['frame']
    try:
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
    except Exception as e:
        return f'invalid image: {e}', 400

    # run detection
    results = app.config['yolo'].predict(source=img, conf=0.35, imgsz=640, save=False, verbose=False)
    # results may be a list with one element
    r = results[0]
    boxes = []
    left_count = 0
    right_count = 0
    total_count = 0

    width, height = img.size

    for box in r.boxes:
        cls = int(box.cls.item()) if box.cls is not None else 0
        label = app.config.get('labels', {}).get(cls, str(cls))
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0].item()) if box.conf is not None else float(box.conf)
        boxes.append({
            'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'conf': conf, 'label': label
        })
        # let's assume 'person' class is label 'person' or index 0 depending on model
        if label.lower() == 'person' or cls == 0:
            total_count += 1
            # determine left/right by center x
            cx = (x1 + x2) / 2
            if cx < width / 2:
                left_count += 1
            else:
                right_count += 1

    resp = {
        'left_count': left_count,
        'right_count': right_count,
        'total_count': total_count,
        'more_people_side': 'left' if left_count > right_count else 'right' if right_count > left_count else 'equal',
        'boxes': boxes
    }

    return jsonify(resp)


def main():
    args = parse_args()
    print('Loading model:', args.model)
    model = YOLO(args.model)
    # set simple label map
    labels = {0: 'person'}
    app.config['yolo'] = model
    app.config['labels'] = labels
    print('Server starting on %s:%s' % (args.host, args.port))
    app.run(host=args.host, port=args.port)


if __name__ == '__main__':
    main()
