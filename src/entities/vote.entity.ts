import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Poll } from './poll.entity';

@ObjectType()
@Entity('votes')
export class Vote {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  selectedOption: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.votes)
  user: User;

  @Field(() => Poll)
  @ManyToOne(() => Poll, poll => poll.votes)
  poll: Poll;
}
