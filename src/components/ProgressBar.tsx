import type { CSSProperties } from 'react';

const barStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '3px',
  overflow: 'hidden',
  backgroundColor: 'transparent',
};

const innerStyle: CSSProperties = {
  width: '40%',
  height: '100%',
  background:
    'linear-gradient(90deg, rgba(56,189,248,1) 0%, rgba(59,130,246,1) 50%, rgba(129,140,248,1) 100%)',
  animation: 'progress-bar-slide 1.2s infinite',
};

export function ProgressBar() {
  return (
    <div style={barStyle} aria-hidden="true">
      <div style={innerStyle} />
    </div>
  );
}

