import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashComments() {
    const { currentUser } = useSelector((state)=> state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(()=> {
        const getComments = async() => {
            try {
                const res = await fetch('/api/comment/getcomments');
                const data = await res.json();
                if(res.ok){
                    setComments(data.comments);
                    if(data.comments.length<9){
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if(currentUser.isAdmin){
            getComments();
        }
    }, [currentUser._id]);

    const handleDeleteComments = async() => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/comment/delete/${commentIdToDelete}`, {
                method: 'DELETE'
            });
            if(res.ok){
                setComments(comments.filter((comment) => comment._id!==commentIdToDelete));
                setShowModal(false);
            }
            else{
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && comments.length>0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Comment</Table.HeadCell>
                            <Table.HeadCell>No. of Likes</Table.HeadCell>
                            <Table.HeadCell>Post Id</Table.HeadCell>
                            <Table.HeadCell>User Id</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body className='divide-y' key={comment._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setCommentIdToDelete(comment._id)
                                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>
                    )}
                </>
            ) : (
                <p>You have no comments yet!</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color={'failure'} onClick={() => handleDeleteComments(commentIdToDelete)}>Yes, I'm sure</Button>
                            <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
