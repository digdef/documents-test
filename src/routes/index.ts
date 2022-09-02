import {Request, Response, Router} from "express";
import {DocumentTypes} from "../database/models/documentTypes";
import {Documents} from "../database/models/documents";
import {Users} from "../database/models/users";

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const router = Router();
module.exports = router;

interface CreateDocument {
    name: string,
    fields: Array<{
        value: string | number | boolean | Date,
        name: string,
    }>
}

router.post("/register", async (req: Request, res: Response, next) => {
    try {
        const data = req.body;

        if (!(data.nickname && data.password)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await Users.findOne({
            where: {
                nickname: data.nickname
            }
        });

        if (oldUser) {
            return res.status(409).send("User already exist");
        }

        const password = await bcrypt.hash(data.password, 10);

        const user = await Users.create({
            nickname: data.nickname,
            password,
            type: data.type,
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        res.status(201).json({ token });
    } catch (e) {
        next(e);
    }
});

router.post("/login", async (req: Request, res: Response, next) =>  {
    try {
        const { nickname, password } = req.body;

        if (!(nickname && password)) {
            return res.status(400).send("All input is required");
        }
        const user = await Users.findOne({
            where: {
                nickname
            }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user.id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            return res.status(200).json({token});
        }
        res.status(400).send("Invalid Credentials");
    } catch (e) {
        next(e);
    }
});

router.post('/create', auth, async (req: Request, res: Response, next) => {
    try {
        const data = req.body;
        const errorField: Array<object> = [];

        await Promise.all(
            data.map(async (el: CreateDocument) => {
                const checkDocument = await DocumentTypes.findOne({
                    where: {
                        name: el.name
                    }
                });
                el.fields.forEach((field) => {
                    const type = checkDocument?.fields.find((item) => item.name === field.name);
                    switch (type?.type) {
                        case 'string':
                            if (!(typeof field.value === 'string')) {
                                errorField.push({
                                    field: field.name,
                                    document: checkDocument?.name,
                                    message: `This field must be a string`
                                });
                            }
                            break;
                        case 'date':
                            if (isNaN(Date.parse(<string>field.value))) {
                                errorField.push({
                                    field: field.name,
                                    document: checkDocument?.name,
                                    message: `This field must be a date`
                                });
                            }
                            break;
                        case 'number':
                            if (!(typeof field.value === 'number')) {
                                errorField.push({
                                    field: field.name,
                                    document: checkDocument?.name,
                                    message: `This field must be a number`
                                });
                            }
                            break;
                        case 'boolean':
                            if (!(typeof field.value === 'boolean')) {
                                errorField.push({
                                    field: field.name,
                                    document: checkDocument?.name,
                                    message: `This field must be a boolean value`
                                });
                            }
                            break;
                        default:
                            errorField.push({
                                field: field.name,
                                document: checkDocument?.name,
                                message: `Unknown field`
                            })
                    }
                });
            })
        );

        if (errorField.length) {
            return res.status(400).json({
                error: 'There is an error in one or more of the fields',
                fields: errorField
            });
        }

        const result = await Promise.all(
            data.map(async (el: CreateDocument) => {
                return await Documents.create({
                    name: el.name,
                    userId: req.query.user,
                    fields: el.fields,
                })
            })
        );

        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
});

router.get('/documents-types', auth, async (req: Request, res: Response, next) => {
    try {
        res.json(await DocumentTypes.findAll());
    } catch (e) {
        next(e);
    }
});

router.get('/my-documents', auth, async (req: Request, res: Response, next) => {
    try {
        res.json(await Documents.findAll({
            where: {
                userId: req.query.user
            }
        }));
    } catch (e) {
        next(e);
    }
});

router.get('/admin/users', authAdmin, async (req: Request, res: Response, next) => {
    try {
        res.json(await Users.findAll({
            where: {
                type: 'user'
            }
        }));
    } catch (e) {
        next(e);
    }
});

router.get('/admin/documents', authAdmin, async (req: Request, res: Response, next) => {
    try {
        res.json(await Documents.findAll());
    } catch (e) {
        next(e);
    }
});

router.get('/admin/documents/:userId', authAdmin, async (req: Request, res: Response, next) => {
    try {
        res.json(await Documents.findAll({
            where: {
                userId: Number(req.params['userId'])
            }
        }));
    } catch (e) {
        next(e);
    }
});

router.post('/admin/create', authAdmin, async (req: Request, res: Response, next) => {
    try {
        const data = req.body;
        const checkDocument = await DocumentTypes.findOne({
            where: {
                name: data.name
            }
        });

        if (checkDocument) {
            return res.status(400).send('There is already a document');
        }

        const documentTypes = await DocumentTypes.create(req.body);
        res.status(201).json(documentTypes);
    } catch (e) {
        next(e);
    }
});

router.post('/admin/document/change-status', authAdmin, async (req: Request, res: Response, next) => {
    try {
        const { status, id } = req.body;
        if (
            status !== 'verified' &&
            status !== 'rejected' &&
            status !== 'requested' &&
            status !== 'new'
        ) {
            return res.status(400).send('There is no such status');
        }
        await Documents.update<Documents>({ status }, {
            where: {
                id
            }
        });
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});
