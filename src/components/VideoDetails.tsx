import { useState, useEffect } from 'react';
import { VideoMetadata, DownloadFormat, QualityOption } from '../types';
import { formatDuration } from '../utils/youtube';
import { Video, Music, Calendar, Flame, ThumbsUp, Eye, Check } from 'lucide-react';

export const VIDEO_QUALITIES: QualityOption[] = [
  { id: '1080p', label: '1080p', resolution: '1920x1080', description: 'Full HD Quality', sizeMultiplier: 18 / 60 }, // 18MB per min
  { id: '720p', label: '720p', resolution: '1280x720', description: 'HD Quality', sizeMultiplier: 10 / 60 }, // 10MB per min
  { id: '480p', label: '480p', resolution: '854x480', description: 'Standard Definition', sizeMultiplier: 5 / 60 }, // 5MB per min
  { id: '360p', label: '360p', resolution: '640x360', description: 'Data Saver', sizeMultiplier: 2.5 / 60 } // 2.5MB per min
];

export const AUDIO_QUALITIES: QualityOption[] = [
  { id: '320kbps', label: '320 kbps', bitrate: '320 kbps', description: 'Ultra CD Quality', sizeMultiplier: 2.4 / 60 }, // 2.4MB per min
  { id: '256kbps', label: '256 kbps', bitrate: '256 kbps', description: 'High Clarity', sizeMultiplier: 1.9 / 60 }, // 1.9MB per min
  { id: '192kbps', label: '192 kbps', bitrate: '192 kbps', description: 'Balanced Quality', sizeMultiplier: 1.4 / 60 }, // 1.4MB per min
  { id: '128kbps', label: '128 kbps', bitrate: '128 kbps', description: 'Standard Quality', sizeMultiplier: 0.95 / 60 } // 0.95MB per min
];

interface VideoDetailsProps {
  metadata: VideoMetadata;
  onStartDownload: (format: DownloadFormat, quality: QualityOption, estimatedSize: number) => void;
  disabled: boolean;
}

export default function VideoDetails({ metadata, onStartDownload, disabled }: VideoDetailsProps) {
  const [format, setFormat] = useState<DownloadFormat>('mp4');
  const [selectedQualityId, setSelectedQualityId] = useState<string>('');

  // Default selection when format changes
  useEffect(() => {
    if (format === 'mp4') {
      setSelectedQualityId(VIDEO_QUALITIES[0].id);
    } else {
      setSelectedQualityId(AUDIO_QUALITIES[0].id);
    }
  }, [format]);

  const currentQualities = format === 'mp4' ? VIDEO_QUALITIES : AUDIO_QUALITIES;
  const activeQuality = currentQualities.find((q) => q.id === selectedQualityId) || currentQualities[0];

  // Calculate file size: sizeMultiplier (MB/min) * duration (seconds) / 60
  const getEstimatedSize = (option: QualityOption) => {
    const minutes = metadata.duration / 60;
    const size = option.sizeMultiplier * minutes * 60; // Wait, multiplier is already per minute! So multiplier * minutes
    return Math.max(0.4, Number(size.toFixed(1)));
  };

  const handleDownloadClick = () => {
    if (disabled) return;
    const size = getEstimatedSize(activeQuality);
    onStartDownload(format, activeQuality, size);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch">
        
        {/* Left Side: Thumbnail Preview */}
        <div className="w-full md:w-[380px] shrink-0 bg-black/40 flex flex-col relative group">
          <div className="relative aspect-video md:aspect-auto md:h-full min-h-[200px] overflow-hidden bg-slate-950">
            <img
              src={metadata.thumbnailUrl}
              alt={metadata.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            
            {/* Duration badge */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/85 text-xs text-slate-100 font-mono font-medium">
              {formatDuration(metadata.duration)}
            </div>
          </div>
          
          {/* Channel Info & stats footer for Thumbnail block */}
          <div className="p-4 bg-slate-950/60 backdrop-blur-md md:absolute md:bottom-0 md:left-0 md:right-0 border-t border-white/5 flex flex-col gap-2">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Loaded Stream</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{metadata.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                <span>{metadata.likes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Options & Actions */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
          
          {/* Header info */}
          <div>
            <h2 className="text-base sm:text-lg font-sans font-bold text-slate-100 line-clamp-2 leading-snug mb-1">
              {metadata.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-5 font-sans font-medium">
              By <span className="text-cyan-400 font-semibold">{metadata.author}</span>
            </p>

            {/* Step 1: Format Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-sans font-bold text-slate-500 uppercase tracking-widest mb-2">
                Step 1: Choose Format
              </label>
              
              <div className="grid grid-cols-2 gap-2.5 p-1 bg-black/40 rounded-xl border border-white/5">
                <button
                  type="button"
                  id="select-format-mp4"
                  onClick={() => setFormat('mp4')}
                  disabled={disabled}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-sans font-bold tracking-wide transition-all ${
                    format === 'mp4'
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video (MP4)</span>
                </button>
                <button
                  type="button"
                  id="select-format-mp3"
                  onClick={() => setFormat('mp3')}
                  disabled={disabled}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-sans font-bold tracking-wide transition-all ${
                    format === 'mp3'
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Audio (MP3)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Quality selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-sans font-bold text-slate-500 uppercase tracking-widest mb-2">
                Step 2: Select Preferred Quality
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentQualities.map((opt) => {
                  const isSelected = selectedQualityId === opt.id;
                  const estimatedSize = getEstimatedSize(opt);
                  
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`quality-option-${opt.id}`}
                      onClick={() => setSelectedQualityId(opt.id)}
                      disabled={disabled}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-slate-950 border-cyan-500/80 text-slate-100 shadow-md ring-1 ring-cyan-500/30'
                          : 'bg-black/30 hover:bg-slate-950 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-sans font-bold flex items-center gap-1 text-slate-200">
                          {opt.label}
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans mt-0.5">
                          {opt.resolution || opt.bitrate} • {opt.description}
                        </span>
                      </div>
                      
                      <div className="px-2.5 py-1 rounded bg-black/40 text-[10px] font-mono font-semibold border border-white/5 text-cyan-400 shadow-inner">
                        ~{estimatedSize} MB
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Call to action & metadata */}
          <div className="pt-4 border-t border-white/5 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-widest">Selected Configuration</p>
                <p className="text-xs text-slate-300 font-medium">
                  {format === 'mp4' ? 'MP4 Video' : 'MP3 Audio'} • {activeQuality.label} (~{getEstimatedSize(activeQuality)} MB)
                </p>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                ETA: ~<span className="font-mono text-slate-400">{(getEstimatedSize(activeQuality) / 12).toFixed(1)}s</span> at 12 MB/s
              </p>
            </div>

            <button
              type="button"
              id="start-download-button"
              onClick={handleDownloadClick}
              disabled={disabled}
              className="w-full py-3.5 rounded-xl btn-gradient text-white font-sans font-bold text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <DownloadIcon format={format} />
              <span>Initiate High-Speed Fetch ({format.toUpperCase()})</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function DownloadIcon({ format }: { format: DownloadFormat }) {
  return format === 'mp4' ? (
    <Video className="w-4 h-4 shrink-0" />
  ) : (
    <Music className="w-4 h-4 shrink-0" />
  );
}
