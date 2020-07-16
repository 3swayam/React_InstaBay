import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

function Post({ postId, userName, imageUrl, logoUrl, caption, user }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [commentFlag, setCommentFlag] = useState(false);
    useEffect(() => {
        if (postId) {
            db
                .collection('posts')
                .doc(postId)
                .collection("comments")
                .orderBy('timeStamp', 'desc')
                .onSnapshot(snap => {
                    setComments(snap.docs.map(doc => (doc.data())
                    ))
                })
        }

    }, [postId]);

    useEffect(() => {
        if (user) {
            setCommentFlag(true);
        }
    }, [user]);

    const handleComment = (event) => {
        event.preventDefault();
        db
            .collection('posts')
            .doc(postId)
            .collection("comments")
            .add({
                comment: comment,
                username: user.displayName,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        setComment('');
    }

    return (
        <div className="post">
            <div className="display__Flex padding___15 aling__centre">
                <Avatar src={logoUrl} alt="logo" className="post___logo" style={{ border: "2px solid #db6a92" }}
                ></Avatar>
                <h3>{userName}</h3>
            </div>
            <div>
                <img src={imageUrl} alt="logo" className="post___image" />
            </div>

            <div className="display__Flex padding___15">
                <h3 className="margin__right">{userName}:</h3>
                <p>{caption}</p>
            </div>
            <div>
                {comments.map((comment) => (
                    <p className="display__Flex padding___5">
                        <h3 className="margin__right">{comment.username}:</h3>
                        <p>{comment.comment}</p>
                    </p>
                ))
                }
            </div>
            {commentFlag ? <div className="margin__bottom">
                <input className="inpu_style" type="text" label="Password" variant="outlined" value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button variant="contained" color="primary" onClick={handleComment} >Post</Button>

            </div> : <span></span>}


        </div>
    )
}

export default Post;

//logo,name,pic,caption
