import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoCard from '../components/video/VideoCard';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchVideoById, 
  fetchRelatedVideos, 
  incrementViews
} from '../services/videoService';
import type { Video } from '../types';

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch video and increment view count
  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await fetchVideoById(id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setVideo(data);
          
          // Increment view count
          await incrementViews(id);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVideo();
  }, [id]);
  
  // Fetch related videos
  useEffect(() => {
    const loadRelatedVideos = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await fetchRelatedVideos(id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setRelatedVideos(data);
        }
      } catch (err) {
        console.error('Error loading related videos:', err);
      }
    };
    
    loadRelatedVideos();
  }, [id]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03A9F4]"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !video) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Video not found</h2>
            <p className="text-gray-400 mb-4">
              {error?.message || 'The requested video could not be loaded.'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Video Player */}
            <VideoPlayer 
              videoUrl={video.videoUrl} 
              title={video.title} 
              autoPlay={true}
            />
            
            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="flex items-center justify-between mt-2 pb-4 border-b border-gray-800">
                <div className="text-gray-400">
                  {formatDate(video.createdAt)}
                </div>
                
                <div className="flex space-x-4">
                  <button className="flex items-center text-gray-400 hover:text-[#03A9F4] transition-colors">
                    <ThumbsUp size={20} className="mr-1" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center text-gray-400 hover:text-[#03A9F4] transition-colors">
                    <ThumbsDown size={20} className="mr-1" />
                    <span>Dislike</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Video Description */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300 whitespace-pre-line">
                {video.description}
              </p>
            </div>
          </div>
          
          {/* Related Videos */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.length === 0 ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#03A9F4]"></div>
                </div>
              ) : (
                relatedVideos.map((relatedVideo) => (
                  <VideoCard key={relatedVideo.id} video={relatedVideo} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoPage;