import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { Vote } from '../entities/vote.entity';
import { User } from '../entities/user.entity';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Poll)
    private pollRepo: Repository<Poll>,
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private websocketService: WebsocketService,
  ) {}

  async getActivePolls() {
    return await this.pollRepo.find({ 
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async vote(pollId: string, option: string, userId: string) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    if (!poll) {
      throw new Error('Poll topilmadi');
    }

    if (!poll.isActive) {
      throw new Error('Poll faol emas');
    }

    if (!poll.options.includes(option)) {
      throw new Error('Noto\'g\'ri variant');
    }

    const existingVote = await this.voteRepo.findOne({
      where: { 
        user: { id: userId },
        poll: { id: pollId }
      }
    });

    if (existingVote) {
      throw new Error('Siz allaqachon ovoz bergansiz');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }
    
    const vote = this.voteRepo.create({
      selectedOption: option,
      user,
      poll
    });

    await this.voteRepo.save(vote);
    
    const updatedResults = await this.getPollResults(pollId);
    this.websocketService.broadcastVoteUpdate(pollId, updatedResults);
    
    return true;
  }

private async getPollResults(pollId: string) {
  const votes = await this.voteRepo.find({ where: { poll: { id: pollId } } });
  const poll = await this.pollRepo.findOne({ where: { id: pollId } });

  if (!poll) {
    throw new Error('Poll topilmadi');
  }

  const results = {};
  poll.options.forEach(option => {
    results[option] = votes.filter(vote => vote.selectedOption === option).length;
  });

  return {
    pollId,
    results,
    totalVotes: votes.length
  };
}

}