import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("odds_id", ["oddsId"], {})
@Entity("windrawloseodds", { schema: "mini" })
export class Windrawloseodds {
  @PrimaryGeneratedColumn({ type: "int", name: "win_draw_lose_id" })
  winDrawLoseId: number;

  @Column("int", { name: "odds_id" })
  oddsId: number;

  @Column("decimal", { name: "win", precision: 5, scale: 2 })
  win: string;

  @Column("decimal", { name: "draw", nullable: true, precision: 5, scale: 2 })
  draw: string | null;

  @Column("decimal", { name: "lose", precision: 5, scale: 2 })
  lose: string;
}
