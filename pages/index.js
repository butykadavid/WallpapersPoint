import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import NavBar from '../components/NavBar'
import TopImagesComponent from '../components/TopImagesComponent'

import { db } from "../public/firebase";
import { query, getDocs, collection, limit, orderBy } from 'firebase/firestore';


export default function Home({ bottomImages, bg, tags }) {

  return (
    // div wrapping whole page with dynamic gackground
    <div className={styles.container} style={{
      background: `linear-gradient(rgba(0, 255, 172, 0.5), rgba(0, 255, 253, 0.5)), url(${bg.displayUrl})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover'
    }}>

      <Head>

        <title>WallpapersPoint</title>

      </Head>

      <NavBar tags={tags} active={"HOME"}/>

      <div className={styles.titleContainer}>

        <h1>WallpapersPoint</h1>
        <h3>Find your new favourite picture<br />to decorate your device</h3>

        {/* button to download the current background*/}
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
          Get background
        </Link>

      </div>

      <div className={styles.bottomContainer}>

        <div className={styles.innerContainer}>

          {/* component displaying top 5 images by likes on the bottom of the page */}
          <TopImagesComponent images={bottomImages} />
          <div>Hi!</div>


        </div>

      </div>

    </div >
  );

}

export const getServerSideProps = async () => {

  // get the all time top 6 images
  // 6th image is background for now
  const q = query(collection(db, "images"), orderBy('likes', 'desc'), limit(6))
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
      bottomImages: images.splice(0, 5),
      bg: images[images.length - 1],
      tags: tags.splice(0, 5)
    }
  };
}