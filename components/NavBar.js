import styles from "../styles/NavBar.module.css"

import { useRouter } from "next/router";
import Link from 'next/link'

import { auth, signInWithGoogle, signOutFunc } from "../public/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const NavBar = () => {

    const [user] = useAuthState(auth)
    const router = useRouter()

    // start search on pressing enter
    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            router.push({
                pathname: '/browse',
                query: { search: e.target.value }
            })
        }
    }

    return (

        <div className={styles.navBar}>

            <div className={styles.search}>

                <div className={styles.searchBar}>

                    <button><img src="/search.png"></img></button>
                    <input type="text" placeholder="Something you'd like to see" onKeyUp={handleKeyUp} />

                </div>

                <div className={styles.popularSearch}>

                    <h3>Top searches:</h3>

                    <div>

                        <a>#nature</a>
                        <a>#ferrari</a>
                        <a>#fantasy</a>
                        <a>#city</a>
                        <a>#landscape</a>

                    </div>

                </div>

            </div>

            <div className={styles.menu}>

                <a href="/">Home</a>
                <a href="/browse">Browse</a>
                <a href="/categories">Categories</a>
                <a href="/about">About</a>

                {/* if user is signed in display user menu */}
                {user == null || user == [] ?
                    <a className={styles.logIn} onClick={signInWithGoogle}>Log In</a>
                    :
                    <div className={styles.dropdown}>
                        <a className={styles.loggedIn}>{user.displayName.split(' ')[0]} ▼</a>
                        <div className={styles.dropdowncontent}>
                            <a className={styles.item} href="/upload">Upload</a>
                            <Link
                            href={{
                                pathname: `profile/${user.uid}`,
                                query: {
                                    profile: user.uid
                                }
                            }}
                        >
                            <a className={styles.item}>My profile</a>
                        </Link>
                            <a className={styles.item} onClick={signOutFunc}>Log Out</a>
                        </div>
                    </div>
                }

            </div>

        </div>
    );
}

export default NavBar;

