import styles from '../../styles/ImgComponent.module.css'

import { auth, db } from "../../public/firebase";
import { query, getDocs, getDoc, collection, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import Link from 'next/link'

import { useState, useEffect } from 'react';

const ImgComponent = ({ images }) => {

    const [user] = useAuthState(auth)
    const [likedImgs, setLikedImgs] = useState([])
    const [reportedImgs, setReportedImgs] = useState([])

    // getting data from user so we know what he liked or reported already
    const getData = async () => {

        if (user != null) {

            try {

                var docId;

                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                const docs = await getDocs(q);

                docs.forEach((doc1) => {
                    docId = doc1.id
                    return;
                })

                const userRef = doc(db, 'users', docId);

                const docSnap = await getDoc(userRef)

                setLikedImgs(docSnap.data().imageLikes)
                setReportedImgs(docSnap.data().imageReports)

            } catch (err) {
                console.error(err)
            }

        }

    }

    // handling pressing like
    const imgLiked = async (img) => {

        var docId;

        const q = query(collection(db, "images"), where("uid", "==", img.uid));
        const docs = await getDocs(q);

        docs.forEach((doc1) => {
            docId = doc1.id
            return;
        })

        const imgRef = doc(db, 'images', docId);

        const docSnap = await getDoc(imgRef)

        const newLikes = docSnap.data().likes + 1

        // cheat again or I dont know
        // images are not refreshing coz they are already loaded from db
        // so it doesnt matter if I update db, therefore I just update their like amount manually
        let _img = images.find(x => x.uid == img.uid);
        _img.likes++;

        const updateImages = await updateDoc(imgRef, {
            likes: newLikes
        });

        updateUser(img.uid, "likes")
    }

    // handling pressing report
    const imgReported = async (img) => {

        var docId;

        const q = query(collection(db, "images"), where("uid", "==", img.uid));
        const docs = await getDocs(q);

        docs.forEach((doc1) => {
            docId = doc1.id
            return;
        })

        const imgRef = doc(db, 'images', docId);

        const docSnap = await getDoc(imgRef)

        const newReports = docSnap.data().reports + 1

        // cheat again
        // images are not refreshing coz they are already loaded from db
        // so it doesnt matter if I update db, therefore I just update their report amount manually
        let _img = images.find(x => x.uid == img.uid);
        _img.reports++;

        const updateImages = await updateDoc(imgRef, {
            reports: newReports
        });

        updateUser(img.uid, "reports")
    }

    // updating user likes, or reports
    const updateUser = async (id, prop) => {

        var docId;

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        docs.forEach((doc1) => {
            docId = doc1.id
            return;
        })

        const userRef = doc(db, 'users', docId);

        if (prop == "likes") {

            const updateImages = await updateDoc(userRef, {
                imageLikes: arrayUnion(id)
            });

        }
        else {

            const updateImages = await updateDoc(userRef, {
                imageReports: arrayUnion(id)
            });

        }

        getData()
    }

    // run getData func when user gets defined
    useEffect(() => {
        getData()
    }, [user])

    return images.map(image => {

        return <>

            <div className={styles.card}>

                <img src={image.displayUrl} />

                <div className={styles.imgOverlap}>

                    <a href={image.downloadUrl} className={styles.dwnld}><img src='/download.png' /></a>
                    <Link key={image.uid}
                        href={{
                            pathname: `browse/${image.uid} `,
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
                        <img src='/fullscreen.png' />
                    </Link>

                    {/* display like or report buttons if they are not already pressed and user exists */}
                    {user != null ? likedImgs.includes(image.uid) ?
                        <></> :
                        <a onClick={() => imgLiked(image)} className={styles.like}><img src='/like.png' /></a> : <></>}
                    {user != null ? reportedImgs.includes(image.uid) ?
                        <></> :
                        <a onClick={() => imgReported(image)} className={styles.rprt}><img src='/report.png' /></a> : <></>}

                </div>


            </div>

        </>;

    });
}

export default ImgComponent;