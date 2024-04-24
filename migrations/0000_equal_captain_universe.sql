CREATE TABLE `locations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`dropins_polled_at` integer,
	`dropins` text,
	`private_polled_at` integer,
	`private` text
);
--> statement-breakpoint
CREATE TABLE `notifies` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text,
	`slot` text NOT NULL,
	`date` integer NOT NULL,
	`location` text NOT NULL,
	`notified` integer DEFAULT true,
	`notified_at` integer,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scrape_locks` (
	`id` integer PRIMARY KEY NOT NULL,
	`locked_at` integer,
	`locked_by` text,
	`location` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`number` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locations_name_unique` ON `locations` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `scrape_locks_location_unique` ON `scrape_locks` (`location`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_number_unique` ON `users` (`number`);