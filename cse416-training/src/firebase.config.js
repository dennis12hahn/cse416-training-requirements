import * as firebase from "firebase/app";
import { firestore } from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAs4XIS-dzpP36B95QQa4z0bk_PR8S53lk",
  authDomain: "cse416-training.firebaseapp.com",
  projectId: "cse416-training",
  storageBucket: "cse416-training.appspot.com",
  messagingSenderId: "838408399543",
  appId: "1:838408399543:web:6c11f4dc6956fed2757b32",
  measurementId: "G-E7F66BCT9L",
});

const db = firebase.firestore();

export default db;