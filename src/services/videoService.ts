import { supabase } from '../lib/supabase';
import type { Video } from '../types';

export async function fetchVideos(
  page = 0,
  limit = 10,
  searchQuery = ''
): Promise<{ data: Video[] | null; error: Error | null }> {
  try {
    console.log('Fetching videos with params:', { page, limit, searchQuery });
    
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    
    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    
    console.log('Supabase response:', { data, error });

    if (error) {
      throw error;
    }

    if (!data) {
      console.log('No data returned from Supabase');
      return { data: [], error: null };
    }

    console.log('Raw video data:', data);

    const videos = data.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description || '',
      duration: Number(video.duration),
      thumbnailUrl: video.thumbnail_url || '',
      videoUrl: video.video_url,
      userId: video.user_id || '',
      createdAt: video.created_at
    }));

    console.log('Processed videos:', videos);
    return { data: videos, error: null };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { data: null, error: error as Error };
  }
}

export async function fetchVideoById(
  id: string
): Promise<{ data: Video | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return { data: null, error: null };
    }

    const video: Video = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      duration: Number(data.duration),
      thumbnailUrl: data.thumbnail_url || '',
      videoUrl: data.video_url,
      userId: data.user_id || '',
      createdAt: data.created_at
    };

    return { data: video, error: null };
  } catch (error) {
    console.error('Error fetching video:', error);
    return { data: null, error: error as Error };
  }
}

export async function fetchRelatedVideos(
  currentVideoId: string,
  limit = 5
): Promise<{ data: Video[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .neq('id', currentVideoId)
      .limit(limit);

    if (error) {
      throw error;
    }

    const videos = data.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description || '',
      duration: Number(video.duration),
      thumbnailUrl: video.thumbnail_url || '',
      videoUrl: video.video_url,
      userId: video.user_id || '',
      createdAt: video.created_at
    }));

    return { data: videos, error: null };
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return { data: null, error: error as Error };
  }
}

export async function incrementViews(
  videoId: string
): Promise<{ data: any; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .rpc('increment_video_views', { video_id: videoId });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { data: null, error: error as Error };
  }
}