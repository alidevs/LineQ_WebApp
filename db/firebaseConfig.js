const firebase = require("firebase")
const admin = require("firebase-admin")
const googleStorage = require('@google-cloud/storage');
const firstServiceAccount = require("./serviceAccountKey.json")
const firebaseConfig = require("./firebaseConfig.json")

const storage = new googleStorage.Storage({
	projectId: "lineq-c30c3",
	keyFilename: `${__dirname}\\serviceAccountKey.json`
})

let storageConfig = {
	credential: admin.credential.cert(firstServiceAccount),
	databaseURL: "gs://lineq-c30c3.appspot.com"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
admin.initializeApp(storageConfig, 'second')

global.bucket = storage.bucket("lineq-c30c3.appspot.com")

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		console.log(`User UID: ${user.uid}\t\tEmail: ${user.email}`)
	}
})

module.exports = {
	admin,
}