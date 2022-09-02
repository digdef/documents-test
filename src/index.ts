import "reflect-metadata";
import express, { Express } from 'express';
import dotenv from 'dotenv';
import {sequelize} from './database/database';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT;

const bootstrap = async () => {
    await sequelize.sync({ force: false });

    const app: Express = express();
    const indexRouter = require('./routes/index');

    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json({limit: '5mb'}))
    app.use(bodyParser.raw())

    app.use('/', indexRouter)

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};

bootstrap();
