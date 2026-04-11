import React from 'react';

const SPEED_OPTIONS = [
  { label: '0.5x', value: 1600 },
  { label: '1x', value: 1000 },
  { label: '1.5x', value: 700 },
  { label: '2x', value: 400 },
];

export default function BellmanFordControls({
  isPlaying = false,
  onPlayPause = () => {},
  onStep = () => {},
  onReset = () => {},
  speed = 1000,
  onSpeedChange = () => {},
  hasSteps = true,
  isFinished = false,
  canStep = true,
}) {
  const disablePlayPause = !hasSteps || isFinished;
  const disableStep = !hasSteps || isFinished || !canStep;

  return (
    <div
      className="bellmanford-controls"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '14px',
        background: 'var(--bg-card, #161b22)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        marginBottom: '16px',
      }}
    >
      <div
        className="bellmanford-controls__actions"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={onPlayPause}
          disabled={disablePlayPause}
          style={buttonStyle(!disablePlayPause, isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          type="button"
          onClick={onStep}
          disabled={disableStep}
          style={secondaryButtonStyle(!disableStep)}
        >
          Step
        </button>

        <button
          type="button"
          onClick={onReset}
          style={secondaryButtonStyle(true)}
        >
          Reset
        </button>
      </div>

      <div
        className="bellmanford-controls__meta"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <label
          htmlFor="bellmanford-speed"
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary, #9ca3af)',
            fontWeight: 600,
          }}
        >
          Speed
        </label>

        <select
          id="bellmanford-speed"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          style={{
            minWidth: '92px',
            padding: '9px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            background: 'var(--bg-secondary, #0f172a)',
            color: 'var(--text-primary, #f8fafc)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {SPEED_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          style={{
            padding: '7px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.03em',
            background: isFinished
              ? 'rgba(245, 166, 35, 0.16)'
              : isPlaying
              ? 'rgba(0, 212, 170, 0.16)'
              : 'rgba(74, 158, 255, 0.14)',
            color: isFinished
              ? '#f5a623'
              : isPlaying
              ? '#00d4aa'
              : '#4a9eff',
          }}
        >
          {isFinished ? 'Completed' : isPlaying ? 'Running' : 'Ready'}
        </span>
      </div>
    </div>
  );
}

function buttonStyle(enabled, active) {
  return {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid transparent',
    background: enabled
      ? active
        ? '#f59e0b'
        : '#00d4aa'
      : 'rgba(148, 163, 184, 0.18)',
    color: enabled ? '#081018' : 'rgba(255,255,255,0.5)',
    fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 160ms ease',
  };
}

function secondaryButtonStyle(enabled) {
  return {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
    background: enabled
      ? 'var(--bg-secondary, #0f172a)'
      : 'rgba(148, 163, 184, 0.1)',
    color: enabled ? 'var(--text-primary, #f8fafc)' : 'rgba(255,255,255,0.45)',
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 160ms ease',
  };
}
