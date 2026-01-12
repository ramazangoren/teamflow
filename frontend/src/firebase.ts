// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFs8JdBZRc2s2ZFKNgHqfxkAvfKoP5Yhw",
  authDomain: "mern-estate-1890b.firebaseapp.com",
  projectId: "mern-estate-1890b",
  storageBucket: "mern-estate-1890b.appspot.com",
  messagingSenderId: "707444721783",
  appId: "1:707444721783:web:1c4218bfbe385264711e72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
export const storage = getStorage(app);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAFs8JdBZRc2s2ZFKNgHqfxkAvfKoP5Yhw",
//   authDomain: "mern-estate-1890b.firebaseapp.com",
//   projectId: "mern-estate-1890b",
//   storageBucket: "mern-estate-1890b.appspot.com",
//   messagingSenderId: "707444721783",
//   appId: "1:707444721783:web:1c4218bfbe385264711e72"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);