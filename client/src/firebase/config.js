import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPN1qB_Np2AOn9DCSqJ0M3UOg8QtNX3ME",
  authDomain: "focuspod-6b719.firebaseapp.com",
  projectId: "focuspod-6b719",
  storageBucket: "focuspod-6b719.appspot.com",
  messagingSenderId: "435569878532",
  appId: "1:435569878532:web:5e39fc1489e2b72d4c3751",
  measurementId: "G-B0Q320HZB7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
