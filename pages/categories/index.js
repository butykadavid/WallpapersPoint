import NavBar from "../../components/NavBar";
import LabelComponent from "./LabelComponent";

import styles from "../../styles/CategoriesPage.module.css"

import { db } from "../../public/firebase";
import { query, getDocs, collection } from 'firebase/firestore';


const categoriesPage = ({ tags }) => {

    const _tags = Object.values(tags[0])

    return <>


        <div className={styles.container}>

            <NavBar />

            <h1>Categories</h1>

            <div className={styles.labelContainer}>

                <LabelComponent tags={_tags} />

            </div>

        </div>

    </>

}


export const getStaticProps = async () => {

    // get categories from db
    const q = query(collection(db, "tags"));
    const fetchedDocs = await getDocs(q)

    const tags = fetchedDocs.docs.map((doc) => {
        return {
            ...doc.data().tags,
        };
    });

    return { props: { tags: tags } };
}

export default categoriesPage;