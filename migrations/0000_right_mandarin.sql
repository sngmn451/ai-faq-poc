CREATE TABLE `chatmessages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`chatroom_id` integer NOT NULL,
	`session_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`chatroom_id`) REFERENCES `chatrooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chatrooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`session_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chatmessages_id_unique` ON `chatmessages` (`id`);--> statement-breakpoint
CREATE INDEX `idxChatmessagesSessionId` ON `chatmessages` (`id`,`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `chatrooms_id_unique` ON `chatrooms` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `chatrooms_key_unique` ON `chatrooms` (`key`);--> statement-breakpoint
CREATE INDEX `idxChatroomSessionId` ON `chatrooms` (`id`,`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_id_unique` ON `sessions` (`id`);