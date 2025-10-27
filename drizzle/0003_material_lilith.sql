CREATE TABLE `auditLogs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`userName` varchar(255),
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` varchar(64),
	`changes` json,
	`oldValues` json,
	`newValues` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`status` varchar(50) DEFAULT 'success',
	`errorMessage` text,
	`metadata` json,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
