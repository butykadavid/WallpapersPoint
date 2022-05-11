import NavBar from "../../components/NavBar";
import ImgComponent from "./ImgComponent";

import styles from "../../styles/BrowsePage.module.css"

import { db } from "../../public/firebase";
import { query, getDocs, collection, where, doc, getDoc } from 'firebase/firestore';


const browsePage = ({ images }) => {

    return <>

        <div className={styles.container}>

            <NavBar />

            <div className={styles.imgContainer}>

                <ImgComponent images={images} />

            </div>

        </div>

    </>

}

export const getServerSideProps = async (context) => {

    if (context.query.search == undefined || context.query.search.length < 1) {

        const q = query(collection(db, "images"));
        const fetchedDocs = await getDocs(q)

        const images = fetchedDocs.docs.map((doc) => {
            return {
                ...doc.data(),
            };
        });

        return { props: { images: images } };

    } else {

        const q = query(collection(db, "images"), where("hashtags", "array-contains", '#' + context.query.search));
        const fetchedDocs = await getDocs(q)

        const images = fetchedDocs.docs.map((doc) => {
            return {
                ...doc.data(),
            };
        });

        return { props: { images: images } };
    }

}


export default browsePage;

