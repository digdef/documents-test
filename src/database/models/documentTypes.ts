import {Model, Column, Table, DataType} from "sequelize-typescript";

@Table({
    tableName: 'document_types'
})
export class DocumentTypes extends Model {
    @Column({
        type: DataType.STRING,
    })
    name!: string;

    @Column({
        type: DataType.JSONB,
    })
    fields!: Array<{
        name: string,
        type: string,
    }>;
}