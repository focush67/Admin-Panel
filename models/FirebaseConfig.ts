import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const productConfig = {
  apiKey: "AIzaSyAxTe35ut6nRUJhIcpgCbaR0C29Hzm1DrA",
  authDomain: "admin-panel-20-oct.firebaseapp.com",
  projectId: "admin-panel-20-oct",
  storageBucket: "admin-panel-20-oct.appspot.com",
  messagingSenderId: "452214874490",
  appId: "1:452214874490:web:3f24836c68c976d7f536c3"
};

const categoryConfig = {
  apiKey: "AIzaSyBAruxlNWXyaxHrpCTcVUe4N59xoF7nChg",
  authDomain: "categories-admin-panel.firebaseapp.com",
  projectId: "categories-admin-panel",
  storageBucket: "categories-admin-panel.appspot.com",
  messagingSenderId: "455030907006",
  appId: "1:455030907006:web:0e1f2869e0835061ea782f"
};

const categoryApp = initializeApp(categoryConfig,"categoryApp");
const productApp = initializeApp(productConfig,"productApp");

export const categoryStorage = getStorage(categoryApp);
export const productStorage = getStorage(productApp);