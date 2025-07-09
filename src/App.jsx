










import React, { useState, useRef, useEffect } from 'react';
import titleImg from '../images/Title.png';
import subtitleImg from '../images/Subtitle.png';
import captionImg from '../images/Caption.png';
import TextboxPlaceholder from './TextboxPlaceholder';

function PromptModal({ open, onClose, onGenerate, ghostText }) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;
  return null; // Placeholder, PromptModal will be rendered from App with input state
}


function App() {
  const slideLabels = [
    'Title - prompt',
    'Title - prompt + snapshot',
    'Subtitle - prompt',
    'Subtitle - prompt + snapshot',
    'Caption - prompt',
    'Caption - prompt + snapshot',
  ];

  const [selected, setSelected] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGhostText, setModalGhostText] = useState('');
  const [modalInput, setModalInput] = useState('');
  // Each slide: { history: [text1, text2, ...], current: idx }
  const [slideHistories, setSlideHistories] = useState([
    { history: [null], current: 0 },
    { history: [null], current: 0 },
    { history: [null], current: 0 },
    { history: [null], current: 0 },
    { history: [null], current: 0 },
    { history: [null], current: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  // Handler for pen icon click
  const handlePenClick = (ghostText) => {
    // For slides 1 & 2, always use 'Add a title..' as ghost text
    if (selected === 0 || selected === 1) {
      setModalGhostText('Add a title..');
    } else {
      setModalGhostText(ghostText);
    }
    setModalInput('');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalInput('');
  };

  const handleModalGenerate = async (input) => {
    setLoading(true);
    try {
      let metaPrompts = `1. Stay on Topic: Ensure the response remains focused on the given topic. Avoid digressions or unrelated content.\n2. Maintain Logical Flow: Structure the response with a clear beginning, middle, and end. Use transitions to guide the reader.\n3. Use Neutral and Professional Tone: Avoid overly casual, emotional, or biased language unless a specific tone is requested.\n4. Avoid Hallucinations: Do not fabricate names, statistics, or references. If unsure, state that the information is not available.\n5. Respect Privacy and Confidentiality: Do not include personal data, sensitive information, or internal-only content unless explicitly allowed.\n6. Avoid Harmful or Sensitive Content: Do not generate content that is discriminatory, offensive, or inappropriate for a general audience.\n7. Use Clear and Concise Language: Prefer simple, direct sentences. Avoid jargon unless the audience is expected to understand it.\n8. Avoid Placeholder Text: Do not include filler like “Lorem ipsum” or “insert here” unless explicitly instructed.\n9. No Self-Referencing: Avoid phrases like “As an AI language model…” unless the context requires it.\n10. No special characters: Don't introduce quotes or asteriks for text generated unnecessarily.`;
      // Add extra instructions for slides 2, 4, 6 (indices 1, 3, 5)
      if (selected === 1 || selected === 3 || selected === 5) {
        metaPrompts += `\n11. Write in slide context: Consider the slide text + visuals to write text - Ensure response is taking info from slides. If user has mentioned particular topic, then search in the slide visuals, reference it if available and then generate text.`;
        metaPrompts += `\n12. Maintain style, tone consistency with rest of the text on the slide if present, else have a default (neutral and professional)`;
        metaPrompts += `\n13. Ensure the written response honours the length / real estate available. Ensure that you write within the space provided and don’t let text overflow - this introduces more pain for users in spending time to format your suggestions.`;
        metaPrompts += `\n14. Never use special characters in the beginning and the end of the message.`;
        metaPrompts += `\n15. You can see the slide image, the textbox width, and the font size. Visually estimate the maximum amount of text that fits in the textbox without overflow. Strictly limit your response to what fits in a single line or the visible area, based on the image and font size. Do not exceed the available space.`;
      }
      // Helper to convert image to base64 data URL
      const toBase64 = async (imgPath) => {
        const response = await fetch(imgPath);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      let messages = [
        { role: 'system', content: metaPrompts }
      ];

      // For slides 2, 4, 6 (indices 1, 3, 5), send image as vision input
      if (selected === 1) {
        const imgData = await toBase64(titleImg);
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: input },
            { type: 'image_url', image_url: { url: imgData } }
          ]
        });
      } else if (selected === 3) {
        const imgData = await toBase64(subtitleImg);
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: input },
            { type: 'image_url', image_url: { url: imgData } }
          ]
        });
      } else if (selected === 5) {
        const imgData = await toBase64(captionImg);
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: input },
            { type: 'image_url', image_url: { url: imgData } }
          ]
        });
      } else {
        messages.push({ role: 'user', content: input });
      }

      const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
      const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error('LLM request failed');
      const data = await response.json();
      const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : '';
      setSlideHistories(prev => prev.map((slide, idx) => {
        if (idx !== selected) return slide;
        // Only push if different from current
        if (slide.history[slide.current] === text) return slide;
        const newHistory = slide.history.slice(0, slide.current + 1).concat([text]);
        return { history: newHistory, current: newHistory.length - 1 };
      }));
    } catch (e) {
      setSlideHistories(prev => prev.map((slide, idx) => {
        if (idx !== selected) return slide;
        const text = 'Error: Could not generate text.';
        if (slide.history[slide.current] === text) return slide;
        const newHistory = slide.history.slice(0, slide.current + 1).concat([text]);
        return { history: newHistory, current: newHistory.length - 1 };
      }));
    } finally {
      setLoading(false);
      setModalOpen(false);
      setModalInput('');
    }
  };
  // Undo handler for a slide
  const handleUndo = (idx) => {
    setSlideHistories(prev => prev.map((slide, i) => {
      if (i !== idx) return slide;
      if (slide.current === 0) return slide;
      return { ...slide, current: slide.current - 1 };
    }));
  };

    return (
      <div className="ppt-app ppt-app-screenshot" style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', minHeight: 0, minWidth: 0 }}>
      {/* PromptModal with input state managed in App */}
      {modalOpen && (
        <div className="copilot-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="copilot-modal-box" style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px #0003',
            padding: 32,
            minWidth: 340,
            maxWidth: '90vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}>
            <div className="copilot-modal-title" style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>What should Copilot add?</div>
            <textarea
              ref={el => { if (el && modalOpen) el.focus(); }}
              className="copilot-modal-input"
              placeholder={modalGhostText}
              value={modalInput}
              onChange={e => setModalInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  setModalInput(modalGhostText);
                }
                if (e.key === 'Escape') {
                  handleModalClose();
                }
              }}
              rows={3}
              style={{ fontSize: 16, padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 20, resize: 'vertical' }}
            />
            <div className="copilot-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="copilot-modal-generate" style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }} onClick={() => handleModalGenerate(modalInput)}>Generate</button>
              <button className="copilot-modal-cancel" style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }} onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="ppt-sidebar ppt-sidebar-screenshot" style={{ width: 220, minWidth: 180, maxWidth: 260, background: '#f4f4f4', boxShadow: '2px 0 8px #0001', zIndex: 2, paddingTop: 12, paddingBottom: 12, overflowY: 'auto' }}>
        {slideLabels.map((label, idx) => (
          <div
            key={idx}
            className={selected === idx ? 'ppt-slide-thumb-selected' : ''}
            onClick={() => setSelected(idx)}
            tabIndex={0}
            style={{
              cursor: 'pointer',
              margin: '0 8px 8px 8px',
              padding: '10px 16px',
              borderRadius: 6,
              background: selected === idx ? '#fff' : 'transparent',
              border: selected === idx ? '2px solid #c00' : '2px solid transparent',
              color: selected === idx ? '#c00' : '#222',
              fontWeight: selected === idx ? 700 : 400,
              fontSize: 16,
              boxShadow: selected === idx ? '0 2px 8px #0001' : 'none',
              outline: 'none',
              transition: 'background 0.15s, border 0.15s, color 0.15s',
            }}
          >
            {`Slide ${idx + 1}: ${label}`}
          </div>
        ))}
      </div>
      {/* Slide Area */}
  <div className="ppt-slide-area ppt-slide-area-screenshot" style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', boxSizing: 'border-box', height: '100%', width: '100%' }}>
        <div className="ppt-slide-content ppt-slide-content-screenshot" style={{ position: 'relative', background: '#fff', boxShadow: '0 2px 16px #0002', borderRadius: 12, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Main slide visual structure as per latest screenshot */}
          {/* Slides 1 & 2: Title area placeholder */}
          {selected <= 1 && (
              <div style={{ position: 'relative', display: 'inline-block', width: '945px', height: '531.3px' }}>
                <img src={titleImg} alt="Title" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 12 }} />
                <TextboxPlaceholder 
                  label={slideHistories[selected].history[slideHistories[selected].current] ?? 'Add a title..'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2.9%',
                    margin: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                      fontSize: '1.76rem',
                    fontWeight: 'bold',
                    color: '#000'
                  }}
                  showPenIcon
                  textColor="#000"
                  penColor="#000"
                  onPenClick={() => handlePenClick('Add a title..')}
                  showUndoIcon={slideHistories[selected].current > 0}
                  onUndo={() => handleUndo(selected)}
                />
              </div>
          )}
          {/* Slides 3 & 4: Subtitle area placeholder */}
          {(selected === 2 || selected === 3) && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={subtitleImg} alt="Subtitle" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 12 }} />
              <TextboxPlaceholder 
                label={slideHistories[selected].history[slideHistories[selected].current] ?? 'Add a subtitle..'}
                style={{position: 'absolute', top: '8%', left: 0, right: 0, height: '5.5%', margin: 0, borderRadius: 0}}
                showPenIcon
                textColor="#111"
                penColor="#111"
                onPenClick={() => handlePenClick('Add a subtitle..')}
                showUndoIcon={slideHistories[selected].current > 0}
                onUndo={() => handleUndo(selected)}
              />
            </div>
          )}
          {/* Slides 5 & 6: Two caption placeholders */}
          {(selected === 4 || selected === 5) && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={captionImg} alt="Caption" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 12 }} />
              <TextboxPlaceholder 
                label={slideHistories[selected].history[slideHistories[selected].current] ?? 'Add a caption..'}
                style={{position: 'absolute', left: '7%', right: '6%', bottom: '2%', height: '3%', margin: 0, borderRadius: 0}}
                showPenIcon
                textColor="#111"
                penColor="#111"
                onPenClick={() => handlePenClick('Add a caption..')}
                showUndoIcon={slideHistories[selected].current > 0}
                onUndo={() => handleUndo(selected)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
