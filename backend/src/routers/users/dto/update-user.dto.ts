import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from 'src/routers/users/entities/user.entity';

export class UpdateUserDto extends PartialType(UserEntity) {}
