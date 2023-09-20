import styles from "../../styles/AboutPage.module.css";

import NavBar from "../../components/NavBar";

import { db } from "../../public/firebase";
import { query, getDocs, collection, limit } from 'firebase/firestore';

export default function AboutPage({ tags }){
  return (
    <>

      <NavBar tags={tags} />

      <div className={styles.content}>

        <div className={styles.textBox}>

          <p>
            WallpapersPoint is the first practice-project of mine learning
            NEXT.JS and Google Firebase.
            <br />
            <br />
            Therefore there could be performance issues and you might discover
            other minor inconveniences.
            <br />
            <br />
            This project is not my main focus anymore, but I might bring some
            new features or make the existing ones better every now and then.
            <br />
            <br />
          </p>

        </div>

        <div className={styles.myPicDiv}>

          <img className={styles.myPic} src="butyka.jpg" />
          <h1 className={styles.myName}>Dávid Butyka</h1>

          <div className={styles.socialDiv}>

            <a href="https://www.facebook.com/david.butyka" target="_blank" rel="noreferrer"><img src="facebook.png" /></a>
            <a href="https://www.instagram.com/_btykdvd_/" target="_blank" rel="noreferrer"><img src="instagram.png" /></a>
            <a href="https://dawson0810.github.io" target="_blank" rel="noreferrer"><img src="browser.png" /></a>
            <a href="https://www.linkedin.com/in/d%C3%A1vid-butyka-565a7a236/" target="_blank" rel="noreferrer"><img src="linkedin.png" /></a>
            <a href="https://github.com/dawson0810" target="_blank" rel="noreferrer"><img src="github.png" /></a>

          </div>

        </div>

      </div>

    </>
  );
};

export const getServerSideProps = async () => {

  // get the first 5 images from db (only for their tags lol)
  const q = query(collection(db, "images"), limit(5))
  const fetchedDocs = await getDocs(q)
  const images = fetchedDocs.docs.map((doc) => {
    return {
      ...doc.data(),
    };
  });

  // gathering random tags (basically cheating)
  const tags = images.map(image => {
    let i = Math.floor(Math.random() * image.hashtags.length)
    return image.hashtags[i];
  })

  return {
    props: {
      tags: tags.splice(0, 5)
    }
  };
}
