import ImgComponentProfile from "../profile/ImgComponentProfile"
import styles from "../../styles/ProfilePage.module.css"
import NavBar from "../../components/NavBar";

import { auth, db } from "../../public/firebase";
import { query, getDocs, getDoc, collection, where, limit } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


const ProfilePage = ({ images, tags }) => {

    const [user] = useAuthState(auth)

    if (user != null) {

        return (

            <div className={styles.container}>

                <NavBar tags={tags} />

                <div className={styles.content}>

                    <div className={styles.nameWrapper}>

                        <div>

                            <h2>{user.displayName}</h2>
                            <h2>{user.email}</h2>

                        </div>

                        <img src="/emptyProfile.png" />

                    </div>

                    <h3>Uploaded images</h3>

                    <div className={styles.imgContainer}>

                        {/* very similar to the normal ImgComponent, but with different styling and functions */}
                        <ImgComponentProfile images={images} />

                    </div>

                </div>

            </div>

        );

    } else {

        return (

            <div className={styles.container}>

                <NavBar />

                <h1>You must be logged in</h1>

            </div>

        )

    }

}

export const getServerSideProps = async (context) => {

    // get all images uploaded by current user
    var q = query(collection(db, "images"), where("uploadedBy.uid", "==", context.query.profile));
    var fetchedDocs = await getDocs(q)

    const userImages = fetchedDocs.docs.map((doc) => {
        return {
            ...doc.data(),
        };
    });

    // get the first five images again for the tags
    q = query(collection(db, "images"), limit(5))
    fetchedDocs = await getDocs(q)
    const images = fetchedDocs.docs.map((doc) => {
        return {
            ...doc.data(),
        };
    });

    // gathering random tags (...)
    const tags = images.map(image => {
        let i = Math.floor(Math.random() * image.hashtags.length)
        return image.hashtags[i];
    })

    return {
        props: {
            images: userImages,
            tags: tags
        }
    };

}

export default ProfilePage;