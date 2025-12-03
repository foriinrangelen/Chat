/*
  Warnings:

  - You are about to drop the column `created_at` on the `channel_members` table. All the data in the column will be lost.
  - The `role` column on the `channel_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `icon_color` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `icon_type` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `direct_message_id` on the `dm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `is_edited` on the `dm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `friendships` table. All the data in the column will be lost.
  - You are about to drop the column `is_online` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_seen_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status_message` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `direct_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `text_channel_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `text_channels` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invite_code]` on the table `channels` will be added. If there are existing duplicate values, this will fail.
  - The required column `invite_code` was added to the `channels` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `dm_room_id` to the `dm_messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('TEXT', 'VOICE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'FILE', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "direct_messages" DROP CONSTRAINT "direct_messages_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "direct_messages" DROP CONSTRAINT "direct_messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "dm_messages" DROP CONSTRAINT "dm_messages_direct_message_id_fkey";

-- DropForeignKey
ALTER TABLE "text_channel_messages" DROP CONSTRAINT "text_channel_messages_reply_to_id_fkey";

-- DropForeignKey
ALTER TABLE "text_channel_messages" DROP CONSTRAINT "text_channel_messages_text_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "text_channel_messages" DROP CONSTRAINT "text_channel_messages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "text_channels" DROP CONSTRAINT "text_channels_channel_id_fkey";

-- DropIndex
DROP INDEX "dm_messages_direct_message_id_idx";

-- DropIndex
DROP INDEX "dm_messages_user_id_idx";

-- AlterTable
ALTER TABLE "channel_members" DROP COLUMN "created_at",
ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "ChannelRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "icon_color",
DROP COLUMN "icon_type",
ADD COLUMN     "invite_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "dm_messages" DROP COLUMN "direct_message_id",
DROP COLUMN "is_edited",
ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "dm_room_id" INTEGER NOT NULL,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "message";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_online",
DROP COLUMN "last_seen_at",
DROP COLUMN "status_message";

-- DropTable
DROP TABLE "direct_messages";

-- DropTable
DROP TABLE "text_channel_messages";

-- DropTable
DROP TABLE "text_channels";

-- CreateTable
CREATE TABLE "workspaces" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WorkspaceType" NOT NULL DEFAULT 'TEXT',
    "channel_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "attachments" JSONB,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reply_to_id" INTEGER,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_read_status" (
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "last_read_message_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_read_status_pkey" PRIMARY KEY ("user_id","workspace_id")
);

-- CreateTable
CREATE TABLE "dm_rooms" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dm_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dm_participants" (
    "dm_room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_read_message_id" INTEGER,

    CONSTRAINT "dm_participants_pkey" PRIMARY KEY ("dm_room_id","user_id")
);

-- CreateIndex
CREATE INDEX "workspaces_channel_id_idx" ON "workspaces"("channel_id");

-- CreateIndex
CREATE INDEX "workspace_messages_workspace_id_created_at_idx" ON "workspace_messages"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "workspace_messages_user_id_idx" ON "workspace_messages"("user_id");

-- CreateIndex
CREATE INDEX "dm_participants_user_id_idx" ON "dm_participants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_invite_code_key" ON "channels"("invite_code");

-- CreateIndex
CREATE INDEX "channels_owner_id_idx" ON "channels"("owner_id");

-- CreateIndex
CREATE INDEX "dm_messages_dm_room_id_created_at_idx" ON "dm_messages"("dm_room_id", "created_at");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_messages" ADD CONSTRAINT "workspace_messages_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_messages" ADD CONSTRAINT "workspace_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_messages" ADD CONSTRAINT "workspace_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "workspace_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_read_status" ADD CONSTRAINT "workspace_read_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_read_status" ADD CONSTRAINT "workspace_read_status_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_participants" ADD CONSTRAINT "dm_participants_dm_room_id_fkey" FOREIGN KEY ("dm_room_id") REFERENCES "dm_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_participants" ADD CONSTRAINT "dm_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_dm_room_id_fkey" FOREIGN KEY ("dm_room_id") REFERENCES "dm_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
