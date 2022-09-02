import { Sequelize } from 'sequelize-typescript'
import dotenv from "dotenv";
import { DocumentTypes } from "./models/documentTypes";
import { Documents } from "./models/documents";
import { Users } from "./models/users";

dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    models: [DocumentTypes, Documents, Users]
})


