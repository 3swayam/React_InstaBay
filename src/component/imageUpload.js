import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';

function ImageUpload({ user }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [userName, setUserName] = useState(null);
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    useEffect(() => {
        if (user) {
            setUserName(user.displayName);
        } else {
            setUserName(null);
        }
    }, [user]);
    const handleUpload = (e) => {
        var uploadTask = storage.ref().child(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //   setProgress(30);
            }, (error) => {
                alert(error);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        db.collection("posts").add({
                            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: downloadURL,
                            logoUrl: downloadURL,
                            userName: userName
                        })
                            .then(function (docRef) {
                                console.log("Document written with ID: ", docRef.id);
                            })
                            .catch(function (error) {
                                console.error("Error adding document: ", error);
                            });

                        setImage(null);
                        setCaption('');
                    })
            }
        )
    };
    return (
        <div className="margin__top margin__bottom">
            <input className="inpu_style" type="text" label="Enter Caption" variant="outlined" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange}></input>
            <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload;
