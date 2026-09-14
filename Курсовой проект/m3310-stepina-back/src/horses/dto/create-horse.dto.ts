import { IsString, IsOptional, IsUrl, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHorseDto {
  @ApiProperty({ example: 'Борис', description: 'Кличка лошади' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @MinLength(2, { message: 'Имя должно быть не короче 2 символов' })
  name!: string;

  @ApiProperty({ example: 'Мерин', description: 'Пол (Мерин, Жеребец, Кобыла)', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Если поле пол указано, оно не может быть пустым' })
  gender?: string;

  @ApiProperty({ example: 'Орловский рысак', description: 'Порода', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Если поле порода указано, оно не может быть пустым' })
  breed?: string;

  @ApiProperty({ example: 'https://...', description: 'URL фотографии', required: false })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Должна быть корректная ссылка на изображение' })
  photoUrl?: string;
}