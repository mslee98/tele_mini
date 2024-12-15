import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("odds_id", ["oddsId"], {})
@Entity("overunderodds", { schema: "mini" })
export class Overunderodds {
  @PrimaryGeneratedColumn({ type: "int", name: "over_under_id" })
  overUnderId: number;

  @Column("int", { name: "odds_id" })
  oddsId: number;

  @Column("decimal", { name: "point", precision: 5, scale: 2 })
  point: string;

  @Column("decimal", { name: "over", precision: 5, scale: 2 })
  over: string;

  @Column("decimal", { name: "under", precision: 5, scale: 2 })
  under: string;
}
