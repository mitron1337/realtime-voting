import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private websocketService: WebsocketService) {}

  afterInit(server: Server) {
    this.websocketService.setServer(server);
    console.log('WebSocket server initialized');
  }

handleConnection(client: Socket) {
  console.log(`Client connected: ${client.id}`);

  const token = client.handshake.auth.token;
  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      const payload = jwt.verify(token, secretKey);
      client.data.user = payload;
      if (typeof payload !== 'string' && 'email' in payload) {
        console.log(`Authenticated user: ${payload.email}`);
      } else {
        console.log('Authenticated user with no email property');
      }
    } catch (error) {
      console.log('Invalid token, continuing as guest');
    }
  }
}


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinPoll')
  handleJoinPoll(@MessageBody() pollId: string, @ConnectedSocket() client: Socket) {
    client.join(`poll_${pollId}`);
    client.emit('joinedPoll', { pollId, message: 'Poll xonasiga qo\'shildingiz' });
  }

  @SubscribeMessage('leavePoll')
  handleLeavePoll(@MessageBody() pollId: string, @ConnectedSocket() client: Socket) {
    client.leave(`poll_${pollId}`);
    client.emit('leftPoll', { pollId, message: 'Poll xonasidan chiqtingiz' });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { message: 'Server ishlamoqda', timestamp: new Date() });
  }
}