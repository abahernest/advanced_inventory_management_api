import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetProductIdAsPrimaryKeyOnInventoryTable1701608311076
  implements MigrationInterface
{
  name = 'SetProductIdAsPrimaryKeyOnInventoryTable1701608311076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Inventory" DROP CONSTRAINT "FK_3475245e7836598e0656aa76fb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Inventory" ADD CONSTRAINT "UQ_3475245e7836598e0656aa76fb6" UNIQUE ("product_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Inventory" ADD CONSTRAINT "FK_3475245e7836598e0656aa76fb6" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Inventory" DROP CONSTRAINT "FK_3475245e7836598e0656aa76fb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Inventory" DROP CONSTRAINT "UQ_3475245e7836598e0656aa76fb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Inventory" ADD CONSTRAINT "FK_3475245e7836598e0656aa76fb6" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
