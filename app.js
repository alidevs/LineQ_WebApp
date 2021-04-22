require("./db/firebaseConfig")
const express = require("express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const session = require("client-sessions")

const app = express()

const {
	createRestaurantAccount,
	loginRestaurantAccount,
	homePage,
	logout,
} = require("./controller/admin")

const {
	addNewRestaurant,
	listRestaurants,
	listQueue,
	updateQueue,
} = require("./controller/restaurantController")
const authenticate = require("./middleware/authenticate")

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
	cookieName: 'session',
	secret: 'random_string_goes_here',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

app.route("/admin/register")
	.post(createRestaurantAccount)

app.route("/admin/login")
	.post(loginRestaurantAccount)

app.route("/admin/logout")
	.post(logout)

app.route("/admin")
	.get(authenticate, homePage)

app.route("/restaurant/add")
	.post(authenticate, addNewRestaurant)

app.route("/restaurant/list")
	.get(authenticate, listRestaurants)

app.route("/restaurant/queue")
	.get(authenticate, listQueue)
	.delete(authenticate, updateQueue)

app.listen(3000, () => console.log(`* Server running on http://localhost:3000`))