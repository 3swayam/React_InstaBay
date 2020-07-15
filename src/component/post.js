import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';

function Post({ postId, userName, imageUrl, logoUrl, caption }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (postId) {
            db.collection('posts').
                doc(postId).
                collection("comments").
                onSnapshot(snap => {
                    setComments(snap.docs.map(doc => (doc.data())
                    ))
                })
        }

    }, [postId]);

    const handleComment = (event) => {
        event.preventDefault();
        db.collection('posts').
            doc(postId).
            collection("comments").add({
                comment: comment,
                username: userName,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        setComment('');
    }

    return (
        <div className="post">

            <div className="display__Flex padding___15 aling__centre">
                <Avatar src={logoUrl} alt="logo" className="post___logo"
                ></Avatar>
                <h3>{userName}</h3>
            </div>

            <img src={imageUrl} alt="logo" className="post___image" />
            <div className="display__Flex padding___15">
                <h3 className="margin__right">{userName}:</h3>
                <p>{caption}</p>
            </div>
            <div>
                {
                    comments.map((comment) => (

                        <p className="display__Flex padding___5">
                            <h3 className="margin__right">{comment.username}:</h3>
                            <p>{comment.comment}</p>

                        </p>
                    ))
                }
            </div>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}></input>
            <button onClick={handleComment}>comment</button>
        </div>
    )
}

export default Post;

//logo,name,pic,caption
