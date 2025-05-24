import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { Vote } from '../entities/vote.entity';
import { User } from '../entities/user.entity';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Poll)
    private pollRepo: Repository<Poll>,
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private websocketService: WebsocketService,
  ) {}

  async createPoll(question: string, options: string[], userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }
    
    const poll = this.pollRepo.create({
      question,
      options,
      createdBy: user,
    });

    const savedPoll = await this.pollRepo.save(poll);
    
    this.websocketService.broadcastNewPoll(savedPoll);
    
    return savedPoll;
  }

  async getPollResults(pollId: string) {
    const poll = await this.pollRepo.findOne({ 
      where: { id: pollId },
      relations: ['votes'] 
    });

    if (!poll) {
      throw new Error('Poll topilmadi');
    }

    const votes = await this.voteRepo.find({ where: { poll: { id: pollId } } });
    
    const results = {};
    poll.options.forEach(option => {
      results[option] = votes.filter(vote => vote.selectedOption === option).length;
    });

    return {
      poll: {
        id: poll.id,
        question: poll.question,
        options: poll.options,
        isActive: poll.isActive
      },
      results,
      totalVotes: votes.length
    };
  }

  async updatePoll(pollId: string, isActive: boolean) {
    await this.pollRepo.update(pollId, { isActive });
    
    // Poll holatini yangilash haqida xabar
    this.websocketService.broadcastPollUpdate(pollId, isActive);
    
    return { success: true };
  }

  async deletePoll(pollId: string) {
    await this.voteRepo.delete({ poll: { id: pollId } });
    await this.pollRepo.delete(pollId);
    
    // Poll o'chirilgani haqida xabar
    this.websocketService.broadcastPollDelete(pollId);
    
    return { success: true };
  }
}