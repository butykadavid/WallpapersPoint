import ImgComponentProfile from "../profile/ImgComponentProfile"
import styles from "../../styles/ProfilePage.module.css"
import NavBar from "../../components/NavBar";

import { auth, db } from "../../public/firebase";
import { query, getDocs, getDoc, collection, where} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


const ProfilePage = ({ images }) => {

    const [user] = useAuthState(auth)

    if (user != null) {

        return (

            <div className={styles.container}>

                <NavBar />

                <div className={styles.content}>

                    <div className={styles.nameWrapper}>

                        <div>

                            <h2>{user.displayName}</h2>
                            <h2>{user.email}</h2>

                        </div>

                        <img src="/emptyProfile.png"/>

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
    const q = query(collection(db, "images"), where("uploadedBy.uid", "==", context.query.profile));
    const fetchedDocs = await getDocs(q)

    const images = fetchedDocs.docs.map((doc) => {
        return {
            ...doc.data(),
        };
    });

    return { props: { images: images } };

}

export default ProfilePage;