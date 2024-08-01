import React, { useCallback, useRef, useState } from "react";
import Image from 'next/image';
import { useCurrentUser } from "@/hooks/user";
import useAutosizeTextArea from "@/hooks/autoResize";
import { FaGlobeAmericas } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { HiMiniGif } from "react-icons/hi2";
import { CiLocationOn } from "react-icons/ci";
import { PiSmiley } from "react-icons/pi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbListDetails } from "react-icons/tb";
import { useCreatePost } from "@/hooks/post";

const PostCard: React.FC = () => {
    const { user } = useCurrentUser();
    const [val, setVal] = useState("");
    const [content, setContent] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, val);

    const { mutate } = useCreatePost()

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = evt.target?.value;
    
        setVal(value);
    };

    const handleSelectImage = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    }, []);

    const handleCreatePost = useCallback(() => {
        mutate({
            content,
        })
    }, [content, mutate]);

    return(
        <div className="border border-t border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-1">
                    {user?.profileImageURL && (
                        <Image src={user?.profileImageURL}
                        alt="user-image" height={50} width={50} className="rounded-full" />
                    )}
                </div>
                <div className="col-span-11 text-white mt-2">
                    <textarea className="outline-none w-full bg-transparent text-xl" placeholder="What is happening?!"
                     rows={1} ref={textAreaRef} onChange={(e) => {
                        handleChange;
                        setVal(e.target.value)
                        setContent(e.target.value);
                     }} value={content} />
                    <div className="flex gap-1 items-center text-blue-400 pt-4 pb-3 border-b border-gray-600">
                        <FaGlobeAmericas size={14} />
                        <p className="text-sm">Everyone can reply</p>
                    </div>
                    <div className="flex justify-between mt-3">
                        <div className="flex justify-start gap-3 font-bold text-xl text-blue-400 items-center">
                            <AiOutlinePicture title="Media" onClick={handleSelectImage} />
                            <HiMiniGif title="GIF" />
                            <TbListDetails title="Poll" />
                            <PiSmiley title="Emoji" />
                            <RiCalendarScheduleLine title="Schedule" />
                            <CiLocationOn title="Location" />
                        </div>
                        <div className="flex justify-between items-center gap-3 pl-3 border-l border-gray-600">
                            <IoIosAddCircleOutline title="Add" className="font-bold text-2xl text-blue-400" />
                            <button className="bg-blue-400 hover:bg-[#5496e8] py-2 px-5 text-sm font-bold rounded-full" onClick={handleCreatePost}>
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard;