import NavBar from "../../components/NavBar";
import LabelComponent from "./LabelComponent";

import styles from "../../styles/CategoriesPage.module.css"

import { db } from "../../public/firebase";
import { query, getDocs, collection, limit } from 'firebase/firestore';


export default function categoriesPage({ cats, tags }) {

    const _cats = Object.values(cats[0])

    return <>


        <div className={styles.container}>

            <NavBar tags={tags} active={"CATEGORIES"} />

            <h1>Categories</h1>

            <div className={styles.labelContainer}>

                <LabelComponent tags={_cats.sort()} />

            </div>

        </div>

    </>

}

export const getServerSideProps = async () => {

    // get the first 5 images for the tags
    var q = query(collection(db, "images"), limit(5))
    var fetchedDocs = await getDocs(q)
    const images = fetchedDocs.docs.map((doc) => {
        return {
            ...doc.data(),
        };
    });

    // gathering random tags (still cheating)
    const tags = images.map(image => {
        let i = Math.floor(Math.random() * image.hashtags.length)
        return image.hashtags[i];
    })

    // get categories from db
    q = query(collection(db, "cats"));
    fetchedDocs = await getDocs(q)

    const cats = fetchedDocs.docs.map((doc) => {
        return {
            ...doc.data().cats,
        };
    });

    return {
        props: {
            cats: cats,
            tags: tags
        }
    };
}