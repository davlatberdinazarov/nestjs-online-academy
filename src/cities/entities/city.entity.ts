import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "cities" })
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    // Corrected type for the description field
    @Column({ type: "varchar", nullable: true })
    description: string;

    @Column({ type: "boolean", default: true })
    active: boolean;
}
