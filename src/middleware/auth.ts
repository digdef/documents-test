import {NextFunction, Request, Response} from "express";
const jwt = require("jsonwebtoken");

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    if (token.toLowerCase().startsWith('bearer')) {
        token = token.slice('bearer'.length).trim();
    }
    try {
        req.query.user = jwt.verify(token, process.env.TOKEN_KEY).id;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
