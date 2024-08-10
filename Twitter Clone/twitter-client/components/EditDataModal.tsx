import { getUserData } from '@/app/SSR/user';
import { graphqlClient } from '@/clients/api';
import { UpdateDataType } from '@/gql/graphql';
import { deleteUserAccountQuery } from '@/graphql/query/user';
import { useCurrentUser, useUpdateUser } from '@/hooks/user';
import { supabase } from '@/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from 'flowbite-react';
import { notFound, usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { RxCross1 } from 'react-icons/rx';
import { TbCameraPlus } from 'react-icons/tb';


interface EditInformation {
    name?: string
    about?: string | null
    coverImageURL?: string
    profileImageURL?: string
}

export default function EditDataModal( data: {username: string, show: boolean }) {
    const [showEditModal, setShowEditModal] = useState(data.show);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editData, setEditData] = useState<EditInformation>({});
    const [coverFile, setCoverFile] = useState<File>();
    const [profileFile, setProfileFile] = useState<File>();
    const [imgURLSuccess, setImgURLSuccess] = useState(0);
    const queryClient = useQueryClient();
    const { mutateAsync } = useUpdateUser();

    useEffect(() => {
        const fetchData = async() => {
            try{
                if(!data.username){
                  notFound();
                }
                const { props, notFound: error } = await getUserData(data.username);
                if(error){
                    return;
                }
                setEditData({
                    name: props?.userInfo?.name,
                    about: props?.userInfo?.about,
                    coverImageURL: props?.userInfo?.coverImageURL,
                    profileImageURL: props?.userInfo?.profileImageURL

                });
            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, [data.username]);

    const handleInputChangeFile = (input: HTMLInputElement, type: 'profile' | 'cover') => {
      return async(event: Event) => {
          event.preventDefault();
          const file = input.files?.item(0);
          if(file){
              if(type==='cover'){
                  setCoverFile(file);
                  setEditData({...editData, coverImageURL: URL.createObjectURL(file)});
              }
              else if(type==='profile'){
                  setProfileFile(file);
                  setEditData({...editData, profileImageURL: URL.createObjectURL(file)});
              }
          }
      }
    };

    const handleSelectImage = useCallback((type: 'cover' | 'profile') => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
    
        const handlerFn = handleInputChangeFile(input, type);
    
        input.addEventListener("change", handlerFn);
    
        input.click();
      }, [handleInputChangeFile]);

      const generateURL = async(file: File|undefined, type: 'cover' | 'profile') => {
        if(!file){
            setImgURLSuccess(imgURLSuccess+1);
            return;
        }
        const fileName = 'Image_'+new Date().getTime().toString() +file.name;
        const { data } = await supabase.storage.from('twitter-images').upload(fileName, file);
        if(data){
            const url = supabase.storage.from('twitter-images').getPublicUrl(fileName);
            if(type==='cover'){
                setEditData({...editData, coverImageURL: url.data.publicUrl});
                setImgURLSuccess(imgURLSuccess+1);
            }
            else{
                setEditData({...editData, profileImageURL: url.data.publicUrl});
                setImgURLSuccess(imgURLSuccess+1);
            }
        }
        else{
            toast.error(`Error while uploading image ${file.name}`);
        }
      }

    const handleSubmit = () => {
        generateURL(profileFile, 'profile');
        generateURL(coverFile, 'cover');
    }

    const handleDeleteAccount = async() => {
        const res = await graphqlClient.request(deleteUserAccountQuery);
        if(!res){
            toast.error('Error while deleting data');
        }
        window.localStorage.removeItem('token');
        queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    }

    useEffect(() => {
        const submitChanges = async() => {
            await mutateAsync({
                data: editData
            });
            setEditData({name: '', about: '', coverImageURL: '', profileImageURL: ''});
            setShowConfirmModal(false);
            setShowEditModal(false);
            setImgURLSuccess(0);
        }
        if(imgURLSuccess==2){
            submitChanges();
        }
    }, [imgURLSuccess]);

  return (
    <div>
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
                <img src={editData?.coverImageURL} alt="cover-image" id="cover"className="object-fill h-48 w-full" />
                <div className="absolute top-20 w-full text-gray-300 p-2 text-3xl flex justify-center gap-5 opacity-80">
                    <TbCameraPlus type="file" title="Add Photo" className="bg-gray-900 rounded-full p-1 cursor-pointer" onClick={() => {
                        handleSelectImage('cover');
                    }} />
                    <RxCross1 title="Remove Photo" className="bg-gray-900 rounded-full p-1 cursor-pointer" onClick={() => {
                        setEditData({...editData, coverImageURL: ''})
                    }}/>
                </div>
                </div>
                <div className="absolute top-52 left-8">
                    <img src={editData?.profileImageURL} alt='User' id="profile" className="object-fill rounded-full w-28 h-28" />
                    <button className="absolute top-6 w-full text-gray-300 p-2 text-3xl flex justify-center gap-5 opacity-80">
                        <TbCameraPlus title="Add Photo" className="bg-gray-900 rounded-full p-1" onClick={() => {
                            handleSelectImage('profile');
                        }} />
                    </button>
                </div>
                <div className="py-16 items-center w-full">
                    <div className="relative pb-6">
                        <input type="text" onChange={(e) => setEditData({...editData, name: e.target.value})} placeholder=" " value={editData?.name}
                        className="block rounded-md px-2.5 pb-2.5 pt-5 h-14 w-full text-sm text-gray-200 bg-transparent border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer" />
                        <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Name</label>
                    </div>
                    <div className="relative items-center">
                        <textarea onChange={(e) => setEditData({...editData, about: e.target.value})} rows={2} cols={28} placeholder=" " value={editData?.about ? editData.about : ''}
                        className="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-200 bg-transparent border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer" />
                        <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Bio</label>
                    </div>
                    <button onClick={() => setShowDeleteModal(true)}
                    className='p-3 mt-5 text-center w-full bg-red-500 text-white font-bold hover:bg-red-700 hover:text-black rounded-full'>
                        Delete Account
                    </button>
                </div>
            </Modal.Body>
        </Modal>
        <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)} popup size={'sm'}>
            <Modal.Header className="bg-black" />
            <Modal.Body className="bg-black text-gray-300 flex justify-center">
                <div>
                <h1 className="font-bold text-xl text-gray-300">Are you sure?</h1>
                <p className="text-sm text-gray-500">This can’t be undone and you’ll lose your changes. </p>
                <button className="w-72 py-3 my-2 rounded-full font-bold bg-purple-500 hover:bg-purple-600" onClick={handleSubmit}>Yes</button>
                <button onClick={() => setShowConfirmModal(false)} className="w-72 py-3 my-2 rounded-full font-bold outline outline-[0.5px] outline-gray-400">Cancel</button>
                </div>
            </Modal.Body>
        </Modal>
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size={'sm'}>
            <Modal.Header className="bg-black" />
            <Modal.Body className="bg-black text-gray-300 flex justify-center">
                <div>
                <h1 className="font-bold text-xl text-gray-300">Are you sure?</h1>
                <p className="text-sm text-gray-500">This can’t be undone and you’ll lose your changes. </p>
                <button className="w-72 py-3 my-2 rounded-full font-bold bg-red-500 hover:bg-red-700" onClick={handleDeleteAccount}>Yes</button>
                <button onClick={() => setShowConfirmModal(false)} className="w-72 py-3 my-2 rounded-full font-bold outline outline-[0.5px] outline-gray-400">Cancel</button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
