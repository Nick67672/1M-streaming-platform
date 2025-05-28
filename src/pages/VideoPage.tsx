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
  incrementViews,
  fetchComments,
  addComment 
} from '../services/videoService';
import type { Video, Comment } from '../types';

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
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
  
  // Fetch comments
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await fetchComments(id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setComments(data);
        }
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };
    
    loadComments();
  }, [id]);
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user || !newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      
      const { data, error } = await addComment(newComment, id, user.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add the new comment to the list
        setComments((prev) => [data, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };
  
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
            
            {/* Comments */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                {comments.length} Comments
              </h3>
              
              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#03A9F4] flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#03A9F4] focus:border-transparent text-white"
                        rows={2}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || submittingComment}
                          className="bg-[#03A9F4] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {submittingComment ? 'Posting...' : 'Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <p className="text-gray-400">
                    Please <a href="/auth" className="text-[#03A9F4]">sign in</a> to comment.
                  </p>
                </div>
              )}
              
              {/* Comment List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-center py-6">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        {comment.user?.avatarUrl ? (
                          <img 
                            src={comment.user.avatarUrl}
                            alt={comment.user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-white">
                            {comment.user?.username || 'User'}
                          </h4>
                          <span className="ml-2 text-sm text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-300">
                          {comment.content}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <button className="text-gray-400 hover:text-white text-sm flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            <span>Like</span>
                          </button>
                          <button className="text-gray-400 hover:text-white text-sm flex items-center">
                            <ThumbsDown size={14} className="mr-1" />
                            <span>Dislike</span>
                          </button>
                          <button className="text-gray-400 hover:text-white text-sm">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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