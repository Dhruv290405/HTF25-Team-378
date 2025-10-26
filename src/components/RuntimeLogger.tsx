import React, { useEffect, useState } from 'react';

type LogEntry = {
  level: 'error' | 'warn' | 'info' | 'log';
  message: string;
  time: string;
};

export default function RuntimeLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const push = (entry: LogEntry) => {
      setLogs((s) => [entry, ...s].slice(0, 50));
    };

    const origError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      push({ level: 'error', message: String(message) + (error ? ' | ' + String(error) : ''), time: new Date().toLocaleTimeString() });
      if (typeof origError === 'function') origError(message, source, lineno, colno, error);
      return false;
    };

    const origConsoleError = console.error;
    console.error = function (...args: any[]) {
      try { push({ level: 'error', message: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' '), time: new Date().toLocaleTimeString() }); } catch {}
      origConsoleError.apply(console, args);
    };

    const origConsoleWarn = console.warn;
    console.warn = function (...args: any[]) {
      try { push({ level: 'warn', message: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' '), time: new Date().toLocaleTimeString() }); } catch {}
      origConsoleWarn.apply(console, args);
    };

    return () => {
      window.onerror = origError as any;
      console.error = origConsoleError;
      console.warn = origConsoleWarn;
    };
  }, []);

  return (
    <div style={{ position: 'fixed', left: 12, bottom: 12, zIndex: 9999, maxWidth: 480, maxHeight: '40vh', overflow: 'auto', background: 'rgba(17,24,39,0.9)', color: '#fff', padding: 8, borderRadius: 6, fontSize: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <strong>Runtime Logs</strong>
        <small style={{ opacity: 0.8 }}>{logs.length}</small>
      </div>
      <div>
        {logs.length === 0 ? <div style={{ opacity: 0.7 }}>No errors yet</div> : null}
        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ color: l.level === 'error' ? '#ff6b6b' : l.level === 'warn' ? '#f6c84c' : '#9ca3af' }}>{l.time} • {l.level.toUpperCase()}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{l.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
