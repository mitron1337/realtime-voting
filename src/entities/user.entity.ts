import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ default: 'user' })
  role: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Poll])
  @OneToMany(() => Poll, poll => poll.createdBy)
  polls: Poll[];

  @Field(() => [Vote])
  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];
}
