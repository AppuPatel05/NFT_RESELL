import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [AuthModule, NftModule
  ],
})
export class AppModule {}
