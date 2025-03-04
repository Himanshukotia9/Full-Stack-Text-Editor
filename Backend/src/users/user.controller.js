//user.controller.js
const User = require("./user.model");

const createAUser = async(req,res) => {
    try {
        const { email, username, photo = '' } = req.body;

        // Check if the user exists in the database
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, update their last login timestamp
            user.lastLogin = new Date();
            await user.save();
            return res.status(200).json({ message: "User exists, updated login time", user });
        } else {
            // If new user, create entry in DB
            user = new User({ email, username, photo, createdAt: new Date(), lastLogin: new Date() });
            await user.save();
            return res.status(201).json({ message: "New user created", user });
        }
    } catch (error) {
        console.error("Error handling user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getUsers = async(req,res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createAUser,
    getUsers,
}