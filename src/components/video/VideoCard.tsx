import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';
import type { Video } from '../../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link 
      to={`/video/${video.id}`} 
      className="group rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-[#03A9F4]/10"
    >
      <div className="relative aspect-video">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
          <div className="bg-[#03A9F4] rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play size={24} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-medium mb-1 line-clamp-2 group-hover:text-[#03A9F4] transition-colors">
          {video.title}
        </h3>
      </div>
    </Link>
  );
};

export default VideoCard;