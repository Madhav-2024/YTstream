import { useState, useEffect } from 'react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import VideoDetails from './components/VideoDetails';
import DownloadStatusCard from './components/DownloadStatusCard';
import DownloadHistory from './components/DownloadHistory';
import FaqSection from './components/FaqSection';
import { VideoMetadata, DownloadProgress, DownloadFormat, QualityOption, HistoryItem } from './types';
import { fetchVideoMetadata, generateMockFile } from './utils/youtube';
import { Heart, Laptop, Sparkles } from 'lucide-react';

export default function App() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{ format: DownloadFormat; qualityLabel: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    status: 'idle',
    progress: 0,
    speed: 0,
    eta: 0,
    phase: '',
    downloadedSize: 0,
    totalSize: 0
  });

  // Load download history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ytstream_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  const handleAnalyzeUrl = async (url: string) => {
    setIsAnalyzing(true);
    setMetadata(null);
    setDownloadProgress({
      status: 'idle',
      progress: 0,
      speed: 0,
      eta: 0,
      phase: '',
      downloadedSize: 0,
      totalSize: 0
    });

    try {
      const result = await fetchVideoMetadata(url);
      setMetadata(result);
    } catch (error) {
      console.error(error);
      setDownloadProgress({
        status: 'error',
        progress: 0,
        speed: 0,
        eta: 0,
        phase: '',
        downloadedSize: 0,
        totalSize: 0,
        error: error instanceof Error ? error.message : 'Failed to retrieve YouTube video streams.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartDownload = (format: DownloadFormat, quality: QualityOption, estimatedSize: number) => {
    if (!metadata) return;

    setSelectedConfig({ format, qualityLabel: quality.label });
    setDownloadProgress({
      status: 'downloading',
      progress: 0,
      speed: 12.5,
      eta: estimatedSize / 12.5,
      phase: 'Handshaking socket with YouTube CDN...',
      downloadedSize: 0,
      totalSize: estimatedSize
    });

    let currentDownloaded = 0;
    const total = estimatedSize;

    const interval = setInterval(() => {
      // Fluctuate speed between 9 MB/s and 19 MB/s for network simulation realism
      const currentSpeed = 9 + Math.random() * 10;
      // Interval triggers every 150ms (0.15s), so downloaded bytes = speed * 0.15
      const chunk = currentSpeed * 0.15;
      
      currentDownloaded = Math.min(total, currentDownloaded + chunk);
      const percent = (currentDownloaded / total) * 100;
      const remainingTime = Math.max(0, (total - currentDownloaded) / currentSpeed);

      let currentPhase = 'Downloading video stream chunks...';
      if (percent < 20) {
        currentPhase = 'Resolving media stream parameters...';
      } else if (percent < 45) {
        currentPhase = 'Fetching and decrypting audio/video frames...';
      } else if (percent < 70) {
        currentPhase = 'Synchronizing audio buffers with digital track...';
      } else if (percent < 90) {
        currentPhase = 'Wrapping streams inside file wrapper container...';
      } else {
        currentPhase = 'Finalizing codec indexes...';
      }

      setDownloadProgress((prev) => {
        if (prev.status !== 'downloading') {
          clearInterval(interval);
          return prev;
        }

        if (currentDownloaded >= total) {
          clearInterval(interval);

          // Build actual file blob & download it directly in the browser
          setTimeout(() => {
            const blob = generateMockFile(metadata.title, total, format, quality.label);
            const downloadUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${metadata.title}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            // Save item to history
            const newHistoryItem: HistoryItem = {
              id: Math.random().toString(36).substring(2, 11),
              videoId: metadata.id,
              title: metadata.title,
              author: metadata.author,
              thumbnailUrl: metadata.thumbnailUrl,
              format,
              quality: quality.label,
              fileSize: `${total.toFixed(1)} MB`,
              timestamp: Date.now()
            };

            setHistory((prevHistory) => {
              const updated = [newHistoryItem, ...prevHistory];
              localStorage.setItem('ytstream_history', JSON.stringify(updated));
              return updated;
            });

            setDownloadProgress((finalPrev) => ({
              ...finalPrev,
              status: 'completed',
              progress: 100,
              downloadedSize: total,
              phase: 'Download triggered successfully!'
            }));
          }, 300);

          return {
            ...prev,
            progress: 100,
            downloadedSize: total,
            eta: 0,
            phase: 'Assembling output binary blocks...'
          };
        }

        return {
          ...prev,
          progress: percent,
          downloadedSize: currentDownloaded,
          speed: currentSpeed,
          eta: remainingTime,
          phase: currentPhase
        };
      });
    }, 150);
  };

  const handleReset = () => {
    setDownloadProgress({
      status: 'idle',
      progress: 0,
      speed: 0,
      eta: 0,
      phase: '',
      downloadedSize: 0,
      totalSize: 0
    });
    setSelectedConfig(null);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('ytstream_history');
    setHistory([]);
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem('ytstream_history', JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="min-h-screen immersive-bg text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-cyan-500/30 selection:text-white">
      {/* Visual background gradient accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Main Header */}
        <Header />

        {/* Input area */}
        <UrlInput onAnalyze={handleAnalyzeUrl} isLoading={isAnalyzing} />

        {/* Loading details state indicator */}
        {isAnalyzing && (
          <div className="w-full max-w-lg mx-auto p-8 text-center flex flex-col items-center justify-center animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <p className="text-sm text-slate-300 font-sans font-medium">Analyzing YouTube Stream Metadata...</p>
            <p className="text-xs text-slate-500 font-mono mt-1">Contacting CDN descriptors & assembling quality tiers</p>
          </div>
        )}

        {/* Download details panel or progress view */}
        {metadata && downloadProgress.status === 'idle' && (
          <VideoDetails
            metadata={metadata}
            onStartDownload={handleStartDownload}
            disabled={downloadProgress.status === 'downloading'}
          />
        )}

        {/* Progress & final status visual card */}
        {downloadProgress.status !== 'idle' && selectedConfig && (
          <DownloadStatusCard
            progress={downloadProgress}
            videoTitle={metadata?.title || 'YouTube Stream'}
            format={selectedConfig.format}
            qualityLabel={selectedConfig.qualityLabel}
            onReset={handleReset}
          />
        )}

        {/* Simple global Error fallback card when URL fails to load */}
        {downloadProgress.status === 'error' && !metadata && (
          <div className="w-full max-w-2xl mx-auto px-4 mb-8">
            <div className="glass-card rounded-3xl p-6 sm:p-8 text-center shadow-xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">!</span>
              </div>
              <h3 className="text-base font-sans font-bold text-slate-200 mb-1">Stream Analysis Interrupted</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                {downloadProgress.error || 'A secure digital socket connection could not be established with YouTube servers.'}
              </p>
              <button
                type="button"
                id="reset-analyser-button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition animate-fade-in"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Historical Downloads List */}
        <DownloadHistory
          items={history}
          onClear={handleClearHistory}
          onRemoveItem={handleRemoveHistoryItem}
        />

        {/* FAQs info guide */}
        <FaqSection />
      </div>

      {/* Understated minimalist footer */}
      <footer className="relative z-10 w-full py-6 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md text-center text-[10px] text-slate-600 font-sans tracking-wide">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 YTStream. Standard Media extraction system. No cookies are stored.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400 animate-pulse" />
            <span>using React & Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
