import React, { useState } from 'react';
import { Link2, Clipboard, Loader2, X } from 'lucide-react';
import { extractVideoId } from '../utils/youtube';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please paste a YouTube video link first.');
      return;
    }

    const videoId = extractVideoId(trimmedUrl);
    if (!videoId) {
      setError('Please provide a valid YouTube URL (e.g. watch, shorts, or youtu.be link).');
      return;
    }

    onAnalyze(trimmedUrl);
  };

  const handlePaste = async () => {
    setError(null);
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        const videoId = extractVideoId(text);
        if (videoId) {
          onAnalyze(text);
        } else {
          setError('Pasted content is not a valid YouTube URL.');
        }
      }
    } catch (err) {
      setError('Could not access clipboard automatically. Please paste using keyboard shortcut (Ctrl+V / Cmd+V).');
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch p-2.5 rounded-2xl glass-card group-focus-within:neon-border transition-all duration-300">
          <div className="relative flex-1 flex items-center">
            <Link2 className="absolute left-3 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            
            <input
              type="text"
              id="youtube-url-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste YouTube, Shorts, or youtu.be URL here..."
              className="w-full pl-10 pr-10 py-3 bg-transparent text-slate-100 placeholder-slate-600 font-sans text-sm focus:outline-none"
              disabled={isLoading}
              autoComplete="off"
            />

            {url && (
              <button
                type="button"
                id="clear-url-button"
                onClick={handleClear}
                className="absolute right-3 p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {!url && (
              <button
                type="button"
                id="paste-clipboard-button"
                onClick={handlePaste}
                className="absolute right-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-sans text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            id="analyze-url-button"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl btn-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-bold text-sm tracking-wider hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Parsing Video...</span>
              </>
            ) : (
              <span>Extract Streams</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans flex items-center gap-2 animate-fade-in">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
