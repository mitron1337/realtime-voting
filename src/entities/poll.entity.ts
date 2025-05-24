import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Vote } from './vote.entity';

@ObjectType()
@Entity('polls')
export class Poll {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  question: string;

  @Field(() => [String])
  @Column('text', { array: true })
  options: string[];

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.polls)
  createdBy: User;

  @Field(() => [Vote])
  @OneToMany(() => Vote, vote => vote.poll)
  votes: Vote[];
}
