const admin = require("firebase-admin")
const firebase = require("firebase")

let { database } = require("./../db/firebaseConfig")
admin.initializeApp()

// POST /admin/register
let createRestaurantAccount = (req, res) => {
	let { email, password } = req.body

	const userAuth = firebase.auth().createUserWithEmailAndPassword(email, password)
	.then((userRecord) => {
		res.send(userRecord.user.uid)

		return userRecord.getIdToken().then((idToken) => {
			const csrfToken = getCookie('csrfToken')
			return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
		})
	})
	.catch((error) => {
		console.log(`ERROR: ${error.message}`)
	})
}

let loginRestaurantAccount = (req, res, next) => {
	let { email, password } = req.body

	if (!email) return res.status(400).json({ error: "Missing email" })
	if (!password) return res.status(400).json({ error: "Missing password" })

	firebase.auth().signInWithEmailAndPassword(email, password)
	.then((user) => {
		req.session.user = user.user
		res.send(req.session.user)
	}).catch((error) => {
		res.send({
			errorCode: error.code,
			errorMessage: error.message
		})
	})
}

let homePage = (req, res) => {
	// res.send(firebase.auth().currentUser.email)
	res.send(req.session.user)
	// res.render("home")
}

let logout = (req, res) => {
	firebase.auth().signOut().then(() => {
		req.session.reset()
		res.send({ success: "User signed out successfully" })
	}).catch((error) => {
		res.send({ error: error.message })
	})
}

module.exports = {
	createRestaurantAccount,
	loginRestaurantAccount,
	homePage,
	logout,
}