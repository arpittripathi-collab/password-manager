const jwt = require('jsonwebtoken');
const User = require("../models/schema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;

        // if (!token) {
        //     return res.status(401).json({ error: "No token provided" });
        // }

        const verify = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verify._id, "tokens.token": token });

        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ error: "Unauthorized user." });
    }
};

module.exports = authenticate;
