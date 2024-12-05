-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('DEFAULT', 'CUSTOM');

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "type" "PermissionType" NOT NULL DEFAULT 'CUSTOM';
