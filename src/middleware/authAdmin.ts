import {NextFunction, Request, Response} from "express";
import {Users} from "../database/models/users";
const jwt = require("jsonwebtoken");

const verifyTokenAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    if (token.toLowerCase().startsWith('bearer')) {
        token = token.slice('bearer'.length).trim();
    }
    try {
        req.query.user = jwt.verify(token, process.env.TOKEN_KEY).id;
        const user = await Users.findOne({
            where: {
                id: req.query.user,
            }
        });
        if (user?.type !== 'admin') {
            return res.status(403).send("You have no access");
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyTokenAdmin;
