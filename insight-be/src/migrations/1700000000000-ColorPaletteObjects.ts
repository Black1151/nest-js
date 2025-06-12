import { MigrationInterface, QueryRunner } from 'typeorm';

export class ColorPaletteObjects1700000000000 implements MigrationInterface {
  name = 'ColorPaletteObjects1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "color_palettes" RENAME COLUMN "colors" TO "colors_old"`);
    await queryRunner.query(`ALTER TABLE "color_palettes" ADD "colors" jsonb`);
    await queryRunner.query(`UPDATE "color_palettes" SET "colors" = (
      SELECT jsonb_agg(jsonb_build_object('name', idx - 1, 'value', color))
      FROM jsonb_array_elements_text(colors_old) WITH ORDINALITY arr(color, idx)
    )`);
    await queryRunner.query(`ALTER TABLE "color_palettes" DROP COLUMN "colors_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "color_palettes" ADD "colors_old" jsonb`);
    await queryRunner.query(`UPDATE "color_palettes" SET "colors_old" = (
      SELECT jsonb_agg(value->>'value') FROM jsonb_array_elements(colors) value
    )`);
    await queryRunner.query(`ALTER TABLE "color_palettes" DROP COLUMN "colors"`);
    await queryRunner.query(`ALTER TABLE "color_palettes" RENAME COLUMN "colors_old" TO "colors"`);
  }
}
