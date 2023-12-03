import { MigrationInterface, QueryRunner } from 'typeorm';

export class SalesTable1701605921974 implements MigrationInterface {
  name = 'SalesTable1701605921974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Sales" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "quantity_sold" integer NOT NULL, "total_amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42b06288cc6e50ea7f5bca1e212" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Sales" ADD CONSTRAINT "FK_ebb161aaf308bbf66ad0c3acb3d" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Sales" DROP CONSTRAINT "FK_ebb161aaf308bbf66ad0c3acb3d"`,
    );

    await queryRunner.query(`DROP TABLE "Sales"`);
  }
}
