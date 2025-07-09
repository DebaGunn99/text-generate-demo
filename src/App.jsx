function getMetaPromptsForSlides1to6(selected) {
  let metaPrompts = `1. Stay on Topic: Ensure the response remains focused on the given topic. Avoid digressions or unrelated content.\n2. Maintain Logical Flow: Structure the response with a clear beginning, middle, and end. Use transitions to guide the reader.\n3. Use Neutral and Professional Tone: Avoid overly casual, emotional, or biased language unless a specific tone is requested.\n4. Avoid Hallucinations: Do not fabricate names, statistics, or references. If unsure, state that the information is not available.\n5. Respect Privacy and Confidentiality: Do not include personal data, sensitive information, or internal-only content unless explicitly allowed.\n6. Avoid Harmful or Sensitive Content: Do not generate content that is discriminatory, offensive, or inappropriate for a general audience.\n7. Use Clear and Concise Language: Prefer simple, direct sentences. Avoid jargon unless the audience is expected to understand it.\n8. Avoid Placeholder Text: Do not include filler like “Lorem ipsum” or “insert here” unless explicitly instructed.\n9. No Self-Referencing: Avoid phrases like “As an AI language model…” unless the context requires it.\n10. No special characters: Don't introduce quotes or asteriks for text generated unnecessarily.`;
  if (selected === 1 || selected === 3 || selected === 5) {
    metaPrompts += `\n11. Write in slide context: Consider the slide text + visuals to write text - Ensure response is taking info from slides. If user has mentioned particular topic, then search in the slide visuals, reference it if available and then generate text.`;
    metaPrompts += `\n12. Maintain style, tone consistency with rest of the text on the slide if present, else have a default (neutral and professional)`;
    metaPrompts += `\n13. Ensure the written response honours the length / real estate available for the textbox. Ensure that you write within the textbox space provided and don’t let text overflow beyond the textbox - this introduces more pain for users in spending time to format your suggestions.`;
    metaPrompts += `\n14. Never use special characters in the beginning and the end of the message.`;
    metaPrompts += `\n15. You can see the slide image, the textbox dimensions, and the font size. Visually estimate the maximum amount of text that fits in the textbox without overflow. Strictly limit your response to what fits in a single line or the visible textbox area, based on the image and font size. Do not exceed the available textbox space. This is avery strict instruction and you have to follow this anyhow because textbox is not set to expand either horizontally or vertically,`;
  }
  return metaPrompts;
}

function getMetaPromptsForSlides7to10(selected) {
  let basePrompts = `1. Stay on Topic: Ensure the response remains grounded in the {textbox content} and user instructions as user wants to rewrite this text block as per their choice.
2. Maintain Logical Flow: Structure the response with a clear beginning, middle, and end. Use transitions to guide the reader.
3. If user instructions is to Rewrite, use the same tone, style, voice as used in the {textbox content}, unless specified by the user in their instructions.
4. Avoid Hallucinations: Do not fabricate names, statistics, or references. If unsure, state that the information is not available.
5. Respect Privacy and Confidentiality: Do not include personal data, sensitive information, or internal-only content unless explicitly allowed.
6. Avoid Harmful or Sensitive Content: Do not generate content that is discriminatory, offensive, or inappropriate for a general audience.
7. Use Clear and Concise Language: Prefer simple, direct sentences. Avoid jargon unless the audience is expected to understand it.
8. Avoid Placeholder Text: Do not include filler like “Lorem ipsum” or “insert here” unless explicitly instructed.
9. No Self-Referencing: Avoid phrases like “As an AI language model…” unless the context requires it.
10. No special characters: Don't introduce quotes or asterisks for text generated unnecessarily.`;
  if (selected === 8 || selected === 10) {
    basePrompts += `\n12. Rewrite in slide context: Apart from the textbox content and user instructions, the response should also be grounded in the slide visual. If user has mentioned particular topic, then search in the slide visuals, reference it if available and then generate text.`;
    basePrompts += `\n13. Maintain overall writing style, tone with the overall slide and prefer this over the tone, style of the textbox content.`;
    basePrompts += `\n14. Ensure the written response honours the length / real estate available. Ensure that you write within the space provided and don’t let text overflow - this introduces more pain for users in spending time to format your suggestions.`;
    basePrompts += `\n15. Never use special characters in the beginning and the end of the message.`;
    basePrompts += `\nYou can see the slide image, the textbox width, and the font size. Visually estimate the maximum amount of text that fits in the textbox without overflow. Strictly limit your response to what fits in a single line or the visible area, based on the image and font size. Do not exceed the available space.`;
  }
  return basePrompts;
}
// RedSnap state restored July 9, 2025
// ...existing code as shown in previous message...











