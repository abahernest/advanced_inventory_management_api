import { MigrationInterface, QueryRunner } from 'typeorm';

export class InventoryTable1701576769161 implements MigrationInterface {
  name = 'InventoryTable1701576769161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Inventory" ("id" SERIAL NOT NULL, "physical_quantity" integer NOT NULL DEFAULT '0', "min_stock_threshold" integer NOT NULL DEFAULT '20', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer NOT NULL, CONSTRAINT "PK_35ccf6f4c1826f5b58c759d2e99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Inventory" ADD CONSTRAINT "FK_3475245e7836598e0656aa76fb6" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Inventory" DROP CONSTRAINT "FK_3475245e7836598e0656aa76fb6"`,
    );
    await queryRunner.query(`DROP TABLE "Inventory"`);
  }
}
