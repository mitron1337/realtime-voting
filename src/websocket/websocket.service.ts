import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebsocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  broadcastNewPoll(poll: any) {
    if (this.server) {
      this.server.emit('newPoll', {
        type: 'NEW_POLL',
        data: poll
      });
    }
  }

  broadcastVoteUpdate(pollId: string, results: any) {
    if (this.server) {
      this.server.emit('voteUpdate', {
        type: 'VOTE_UPDATE',
        pollId,
        data: results
      });
    }
  }

  broadcastPollUpdate(pollId: string, isActive: boolean) {
    if (this.server) {
      this.server.emit('pollUpdate', {
        type: 'POLL_STATUS_UPDATE',
        pollId,
        isActive
      });
    }
  }

  broadcastPollDelete(pollId: string) {
    if (this.server) {
      this.server.emit('pollDelete', {
        type: 'POLL_DELETED',
        pollId
      });
    }
  }
}