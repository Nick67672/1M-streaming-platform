import { supabase } from '../lib/supabase';
import type { Video, Comment } from '../types';

// Dummy data for development
const dummyVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    description: 'Learn the basics of React Hooks and how to use them in your applications.',
    duration: 1250,
    thumbnailUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    videoUrl: 'https://example.com/video1.mp4',
    userId: 'user1',
    createdAt: '2025-05-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Building a REST API with Node.js',
    description: 'Complete guide to building RESTful APIs using Node.js and Express.',
    duration: 2400,
    thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
    videoUrl: 'https://example.com/video2.mp4',
    userId: 'user2',
    createdAt: '2025-05-19T15:30:00Z'
  },
  {
    id: '3',
    title: 'TypeScript for Beginners',
    description: 'Getting started with TypeScript in your web development projects.',
    duration: 1800,
    thumbnailUrl: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg',
    videoUrl: 'https://example.com/video3.mp4',
    userId: 'user1',
    createdAt: '2025-05-18T09:15:00Z'
  },
  {
    id: '4',
    title: 'CSS Grid Layout Tutorial',
    description: 'Master CSS Grid Layout with practical examples.',
    duration: 1500,
    thumbnailUrl: 'https://images.pexels.com/photos/11035482/pexels-photo-11035482.jpeg',
    videoUrl: 'https://example.com/video4.mp4',
    userId: 'user3',
    createdAt: '2025-05-17T14:20:00Z'
  },
  {
    id: '5',
    title: 'Modern JavaScript Features',
    description: 'Explore the latest features in JavaScript ES2022.',
    duration: 2100,
    thumbnailUrl: 'https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg',
    videoUrl: 'https://example.com/video5.mp4',
    userId: 'user2',
    createdAt: '2025-05-16T11:45:00Z'
  },
  {
    id: '6',
    title: 'Full Stack Development Guide',
    description: 'Complete guide to becoming a full stack developer.',
    duration: 3600,
    thumbnailUrl: 'https://images.pexels.com/photos/11035390/pexels-photo-11035390.jpeg',
    videoUrl: 'https://example.com/video6.mp4',
    userId: 'user1',
    createdAt: '2025-05-15T16:30:00Z'
  }
];

export async function fetchVideos(
  page = 0,
  limit = 10,
  searchQuery = ''
): Promise<{ data: Video[] | null; error: Error | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    let filteredVideos = [...dummyVideos];
    
    if (searchQuery) {
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const paginatedVideos = filteredVideos.slice(page * limit, (page + 1) * limit);
    return { data: paginatedVideos, error: null };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { data: null, error: error as Error };
  }
}

export async function fetchVideoById(
  id: string
): Promise<{ data: Video | null; error: Error | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const video = dummyVideos.find(v => v.id === id);
    return { data: video || null, error: null };
  } catch (error) {
    console.error('Error fetching video:', error);
    return { data: null, error: error as Error };
  }
}

export async function fetchRelatedVideos(
  currentVideoId: string,
  limit = 5
): Promise<{ data: Video[] | null; error: Error | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    const relatedVideos = dummyVideos
      .filter(video => video.id !== currentVideoId)
      .slice(0, limit);
    return { data: relatedVideos, error: null };
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return { data: null, error: error as Error };
  }
}

export async function incrementViews(
  videoId: string
): Promise<{ data: any; error: Error | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    // For now, just return a success message
    // In a real implementation, this would update the view count in the database
    return { data: { message: 'View incremented' }, error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { data: null, error: error as Error };
  }
}

export async function fetchComments(
  videoId: string
): Promise<{ data: Comment[] | null; error: Error | null }> {
  // Return empty comments for now
  return { data: [], error: null };
}

export async function addComment(
  content: string,
  videoId: string,
  userId: string
): Promise<{ data: Comment | null; error: Error | null }> {
  // Simulate adding a comment
  const newComment: Comment = {
    id: Math.random().toString(),
    content,
    userId,
    videoId,
    createdAt: new Date().toISOString(),
  };
  return { data: newComment, error: null };
}