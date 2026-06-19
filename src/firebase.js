// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ref as dbRef, set } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABxgB0l9C8dGnGLoSw7KkOba59V2cMr48",
  authDomain: "florascent2026.firebaseapp.com",
  databaseURL: "https://florascent2026-default-rtdb.firebaseio.com",
  projectId: "florascent2026",
  storageBucket: "florascent2026.firebasestorage.app",
  messagingSenderId: "1034431527621",
  appId: "1:1034431527621:web:1c9155e4ef98c87cf6ceac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

/**
 * 重置任意 Firebase 節點
 * @param {string} path - 節點路徑 (例如 'controlSignal/voteResult')
 * @param {any} defaultValue - 重置後的預設值 (如果不傳，預設為 null，即刪除節點)
 */
export async function ResetNode(path, defaultValue = null) {
  const nodeRef = dbRef(db, path);
  
  try {
    await set(nodeRef, defaultValue);
  } catch (error) {
    console.error(`[ResetNode] 重置節點 '${path}' 失敗:`, error);
  }
}

export { auth, db }
