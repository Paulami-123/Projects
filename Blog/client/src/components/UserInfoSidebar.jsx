import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function UserInfoSidebar({authorId}) {
    const [author, setAuthor] = useState({});

    useEffect(() => {
        const fetchAuthor = async() => {
            try {
                const res = await fetch(`/api/user/${authorId}`);
                const data = await res.json();
                console.log("AuthorId", authorId);
                console.log("Data: ", data);
                if(res.ok){
                  setAuthor(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchAuthor();
    }, [authorId]);
    
    return (
        <div className="invisible lg:visible">
            <div className="m-10">
            <div className="font-semibold text-lg">Author</div>
            <div className="flex justify-start gap-3 items-center py-4">
                <div className="m-2">
                <img src={author.profilePicture} alt={author.username} className='w-24 rounded-full' />
                </div>
                <div className="pl-2">
                <div className="font-bold text-lg">{author.username}</div>
                {author.about ? (
                    <div className="text-slate-400">{author.about}</div>
                ) : (
                    <div className=''>Hello, I'm {author.username}. Hope you enjoy my blog.</div>
                )}
                </div>
            </div>
            </div>
        </div>
    )
}
