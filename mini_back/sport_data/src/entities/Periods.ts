import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("game_id", ["gameId"], {})
@Entity("periods", { schema: "mini" })
export class Periods {
  @PrimaryGeneratedColumn({ type: "int", name: "period_id" })
  periodId: number;

  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;

  @Column("int", { name: "period_number", nullable: true })
  periodNumber: number | null;

  @Column("int", { name: "home_team_score", nullable: true })
  homeTeamScore: number | null;

  @Column("int", { name: "away_team_score", nullable: true })
  awayTeamScore: number | null;

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
}
