import React from 'react'
import DashSidebar from '../components/DashSideBar';

export const About = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row gap-6'>
      <DashSidebar />
      <div className='max-w-2xl mx-auto p-3 text-center flex items-center justify-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Paulami' Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Paulami's Blog! This blog was created by Paulami Banerjee
              as a personal project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
