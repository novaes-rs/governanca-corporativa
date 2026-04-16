CREATE TABLE `class_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`currentSlide` int NOT NULL DEFAULT 1,
	`projectorMode` boolean NOT NULL DEFAULT false,
	`responsesVisible` boolean NOT NULL DEFAULT false,
	`scoresVisible` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `class_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`slideIndex` int NOT NULL,
	`teamName` varchar(32) NOT NULL,
	`activityType` enum('quiz','vote','case','open') NOT NULL,
	`response` text NOT NULL,
	`isCorrect` boolean DEFAULT false,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`teamName` varchar(32) NOT NULL,
	`totalPoints` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_scores_id` PRIMARY KEY(`id`)
);
