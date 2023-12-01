import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorTable1701473355789 implements MigrationInterface {
  name = 'VendorTable1701473355789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Vendor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_df063e494419697590276842311" UNIQUE ("name"), CONSTRAINT "PK_4209c575b75de7de935cddda4e7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Vendor"`);
  }
}
