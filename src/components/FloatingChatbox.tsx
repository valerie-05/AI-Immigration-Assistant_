import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Volume2, Loader2, Download, Globe } from 'lucide-react';
import { supabase, type Message } from '../lib/supabase';
import { getImmigrationGuidance } from '../services/geminiService';
import { textToSpeech, SUPPORTED_LANGUAGES, createAudioPlayer } from '../services/elevenLabsService';

export function FloatingChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = async () => {
    try {
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert([{ title: 'Immigration Chat' }])
        .select()
        .single();

      if (error) throw error;
      setSessionId(newSession.id);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const { data: userMsg, error: userError } = await supabase
        .from('messages')
        .insert([{
          session_id: sessionId,
          role: 'user',
          content: userMessage
        }])
        .select()
        .single();

      if (userError) throw userError;
      setMessages(prev => [...prev, userMsg]);

      const response = await getImmigrationGuidance(userMessage);

      const { data: assistantMsg, error: assistantError } = await supabase
        .from('messages')
        .insert([{
          session_id: sessionId,
          role: 'assistant',
          content: response
        }])
        .select()
        .single();

      if (assistantError) throw assistantError;
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (messageId: string, text: string) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }

    setAudioLoading(messageId);

    try {
      const audioUrl = await textToSpeech(text, selectedLanguage);

      if (audioUrl) {
        const audio = createAudioPlayer(audioUrl);
        audio.onended = () => {
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };
        audio.play();
        setCurrentAudio(audio);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    } finally {
      setAudioLoading(null);
    }
  };

  const handleSaveResponse = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'immigration-guidance.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Immigration Assistant</h3>
            <p className="text-xs text-blue-100">Ask me anything</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-600 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 bg-gray-50 border-b flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-600" />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm mb-2">Start a conversation!</p>
            <p className="text-xs text-gray-400">
              Try: "My student visa expires next year"
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handlePlayAudio(message.id, message.content)}
                      disabled={audioLoading === message.id}
                      className="text-xs flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors disabled:opacity-50"
                      title="Listen"
                    >
                      {audioLoading === message.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSaveResponse(message.content)}
                      className="text-xs flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
                      title="Save"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about immigration..."
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
