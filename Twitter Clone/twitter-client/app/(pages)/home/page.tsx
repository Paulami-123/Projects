"use client"

import FeedCard from '@/components/FeedCard';
import PostCard from '@/components/PostCard';
import { Post } from '@/gql/graphql';
import { useGetAllPosts } from '@/hooks/post';
import { useCurrentUser } from '@/hooks/user';
import React from 'react'

export default function Home() {
  const { user } = useCurrentUser();
  const { posts = [] } = useGetAllPosts();
  
  return (
    <>
      {user && (
        <div>
          <PostCard />
        </div>
      )}
      {posts && posts.map((post) => post ? <FeedCard key={post?.id} post={post as Post} /> : null)}
    </>
  )

}
