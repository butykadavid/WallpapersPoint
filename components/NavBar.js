import styles from "../styles/NavBar.module.css"

import NavBarTagsComponent from "./NavbarTagsComponent"

import { useRouter } from "next/router";
import Link from 'next/link'

import { auth, signInWithGoogle, signOutFunc } from "../public/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const NavBar = ({ tags }) => {

    const [user] = useAuthState(auth)
    const router = useRouter()

    // start search on pressing enter
    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            router.push({
                pathname: '/browse',
                query: {
                    search: e.target.value.toLowerCase(),
                    tags: tags
                }
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

                    <h3>Explore more:</h3>

                    <div>

                        <NavBarTagsComponent tags={tags} />

                    </div>

                </div>

            </div>

            <div className={styles.menu}>

                <Link href="/">Home</Link>
                <Link href="/browse">Browse</Link>
                <Link href="/categories">Categories</Link>
                <Link href="/about">About</Link>

                {/* if user is signed in display user menu */}
                {user == null || user == [] ?
                    <a className={styles.logIn} onClick={signInWithGoogle}>Log In</a>
                    :
                    <div className={styles.dropdown}>
                        <a className={styles.loggedIn}>{user.displayName.split(' ')[0]} ▼</a>
                        <div className={styles.dropdowncontent}>
                            <Link href="/upload"><p className={styles.item}>Upload</p></Link>
                            <Link
                                href={{
                                    pathname: `profile/${user.uid}`,
                                    query: {
                                        profile: user.uid
                                    }
                                }}
                            >
                                <p className={styles.item}>My profile</p>
                            </Link>
                            <a className={styles.item} onClick={signOutFunc}>Log Out</a>
                        </div>
                    </div>
                }

            </div>

            <a className={styles.mobileMenuIcon}><img src="/menu.png" /></a>

            <div className={styles.sideMenu}>

                <div>

                    <Link href="/"><p className={styles.sideMenuItem}>Home</p></Link>
                    <Link href="/browse"><p className={styles.sideMenuItem}>Browse</p></Link>
                    <Link href="/categories"><p className={styles.sideMenuItem}>Categories</p></Link>
                    <Link href="/about"><p className={styles.sideMenuItem}>About</p></Link>

                    {/* if user is signed in display user menu */}
                    {user == null || user == [] ?
                        <a className={styles.logIn} onClick={signInWithGoogle}>Log In</a>
                        :
                        <div>

                            <p className={styles.sideMenuUserName}>{user.displayName.split(' ')[0]}</p>
                            <Link href="/upload"><p className={styles.sideMenuItem_2}>Upload</p></Link>
                            <Link
                                href={{
                                    pathname: `profile/${user.uid}`,
                                    query: {
                                        profile: user.uid
                                    }
                                }}
                            >
                                <p className={styles.sideMenuItem_2}>My profile</p>
                            </Link>
                            <a className={styles.sideMenuItem_2} onClick={signOutFunc}>Log Out</a>

                        </div>

                    }

                </div>

            </div>

        </div>
    );
}

export default NavBar;

