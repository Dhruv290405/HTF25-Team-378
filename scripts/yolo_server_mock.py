"""
Simple mock YOLO server for local testing.
Provides /ping and /detect endpoints that return deterministic mock detections.
No external dependencies beyond Flask and Pillow (Pillow optional).

Run with:
  python scripts/yolo_server_mock.py --host 0.0.0.0 --port 5000
"""
from flask import Flask, request, jsonify
import argparse
import time


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--host', default='127.0.0.1')
    p.add_argument('--port', type=int, default=5000)
    return p.parse_args()


app = Flask(__name__)


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
    # accept an uploaded file but ignore content; return mock detections
    # Simulate some processing time
    time.sleep(0.2)
    # Return two person boxes with left/right distribution
    boxes = [
        { 'x1': 10, 'y1': 20, 'x2': 110, 'y2': 220, 'conf': 0.92, 'label': 'person' },
        { 'x1': 400, 'y1': 50, 'x2': 520, 'y2': 260, 'conf': 0.88, 'label': 'person' }
    ]
    resp = {
        'left_count': 1,
        'right_count': 1,
        'total_count': 2,
        'more_people_side': 'equal',
        'boxes': boxes
    }
    return jsonify(resp)


def main():
    args = parse_args()
    print(f"Starting mock YOLO server on {args.host}:{args.port}")
    app.run(host=args.host, port=args.port)


if __name__ == '__main__':
    main()
