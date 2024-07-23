ALTER TABLE `chatrooms` ADD `name` text;--> statement-breakpoint
CREATE INDEX `keyChatroomSessionId` ON `chatrooms` (`key`,`session_id`);