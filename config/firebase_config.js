import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnR2PHeejXN9SP-RqiY3cbQhWP0VTmnow",
  authDomain: "adventour-app-31dca.firebaseapp.com",
  projectId: "adventour-app-31dca",
  storageBucket: "adventour-app-31dca.firebasestorage.app",
  messagingSenderId: "843595656509",
  appId: "1:843595656509:web:7d68e1001f619b0afee954",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
