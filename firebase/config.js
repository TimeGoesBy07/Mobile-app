import { initializeApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence } from "@firebase/auth"
import { getDatabase } from "@firebase/database"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHvymtZYto_5ShBhQKNpnBen1vPrHOo_0",
    authDomain: "smart-parking-369015.firebaseapp.com",
    databaseURL: "https://smart-parking-369015-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-parking-369015",
    storageBucket: "smart-parking-369015.appspot.com",
    messagingSenderId: "331957411787",
    appId: "1:331957411787:web:8120da373d098040d4204e",
    measurementId: "G-ZRZ86BYV6Y"
}

export const FIREBASE_APP = initializeApp(firebaseConfig)
export const db = getDatabase(FIREBASE_APP)
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
})