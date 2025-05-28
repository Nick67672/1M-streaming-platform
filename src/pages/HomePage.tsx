import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import VideoGrid from '../components/video/VideoGrid';
import { fetchVideos } from '../services/videoService';
import type { Video } from '../types';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const loadVideos = useCallback(async (reset = false) => {
    const newPage = reset ? 0 : page;
    const loadingStateSetter = reset ? setLoading : setLoadingMore;
    
    try {
      loadingStateSetter(true);
      setError(null);
      
      const { data, error } = await fetchVideos(newPage, 12, searchQuery);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        if (reset) {
          setVideos(data);
        } else {
          setVideos((prev) => [...prev, ...data]);
        }
        
        setHasMore(data.length === 12);
        
        if (!reset) {
          setPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      loadingStateSetter(false);
    }
  }, [page, searchQuery]);
  
  // Initial load
  useEffect(() => {
    setPage(0);
    loadVideos(true);
  }, [searchQuery]);
  
  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading &&
        !loadingMore &&
        hasMore
      ) {
        loadVideos();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, hasMore, loadVideos]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {searchQuery && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Search Results: "{searchQuery}"
            </h1>
            <p className="text-gray-400">
              {!loading && `Showing ${videos.length} results`}
            </p>
          </div>
        )}
        
        <VideoGrid videos={videos} loading={loading} error={error} />
        
        {loadingMore && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#03A9F4]"></div>
          </div>
        )}
        
        {!hasMore && videos.length > 0 && (
          <p className="text-center text-gray-400 mt-8">
            No more videos to load
          </p>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;