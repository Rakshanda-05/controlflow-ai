import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const AssistantPage: React.FC = () => {
  const { assistantMessages, isAssistantThinking, sendAssistantQuery } = useFinancial();
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Why did expenses increase this month?',
    'What is our biggest financial risk?',
    'Which category is overspending?',
    'How much cash runway do we have?',
    'What happens if expenses increase by 20%?',
    'How can we extend runway to 12 months?',
    'Show me flagged transaction anomalies',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [assistantMessages, isAssistantThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAssistantThinking) return;
    sendAssistantQuery(inputQuery);
    setInputQuery('');
  };

  const handlePromptClick = (prompt: string) => {
    sendAssistantQuery(prompt);
  };

  // Helper to render markdown bolding and bullet points nicely
  const formatAssistantText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-white text-sm md:text-base mt-3 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-white text-base md:text-lg mt-3 mb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className="text-brand-400 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: renderInlineBold(line.slice(2)) }} />
              </div>
            );
          }
          if (line.match(/^\d+\. /)) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className="text-brand-400 font-bold">{line.match(/^\d+\./)?.[0]}</span>
                <span dangerouslySetInnerHTML={{ __html: renderInlineBold(line.replace(/^\d+\. /, '')) }} />
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: renderInlineBold(line) }} />
          );
        })}
      </div>
    );
  };

  const renderInlineBold = (str: string) => {
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto h-[calc(100vh-4.5rem)] flex flex-col space-y-3">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-medium text-slate-400 uppercase shrink-0 mr-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-indigo-400" /> Prompts:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(p)}
            className="px-2.5 py-1 rounded-lg bg-[#111726] hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-medium border border-[#1e293b] transition-colors shrink-0 whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-[#111726] rounded-xl p-4 md:p-5 overflow-y-auto space-y-4 border border-[#1e293b]">
        {assistantMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-3.5 space-y-2.5 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-[#0e1422] text-slate-200 border border-[#1e293b] rounded-bl-none shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-[10px] opacity-70 border-b border-white/10 pb-1 mb-1">
                  <span className="font-semibold">{isUser ? 'You' : 'Finance Assistant'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Body */}
                {isUser ? (
                  <p className="text-xs md:text-sm leading-relaxed">{msg.text}</p>
                ) : (
                  formatAssistantText(msg.text)
                )}

                {/* Optional Metric Highlight Cards */}
                {msg.metrics && msg.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    {msg.metrics.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#0b0f19]/80 border border-slate-700">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          {m.label}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">{m.value}</span>
                        {m.delta && (
                          <span className="text-[10px] text-brand-300 block font-medium">
                            {m.delta}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(fu)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-brand-600 text-brand-300 hover:text-white border border-slate-700 transition-colors"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAssistantThinking && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0 animate-pulse shadow-glow">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#131c2e] border border-[#23324d] rounded-2xl p-4 rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-1">Analyzing financial ledger & models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Bar */}
      <form onSubmit={handleSubmit} className="shrink-0 relative flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything (e.g. 'What happens if we reduce marketing spend by 30%?')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="w-full pl-4 pr-12 py-3.5 bg-[#131c2e] border border-[#23324d] rounded-xl text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-lg"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isAssistantThinking}
          className="absolute right-2 p-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 transition-all shadow-glow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
