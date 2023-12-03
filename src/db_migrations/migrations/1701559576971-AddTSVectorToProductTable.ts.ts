import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTSVectorToProductTable1701559576971
  implements MigrationInterface
{
  name = 'AddTSVectorToProductTable1701559576971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" ADD COLUMN "fts_document" tsvector 
    GENERATED  ALWAYS  AS (
            setweight(to_tsvector('english', title), 'A') ||
            setweight(to_tsvector('english', description), 'B')
        ) STORED`,
    );

    await queryRunner.query(
      `CREATE INDEX "product_fts_document_idx" ON "Product" USING GIN ("fts_document")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."product_fts_document_idx"`);
    await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "fts_document"`);
  }
}
