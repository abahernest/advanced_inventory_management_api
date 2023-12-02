import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductTable1701548695557 implements MigrationInterface {
  name = 'ProductTable1701548695557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."Product_currency_enum" AS ENUM('NGN', 'USD', 'GBP', 'YEN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL DEFAULT '', "price" numeric(4) NOT NULL DEFAULT '0', "quantity" integer NOT NULL DEFAULT '1', "currency" "public"."Product_currency_enum" NOT NULL DEFAULT 'USD', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "vendor_id" integer, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_4ace587792c6d4a65d5da0649e2" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_4ace587792c6d4a65d5da0649e2"`,
    );
    await queryRunner.query(`DROP TABLE "Product"`);
    await queryRunner.query(`DROP TYPE "public"."Product_currency_enum"`);
  }
}
