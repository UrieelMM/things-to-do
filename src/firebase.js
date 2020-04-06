import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQyk7aYxatAMlOumVEfqR8KzQzyUbN3g8",
  authDomain: "crud-reactjs-firebase.firebaseapp.com",
  databaseURL: "https://crud-reactjs-firebase.firebaseio.com",
  projectId: "crud-reactjs-firebase",
  storageBucket: "crud-reactjs-firebase.appspot.com",
  messagingSenderId: "767314014814",
  appId: "1:767314014814:web:62dd4d33f152c749b77acf",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}
