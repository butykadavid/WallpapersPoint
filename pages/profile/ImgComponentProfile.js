import styles from '../../styles/ImgComponentProfile.module.css'

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from "../../public/firebase";
import { query, getDocs, getDoc, collection, where, doc, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

import Link from 'next/link'

import { useState, useEffect } from 'react';


const ImgComponentProfile = ({ images }) => {

    const _images = images
    const [user] = useAuthState(auth)
    const [isInProgress, setProgress] = useState(false)

    // deleting image from storage
    const deleteFromStorage = async (img) => {

        setProgress(true)

        const imgRef = ref(storage, 'images/' + img.uid)

        await deleteObject(imgRef).then(() => {

            deleteFromLocal(img)
            deleteFromImages(img.uid)

        }).catch((err) => {

            console.log(err)

        })

    }

    // deleting image from '_images' array
    const deleteFromLocal = (img) => {

        var index = _images.indexOf(img);
        if (index !== -1) {
            _images.splice(index, 1);
        }

    }

    // deleting image from the 'images' collection in the database
    const deleteFromImages = async (id) => {

        var docId;

        const q = query(collection(db, "images"), where("uid", "==", id));
        const docs = await getDocs(q);

        docs.forEach((doc1) => {
            docId = doc1.id
            return;
        })

        await deleteDoc(doc(db, 'images', docId)).then(() => {

            deleteFromUser(id)

        }).catch((err) => {
            console.log(err)
        })

    }

    // deleting image from the current user's 'images' field in the database
    const deleteFromUser = async (id) => {

        var docId;

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        docs.forEach((doc1) => {
            docId = doc1.id
            return;
        })

        const userRef = doc(db, 'users', docId);

        await updateDoc(userRef, {

            images: arrayRemove(id)

        }).then(() => {

            setProgress(false)

        }).catch((err) => {
            console.log(err)
        });

    }

    // if deleting is in progress page displays a loading screen
    if (isInProgress == false) {

        if (_images.length > 0) {

            return (

                _images.map(image => {

                    return (<>

                        <div className={styles.card}>

                            <img src={image.displayUrl} />

                            <div className={styles.imgOverlap}>

                                <a href={image.downloadUrl} className={styles.dwnld}><img src='/download.png' /></a>
                                <Link
                                    href={{
                                        pathname: `image/${image.uid} `,
                                        query: {
                                            displayUrl: image.displayUrl,
                                            downloadUrl: image.downloadUrl,
                                            uploaderEmail: image.uploadedBy.email,
                                            hashtags: image.hashtags,
                                            likes: image.likes,
                                            reports: image.reports
                                        }
                                    }}
                                >
                                    <a><img src='/fullscreen.png' /></a>
                                </Link>
                                <a onClick={() => deleteFromStorage(image)} className={styles.rprt}><img src='/delete.png' /></a>

                            </div>


                        </div>

                    </>)

                })

            )

        } else {

            return (<div>

                <h4 className={styles.noImg}>You haven't uploaded any images yet</h4>
                <p className={styles.noImg}>Go to <a href="/upload">upload page</a> to upload pictures</p>

            </div>)

        }

    } else {

        return (

            <div className={styles.container}>

                <h1>Deleting</h1>

            </div>

        )

    }

}

export default ImgComponentProfile;