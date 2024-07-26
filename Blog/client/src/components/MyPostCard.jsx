import { Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function MyPostCard({ post, postList, setPostsList }) {
    const [status, setStatus] = useState(post.status);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    useEffect(() => {
        const changeStatus = async() => {
            try {
                const res = await fetch(`/api/post/updatepost/${post._id}/${post.userId}?status=${status}`, {
                    method: 'PUT'
                });
                const data = await res.json();
                if(res.ok){
                    const newPost = postList.find((value) => {
                        if(value._id===data._id){
                            value.status = data.status;
                        }
                    });
                    
                    // console.log(newPost);
                    // setPostsList(postList.map((myPost) => myPost._id===post._id ? myPost.status = data.status : null))
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        changeStatus();
    }, [status]);

    return (
        <Card className="m-10 hover:shadow-lg shadow-none">
                    <div className="flex justify-between p-8 pb-0">
                        <Link to={`/post/${post.slug}`}>
                            <div className="flex justify-start items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</h1>
                                <span className="italic text-sm">{post.category}</span>
                            </div>
                        </Link>
                        <Button className={`p-1 sm:inline place-self-end text-center`} gradientDuoTone={post.status==='published' ? `purpleToPink` : `greenToBlue`}
                         onClick={() => {
                            post.status==='published' ? setStatus('draft') : setStatus('published');
                        }}>{post.status==='published' ? 'Save as Draft?' : 'Publish?'}</Button>
                    </div>
                    <p className="text-sm text-gray-500 px-8">Posted on {new Date(post.updatedAt).toLocaleDateString("en-US", options)}</p>
                    <Link to={`/post/${post.slug}`}>
                <div className="flex justify-between px-8">
                    <div className="px-3 py-1 flex flex-col gap-2">
                        <div className="max-w-2xl mx-auto w-full post-content"
                        dangerouslySetInnerHTML={{ __html: post && post.content }} />
                        <span className="italic text-sm">{post && (post?.content?.length / 1000).toFixed(0)} mins read</span>
                    </div>
                    <img src={post.image} alt={post.title} className="h-[150px] w-[250px] mb-10 object-cover group-hover:h-[200px] transition-all duration-300 z-20" />
                </div>
                </Link>
        </Card>
    )
}
