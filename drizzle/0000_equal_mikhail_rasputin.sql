CREATE TABLE `scrape_locks` (
	`id` integer PRIMARY KEY NOT NULL,
	`locked_at` integer,
	`locked_by` text,
	`location` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scrape_locks_location_unique` ON `scrape_locks` (`location`);