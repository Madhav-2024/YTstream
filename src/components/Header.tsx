import { Youtube, Download, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center pt-8 pb-4 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-5 shadow-lg shadow-cyan-500/5 animate-fade-in">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        <span>High Fidelity Stream Processor</span>
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl btn-gradient shadow-lg">
          <Youtube className="w-5.5 h-5.5 text-white" />
          <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-lg bg-slate-950 border border-white/10">
            <Download className="w-3 h-3 text-cyan-400" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tighter text-white glow-text">
            YTSTREAM<span className="text-cyan-400">PRO</span>
          </h1>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        Extract digital media assets in pristine container packages. Paste a YouTube URL below to initialize the engine.
      </p>
    </header>
  );
}
