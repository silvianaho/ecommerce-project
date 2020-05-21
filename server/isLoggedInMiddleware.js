const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({
            message: "Unauthorized [1]"
        });
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
        if (error) {
            res.status(401).send({
                message: "Unauthorized [2]"
            });
            return;
        }

        req.decodedToken = decodedToken;
        next();
    });
}

module.exports = verifyToken 
