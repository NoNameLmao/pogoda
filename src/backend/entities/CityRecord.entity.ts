import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('cities')
export class CityRecord {
    @PrimaryColumn({ unique: true, type: 'int', primary: true, generated: 'increment' })
    id!: number;

    @Column({ type: 'text' })
    name!: string

    @Column({ type: 'text' })
    country!: string

    // coordinates \\
    @Column({ type: 'text' })
    lat!: string

    @Column({ type: 'text' })
    lng!: string
}
