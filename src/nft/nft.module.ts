import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user-repository';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { NFTRepository } from './nft-repository';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NFTRepository,UserRepository]),
    TypeOrmModule.forRoot(TypeOrmConfig)
  ],
  controllers: [NftController],
  providers: [NftService]
})
export class NftModule {}
