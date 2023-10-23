import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('cities')
export class CityRecord {
    @PrimaryColumn({ unique: true, type: 'int', primary: true, generated: 'increment' })
    id: number;

    @Column({ type: 'string' })
    name: string

    @Column({ type: 'string' })
    country: string
}