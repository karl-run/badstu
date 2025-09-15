DROP INDEX "availability_id_unique";--> statement-breakpoint
DROP INDEX "location_date_unique_index";--> statement-breakpoint
DROP INDEX "scrape_locks_location_unique";--> statement-breakpoint
ALTER TABLE `availability` ALTER COLUMN "slots" TO "slots" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `availability_id_unique` ON `availability` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `location_date_unique_index` ON `availability` (`location_key`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `scrape_locks_location_unique` ON `scrape_locks` (`location`);--> statement-breakpoint
ALTER TABLE `availability` ADD `location_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `availability` ADD `date_string` text NOT NULL;--> statement-breakpoint
ALTER TABLE `availability` ADD `provider` text NOT NULL;