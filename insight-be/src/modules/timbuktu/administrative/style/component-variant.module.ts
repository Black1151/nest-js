import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentVariantEntity } from './component-variant.entity';
import { ComponentVariantResolver } from './component-variant.resolver';
import { ComponentVariantService } from './component-variant.service';
import { ThemeEntity } from '../theme/theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentVariantEntity, ThemeEntity])],
  providers: [ComponentVariantService, ComponentVariantResolver],
  exports: [ComponentVariantService],
})
export class ComponentVariantModule {}
