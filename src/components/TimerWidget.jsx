import { useEffect, useRef, useState } from "react";
import timerStyles from "../widgets/TimerWidget.module.css";

export function TimerWidget() {
  const [hours,   setHours]   = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [total,   setTotal]   = useState(0);   // total seconds countdown
  const [running, setRunning] = useState(false);
  const [done,    setDone]    = useState(false);
  const intervalRef = useRef(null);

  // Tick
  useEffect(() => {
    if (running && total > 0) {
      intervalRef.current = setInterval(() => setTotal((t) => t - 1), 1000);
    } else if (total === 0 && running) {
      setRunning(false);
      setDone(true);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, total]);

  const start = () => {
    const t = hours * 3600 + minutes * 60 + seconds;
    if (t === 0) return;
    setTotal(t);
    setDone(false);
    setRunning(true);
  };

  const pause  = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset  = () => {
    setRunning(false);
    setTotal(0);
    setDone(false);
  };

  const pad  = (n) => String(n).padStart(2, "0");
  const h    = Math.floor(total / 3600);
  const m    = Math.floor((total % 3600) / 60);
  const s    = total % 60;
  const pct  = total > 0 && !done
    ? ((hours * 3600 + minutes * 60 + seconds - total) /
       (hours * 3600 + minutes * 60 + seconds)) * 100
    : done ? 100 : 0;

  return (
    <div className={timerStyles.widget}>
      <h3 className={timerStyles.title}>⏱ Timer</h3>

      {/* Inputs (only shown when not running) */}
      {!running && total === 0 && (
        <div className={timerStyles.inputs}>
          <NumInput label="HH" value={hours}   max={99} set={setHours} />
          <span>:</span>
          <NumInput label="MM" value={minutes} max={59} set={setMinutes} />
          <span>:</span>
          <NumInput label="SS" value={seconds} max={59} set={setSeconds} />
        </div>
      )}

      {/* Countdown display */}
      {(running || total > 0) && (
        <div className={timerStyles.display}>
          <div
            className={timerStyles.ring}
            style={{ "--pct": `${pct}%` }}
          >
            <span className={timerStyles.time}>
              {pad(h)}:{pad(m)}:{pad(s)}
            </span>
          </div>
        </div>
      )}

      {done && <p className={timerStyles.doneMsg}>⏰ Time's up!</p>}

      {/* Controls */}
      <div className={timerStyles.controls}>
        {!running && total === 0 && (
          <button className={timerStyles.btnStart} onClick={start}>Start</button>
        )}
        {running && (
          <button className={timerStyles.btnPause} onClick={pause}>Pause</button>
        )}
        {!running && total > 0 && !done && (
          <button className={timerStyles.btnStart} onClick={resume}>Resume</button>
        )}
        {(running || total > 0) && (
          <button className={timerStyles.btnReset} onClick={reset}>Reset</button>
        )}
      </div>
    </div>
  );
}

const NumInput = ({ label, value, max, set }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
    <span style={{ fontSize: "0.65rem", color: "#aaa", fontWeight: 600 }}>{label}</span>
    <input
      type="number"
      min={0}
      max={max}
      value={value}
      onChange={(e) => set(Math.min(max, Math.max(0, Number(e.target.value))))}
      style={{
        width: 52,
        textAlign: "center",
        padding: "6px 4px",
        borderRadius: 8,
        border: "1.5px solid #e0e0e0",
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "#1a1a2e",
      }}
    />
  </div>
);

export default TimerWidget;
