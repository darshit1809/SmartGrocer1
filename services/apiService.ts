import { Post } from '../types/post';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
