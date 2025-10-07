import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  providers: [AccountResolver, AccountService, PrismaService],
})
export class AccountModule {}