import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const [post, setPost] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentPosts, setRecentPosts] = useState([]);
    const { postslug } = useParams();

    useEffect(() => {
        const fetchPost = async() => {
            try {
                setLoading(true);
                setError(null)
                const res = await fetch(`/api/post/getposts?slug=${postslug}`);
                const data = await res.json();
                if(!res.ok){
                    setError(data.message);
                    setLoading(false);
                    return;
                }
                setError(null);
                setLoading(null);
                setPost(data.posts[0])
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postslug]);

    useEffect(() => {
        try {
          const fetchRecentPosts = async () => {
            const res = await fetch(`/api/post/getposts?limit=4`);
            const data = await res.json();
            if (res.ok) {
                data.posts.filter((recentPosts) => recentPosts._id !== post._id);
                if(data.posts.length===4){
                    data.posts.splice(3);
                }
              setRecentPosts(data.posts);
            }
          };
          fetchRecentPosts();
        } catch (error) {
          console.log(error.message);
        }
      }, []);

    if(loading){
        return(
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size='xl' />
            </div>
        )
    }

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
                {post && post.title}
            </h1>
            <Link className='self-center mt-5'>
                <Button color={'gray'} pill size={'xs'}>{post && post.category}</Button>
            </Link>
            <img src={post.image} alt={post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post?.content?.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className="p-3 max-w-2xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }} />
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />
            <div className="flex flex-col grid-cols-3 justify-center items-center mb-5">
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentPosts && recentPosts.map((displayPost) => <PostCard key={displayPost._id} post={displayPost} />)}
                </div>
            </div>
        </main>
    )
}
