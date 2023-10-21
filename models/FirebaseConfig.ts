import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAxTe35ut6nRUJhIcpgCbaR0C29Hzm1DrA",
  authDomain: "admin-panel-20-oct.firebaseapp.com",
  projectId: "admin-panel-20-oct",
  storageBucket: "admin-panel-20-oct.appspot.com",
  messagingSenderId: "452214874490",
  appId: "1:452214874490:web:3f24836c68c976d7f536c3"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);