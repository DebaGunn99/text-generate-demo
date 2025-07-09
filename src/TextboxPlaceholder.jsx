
import React, { useState, useRef } from 'react';
import './TextboxPlaceholder.css';

function TextboxPlaceholder({ label, style, showPenIcon, textColor, penColor, onPenClick, showUndoIcon, onUndo }) {
  const [showIcon, setShowIcon] = useState(false);
  const boxRef = useRef(null);

  // Show icon on hover or focus or click
  const handleMouseEnter = () => setShowIcon(true);
  const handleMouseLeave = () => setShowIcon(false);
  const handleFocus = () => setShowIcon(true);
  const handleBlur = (e) => {
    // Only hide if focus moves outside the box
    if (!boxRef.current.contains(e.relatedTarget)) setShowIcon(false);
  };

  return (
    <div
      className="textbox-placeholder"
      style={style}
      tabIndex={showPenIcon ? 0 : undefined}
      ref={boxRef}
      onMouseEnter={showPenIcon ? handleMouseEnter : undefined}
      onMouseLeave={showPenIcon ? handleMouseLeave : undefined}
      onFocus={showPenIcon ? handleFocus : undefined}
      onBlur={showPenIcon ? handleBlur : undefined}
    >
      <span className="textbox-placeholder-label" style={textColor ? { color: textColor } : undefined}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
        {showPenIcon && showIcon && (
          <button
            className="textbox-pen-icon"
            tabIndex={0}
            aria-label="Edit textbox"
            style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', padding: 0 }}
            onClick={onPenClick}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background:
                  penColor === '#fff'
                    ? 'rgba(0,0,0,0.18)'
                    : 'rgba(0,120,212,0.13)',
                transition: 'background 0.15s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-9.1 9.1-2.1.4.4-2.1 9.1-9.1Zm-9.7 10.9 1.2-.2-.2-1.2-1 1.4Zm10.6-10.6a2.2 2.2 0 0 0-3.1 0l-9.1 9.1a1 1 0 0 0-.3.5l-.7 3.5a1 1 0 0 0 1.2 1.2l3.5-.7a1 1 0 0 0 .5-.3l9.1-9.1a2.2 2.2 0 0 0 0-3.1Z" fill={penColor || '#888'} />
              </svg>
            </span>
          </button>
        )}
        {showUndoIcon && showIcon && (
          <button
            className="textbox-undo-icon"
            tabIndex={0}
            aria-label="Undo textbox"
            style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', padding: 0 }}
            onClick={onUndo}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: penColor === '#000' ? 'rgba(0,0,0,0.13)' : 'rgba(200,0,0,0.13)',
                transition: 'background 0.15s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 4.5L3 9l4.5 4.5M3 9h9a5 5 0 1 1 0 10" stroke={penColor === '#000' ? '#000' : '#c00'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default TextboxPlaceholder;
