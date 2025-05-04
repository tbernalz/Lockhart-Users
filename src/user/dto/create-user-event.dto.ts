import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserEventDto {
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  eventType: string;

  @IsNotEmpty()
  payload: any;

  @IsNotEmpty()
  @IsString()
  timestamp: string;
}
