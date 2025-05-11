import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { YearGroupEntity, ValidYear } from './year-group.entity';
import { KeyStageEntity, ValidKeyStage } from '../key-stage/key-stage.entity';

@Injectable()
export class YearGroupBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(YearGroupBootstrapService.name);

  constructor(
    @InjectRepository(YearGroupEntity)
    private readonly yearGroupRepo: Repository<YearGroupEntity>,
    @InjectRepository(KeyStageEntity)
    private readonly keyStageRepo: Repository<KeyStageEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // ──────────────────────────────────────────────────────────────────────────
    // 1.  Key‑Stage bootstrap
    // ──────────────────────────────────────────────────────────────────────────
    const REQUIRED_STAGES: ValidKeyStage[] = [
      ValidKeyStage.KS3, // 3
      ValidKeyStage.KS4, // 4
      ValidKeyStage.KS5, // 5
    ];

    /**
     * 1A.  Ensure KS3/4/5 exist (stage + name="KS3|KS4|KS5")
     * ------------------------------------------------------
     */
    const existingStages = await this.keyStageRepo.find({
      where: { stage: In(REQUIRED_STAGES) },
      select: ['stage'],
    });

    const presentStages = new Set(existingStages.map((k) => k.stage));
    const missingStages = REQUIRED_STAGES.filter((s) => !presentStages.has(s));

    if (missingStages.length) {
      await this.keyStageRepo.save(
        missingStages.map((stage) =>
          this.keyStageRepo.create({
            stage,
            // ↓ convert numeric stage (3/4/5) → string name ("KS3"/"KS4"/"KS5")
            name: `KS${stage}`,
          }),
        ),
      );
      this.logger.log(
        `KeyStage bootstrap: inserted ${missingStages.length} → ${missingStages.join(', ')}`,
      );
    } else {
      this.logger.log('KeyStage bootstrap: all KS3–KS5 present.');
    }

    // Fresh lookup map <stage number → KeyStageEntity>
    const keyStageMap = new Map<ValidKeyStage, KeyStageEntity>(
      (
        await this.keyStageRepo.find({
          where: { stage: In(REQUIRED_STAGES) },
        })
      ).map((k) => [k.stage as ValidKeyStage, k]),
    );

    // ──────────────────────────────────────────────────────────────────────────
    // 2.  Year‑Group bootstrap (with KS linkage)
    // ──────────────────────────────────────────────────────────────────────────
    const REQUIRED_YEARS: ValidYear[] = [
      ValidYear.Year7,
      ValidYear.Year8,
      ValidYear.Year9,
      ValidYear.Year10,
      ValidYear.Year11,
      ValidYear.Year12,
      ValidYear.Year13,
    ];

    const yearLookup = await this.yearGroupRepo.find({
      where: { year: In(REQUIRED_YEARS) },
      select: ['year'],
    });
    const presentYears = new Set(yearLookup.map((y) => y.year));
    const missingYears = REQUIRED_YEARS.filter((y) => !presentYears.has(y));

    if (missingYears.length === 0) {
      this.logger.log('YearGroup bootstrap: all records already present.');
      return;
    }

    // Map each year → correct KS
    const YEAR_TO_STAGE: Record<ValidYear, ValidKeyStage> = {
      [ValidYear.Year7]: ValidKeyStage.KS3,
      [ValidYear.Year8]: ValidKeyStage.KS3,
      [ValidYear.Year9]: ValidKeyStage.KS3,
      [ValidYear.Year10]: ValidKeyStage.KS4,
      [ValidYear.Year11]: ValidKeyStage.KS4,
      [ValidYear.Year12]: ValidKeyStage.KS5,
      [ValidYear.Year13]: ValidKeyStage.KS5,
    };

    const newYearEntities = missingYears.map((year) =>
      this.yearGroupRepo.create({
        year,
        keyStage: keyStageMap.get(YEAR_TO_STAGE[year]),
      }),
    );

    await this.yearGroupRepo.save(newYearEntities);

    this.logger.log(
      `YearGroup bootstrap: inserted ${missingYears.length} record(s) → ${missingYears.join(', ')}`,
    );
  }
}
