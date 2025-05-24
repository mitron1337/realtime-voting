import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

class CreatePollDto {
  question: string;
  options: string[];
}

class UpdatePollDto {
  isActive: boolean;
}

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('polls')
  @ApiOperation({ summary: 'Yangi poll yaratish' })
  async createPoll(@Body() createPollDto: CreatePollDto, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Ruxsat yoq' };
    }

    try {
      return await this.adminService.createPoll(
        createPollDto.question,
        createPollDto.options,
        req.user.userId
      );
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('polls/:id/results')
  @ApiOperation({ summary: 'Poll natijalarini olish' })
  async getPollResults(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Ruxsat yoq' };
    }

    try {
      return await this.adminService.getPollResults(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch('polls/:id')
  @ApiOperation({ summary: 'Pollni yangilash' })
  async updatePoll(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Ruxsat yoq' };
    }

    try {
      return await this.adminService.updatePoll(id, updatePollDto.isActive);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('polls/:id')
  @ApiOperation({ summary: 'Pollni ochirish' })
  async deletePoll(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Ruxsat yoq' };
    }

    try {
      return await this.adminService.deletePoll(id);
    } catch (error) {
      return { error: error.message };
    }
  }
}