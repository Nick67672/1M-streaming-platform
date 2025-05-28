import React from 'react';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';
import type { Video } from '../../types';

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
  error: Error | null;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading, error }) => {
  const renderContent = () => {
    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
          <p className="text-red-500 mb-2">Failed to load videos</p>
          <p className="text-gray-400">{error.message}</p>
        </div>
      );
    }

    if (loading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ));
    }

    if (videos.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
          <p className="text-xl mb-2">No videos found</p>
          <p className="text-gray-400">Try a different search term</p>
        </div>
      );
    }

    return videos.map((video) => (
      <VideoCard key={video.id} video={video} />
    ));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {renderContent()}
    </div>
  );
};

export default VideoGrid;