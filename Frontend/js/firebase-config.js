// // Firebase configuration
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCyPrddrhiTH81tA4pugP9j_oWHoEjt0Xo",
//   authDomain: "farmrise-86e54.firebaseapp.com",
//   projectId: "farmrise-86e54",
//   storageBucket: "farmrise-86e54.firebasestorage.app",
//   messagingSenderId: "470415929415",
//   appId: "1:470415929415:web:c01c8a423fce6a63348162",
//   measurementId: "G-QF7253N0PQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);

// export { app, analytics, auth };


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyPrddrhiTH81tA4pugP9j_oWHoEjt0Xo",
  authDomain: "farmrise-86e54.firebaseapp.com",
  projectId: "farmrise-86e54",
  storageBucket: "farmrise-86e54.appspot.com",
  messagingSenderId: "470415929415",
  appId: "1:470415929415:web:c01c8a423fce6a63348162",
  measurementId: "G-QF7253N0PQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };