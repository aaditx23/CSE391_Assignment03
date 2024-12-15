// Firebase SDK
require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Firebase Configuration (hardcoded)

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
