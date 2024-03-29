import Link from 'next/link'

const TopImagesComponent = ({ images }) => {

  return images.map((image) => {

    return (
      <Link key={image.uid}
        href={{
          pathname: `browse/${image.uid} `,
          query: {
            displayUrl: image.displayUrl,
            downloadUrl: image.downloadUrl,
            uploaderEmail: image.uploadedBy.email,
            hashtags: image.hashtags,
            likes: image.likes,
            reports: image.reports
          }
        }}
      >
        <img src={image.displayUrl} />
      </Link>
    );

  });

}

export default TopImagesComponent;