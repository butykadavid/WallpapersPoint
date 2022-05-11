import styles from '../../../styles/ImgPage.module.css'

import { useState } from 'react';

const ImgPageProfile = ({ displayUrl, downloadUrl, uploaderEmail, hashtags, likes, reports }) => {

    const [imgDims, setImgDims] = useState({})

    const getImgDimensions = (e) => {
        setImgDims({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight
        })
    }

    return (<>

        <img src={displayUrl} className={`${styles.mainImg} ${styles.filler}`} />
        <img src={displayUrl} className={`${styles.mainImg} ${styles.fixed}`} onLoad={getImgDimensions} />

        <div className={styles.details}>
            <h1>Uploader: <span>{uploaderEmail}</span></h1>
            <h2>Resolution: <span>{imgDims.width}×{imgDims.height}</span></h2>
            <h2>Likes: <span>{likes}</span></h2>
            <h2>Reports: <span>{reports}</span></h2>
            <h3>{hashtags.join(' ')}</h3>
            <div className={styles.buttons}>
                <a href={downloadUrl} className={styles.dwnld}>
                    <img src='/download.png' />
                </a>
            </div>
        </div>

    </>);

}

export const getServerSideProps = async (context) => {

    return {
        props: {
            displayUrl: context.query.displayUrl,
            downloadUrl: context.query.downloadUrl,
            uploaderEmail: context.query.uploaderEmail,
            hashtags: context.query.hashtags,
            likes: context.query.likes,
            reports: context.query.reports,
        }
    }

}

export default ImgPageProfile;