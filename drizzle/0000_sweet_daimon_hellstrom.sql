CREATE TABLE `site_content` (
	`key` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated_by` text,
	`updated_at` integer NOT NULL
);
