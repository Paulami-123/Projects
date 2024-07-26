import { Sidebar } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { HiAnnotation, HiArrowSmRight, HiBookmark, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { signoutSuccess } from '../redux/user/userSlice'
import { FaBars } from 'react-icons/fa'

export default function DashSidebar() {
    const { currentUser } = useSelector((state) => state.user)
    const location = useLocation();
    const [tab, setTab] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const dispatch = useDispatch();
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    }, [location.search])

    const handleSignout = async() => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST'
          });
          const data = await res.json();
          if(!res.ok){
            console.log(data.message);
          }
          else{
            dispatch(signoutSuccess());
          }
        } catch (error) {
          console.log(error.message)
        }
    }

    return (
        <div>
            {showSidebar ? (
            <Sidebar className='w-full h-screen md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <button onClick={() => setShowSidebar(false)}>
                    <Sidebar.Item icon={FaBars}></Sidebar.Item>
                </button>
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
                    {currentUser && currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Link to={'/dashboard?tab=myposts'}>
                        <Sidebar.Item active={tab==='myposts'} icon={HiBookmark} as='div'>
                            My Posts
                        </Sidebar.Item>
                    </Link>
                    
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
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
        ) : (
            <button onClick={() => setShowSidebar(true)} className='w-6 m-5'>
                <FaBars size={'sm'} className='' />
            </button>
        )}
        </div>
    )
}
