import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("league_id", ["leagueId"], {})
@Entity("teams", { schema: "mini" })
export class Teams {
  @PrimaryGeneratedColumn({ type: "int", name: "team_id" })
  teamId: number;

  @Column("varchar", { name: "team_name_en", length: 255 })
  teamNameEn: string;

  @Column("varchar", { name: "team_name_kr", length: 255 })
  teamNameKr: string;

  @Column("varchar", { name: "team_short_name_kr", nullable: true, length: 50 })
  teamShortNameKr: string | null;

  @Column("int", { name: "league_id", nullable: true })
  leagueId: number | null;

  @Column("tinyint", {
    name: "is_active",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @Column("varchar", { name: "logo_path", nullable: true, length: 255 })
  logoPath: string | null;

  @Column("varchar", { name: "team_color", nullable: true, length: 7 })
  teamColor: string | null;

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
