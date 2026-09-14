import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Индивидуальное занятие' })
  title!: string;

  @ApiPropertyOptional({
    example: 'Персональная тренировка с инструктором',
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({ example: 3200, nullable: true })
  priceRub?: number | null;

  @ApiProperty({ example: '2026-04-01T09:00:00.000Z' })
  createdAt!: Date;
}