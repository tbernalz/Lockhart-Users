import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsers1746474449732 implements MigrationInterface {
    name = 'AddUsers1746474449732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_document_type_enum" AS ENUM('CC')`);
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum" AS ENUM('citizen', 'entity')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "document_type" "public"."users_document_type_enum" NOT NULL, "document_number" character varying(10) NOT NULL, "country_code" character varying(5) NOT NULL, "phone_number" character varying(10) NOT NULL, "email" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "type" "public"."users_type_enum" NOT NULL DEFAULT 'citizen', "gov_carpeta_verified" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_5f6c1b67ac12a1e7eb454a48e59" UNIQUE ("document_number"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_document_type_enum"`);
    }

}
