import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { ComboBets } from "./ComboBets";
import { SingleBets } from "./SingleBets";

@Index("user_id", ["userId"], {})
@Entity("bets", { schema: "mini" })
export class Bets {
  @PrimaryGeneratedColumn({ type: "int", name: "bet_id" })
  betId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("enum", { name: "bet_type", enum: ["single", "combo"] })
  betType: "single" | "combo";

  @Column("decimal", { name: "stake", precision: 10, scale: 2 })
  stake: string;

  @Column("decimal", { name: "potential_win", precision: 10, scale: 2 })
  potentialWin: string;

  @Column("decimal", {
    name: "total_potential_win",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  totalPotentialWin: string | null;

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

  @ManyToOne(() => Users, (users) => users.bets, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(() => ComboBets, (comboBets) => comboBets.bet)
  comboBets: ComboBets[];

  @OneToMany(() => SingleBets, (singleBets) => singleBets.bet)
  singleBets: SingleBets[];
}
