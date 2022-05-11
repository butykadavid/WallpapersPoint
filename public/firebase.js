import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc, snapshotEqual, } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage'

import { v4 as uuidv4 } from 'uuid'

const firebaseConfig = {
    apiKey: "AIzaSyANaFQxWdigLqQIGnhdj5JY6BKFK8-7ByQ",
    authDomain: "wallpaperspoint-36d6c.firebaseapp.com",
    projectId: "wallpaperspoint-36d6c",
    storageBucket: "wallpaperspoint-36d6c.appspot.com",
    messagingSenderId: "493414425708",
    appId: "1:493414425708:web:fe1b173944a28b8c952449"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app);

const signInWithGoogle = async () => {
    /*await signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });*/
    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                images: [],
                imageLikes: [],
                imageReports: []
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const signOutFunc = () => {
    signOut(auth).then(() => {
        console.log("Sign out successful")
    }).catch((error) => {
        console.error(err);
    });
}

export {
    auth,
    db,
    storage,
    signInWithGoogle,
    signOutFunc,
  };