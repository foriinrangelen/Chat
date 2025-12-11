import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities';

export class UpdateUserDto extends PartialType(UserEntity) {}
