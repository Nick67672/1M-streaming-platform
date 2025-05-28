import React from 'react';

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 animate-pulse">
      <div className="aspect-video bg-gray-700"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;