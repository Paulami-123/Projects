import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function CreatePost() {
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({})
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
      <form className='flex flex-col gap-4'>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1'
          onChange={(e) => {
            setFormData({...formData, title: e.target.value})
          }} />
          <Select onChange={(e) => {
            setFormData({...formData, category: e.target.value})
          }} >
            <option value='uncategorised'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>ReactJS</option>
            <option value='nextjs'>NextJS</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type='file' accept='image/*' onChange={(e) => {setFile(e.target.files[0])}} />
          <Button type='button' gradientDuoTone={'purpleToBlue'} size={'sm'} outline>Upload Image</Button>
        </div>
        <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12'
          onChange={(e) => {
            setFormData({...formData, content: e.target.value})
          }} />
        <Button type='submit' gradientDuoTone={'purpleToPink'}>Publish</Button>
      </form>
    </div>
  )
}
