import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Comment from './Comment';

export default function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user);
    const [newComment, setNewComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newComment.length > 200) {
          return;
        }
        try {
          const res = await fetch('/api/comment/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: newComment,
              postId,
              userId: currentUser._id,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setNewComment('');
            setCommentError(null);
            setComments([data, ...comments]);
          }
        } catch (error) {
          setCommentError(error.message);
        }
      };

    useEffect(() => {
        const getComments = async() => {
            try {
                const res = await fetch(`/api/comment/getpostcomments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getComments();
    }, [postId]);

    const handleLike = async(commentId) => {
        try {
            if(!currentUser){
                navigate('/signin');
                return;
            }
            const res = await fetch(`/api/comment/like/${commentId}`, {
                method: 'PUT'
            });
            if(res.ok){
                const data = await res.json();
                setComments(comments.map((comment) => {
                    comment._id===commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    } : comment
                }));
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleEdit = async(comment, editedComment) => {
        setComments(
            comments.map((c) => c._id === comment._id ? { ...c, content: editedComment } : c)
        )
    }

    const handleDelete = async(commentId) => {
        setShowModal(false);
        try {
            if(!currentUser){
                navigate('/signin');
                return;
            }
            console.log("Comment ID: ", commentId);
            const res = await fetch(`/api/comment/delete/${commentId}`, {
                method: 'DELETE'
            });
            if(res.ok){
                setComments(comments.filter((comment) => comment._id!==commentId));
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as: </p>
                    <img src={currentUser.profilePicture} alt={currentUser.username} className='h-5 w-5 rounded-full object-cover' />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>@{currentUser.username}</Link>
                </div>
                ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link to={'/signin'} className='text-blue-500 hover:underline'>Sign In</Link>
                </div>
            )}
            {currentUser && (
                <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea placeholder='Add a comment...' rows={3} maxLength={200} onChange={(e) => setNewComment(e.target.value)} />
                    <div className="flex justify-between items-center mt-5">
                        <p className='text-gray-500 text-xs'>{200-newComment.length} characters remaining</p>
                        <Button outline gradientDuoTone={'purpleToBlue'} type={'submit'}>Submit</Button>
                    </div>
                    {commentError && (
                        <Alert color={'failure'} className='mt-5'>{commentError}</Alert>
                    )}
                </form>
            )}
            {comments?.length === 0 ? (
                <p className='text-sm my-5'>No comments yet</p>
                ) : (
                    <>
                        <div className="text-sm my-5 flex items-center gap-1">
                            <p>Comments</p>
                            <div className="border border-gray-400 py-1 px-2 rounded-sm">
                                <p>{comments?.length}</p>
                            </div>
                        </div>
                        {comments.map((comment) => (
                            <Comment key={comment._id} comment={comment} 
                            onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {
                                setShowModal(true);
                                setCommentToDelete(commentId);
                            }} />
                        ))}
                    </>
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
                            <Button color={'failure'} onClick={() => handleDelete(commentToDelete)}>Yes, I'm sure</Button>
                            <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
