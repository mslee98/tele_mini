import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("odds_id", ["oddsId"], {})
@Entity("handicapodds", { schema: "mini" })
export class Handicapodds {
  @PrimaryGeneratedColumn({ type: "int", name: "handicap_id" })
  handicapId: number;

  @Column("int", { name: "odds_id" })
  oddsId: number;

  @Column("varchar", { name: "value", length: 10 })
  value: string;

  @Column("decimal", { name: "win", precision: 5, scale: 2 })
  win: string;

  @Column("decimal", { name: "lose", precision: 5, scale: 2 })
  lose: string;
}
