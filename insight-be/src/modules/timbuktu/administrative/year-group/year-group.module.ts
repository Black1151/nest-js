// year-group.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { YearGroupEntity } from './year-group.entity';
import { KeyStageEntity } from '../key-stage/key-stage.entity'; // ← add
import { YearGroupBootstrapService } from './year-group.bootstrap'; // or wherever it lives
import { YearGroupService } from './year-group.service';
import { YearGroupResolver } from './year-group.resolver';

// If you already have a KeyStageModule that exports its repository, you can
// *instead* import that module (see next section).  Either way is fine.
@Module({
  imports: [
    TypeOrmModule.forFeature([YearGroupEntity, KeyStageEntity]), // ← add the second entity
    // forwardRef(() => KeyStageModule),  // optional alternative
  ],
  providers: [YearGroupService, YearGroupResolver, YearGroupBootstrapService],
  exports: [YearGroupService],
})
export class YearGroupModule {}
