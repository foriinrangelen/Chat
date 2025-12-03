/*
  Warnings:

  - The `role` column on the `channel_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `dm_messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `friendships` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `workspace_messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `workspaces` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "channel_members" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "dm_messages" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "workspace_messages" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';

-- DropEnum
DROP TYPE "ChannelRole";

-- DropEnum
DROP TYPE "FriendshipStatus";

-- DropEnum
DROP TYPE "MessageType";

-- DropEnum
DROP TYPE "WorkspaceType";
