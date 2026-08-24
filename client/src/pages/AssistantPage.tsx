import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  DollarSign,
  Zap,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const AssistantPage: React.FC = () => {
  const { assistantMessages, sendAssistantQuery, isAssistantThinking, formatCurrency } = useFinancial();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [assistantMessages, isAssistantThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAssistantThinking) return;

    const query = inputText;
    setInputText('');
    await sendAssistantQuery(query);
  };

  const handlePromptClick = async (prompt: string) => {
    if (isAssistantThinking) return;
    await sendAssistantQuery(prompt);
  };

  const quickPrompts = [
    'Why did expenses increase this month?',
    'What is our biggest financial risk right now?',
    'Which department is spending over budget?',
    'How can we extend cash runway to 12 months?',
    'What anomalies were detected this billing cycle?',
  ];

  const formatAssistantText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs md:text-sm text-slate-800 leading-relaxed font-normal">
        {lines.map((line, idx) => {
          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-slate-400 mt-1">•</span>
                <span>{line.substring(2)}</span>
              </div>
            );
          }
          if (line.match(/^\d+\./)) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 font-medium text-slate-900">
                <span>{line}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto h-[calc(100vh-4.5rem)] flex flex-col space-y-3 w-full">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-medium text-slate-500 uppercase shrink-0 mr-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-slate-600" /> Prompts:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(p)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-medium border border-slate-200 shadow-xs transition-colors shrink-0 whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-xl p-4 md:p-5 overflow-y-auto space-y-4 border border-slate-200 shadow-xs">
        {assistantMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-3.5 space-y-2.5 ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-none shadow-xs'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-[10px] opacity-70 border-b border-black/5 pb-1 mb-1">
                  <span className="font-semibold">{isUser ? 'You' : 'Financial Assistant'}</span>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    {msg.metrics.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          {m.label}
                        </span>
                        <span className="text-sm font-bold font-mono text-slate-900">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommended Follow-up Prompt Chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                      Suggested Follow-ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(fu)}
                          className="px-2.5 py-1 text-[11px] rounded-md bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isAssistantThinking && (
          <div className="flex gap-3 items-center text-slate-500 text-xs">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="ml-2 font-medium text-slate-600">Analyzing financial data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about burn rate, runway, department spend, or cost savings..."
          disabled={isAssistantThinking}
          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isAssistantThinking}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