import React, { useState, useRef, useEffect } from 'react';
import titleImg from '../images/Title.png';
import subtitleImg from '../images/Subtitle.png';
import captionImg from '../images/Caption.png';
import rewriteBodyImg from '../images/RewriteBody.png';
import rewriteCaptionImg from '../images/RewriteCaption.png';
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
  // Opens the prompt modal with ghost text
  const handlePenClick = (ghostText) => {
    setModalGhostText(ghostText);
    setModalInput('');
    setModalOpen(true);
  };
  const slideLabels = [
    'Title - prompt',
    'Title - prompt + snapshot',
    'Subtitle - prompt',
    'Subtitle - prompt + snapshot',
    'Caption - prompt',
    'Caption - prompt + snapshot',
    'RewriteBody - prompt',
    'RewriteBody - prompt + snapshot',
    'RewriteCaption - prompt',
    'RewriteCaption - prompt + snapshot',
  ];

  const [selected, setSelected] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGhostText, setModalGhostText] = useState('');
  const [modalInput, setModalInput] = useState('');
  const [slideHistories, setSlideHistories] = useState([
    { history: [null], current: 0 }, // 0 Title - prompt
    { history: [null], current: 0 }, // 1 Title - prompt + snapshot
    { history: [null], current: 0 }, // 2 Subtitle - prompt
    { history: [null], current: 0 }, // 3 Subtitle - prompt + snapshot
    { history: [null], current: 0 }, // 4 Caption - prompt
    { history: [null], current: 0 }, // 5 Caption - prompt + snapshot
    { history: [
      `Physical inactivity also presents\nan existential risk to the sporting\ngoods industry. If levels continue\nto rise or even remain constant\nfor younger generations, the\nmarket related to physical\nactivity will decline. However,\nconverting physically inactive\nsegments is the biggest potential\nopportunity for the sporting\ngoods industry.​`
    ], current: 0 }, // 6 RewriteBody - prompt
    { history: [
      `Physical inactivity also presents\nan existential risk to the sporting\ngoods industry. If levels continue\nto rise or even remain constant\nfor younger generations, the\nmarket related to physical\nactivity will decline. However,\nconverting physically inactive\nsegments is the biggest potential\nopportunity for the sporting\ngoods industry.​`
    ], current: 0 }, // 7 RewriteBody - prompt + snapshot
    { history: [
      'Survey of these active consumers in the sporting goods sector revealed an expanding gap in activity levels, with these cohorts drifting ever further apart.​'
    ], current: 0 }, // 8 RewriteCaption - prompt
    { history: [
      'Survey of these active consumers in the sporting goods sector revealed an expanding gap in activity levels, with these cohorts drifting ever further apart.​'
    ], current: 0 }, // 9 RewriteCaption - prompt + snapshot
  ]);

  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    setModalInput('');
  };

  const handleModalGenerate = async (input) => {
    // For slides 7-10, require user instructions and send both textbox and instructions to LLM
    if (!input.trim()) {
  alert('Please enter instructions.');
      return;
    }
    setLoading(true);
    try {
      let metaPrompts = '';
      if (selected >= 0 && selected <= 5) {
        metaPrompts = getMetaPromptsForSlides1to6(selected);
      } else if (selected >= 6 && selected <= 9) {
        let rawMetaPrompts = getMetaPromptsForSlides7to10(selected);
        const textboxContent = slideHistories[selected].history[slideHistories[selected].current] || '';
        metaPrompts = rawMetaPrompts.replaceAll('{textbox content}', textboxContent);
      }
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

      // Slides 7, 8, 9, 10: RewriteBody/RewriteCaption with/without snapshot
      if (selected === 6) {
        const textboxContent = slideHistories[selected].history[slideHistories[selected].current] || '';
        messages.push({ role: 'user', content: `Rewrite the following content based on these instructions.\n\nContent:\n${textboxContent}\n\nInstructions:\n${input}` });
      } else if (selected === 7) {
        const textboxContent = slideHistories[selected].history[slideHistories[selected].current] || '';
        const imgData = await toBase64(rewriteBodyImg);
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: `Rewrite the following content based on these instructions.\n\nContent:\n${textboxContent}\n\nInstructions:\n${input}` },
            { type: 'image_url', image_url: { url: imgData } }
          ]
        });
      } else if (selected === 8) {
        const textboxContent = slideHistories[selected].history[slideHistories[selected].current] || '';
        messages.push({
          role: 'user',
          content: `Rewrite the following content based on these instructions.\n\nContent:\n${textboxContent}\n\nInstructions:\n${input}`
        });
      } else if (selected === 9) {
        const textboxContent = slideHistories[selected].history[slideHistories[selected].current] || '';
        const imgData = await toBase64(rewriteCaptionImg);
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: `Rewrite the following content based on these instructions.\n\nContent:\n${textboxContent}\n\nInstructions:\n${input}` },
            { type: 'image_url', image_url: { url: imgData } }
          ]
        });
      } else if (selected === 10) {
        const textboxContent = slideHistories[selected].history[slideHistories[selected].current] || '';
        messages.push({
          role: 'user',
          content: `Rewrite the following content based on these instructions.\n\nContent:\n${textboxContent}\n\nInstructions:\n${input}`
        });
      } else if (selected === 1) {
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
          temperature: 0.2
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
      {/* Sidebar + Main Content Flex Row */}
      <div style={{ display: 'flex', flex: 1, height: '100vh', width: '100vw' }}>
        <div className="ppt-sidebar ppt-sidebar-screenshot" style={{ width: 220, minWidth: 180, maxWidth: 260, background: '#f4f4f4', boxShadow: '2px 0 8px #0001', zIndex: 2, paddingTop: 12, paddingBottom: 12, overflowY: 'auto', height: '100vh' }}>
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
                borderRadius: 8,
                background: selected === idx ? '#fff' : 'transparent',
                fontWeight: selected === idx ? 700 : 400,
                color: selected === idx ? '#c00' : '#222',
                border: selected === idx ? '2px solid #c00' : '2px solid transparent',
                boxShadow: selected === idx ? '0 2px 8px #c003' : 'none',
                transition: 'all 0.15s',
                outline: 'none',
              }}
            >
              {label}
            </div>
          ))}
        </div>

  {/* Main slide rendering block */}
  <div className="ppt-main-slide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', minWidth: 0, minHeight: 0, background: '#ececf0' }}>
          {/* Slides 1 & 2: Title area placeholder */}
          {selected === 0 || selected === 1 ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '945px', height: '531.3px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 0 }}>
              <img src={titleImg} alt="Title" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 18 }} />
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
          ) : null}
          {/* Slides 3 & 4: Subtitle area placeholder */}
          {selected === 2 || selected === 3 ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '945px', height: '531.3px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 0 }}>
              <img src={subtitleImg} alt="Subtitle" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 18 }} />
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
          ) : null}
          {/* Slides 5 & 6: Caption area placeholder */}
          {selected === 4 || selected === 5 ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '945px', height: '531.3px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 0 }}>
              <img src={captionImg} alt="Caption" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 18 }} />
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
          ) : null}
          {/* Slides 7 & 8: RewriteBody area placeholder */}
          {selected === 6 || selected === 7 ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '945px', height: '531.3px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 0 }}>
              <img src={rewriteBodyImg} alt="RewriteBody" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 18 }} />
              <TextboxPlaceholder 
                label={slideHistories[selected].history[slideHistories[selected].current] ?? 'Rewrite the body text..'}
                style={{position: 'absolute', top: '20%', left: '65%', right: 0, height: '75%', margin: 0, borderRadius: 0}}
                showPenIcon
                textColor="#111"
                penColor="#111"
                onPenClick={() => handlePenClick('Rewrite this in a concise way using slide data points..')}
                showUndoIcon={slideHistories[selected].current > 0}
                onUndo={() => handleUndo(selected)}
              />
            </div>
          ) : null}
          {/* Slides 9 & 10: RewriteCaption area placeholder */}
          {selected === 8 || selected === 9 ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '945px', height: '531.3px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 0 }}>
              <img src={rewriteCaptionImg} alt="RewriteCaption" style={{ display: 'block', width: '945px', height: '531.3px', objectFit: 'contain', borderRadius: 18 }} />
              <TextboxPlaceholder 
                label={slideHistories[selected].history[slideHistories[selected].current] ?? 'Rewrite the caption..'}
                style={{position: 'absolute', top: '8%', left: 0, right: 0, height: '5.5%', margin: 0, borderRadius: 0}}
                showPenIcon
                textColor="#111"
                penColor="#111"
                onPenClick={() => handlePenClick('Rewrite this as a subtitle using slide data points..')}
                showUndoIcon={slideHistories[selected].current > 0}
                onUndo={() => handleUndo(selected)}
              />
            </div>
          ) : null}
        </div>
      </div>
  </div>
  );
}

export default App;
