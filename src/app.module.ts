import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { User } from './entities/user.entity';
import { Poll } from './entities/poll.entity';
import { Vote } from './entities/vote.entity';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { WebsocketService } from './websocket/websocket.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mitron2020',
      database: 'postgres',
      entities: [User, Poll, Vote],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Poll, Vote]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [AuthController, AdminController],
  providers: [
    AuthService, 
    AdminService, 
    UserResolver, 
    UserService, 
    WebsocketGateway, 
    WebsocketService
  ],
})
export class AppModule {}