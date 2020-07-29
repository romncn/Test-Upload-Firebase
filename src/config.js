import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBM9slbZB6VCZsjWVIUy-BK4NDHKv5rEfk",
    authDomain: "test-storage-rom.firebaseapp.com",
    databaseURL: "https://test-storage-rom.firebaseio.com",
    projectId: "test-storage-rom",
    storageBucket: "test-storage-rom.appspot.com",
    messagingSenderId: "177024075240",
    appId: "1:177024075240:web:f9221b81efa7cc9a35505d",
    measurementId: "G-D5D8HPWEVG"
};
const store = firebase.initializeApp(config);

export default store;