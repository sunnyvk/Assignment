import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[ 
        ConfigModule,
    ],
    providers: [TasksService, EmailService],
})
export class TasksModule { }