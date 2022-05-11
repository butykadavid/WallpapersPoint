import NavBar from "../../components/NavBar";

import styles from "../../styles/UploadPage.module.css"

import Script from "next/script"

import { useState, useEffect } from "react";

import { v4 as uuidv4 } from 'uuid'

import { uploadBytes, ref, getDownloadURL, getMetadata } from 'firebase/storage'
import { auth, db, storage, storageRef } from "../../public/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, snapshotEqual, setDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';


const uploadPage = () => {

    const file = null;
    const metadata = [];
    var hashtags = [];
    const [user] = useAuthState(auth)
    const [isInProgress, setProgress] = useState(false)

    const uploadImg = async () => {

        setProgress(true)

        const imgUid = uuidv4()

        const storageRef = ref(storage, 'images/' + imgUid)

        if (imgUid != null && hashtags.length > 1) {

            var docId;

            await uploadBytes(storageRef, file, metadata).then(async () => {

                const displayUrl = await getDownloadURL(storageRef).then((url) => {
                    return url
                })

                const downloadUrl = await getMetadata(storageRef).then((metadata) => {
                    return "https://storage.googleapis.com/download/storage/v1/b/wallpaperspoint-36d6c.appspot.com/o/images%2F" + imgUid + "?generation=" + metadata.generation + "&alt=media"
                })

                await addDoc(collection(db, "images"), {
                    uid: imgUid,
                    displayUrl: displayUrl,
                    downloadUrl: downloadUrl,
                    uploadedBy: {
                        email: user.email,
                        name: user.displayName,
                        uid: user.uid
                    },
                    hashtags: hashtags,
                    likes: 0,
                    reports: 0
                });

                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                const docs = await getDocs(q);

                docs.forEach((doc1) => {
                    docId = doc1.id
                    return;
                })

                const userRef = doc(db, 'users', docId);

                await updateDoc(userRef, {
                    images: arrayUnion(imgUid)
                });


                setProgress(false)

            })
        }
    }

    const handleSelected = e => {

        try {
            file = e.target.files[0]
            metadata = {
                contentType: e.target.files[0].type
            }
        } catch (err) {
            console.log(err)
        }

    }

    const handleText = e => {

        try {
            hashtags.splice(0, hashtags.length)
            e.target.value.split(' ').forEach(element => {
                hashtags.push(element.trim())
            });
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
    }, [isInProgress])

    if (isInProgress == false) {

        if (user == null || user == []) {

            return (
                <>
                    <div className={styles.container}>

                        <NavBar />

                        <div className={styles.middleContainer}>

                            <div>

                                <h1>Sign in to upload images</h1>

                            </div>

                        </div>

                    </div>

                </>
            );

        }
        else {

            return (
                <>
                    <div className={styles.container}>

                        <NavBar />

                        <div className={styles.middleContainer}>

                            <div>

                                <h1>Upload image</h1>
                                <input id="fileButton" type="file" onChange={handleSelected} hidden />
                                <label className={styles.inputButton} htmlFor="fileButton">Choose file</label>
                                <span id="fileChosen"></span>
                                <textarea className={styles.hashtagsText} rows="5" placeholder="#hashtag #dog #cute" onChange={handleText}></textarea>
                                <button className={styles.uploadButton} onClick={uploadImg}>Upload</button>

                            </div>

                        </div>

                    </div>

                    <Script src="/fileUpload.js" />

                </>
            );

        }

    } else {
        return (

            <div className={styles.container}>

                <div className={styles.middleContainer}>

                    <div>

                        <h1>Uploading</h1>

                    </div>

                </div>

            </div>

        )
    }


}

export default uploadPage;