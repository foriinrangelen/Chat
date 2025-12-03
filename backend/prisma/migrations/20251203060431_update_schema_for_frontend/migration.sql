/*
  Warnings:

  - You are about to drop the `channel_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "channel_messages" DROP CONSTRAINT "channel_messages_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "channel_messages" DROP CONSTRAINT "channel_messages_user_id_fkey";

-- AlterTable
ALTER TABLE "channel_members" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon_color" TEXT,
ADD COLUMN     "icon_type" TEXT DEFAULT 'initial';

-- AlterTable
ALTER TABLE "dm_messages" ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reply_to_id" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "status_message" TEXT;

-- DropTable
DROP TABLE "channel_messages";

-- CreateTable
CREATE TABLE "text_channels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "text_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_channel_messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "text_channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reply_to_id" INTEGER,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "text_channel_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "text_channels_channel_id_idx" ON "text_channels"("channel_id");

-- CreateIndex
CREATE INDEX "text_channel_messages_text_channel_id_idx" ON "text_channel_messages"("text_channel_id");

-- CreateIndex
CREATE INDEX "text_channel_messages_user_id_idx" ON "text_channel_messages"("user_id");

-- AddForeignKey
ALTER TABLE "text_channels" ADD CONSTRAINT "text_channels_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_channel_messages" ADD CONSTRAINT "text_channel_messages_text_channel_id_fkey" FOREIGN KEY ("text_channel_id") REFERENCES "text_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_channel_messages" ADD CONSTRAINT "text_channel_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_channel_messages" ADD CONSTRAINT "text_channel_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "text_channel_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "dm_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
