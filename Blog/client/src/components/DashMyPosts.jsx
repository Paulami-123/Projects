import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MyPostCard from './MyPostCard';

export default function DashMyPosts() {
    const [myPosts, setMyPosts] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchMyPosts = async() => {
            try {
                console.log("Current User: ",currentUser);
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if(res.ok){
                    setMyPosts(data.posts);
                    return;
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchMyPosts();
    }, [currentUser._id]);
  return (
    <div className='p-10 w-full'>
    {currentUser && myPosts.length>0 ? (
        <div className='p-10 w-full'>
            {myPosts.map((myPost) => (
                <MyPostCard key={myPost._id} post={myPost} postList = {myPosts} setPostsList={setMyPosts} />
            ))}
        </div>
    ) : (
        <p>You have no posts yet!</p>
    )}
    </div>
  )
}
