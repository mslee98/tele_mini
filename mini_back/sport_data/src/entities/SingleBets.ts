import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bets } from "./Bets";

@Index("bet_id", ["betId"], {})
@Index("game_id", ["gameId"], {})
@Index("odds_id", ["oddsId"], {})
@Entity("single_bets", { schema: "mini" })
export class SingleBets {
  @PrimaryGeneratedColumn({ type: "int", name: "single_bet_id" })
  singleBetId: number;

  @Column("int", { name: "bet_id" })
  betId: number;

  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("int", { name: "odds_id" })
  oddsId: number;

  @Column("enum", {
    name: "odds_type",
    enum: ["win_draw_lose", "handicap", "over_under", "custom"],
  })
  oddsType: "win_draw_lose" | "handicap" | "over_under" | "custom";

  @Column("decimal", { name: "stake", precision: 10, scale: 2 })
  stake: string;

  @Column("decimal", { name: "potential_win", precision: 10, scale: 2, nullable: true })
  potentialWin: string;

  @Column("enum", {
      name: "result_status",
      enum: ["R", "W", "L"],
      default: "R",
      nullable: true,
  })
  resultStatus: "R" | "W" | "L" | null;

  @Column("decimal", {
    name: "result_amount",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  resultAmount: string | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(() => Bets, (bets) => bets.singleBets, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "bet_id", referencedColumnName: "betId" }])
  bet: Bets;
}
