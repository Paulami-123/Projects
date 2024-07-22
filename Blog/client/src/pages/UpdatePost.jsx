import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const { currentUser } = useSelector((state) => state.user)
    const { postId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        try {
            const fetchPost = async() => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data = await res.json()
                console.log(data)
                if(!res.ok){
                    setPublishError(data.message)
                    console.log("Response error: ",data.message)
                    return;
                }
                else{
                    setPublishError(null)
                    setFormData(data.posts[0])
                }
            } 
            fetchPost()
        } catch (error) {
            console.log("Catch error: ",error.message)
            setPublishError(error.message)
        }
    }, [postId])

    const handleUploadImage = async() => {
        try {
            if(!file){
                setImageUploadError('Please select an image')
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
              },
              (error) => {
                setImageUploadError('Failed to upload image'),
                setImageUploadProgress(null)
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageUploadProgress(null)
                  setImageUploadError(null);
                  setFormData({...formData, image: downloadURL})
                });
              }
            );
        } catch (error) {
            setImageUploadProgress(null);
            setImageUploadError('Image upload failed');
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json()
            if(!res.ok){
                setPublishError(data.message)
                return
            }
            setPublishError(null);
            navigate(`/post/${data.slug}`)
        } catch (error) {
            setPublishError('Something went wrong')
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' value={formData.title} 
                    onChange={(e) => { setFormData({ ...formData, title: e.target.value }) }} />
                    <Select value={formData.category} onChange={(e) => { 
                        setFormData({ ...formData, category: e.target.value }) 
                    }}>
                        <option value={'uncategorised'}>Select a category</option>
                        <option value={'javascript'}>JavaScript</option>
                        <option value={'reactjs'}>ReactJS</option>
                        <option value={'nextjs'}>NextJS</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='image/*' onChange={(e) => {setFile(e.target.files[0])}} />
                    <Button type='button' gradientDuoTone={'purpleToBlue'} size={'sm'} onClick={handleUploadImage} disabled={imageUploadProgress}>
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {imageUploadError && <Alert color={'failur'}>{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt='Blog Image' className='w-full h-72 object-cover' />
                )}
                <ReactQuill theme='snow' value={formData.content} placeholder='Write something...' className='h-72 mb-12' required />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>Update Post</Button>
                {publishError && (
                    <Alert color={'failure'} className='mt-5'>{publishError}</Alert>
                )}
            </form>
        </div>
    )
}
