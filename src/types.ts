export interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  url: string;
  views: string;
  likes: string;
}

export type DownloadFormat = 'mp4' | 'mp3';

export interface QualityOption {
  id: string;
  label: string;
  resolution?: string;
  bitrate?: string;
  description: string;
  sizeMultiplier: number; // MB per minute of video
}

export type DownloadStatus = 'idle' | 'analyzing' | 'ready' | 'downloading' | 'completed' | 'error';

export interface DownloadProgress {
  status: DownloadStatus;
  progress: number; // 0 to 100
  speed: number; // in MB/s
  eta: number; // in seconds
  phase: string;
  downloadedSize: number; // in MB
  totalSize: number; // in MB
  error?: string;
}

export interface HistoryItem {
  id: string;
  videoId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  format: DownloadFormat;
  quality: string;
  fileSize: string;
  timestamp: number;
}
