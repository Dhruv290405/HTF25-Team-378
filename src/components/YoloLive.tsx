import React, { useEffect, useRef, useState } from 'react';
import { detectFrame } from '../services/yoloService';

type Box = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  conf: number;
  label: string;
};

export default function YoloLive() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string>('idle');
  const [counts, setCounts] = useState({ left: 0, right: 0, total: 0 });
  const [boxes, setBoxes] = useState<Box[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    setStatus('starting camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setRunning(true);
      setStatus('running');
      // capture frames
      intervalRef.current = window.setInterval(captureAndSend, 1000); // 1 fps
    } catch (err: any) {
      console.error('camera start error', err);
      setStatus('camera error: ' + (err.message || err));
      setRunning(false);
    }
  }

  function stop() {
    setStatus('stopping');
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const stream = videoRef.current?.srcObject as MediaStream | undefined;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('stopped');
  }

  async function captureAndSend() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // convert to blob and send
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setStatus('sending frame');
      try {
        const res = await detectFrame(blob);
        // expected res: { total_count, left_count, right_count, boxes: [{x1,y1,x2,y2,conf,label}] }
        if (res) {
          setCounts({ left: res.left_count || 0, right: res.right_count || 0, total: res.total_count || 0 });
          setBoxes(res.boxes || []);
          drawBoxes(res.boxes || []);
          setStatus('ok');
        }
      } catch (err: any) {
        console.error('detection error', err);
        setStatus('detection error: ' + (err.message || err));
      }
    }, 'image/jpeg', 0.8);
  }

  function drawBoxes(boxes: Box[]) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // draw overlay on top of the current image
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = Math.max(2, Math.round(canvas.width / 300));
    ctx.font = `${Math.max(12, Math.round(canvas.width / 80))}px sans-serif`;
    ctx.fillStyle = 'lime';
    boxes.forEach((b) => {
      const x = b.x1;
      const y = b.y1;
      const w = b.x2 - b.x1;
      const h = b.y2 - b.y1;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.stroke();
      const label = `${b.label} ${(b.conf * 100).toFixed(0)}%`;
      const textW = ctx.measureText(label).width + 6;
      ctx.fillRect(x, Math.max(0, y - 18), textW, 18);
      ctx.fillStyle = 'black';
      ctx.fillText(label, x + 3, y - 3);
      ctx.fillStyle = 'lime';
    });
  }

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={start} disabled={running} className="btn">Start Camera & AI</button>
        <button onClick={stop} disabled={!running} className="btn">Stop</button>
        <div style={{ marginLeft: 12 }}><strong>Status:</strong> {status}</div>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 900 }}>
        <video ref={videoRef} style={{ width: '100%', display: 'block' }} playsInline muted />
        <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', width: '100%', height: '100%' }} />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div><strong>Total:</strong> {counts.total}</div>
        <div><strong>Left:</strong> {counts.left}</div>
        <div><strong>Right:</strong> {counts.right}</div>
      </div>
    </div>
  );
}
