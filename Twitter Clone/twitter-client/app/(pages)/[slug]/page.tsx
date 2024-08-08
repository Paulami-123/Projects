"use client"

import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import { Post } from "@/gql/graphql";
import { getUserByUsernameQuery } from "@/graphql/query/user";
import { useCurrentUser, useUpdateUser } from "@/hooks/user";
import { Modal } from "flowbite-react";
import Image from "next/image";
import { notFound, usePathname } from "next/navigation";
import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { TbCameraPlus } from "react-icons/tb";
import { saveAs } from 'file-saver';
import { ref } from "vue";
import { supabase } from "@/supabase";
import toast from "react-hot-toast";

interface ServerProps {
    username: string
    id: string
    name: string
    about: string
    profileImageURL: string
    coverImageURL: string
    createdAt: string
    posts: Post[]
}

interface EditInformation {
    id: string
    name: string
    about: string
    coverImageURL: string
    profileImageURL: string
}

interface ImageTypeOptions {
    type: 'cover' | 'profile'
}

const UserProfilePage = () =>{
    const { user } = useCurrentUser();
    const [userData, setUserData] = useState<ServerProps>();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [imageType, setImageType] = useState<ImageTypeOptions>({type: 'cover'});
    const [profileFile, setProfileFile] = useState<File>();
    const [coverFile, setCoverFile] = useState<File>();
    const { mutateAsync } = useUpdateUser();
    const [editData, setEditData] = useState<EditInformation>({
        id: '',
        name: '',
        about: '',
        coverImageURL: '#',
        profileImageURL: '#'
    });

    const pathname = usePathname();
        if(!pathname){
            notFound();
        }
    useEffect(() => {
        async function getData(username: string) {
            const res:any = await graphqlClient.request(getUserByUsernameQuery, { username: username });
            if(!res){
                notFound();
            }
            setUserData(res.getUserByUsername);
            setEditData({
                id: userData?.id || '',
                name: userData?.name || '',
                about: userData?.about || '',
                profileImageURL: userData?.profileImageURL || '#',
                coverImageURL: userData?.coverImageURL || '#'
            });
        }
        getData(pathname.substring(1));
    }, []);
    
    const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
        return async(event: Event) => {
            event.preventDefault();
            const file = input.files?.item(0);
            if(file){
                if(imageType.type==='cover'){
                    setCoverFile(file);
                    setEditData({...editData, coverImageURL: URL.createObjectURL(file)});
                }
                else if(imageType.type==='profile'){
                    setProfileFile(file);
                    setEditData({...editData, profileImageURL: URL.createObjectURL(file)});
                }
            }
        }
    }, []);

    const handleSelectImage = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
    
        const handlerFn = handleInputChangeFile(input);
    
        input.addEventListener("change", handlerFn);
    
        input.click();
      }, [handleInputChangeFile]);

      const generateURL = async(file: File, image: ImageTypeOptions) => {
        const fileName = 'Image_'+new Date().getTime().toString() +file.name;
        const { data } = await supabase.storage.from('twitter-images').upload(fileName, file);
        if(data){
            const url = supabase.storage.from('twitter-images').getPublicUrl(fileName);
            if(image.type==='cover'){
                setEditData({...editData, coverImageURL: url.data.publicUrl});
            }
            else{
                setEditData({...editData, profileImageURL: url.data.publicUrl});
            }
        }
        else{
            toast.error(`Error while uploading image ${file.name}`);
        }
      }
    
      const handleSubmit = useCallback(async() => {
        if(profileFile){
            await generateURL(profileFile, {type: 'profile'});
        }
        if(coverFile){
            await generateURL(coverFile, {type: 'cover'});
        }
        await mutateAsync({
            data: editData
        });
        setEditData({id: '', name: '', about: '', profileImageURL: '', coverImageURL: ''});
      }, [mutateAsync])

    return(
        <div>
            <div>
                <nav className="text-xl flex items-center gap-8 p-1 m-2 cursor-pointer">
                    <GoArrowLeft strokeWidth={1} />
                    <div>
                        <h1 className="font-bold text-gray-200">{userData?.name}</h1>
                        <p className="text-sm text-gray-500">{userData?.posts.length} posts</p>
                    </div>
                </nav>
                <div className="relative">
                    <img src={userData?.coverImageURL}
                    className="w-full object-fill h-48" />
                    <div className="flex justify-between items-center">
                        <div className="absolute top-32 left-5">
                            {userData?.profileImageURL && (
                                <Image src={userData.profileImageURL} alt={userData.username} height={125} width={125} className="rounded-full border-black border-4" />
                            )}
                        </div>
                        <div className="absolute top-48 pt-2 right-5 text-2xl items-center">
                            {user?.username===userData?.username ? (
                                <button className="text-sm font-bold py-2 px-4 rounded-full border-gray-300 text-white" onClick={() => setShowEditModal(true)}>Edit Profile</button>
                            ) : (
                                <div className="flex gap-4 ">
                                    <HiOutlineDotsHorizontal className="rounded-full border border-gray-500" />
                                    <button className="text-sm font-bold py-2 px-4 rounded-full bg-white text-black" onClick={() => setShowEditModal(true)}>Follow</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pb-5 border-b border-gray-600">
                    <div className="pt-20 pl-5">
                        {userData && (
                            <div className="text-sm text-gray-400">
                                <h1 className="text-xl font-bold text-gray-200">{userData.name}</h1>
                                <p>@{userData.username}</p>
                                <p className="pt-5 text-gray-200">Hey there! I am using Twitter Clone</p>
                                <div className="pt-2 flex gap-1 items-center">
                                    <FaRegCalendarAlt className="" />
                                    <p>Joined {months[new Date(userData.createdAt).getMonth()-1]} {new Date(userData.createdAt).getFullYear()}</p>
                                </div>
                                <div className="flex pt-2 gap-4">
                                    <div className="flex gap-1">
                                        <p className="font-bold text-gray-200">450</p> 
                                        <p>Following</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <p className="font-bold text-gray-200">450</p> 
                                        <p>Followers</p>
                                    </div>
                                </div>
                                <div className="pt-3">
                                    <p>Not followed by anyone you're following</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {userData&& userData.posts?.map((post) => (
                    <FeedCard key={post?.id} post={post as Post} redirect={false} />
                )) }
            </div>
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} popup size={'lg'}>
                <Modal.Header className="bg-black">
                    <div className="flex gap-60">
                        <h1 className="font-bold text-gray-300">Edit Profile</h1>
                        <button onClick={() => {
                            setShowConfirmModal(true);
                        }} className="py-2 px-5 rounded-full bg-gray-100 text-sm font-bold hover:bg-gray-300">Save</button>
                    </div>
                </Modal.Header>
                <Modal.Body className="bg-black text-gray-300 p-5">
                    <div className="relative">
                    <img src={editData?.coverImageURL || '#'} alt="cover-image" id="cover" width={125} height={125} className="object-fill h-48 w-full" />
                    <div className="absolute top-20 w-full text-gray-300 p-2 text-3xl flex justify-center gap-5 opacity-80">
                        <TbCameraPlus type="file" title="Add Photo" className="bg-gray-900 rounded-full p-1 cursor-pointer" onClick={() => {
                                    setImageType({type: 'cover'});
                                    handleSelectImage()
                        }} />
                        <RxCross1 title="Remove Photo" className="bg-gray-900 rounded-full p-1 cursor-pointer" onClick={() => {
                            setEditData({...editData, coverImageURL: ''})
                        }}/>
                    </div>
                    </div>
                    <div className="absolute top-52 left-8">
                        <img src={editData?.profileImageURL || '#'} alt='User' id="profile" className="object-fill rounded-full w-28 h-28" width={80} height={80} />
                        <button className="absolute top-6 w-full text-gray-300 p-2 text-3xl flex justify-center gap-5 opacity-80">
                            <TbCameraPlus title="Add Photo" className="bg-gray-900 rounded-full p-1" onClick={() => {
                                setImageType({type: 'profile'});
                                handleSelectImage();
                            }} />
                        </button>
                    </div>
                    <div className="py-16 items-center w-full">
                        <div className="relative pb-6">
                            <input type="text" onChange={(e) => setEditData({...editData, name: e.target.value})} placeholder=" " value={editData?.name}
                            className="block rounded-md px-2.5 pb-2.5 pt-5 h-14 w-full text-sm text-gray-200 bg-transparent border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer" />
                            <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Name</label>
                        </div>
                        <div className="relative pb-6 items-center">
                            <textarea onChange={(e) => setEditData({...editData, about: e.target.value})} rows={2} cols={28} placeholder=" " value={editData?.about}
                            className="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-200 bg-transparent border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer" />
                            <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Bio</label>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)} popup size={'sm'}>
                <Modal.Header className="bg-black" />
                <Modal.Body className="bg-black text-gray-300 flex justify-center">
                    <div>
                    <h1 className="font-bold text-xl text-gray-300">Are you sure?</h1>
                    <p className="text-sm text-gray-500">This can’t be undone and you’ll lose your changes. </p>
                    <button className="w-72 py-3 my-2 rounded-full font-bold bg-lime-500 hover:bg-lime-600" onClick={handleSubmit}>Yes</button>
                    <button onClick={() => setShowConfirmModal(false)} className="w-72 py-3 my-2 rounded-full font-bold outline outline-[0.5px] outline-gray-400">Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserProfilePage;