import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import NavBar from '../components/NavBar'
import TopImagesComponent from '../components/TopImagesComponent'

import { db } from "../public/firebase";
import { query, getDocs, collection, limit, orderBy } from 'firebase/firestore';


export default function Home({ bottomImages, bg }) {

  return (
    
    <div className={styles.container} style={{
      background: `linear-gradient(rgba(0, 255, 172, 0.5), rgba(0, 255, 253, 0.5)), url(${bg.displayUrl})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover'
    }}>

      <Head>

        <title>WallpapersPoint</title>

      </Head>

      <NavBar />

      <div className={styles.titleContainer}>

        <h1>WallpapersPoint</h1>
        <h3>Find your new favourite picture<br />to decorate your device</h3>
        <Link
          href={{
            pathname: `browse/${bg.uid} `,
            query: {
              displayUrl: bg.displayUrl,
              downloadUrl: bg.downloadUrl,
              uploaderEmail: bg.uploadedBy.email,
              hashtags: bg.hashtags,
              likes: bg.likes,
              reports: bg.reports
            }
          }}
        >
          <a>Get background</a>
        </Link>

      </div>

      <div className={styles.bottomContainer}>

        <h3>All time top 5</h3>
        <div className={styles.innerContainer}>

          <TopImagesComponent images={bottomImages} />
          <div>Hi!</div>


        </div>

      </div>

    </div >

  )

}

export const getServerSideProps = async () => {

  const q = query(collection(db, "images"), orderBy('likes', 'desc'), limit(6));
  const fetchedDocs = await getDocs(q)

  const images = fetchedDocs.docs.map((doc) => {
    return {
      ...doc.data(),
    };
  });

  return {
    props: {
      bottomImages: images.splice(0, 5),
      bg: images[images.length - 1]
    }
  };

}
