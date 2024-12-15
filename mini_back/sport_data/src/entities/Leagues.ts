import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seasons } from "./Seasons";

@Entity("leagues", { schema: "mini" })
export class Leagues {
  @PrimaryGeneratedColumn({ type: "int", name: "league_id" })
  leagueId: number;

  @Column("varchar", { name: "league_name_en", length: 255 })
  leagueNameEn: string;

  @Column("varchar", { name: "league_name_kr", length: 255 })
  leagueNameKr: string;

  @Column("varchar", { name: "sport_type", nullable: true, length: 50 })
  sportType: string | null;

  @Column("varchar", { name: "country", nullable: true, length: 255 })
  country: string | null;

  @Column("varchar", { name: "logo_path", nullable: true, length: 255 })
  logoPath: string | null;

  @Column("int", { name: "priority", nullable: true, default: () => "'0'" })
  priority: number | null;

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

  @OneToMany(() => Seasons, (seasons) => seasons.league)
  seasons: Seasons[];
}
