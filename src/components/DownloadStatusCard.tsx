import { useState, useEffect, useRef } from 'react';
import { DownloadProgress, DownloadFormat } from '../types';
import { Loader2, CheckCircle2, AlertTriangle, ChevronRight, Terminal, Sparkles } from 'lucide-react';

interface DownloadStatusCardProps {
  progress: DownloadProgress;
  videoTitle: string;
  format: DownloadFormat;
  qualityLabel: string;
  onReset: () => void;
}

export default function DownloadStatusCard({ progress, videoTitle, format, qualityLabel, onReset }: DownloadStatusCardProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Accumulate logs dynamically based on download progress percentage
  useEffect(() => {
    if (progress.status === 'downloading') {
      const newLogs = ['[SYSTEM] Initiating digital media extraction sequence...'];
      
      if (progress.progress >= 10) {
        newLogs.push('[CDN] Connected to primary stream distribution node...');
      }
      if (progress.progress >= 25) {
        newLogs.push(`[STREAM] Selecting high-fidelity ${format.toUpperCase()} stream block...`);
      }
      if (progress.progress >= 40) {
        newLogs.push(`[MULTIPLEX] Fetching digital blocks (${qualityLabel})...`);
      }
      if (progress.progress >= 60) {
        newLogs.push('[DECODE] Resolving video signature and applying codec parameters...');
      }
      if (progress.progress >= 80) {
        newLogs.push('[ASSEMBLY] Conforming stream packages to standard file wrapper...');
      }
      if (progress.progress >= 95) {
        newLogs.push('[SERVER] Stream synthesis complete. Delivering file buffer to browser...');
      }
      
      if (progress.phase && !newLogs.includes(`[SYSTEM] ${progress.phase}`)) {
        newLogs.push(`[STATUS] ${progress.phase}`);
      }

      setLogs(newLogs);
    } else if (progress.status === 'completed') {
      setLogs([
        '[SYSTEM] Initiating digital media extraction sequence...',
        '[CDN] Connected to primary stream distribution node...',
        `[STREAM] Selecting high-fidelity ${format.toUpperCase()} stream block...`,
        `[MULTIPLEX] Fetching digital blocks (${qualityLabel})...`,
        '[DECODE] Resolving video signature and applying codec parameters...',
        '[ASSEMBLY] Conforming stream packages to standard file wrapper...',
        '[SERVER] Stream synthesis complete. Delivering file buffer to browser...',
        '------------------------------------------------------------------',
        '[SUCCESS] Container assembly successfully completed!',
        `[SYSTEM] Triggered direct download of "${videoTitle}.${format}"`
      ]);
    } else if (progress.status === 'error') {
      setLogs((prev) => [...prev, `[ERROR] Extraction halted: ${progress.error || 'Unknown failure'}`]);
    } else {
      setLogs([]);
    }
  }, [progress.progress, progress.status, progress.phase, format, qualityLabel, videoTitle, progress.error]);

  // Scroll terminal logs automatically to the bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Glow decorative ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-b-full shadow-lg shadow-cyan-500/20" />

        {/* Status: Downloading */}
        {progress.status === 'downloading' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    Processing Stream
                  </span>
                </div>
                <h3 className="text-sm font-sans font-bold text-slate-100 line-clamp-1 max-w-[280px] sm:max-w-[400px]">
                  {videoTitle}
                </h3>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {Math.round(progress.progress)}%
                </span>
              </div>
            </div>

            {/* Custom Premium Progress Bar */}
            <div className="relative">
              <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${progress.progress}%` }}
                >
                  {/* Subtle moving stripe reflection */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:12px_12px] animate-[pulse_1.5s_infinite]" />
                </div>
              </div>
            </div>

            {/* Dynamic Extraction Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-center text-center">
                <span className="text-[9px] font-sans text-slate-500 uppercase tracking-wider font-semibold">Speed</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 mt-0.5">
                  {progress.speed.toFixed(1)} MB/s
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-center text-center">
                <span className="text-[9px] font-sans text-slate-500 uppercase tracking-wider font-semibold">Remaining</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 mt-0.5">
                  {progress.eta > 0 ? `${progress.eta.toFixed(1)}s` : 'Finishing...'}
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-center text-center">
                <span className="text-[9px] font-sans text-slate-500 uppercase tracking-wider font-semibold">Transferred</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 mt-0.5">
                  {progress.downloadedSize.toFixed(1)} / {progress.totalSize.toFixed(1)} MB
                </span>
              </div>
            </div>

            {/* Realtime Extraction Logs Console */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-1">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-400 font-medium uppercase tracking-wider">Stream Processor Console</span>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-slate-400 space-y-1.5 max-h-[110px] overflow-y-auto scrollbar-thin">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400/70 shrink-0 mt-0.5" />
                    <span className={log.startsWith('[ERROR]') ? 'text-rose-400' : log.startsWith('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Status: Completed Successfully */}
        {progress.status === 'completed' && (
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <CheckCircle2 className="w-8 h-8" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 animate-bounce" />
              </div>
              <h3 className="text-lg font-sans font-bold text-slate-100 mb-1">
                Extraction Finished!
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                The file <span className="text-slate-200 font-semibold">"{videoTitle}.{format}"</span> (~{progress.totalSize.toFixed(1)} MB) has been assembled and downloaded directly to your computer.
              </p>
            </div>

            {/* Final Console Log Overview */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-left text-slate-400 space-y-1.5 max-h-[110px] overflow-y-auto scrollbar-thin max-w-lg mx-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500/70 shrink-0 mt-0.5" />
                  <span className={log.startsWith('[SUCCESS]') || log.startsWith('[SUCCESS') ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="reset-downloader-button"
                onClick={onReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-sans font-semibold text-xs transition border border-white/10"
              >
                Download Another Link
              </button>
            </div>
          </div>
        )}

        {/* Status: Error state */}
        {progress.status === 'error' && (
          <div className="space-y-5 text-center py-4">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-lg font-sans font-bold text-slate-100 mb-1">
                Extraction Failed
              </h3>
              <p className="text-xs text-rose-300 max-w-sm px-4">
                {progress.error || 'The video streaming chunks could not be gathered. This video might be geo-restricted or age-blocked by YouTube.'}
              </p>
            </div>

            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                id="retry-downloader-button"
                onClick={onReset}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-sans font-semibold text-xs transition shadow-md"
              >
                Go Back & Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
