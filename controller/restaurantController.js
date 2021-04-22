const firebase = require("firebase")

// POST /restaurant/add
let addNewRestaurant = (req, res) => {
    let { name, category, phone, url, description, imageUrl } = req.body
    let restaurant = {
        name,
        phone,
        category,
        url,
        description,
        imageUrl,
        queue: [
            "BKhkA6f03vZJxgtmQpmHFYcrmXt1",
        ]
    }

    firebase
        .database()
        .ref(`restaurants/${req.session.user.uid}`)
        .once("value")
        .then((snapshot) => {
            snapshot
                .ref
                .push(restaurant)
                .then((record) => res.send(snapshot))
                .catch((error) => res.send({ error }))
        })

}

let listRestaurants = (req, res) => {
    firebase
        .database()
        .ref(`restaurants/${req.session.user.uid}`)
        .once("value")
        .then((snapshot) => {
            res.send(snapshot)
        })
}

let listQueue = (req, res) => {
    let { restaurant } = req.body

    firebase
        .database()
        .ref(`restaurants/${req.session.user.uid}/${restaurant}/queue`)
        .once("value")
        .then((snapshot) => {
            res.send(snapshot)
        })
}

let updateQueue = (req, res) => {
    let { userUid, restaurant } = req.body

    firebase
        .database()
        .ref(`restaurants/${req.session.user.uid}/${restaurant}/queue`)
        .once("value")
        .then((snapshot) => {
            if (snapshot.hasChild(userUid)) {
                res.send(snapshot.val())

                snapshot
                    .ref
                    .on('child_removed', (ss) => {
                        res.send({ss})
                    })
            } else {
                res.send({ error: "User not queued to this restaurant." })
            }
        })
}

module.exports = {
    addNewRestaurant,
    listRestaurants,
    listQueue,
    updateQueue,
}