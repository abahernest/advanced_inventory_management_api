import { MigrationInterface, QueryRunner } from 'typeorm';

export class TypeormMetadata1701547888319 implements MigrationInterface {
  name = 'TypeormMetadata1701547888319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "typeorm_metadata" (
                "type" varchar(255) NOT NULL,
                "database" varchar(255) DEFAULT NULL,
                "schema" varchar(255) DEFAULT NULL,
                "table" varchar(255) DEFAULT NULL,
                "name" varchar(255) DEFAULT NULL,
                "value" text
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "typeorm_metadata"`);
  }
}
