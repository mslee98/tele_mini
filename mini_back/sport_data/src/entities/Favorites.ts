import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_id", ["userId"], {})
@Index("game_id", ["gameId"], {})
@Entity("favorites", { schema: "mini" })
export class Favorites {
  @PrimaryGeneratedColumn({ type: "int", name: "favorite_id" })
  favoriteId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
