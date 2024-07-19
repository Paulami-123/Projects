import { Sidebar } from 'flowbite-react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useEffect, useState } from 'react'

export default function DashSideBar() {
    const { currentUser } = useSelector((state) => state.user)
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    }, [location.search])
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {currentUser && currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=dash'}>
                            <Sidebar.Item active={tab==='dash' || !tab} icon={HiChartPie} as='div'>
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item active={tab==='profile'} icon={HiUser} as='div' 
                        label={currentUser.isAdmin? 'Admin' : 'User'} labelColor='dark'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <>
                            <Link to={'/dashboard?tab=users'}>
                                <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} as='div'>
                                    Users
                                </Sidebar.Item>
                            </Link>
                            <Link to={'/dashboard?tab=comments'}>
                                <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} as='div'>
                                    Comments
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
