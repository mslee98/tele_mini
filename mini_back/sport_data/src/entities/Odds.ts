import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Games } from "./Games";

@Index("game_id", ["gameId"], {})
@Entity("odds", { schema: "mini" })
export class Odds {
  @PrimaryGeneratedColumn({ type: "int", name: "odds_id" })
  oddsId: number;

  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("enum", {
    name: "type",
    enum: ["win_draw_lose", "handicap", "over_under", "custom"],
  })
  type: "win_draw_lose" | "handicap" | "over_under" | "custom";

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

  @OneToMany(() => Games, (games) => games.odds)
  games: Games[];
}
