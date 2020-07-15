import React, { useState } from 'react';
import { db, storage } from '../firebase';
import firebase from 'firebase';

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = (e) => {
        var uploadTask = storage.ref().child(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgress(30);
            }, (error) => {
                alert(error);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        console.log(downloadURL);
                        db.collection("posts").add({
                            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: downloadURL,
                            logoUrl: downloadURL,
                            userName: username
                        })
                            .then(function (docRef) {
                                console.log("Document written with ID: ", docRef.id);
                            })
                            .catch(function (error) {
                                console.error("Error adding document: ", error);
                            });

                        setProgress(0);
                        setImage(null);
                        setCaption('');
                    })
            }
        )
    };
    return (
        <div>
            <h4>Upload Image</h4>
            <input type="text" placeholder="enter caption" value={caption} onChange={(e) => setCaption(e.target.value)}></input>
            <input type="file" onChange={handleChange}></input>
            <button onClick={handleUpload}> Upload</button>
        </div>
    )
}

export default ImageUpload;
