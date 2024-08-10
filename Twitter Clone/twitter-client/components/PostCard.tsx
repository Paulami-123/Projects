import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { supabase } from "@/supabase";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const PostCard: React.FC = () => {
    const { user } = useCurrentUser();
    const [val, setVal] = useState("");
    const [content, setContent] = useState('');
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [imagesURL, setImagesURL] = useState<string[]>([]);
    const [files, setFiles] = useState<FileList|null>();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, val);

    const { mutateAsync } = useCreatePost();

    const handleSelectImage = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('multiple', '');
        const handlerFn = handleUploadImages(input);
        input.addEventListener("change", handlerFn);
        input.click();
    }, []);

    const handleUploadImages = useCallback((input: HTMLInputElement) => {
        return async(event: Event) => {
            event.preventDefault();
            const fileList = input.files;
            if(fileList){
                setFiles(fileList);
                Array.from(fileList).map((file) => {
                    setPreviewImages(previewImages => [...previewImages, URL.createObjectURL(file)])
                });
            }

        }
    }, [handleSelectImage]);

    useEffect(() => {
        const createPost = async() =>{
            await mutateAsync({
                content,
                postImages: imagesURL
            });
            setContent('');
            setImagesURL([]);
            setFiles(null);
            setPreviewImages([]);
        }
        if(files?.length===imagesURL.length){
            createPost();
        }
    }, [imagesURL]);

    const handleCreatePost = async() => {
        if(files){
            Array.from(files).map(async(file) => {
                const fileName = 'Image_'+new Date().getTime().toString() +file.name;
                const { data } = await supabase.storage.from('twitter-images').upload(fileName, file);
                if(data){
                    const url = supabase.storage.from('twitter-images').getPublicUrl(fileName);
                    setImagesURL((prev) => [...prev, url.data.publicUrl]);
                }
                else{
                    toast.error(`Error while uploading ${file.name}`);
                    return;
                }
            });
        }
    };

    return(
        <div className="border border-t border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-1">
                    {user?.profileImageURL && (
                        <div className="pt-1.5">
                            <img src={user?.profileImageURL} alt="user-image" className="object-fill w-full h-10 rounded-full" />
                        </div>
                    )}
                </div>
                <div className="col-span-11 text-white mt-2">
                    <textarea className="outline-none w-full bg-transparent text-xl" placeholder="What is happening?!"
                     rows={1} ref={textAreaRef} onChange={(e) => {
                        setVal(e.target.value)
                        setContent(e.target.value);
                     }} value={content} />
                    <div className="grid grid-cols-2 md:grid-cols-3 h-auto w-full">
                        {previewImages && previewImages.map((img) => (
                            <div className="relative" key={img}>
                                <Image src={img} alt="image" width={150} height={150} className="rounded-lg py-2" />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1 items-center text-blue-400 pt-4 pb-3 border-b border-gray-600">
                        <FaGlobeAmericas size={14} />
                        <p className="text-sm">Everyone can reply</p>
                    </div>
                    <div className="flex justify-between mt-3">
                        <div className="flex justify-start gap-3 font-bold text-xl text-blue-400 items-center">
                            <AiOutlinePicture title="Media" onClick={handleSelectImage} />
                            <HiMiniGif title="GIF" />
                            <TbListDetails title="Poll" className="hidden md:block" />
                            <PiSmiley title="Emoji" />
                            <RiCalendarScheduleLine title="Schedule" className="hidden md:block" />
                            <CiLocationOn title="Location" />
                        </div>
                        <div className="flex justify-between items-center gap-3 pl-3 border-l border-gray-600">
                            <IoIosAddCircleOutline title="Add" className="font-bold text-2xl text-blue-400" />
                            <button className="bg-blue-400 hover:bg-[#5496e8] py-2 px-5 text-sm font-bold rounded-full" onClick={() => {
                                content.length>0 ? handleCreatePost(): toast.error('Add some content.')
                            }}>
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