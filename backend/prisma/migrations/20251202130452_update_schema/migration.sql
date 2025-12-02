/*
  Warnings:

  - You are about to drop the column `updated_at` on the `channel_members` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the `channel_chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `channel_mentions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dm_chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dm_mentions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspaces` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `owner_id` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "channel_chats" DROP CONSTRAINT "channel_chats_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "channel_chats" DROP CONSTRAINT "channel_chats_user_id_fkey";

-- DropForeignKey
ALTER TABLE "channel_mentions" DROP CONSTRAINT "channel_mentions_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "channel_mentions" DROP CONSTRAINT "channel_mentions_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "channel_mentions" DROP CONSTRAINT "channel_mentions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "dm_chats" DROP CONSTRAINT "dm_chats_dm_id_fkey";

-- DropForeignKey
ALTER TABLE "dm_chats" DROP CONSTRAINT "dm_chats_user_id_fkey";

-- DropForeignKey
ALTER TABLE "dm_mentions" DROP CONSTRAINT "dm_mentions_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "dm_mentions" DROP CONSTRAINT "dm_mentions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "dms" DROP CONSTRAINT "dms_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "dms" DROP CONSTRAINT "dms_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "dms" DROP CONSTRAINT "dms_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_workspace_id_fkey";

-- DropIndex
DROP INDEX "channels_workspace_id_idx";

-- AlterTable
ALTER TABLE "channel_members" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "private",
DROP COLUMN "workspace_id",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_seen_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "channel_chats";

-- DropTable
DROP TABLE "channel_mentions";

-- DropTable
DROP TABLE "dm_chats";

-- DropTable
DROP TABLE "dm_mentions";

-- DropTable
DROP TABLE "dms";

-- DropTable
DROP TABLE "workspace_members";

-- DropTable
DROP TABLE "workspaces";

-- CreateTable
CREATE TABLE "friendships" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direct_messages" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "direct_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dm_messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "direct_message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dm_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friendships_receiver_id_idx" ON "friendships"("receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_sender_id_receiver_id_key" ON "friendships"("sender_id", "receiver_id");

-- CreateIndex
CREATE INDEX "channel_messages_channel_id_idx" ON "channel_messages"("channel_id");

-- CreateIndex
CREATE INDEX "channel_messages_user_id_idx" ON "channel_messages"("user_id");

-- CreateIndex
CREATE INDEX "direct_messages_receiver_id_idx" ON "direct_messages"("receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "direct_messages_sender_id_receiver_id_key" ON "direct_messages"("sender_id", "receiver_id");

-- CreateIndex
CREATE INDEX "dm_messages_direct_message_id_idx" ON "dm_messages"("direct_message_id");

-- CreateIndex
CREATE INDEX "dm_messages_user_id_idx" ON "dm_messages"("user_id");

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_messages" ADD CONSTRAINT "direct_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_messages" ADD CONSTRAINT "direct_messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_direct_message_id_fkey" FOREIGN KEY ("direct_message_id") REFERENCES "direct_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
