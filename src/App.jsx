import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are WebCraft AI, an expert agent in web design and development.
Your mission is to help designers and developers create extraordinary web experiences.

You can help with:
- Layout design, color palettes, typography, and compositions
- Generating complete and functional HTML, CSS, JavaScript, and React code
- Suggesting UX/UI improvements grounded in design principles
- Analyzing accessibility and performance issues
- Recommending animations, transitions, and micro-interactions
- Creating design systems and reusable components
- Advising on current web design trends

When generating code:
- Always produce clean, semantic, and well-commented code
- Include modern CSS (variables, grid, flexbox, animations)
- Add explanatory comments throughout the code
- Suggest additional improvements at the end

Always respond in English. Be creative, precise, and enthusiastic about design.`;

const SUGGESTIONS = [
  "Design a landing page for a tech startup",
  "Create a color palette for a luxury brand",
  "How do I build a responsive navbar with animations?",
  "Generate a product card component in React",
  "Design a hero section with animated gradient",
  "What are the top web design trends in 2025?",
  "Create a contact form with visual validation",
  "Design a minimalist dashboard using CSS Grid",
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`message ${isUser ? "user-msg" : "ai-msg"}`}>
      {!isUser && (
        <div className="avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.8"/>
            <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.5"/>
            <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.5"/>
            <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.8"/>
          </svg>
        </div>
      )}
      <div className="bubble">
        <div className="content" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
      </div>
      {isUser && <div className="avatar user-av">U</div>}
    </div>
  );
}

function formatMessage(text) {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block"><div class="code-lang">${lang || "code"}</div><code>${escapeHtml(code.trim())}</code></pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hup]|<li|<pre|<ul)(.+)/gm, "<p>$1</p>");
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi there! I'm **WebCraft AI**, your web design agent. 🎨

I'm here to help you build incredible web experiences. I can:

- Generate complete **HTML, CSS, JavaScript, and React** code
- Design **layouts, color palettes**, and typography systems
- Advise on **UX/UI, accessibility, and performance**
- Create memorable **animations and micro-interactions**

What project shall we start with today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setShowSuggestions(false);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.map((b) => b.text || "").join("") || "Sin respuesta.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Failed to connect to the API. Please check your connection." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" fill="#6EE7B7"/>
                <rect x="18" y="2" width="12" height="12" rx="2" fill="#6EE7B7" opacity="0.5"/>
                <rect x="2" y="18" width="12" height="12" rx="2" fill="#6EE7B7" opacity="0.5"/>
                <rect x="18" y="18" width="12" height="12" rx="2" fill="#6EE7B7"/>
              </svg>
            </div>
            <div>
              <div className="logo-name">WebCraft</div>
              <div className="logo-sub">AI Design Agent</div>
            </div>
          </div>

          <nav className="nav-section">
            <div className="nav-label">Capabilities</div>
            {[
              { icon: "⬡", label: "UI/UX Design" },
              { icon: "⌨", label: "Code Generation" },
              { icon: "◈", label: "Design Systems" },
              { icon: "⟐", label: "CSS Animations" },
              { icon: "⊞", label: "Layouts & Grid" },
              { icon: "◉", label: "Color Palettes" },
            ].map((item) => (
              <button key={item.label} className="nav-item" onClick={() => sendMessage(`Help me with ${item.label}`)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="status-dot" />
            <span>Active model: Claude Sonnet</span>
          </div>
        </aside>

        <main className="chat-area">
          <header className="chat-header">
            <div className="header-title">
              <span>Web Design</span>
              <span className="header-badge">AI</span>
            </div>
            <button className="new-chat" onClick={() => { setMessages([{ role: "assistant", content: `New session ready! What project are we working on today? 🚀` }]); setShowSuggestions(true); }}>
              + New session
            </button>
          </header>

          <div className="messages">
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}

            {showSuggestions && messages.length === 1 && (
              <div className="suggestions">
                <div className="sug-title">Try these prompts</div>
                <div className="sug-grid">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="sug-chip" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="message ai-msg">
                <div className="avatar">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.8"/>
                    <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.5"/>
                    <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.5"/>
                    <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.8"/>
                  </svg>
                </div>
                <div className="bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="input-area">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKey}
                placeholder="Describe the design you need..."
                rows={1}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="send-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9"/>
                </svg>
              </button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        </main>
      </div>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c0f;
    --surface: #111418;
    --surface2: #181c22;
    --border: #1f2530;
    --accent: #6EE7B7;
    --accent2: #34d399;
    --text: #e8edf5;
    --text2: #8892a4;
    --text3: #4a5568;
    --user-bg: #1a2235;
    --ai-bg: #111720;
    --radius: 12px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; height: 100vh; overflow: hidden; }

  .app { display: flex; height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 16px; gap: 24px;
  }

  .logo { display: flex; align-items: center; gap: 12px; padding: 4px 8px; }
  .logo-icon { width: 36px; height: 36px; flex-shrink: 0; }
  .logo-name { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .logo-sub { font-size: 10px; color: var(--accent); font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }

  .nav-section { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .nav-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; font-family: 'DM Mono', monospace; padding: 0 8px; margin-bottom: 4px; margin-top: 8px; }

  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px;
    border: none; background: transparent; color: var(--text2); font-family: 'Syne', sans-serif;
    font-size: 13px; cursor: pointer; text-align: left; transition: all 0.15s;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-icon { font-size: 14px; opacity: 0.7; }

  .sidebar-footer {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace;
    padding: 8px; border-top: 1px solid var(--border); padding-top: 16px;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }

  /* CHAT */
  .chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }

  .chat-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 28px; border-bottom: 1px solid var(--border);
    background: var(--surface); min-height: 64px;
  }
  .header-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; color: var(--text); }
  .header-badge { background: var(--accent); color: #0a0c0f; font-size: 9px; font-weight: 700; font-family: 'DM Mono', monospace; padding: 2px 7px; border-radius: 20px; letter-spacing: 0.05em; }
  .new-chat { background: var(--surface2); border: 1px solid var(--border); color: var(--text2); padding: 7px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .new-chat:hover { border-color: var(--accent); color: var(--accent); }

  .messages { flex: 1; overflow-y: auto; padding: 28px; display: flex; flex-direction: column; gap: 20px; scroll-behavior: smooth; }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .message { display: flex; align-items: flex-start; gap: 12px; max-width: 800px; animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }

  .user-msg { flex-direction: row-reverse; align-self: flex-end; }
  .ai-msg { align-self: flex-start; width: 100%; }

  .avatar {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface2); border: 1px solid var(--border); color: var(--accent); padding: 6px;
  }
  .user-av { background: var(--user-bg); border-color: #2a3550; font-size: 12px; font-weight: 700; color: var(--accent); font-family: 'DM Mono', monospace; }

  .bubble { padding: 14px 18px; border-radius: var(--radius); line-height: 1.65; font-size: 14px; }
  .user-msg .bubble { background: var(--user-bg); border: 1px solid #2a3550; color: var(--text); border-bottom-right-radius: 3px; }
  .ai-msg .bubble { background: transparent; color: var(--text); border-bottom-left-radius: 3px; flex: 1; }

  .content h1, .content h2, .content h3 { color: var(--text); margin: 16px 0 8px; font-weight: 700; }
  .content h1 { font-size: 20px; } .content h2 { font-size: 17px; } .content h3 { font-size: 15px; }
  .content p { color: var(--text2); margin: 6px 0; }
  .content strong { color: var(--text); font-weight: 600; }
  .content ul { padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
  .content li { color: var(--text2); font-size: 13.5px; }

  .code-block { background: #0d1117; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin: 12px 0; }
  .code-lang { background: var(--surface2); padding: 6px 14px; font-size: 10px; color: var(--accent); font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border); }
  .code-block code { display: block; padding: 16px; font-family: 'DM Mono', monospace; font-size: 12.5px; color: #a8d9a8; overflow-x: auto; line-height: 1.7; }
  .inline-code { background: var(--surface2); color: var(--accent); padding: 2px 6px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 12px; border: 1px solid var(--border); }

  /* TYPING */
  .typing { display: flex; align-items: center; gap: 5px; height: 42px; padding: 0 18px; }
  .typing span { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: bounce 1.2s infinite; }
  .typing span:nth-child(2) { animation-delay: 0.15s; }
  .typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%,60%,100% { transform:translateY(0) } 30% { transform:translateY(-6px) } }

  /* SUGGESTIONS */
  .suggestions { padding: 8px 0; }
  .sug-title { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
  .sug-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
  .sug-chip {
    background: var(--surface); border: 1px solid var(--border); color: var(--text2);
    padding: 10px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 12.5px;
    cursor: pointer; text-align: left; transition: all 0.15s; line-height: 1.4;
  }
  .sug-chip:hover { border-color: var(--accent); color: var(--text); background: var(--surface2); }

  /* INPUT */
  .input-area { padding: 16px 28px 20px; border-top: 1px solid var(--border); background: var(--bg); }
  .input-box {
    display: flex; align-items: flex-end; gap: 10px;
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 10px 14px; transition: border-color 0.2s;
  }
  .input-box:focus-within { border-color: #2a3c50; }

  textarea {
    flex: 1; background: transparent; border: none; outline: none; resize: none;
    color: var(--text); font-family: 'Syne', sans-serif; font-size: 14px; line-height: 1.6;
    min-height: 24px; max-height: 160px;
  }
  textarea::placeholder { color: var(--text3); }

  .send-btn {
    width: 36px; height: 36px; min-width: 36px; border-radius: 8px; border: none;
    background: var(--accent); color: #0a0c0f; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s; padding: 8px;
  }
  .send-btn:hover:not(:disabled) { background: var(--accent2); transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  .input-hint { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace; margin-top: 8px; text-align: center; }
`;
