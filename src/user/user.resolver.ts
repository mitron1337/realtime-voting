import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Poll } from '../entities/poll.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [Poll])
  async polls() {
    try {
      return await this.userService.getActivePolls();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async vote(
    @Args('pollId') pollId: string,
    @Args('option') option: string,
    @Context() context
  ) {
    try {
      const userId = context.req.user.userId;
      return await this.userService.vote(pollId, option, userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
