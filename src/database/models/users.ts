import {Model, Column, Table, DataType} from "sequelize-typescript";

@Table({
    tableName: 'users'
})
export class Users extends Model {
    @Column({
        type: DataType.STRING,
    })
    nickname!: string;

    @Column({
        type: DataType.STRING,
    })
    password!: string;

    @Column({
        type: DataType.ENUM('user', 'admin'),
        defaultValue: 'user',
    })
    type!: string;
}