import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RssItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  pubDate: Date;
}
