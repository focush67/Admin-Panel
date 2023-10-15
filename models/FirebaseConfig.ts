import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD4bNcbF7XIDYb-zqKAP3yXoK04ZddRpBE",
  authDomain: "frontend-43f86.firebaseapp.com",
  projectId: "frontend-43f86",
  storageBucket: "frontend-43f86.appspot.com",
  messagingSenderId: "695465871072",
  appId: "1:695465871072:web:3e6bbc17db1a2149053285",
  measurementId: "G-8KH6YNQQD4"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);