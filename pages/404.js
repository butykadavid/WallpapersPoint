import styles from '../styles/Custom404.module.css'


const Custom404 = () => {
    return (
        <div className={styles.container}>
            <h1>404</h1>
            <h2>Page not found</h2>
            <a href='/'>Return to Home</a>
        </div>
    );
}

export default Custom404;