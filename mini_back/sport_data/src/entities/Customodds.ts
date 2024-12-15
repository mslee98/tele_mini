import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("odds_id", ["oddsId"], {})
@Entity("customodds", { schema: "mini" })
export class Customodds {
  @PrimaryGeneratedColumn({ type: "int", name: "custom_odds_id" })
  customOddsId: number;

  @Column("int", { name: "odds_id" })
  oddsId: number;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("decimal", { name: "value", precision: 5, scale: 2 })
  value: string;
}
