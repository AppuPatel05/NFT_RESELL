import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { OTP } from '../shared/entity/otp.entity';

@EntityRepository(OTP)
export class OTPRepository extends Repository<OTP> {
  async OTPSave(otp:OTP) {
      try {
        
        const saveOtp = await otp.save();
        
        setTimeout(() => {
          this.createQueryBuilder('otp')
          .update()
          .set({isDeleted:true})
          .where("otp.otp= :otp",{otp:saveOtp.otp})
          .execute()
        }, 60000);
        
        if (saveOtp) {
          return true;
        }

      } catch (error) {
        throw new InternalServerErrorException('AT OTP Repository');
      }
  }
}
