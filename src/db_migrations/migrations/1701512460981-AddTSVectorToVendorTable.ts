import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTSVectorToVendorTable1701512460981
  implements MigrationInterface
{
  name = 'AddTSVectorToVendorTable1701512460981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Vendor" ADD COLUMN "fts_document" tsvector 
    GENERATED  ALWAYS  AS (
            setweight(to_tsvector('simple', name), 'A') ||
            setweight(to_tsvector('english', address), 'B')
        ) STORED`,
    );

    await queryRunner.query(
      `CREATE INDEX "vendor_fts_document_idx" ON "Vendor" USING GIN ("fts_document")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."vendor_fts_document_idx"`);
    await queryRunner.query(`ALTER TABLE "Vendor" DROP COLUMN "fts_document"`);
  }
}
