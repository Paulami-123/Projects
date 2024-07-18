import React, { useState } from 'react'
import { Button, Label, Spinner, TextInput } from "flowbite-react"
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Paulami's
            </span>
            Blog
          </Link>
          <p className='text-md mt-5 font-semibold'>
            This is a demo project. You can sign up with your email & password or with Google.
          </p>
        </div>
        {/* right side */}
        <div className="flex-1">
          <form className='flex flex-col gap-4'>
            <div>
              <Label value="Your Username" />
              <TextInput type='text' placeholder='Username' id='username' />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label value='Password' />
              <TextInput type='password' placeholder='Password' id='password' />
            </div>
            <Button gradientDuoTone={'purpleToPink'} type='submit'>Sign Up</Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already have an account?</span>
            <Link to={'/signin'} className='text-blue-500'> Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup