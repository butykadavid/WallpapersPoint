import NavBar from "../../components/NavBar";
import ImgComponent from "./ImgComponent";

import styles from "../../styles/BrowsePage.module.css"

import { db } from "../../public/firebase";
import { query, getDocs, collection, where, doc, getDoc } from 'firebase/firestore';


const browsePage = ({ images, tags }) => {

    return <>

        <div className={styles.container}>

            <NavBar tags={tags}/>

            <div className={styles.imgContainer}>

                <ImgComponent images={images} />

            </div>

        </div>

    </>

}

export const getServerSideProps = async (context) => {

    // get images to display on the page

    // if it was not a search
    if (context.query.search == undefined || context.query.search.length < 1) {

        const q = query(collection(db, "images"));
        const fetchedDocs = await getDocs(q)

        const images = fetchedDocs.docs.map((doc) => {
            return {
                ...doc.data(),
            };
        });

        const tags = images.map(image => {
            let i = Math.floor(Math.random() * image.hashtags.length)
            return image.hashtags[i];
        })

        return { props: { 
            images: images,
            tags: tags.splice(0,5)
        }};

    } 
    
    // if it was a search
    else {

        const q = query(collection(db, "images"), where("hashtags", "array-contains", '#' + context.query.search));
        const fetchedDocs = await getDocs(q)

        const images = fetchedDocs.docs.map((doc) => {
            return {
                ...doc.data(),
            };
        });

        return { props: { 
            images: images,
            tags: context.query.tags
         }};
    }

}


export default browsePage;

