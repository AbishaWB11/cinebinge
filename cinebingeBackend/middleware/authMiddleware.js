const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, "secretkey");

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = protect;