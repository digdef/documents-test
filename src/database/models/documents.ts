import {Model, Column, Table, DataType} from "sequelize-typescript";

@Table({
    tableName: 'documents'
})
export class Documents extends Model {
    @Column({
        type: DataType.STRING,
    })
    name!: string;

    @Column({
        type: DataType.JSONB,
    })
    fields!: object;

    @Column({
        type: DataType.ENUM('verified', 'rejected', 'requested', 'new'),
        defaultValue: 'new',
    })
    status!: string;

    @Column({
        type: DataType.INTEGER,
    })
    userId!: number;
}