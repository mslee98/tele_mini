import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bets } from "./Bets";

@Index("unique_tele_id", ["teleId"], { unique: true })
@Index("IDX_2db62d5e5122c8cf3f6082029e", ["teleId"], { unique: true })
@Entity("users", { schema: "mini" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "first_name", length: 255, nullable: true })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 255, nullable: true })
  lastName: string;

  @Column('varchar', { name: 'email', unique: true, length: 30, nullable: true })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30, nullable: true })
  nickname: string;

  // 우선 텔레그램 사용자는 비밀번호 없이 진행
  @Column('varchar', { name: 'password', length: 100, select: false, nullable: true })
  password: string;

  @Column('boolean', { name: 'is_first_visit', default: true })
  isFirstVisit: boolean;

  @Column("int", {name: 'visit_count', default: () => 0})
  visitCount: number;

  @Column("datetime", {
    name: "createdAt",
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column("varchar", { name: "tele_id", unique: true, length: 255, nullable: true })
  teleId: string;

  @Column("int", { name: "money", nullable: true })
  money: number;

  @OneToMany(() => Bets, (bets) => bets.user)
  bets: Bets[];
}
