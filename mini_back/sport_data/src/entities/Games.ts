import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Odds } from "./Odds";

@Index("home_team_id", ["homeTeamId"], {})
@Index("away_team_id", ["awayTeamId"], {})
@Index("season_id", ["seasonId"], {})
@Index("odds_id", ["oddsId"], {})
@Entity("games", { schema: "mini" })
export class Games {
  @PrimaryGeneratedColumn({ type: "int", name: "game_id" })
  gameId: number;

  @Column("int", { name: "season_id" })
  seasonId: number;

  @Column("int", { name: "home_team_id" })
  homeTeamId: number;

  @Column("int", { name: "away_team_id" })
  awayTeamId: number;

  @Column("int", { name: "odds_id", nullable: true })
  oddsId: number | null;

  @Column("datetime", { name: "game_date" })
  gameDate: Date;

  @Column("datetime", { name: "real_start_date_time", nullable: true })
  realStartDateTime: Date | null;

  @Column("int", { name: "home_score", default: () => "'0'" })
  homeScore: number;

  @Column("int", { name: "away_score", default: () => "'0'" })
  awayScore: number;

  @Column("varchar", {
    name: "game_status",
    length: 50,
    default: () => "'Scheduled'",
  })
  gameStatus: string;

  @Column("int", { name: "period", nullable: true })
  period: number | null;

  @Column("varchar", {
    name: "current_period",
    nullable: true,
    length: 50,
    default: () => "'Not Started'",
  })
  currentPeriod: string | null;

  @Column("varchar", {
    name: "time_elapsed",
    nullable: true,
    length: 10,
    default: () => "'00:00'",
  })
  timeElapsed: string | null;

  @Column("longtext", { name: "period_score", nullable: true })
  periodScore: string | null;

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

  @ManyToOne(() => Odds, (odds) => odds.games, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "odds_id", referencedColumnName: "oddsId" }])
  odds: Odds;
}
