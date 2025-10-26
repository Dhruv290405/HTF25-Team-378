// Simple Node/Express mock YOLO server for local testing
// Run: node scripts/yolo_server_node.cjs

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer();
app.use(cors());

app.get('/ping', (req, res) => {
  res.send('ok');
});

app.post('/detect', upload.single('frame'), (req, res) => {
  // ignore incoming file, return deterministic mock boxes
  const boxes = [
    { x1: 10, y1: 20, x2: 110, y2: 220, conf: 0.92, label: 'person' },
    { x1: 400, y1: 50, x2: 520, y2: 260, conf: 0.88, label: 'person' }
  ];
  const resp = {
    left_count: 1,
    right_count: 1,
    total_count: 2,
    more_people_side: 'equal',
    boxes
  };
  // simulate small processing delay
  setTimeout(() => res.json(resp), 150);
});

const port = process.env.YOLO_PORT || 5000;
app.listen(port, () => console.log(`Mock YOLO server listening on port ${port}`));
