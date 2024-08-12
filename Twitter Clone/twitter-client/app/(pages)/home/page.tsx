"use client"

import { getAllPosts } from '@/SSR/post';
import FeedCard from '@/components/FeedCard';
import PostCard from '@/components/PostCard';
import { Post } from '@/gql/graphql';
import { useCurrentUser } from '@/hooks/user';
import React, { useEffect, useState } from 'react';

interface PostProps {
  data: Post[]
}

export default function HomePage() {
  const { user} = useCurrentUser();
  const [posts, setPosts] = useState<PostProps>();
  useEffect (() => {
    const fetchPosts = async() => {
      try{
        const { props } = await getAllPosts();
        setPosts(props);
      } catch(err){
        console.log(err);
      }
    }
    fetchPosts();
  }, [])
  
  return (
    <>
      {user && (
        <div>
          <PostCard />
        </div>
      )}
      {posts?.data?.map((post) => post ? <FeedCard key={post?.id} post={post as Post} /> : null)}
    </>
  )

}