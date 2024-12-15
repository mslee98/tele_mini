import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Leagues } from "./Leagues";

@Index("league_id", ["leagueId"], {})
@Entity("seasons", { schema: "mini" })
export class Seasons {
  @PrimaryGeneratedColumn({ type: "int", name: "season_id" })
  seasonId: number;

  @Column("varchar", { name: "season_name", length: 255 })
  seasonName: string;

  @Column("int", { name: "league_id" })
  leagueId: number;

  @Column("int", { name: "year" })
  year: number;

  @Column("date", { name: "start_date", nullable: true })
  startDate: Date | null;

  @Column("date", { name: "end_date", nullable: true })
  endDate: Date | null;

  @Column("tinyint", {
    name: "is_active",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

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

  @ManyToOne(() => Leagues, (leagues) => leagues.seasons, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "league_id", referencedColumnName: "leagueId" }])
  league: Leagues;
}
