CREATE TABLE `availability` (
	`id` integer PRIMARY KEY NOT NULL,
	`location_key` text NOT NULL,
	`date` integer NOT NULL,
	`last_polled_at` integer,
	`slots` text
);
