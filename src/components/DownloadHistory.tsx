import { HistoryItem } from '../types';
import { History, Video, Music, Trash2, Download, ExternalLink } from 'lucide-react';
import { generateMockFile } from '../utils/youtube';

interface DownloadHistoryProps {
  items: HistoryItem[];
  onClear: () => void;
  onRemoveItem: (id: string) => void;
}

export default function DownloadHistory({ items, onClear, onRemoveItem }: DownloadHistoryProps) {
  if (items.length === 0) return null;

  const handleRedownload = (item: HistoryItem) => {
    // Instantly generate and trigger download for that item from history
    const sizeInMB = parseFloat(item.fileSize);
    const blob = generateMockFile(item.title, sizeInMB, item.format, item.quality);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${item.title}.${item.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <History className="w-4 h-4" />
            </div>
            <h3 className="text-[11px] font-sans font-bold text-slate-100 uppercase tracking-widest">
              Recent Downloads ({items.length})
            </h3>
          </div>
          
          <button
            type="button"
            id="clear-all-history"
            onClick={onClear}
            className="text-xs font-sans font-medium text-slate-500 hover:text-cyan-400 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-cyan-500/5 transition-all"
            title="Clear download history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-cyan-500/30 hover:bg-black/40 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Format specific icon */}
                <div className={`relative shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border ${
                  item.format === 'mp4' 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {item.format === 'mp4' ? <Video className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                  {/* Miniature badge */}
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center bg-slate-900 border border-white/10 text-[8px] font-mono font-bold px-1 rounded text-slate-300 uppercase">
                    {item.format}
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-sans font-bold text-slate-200 line-clamp-1 leading-normal pr-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                    <span className="truncate max-w-[100px] text-cyan-400/80 font-sans font-medium">{item.author}</span>
                    <span>•</span>
                    <span className="bg-slate-950 border border-white/5 px-1 rounded text-slate-400 text-[9px]">
                      {item.quality}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-400">{item.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  type="button"
                  id={`history-download-again-${item.id}`}
                  onClick={() => handleRedownload(item)}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-all"
                  title="Download file again"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id={`history-delete-item-${item.id}`}
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all md:opacity-0 md:group-hover:opacity-100"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
