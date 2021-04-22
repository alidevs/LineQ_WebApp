module.exports = function (req, res, next) {
    if (req.session && req.session.user) {
        req.user = req.session.user
        next()
    } else {
        res.send({ error: "No user signed in" })
    }
}
