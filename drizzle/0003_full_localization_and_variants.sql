CREATE TABLE `collection_translations` (
  `id` varchar(64) NOT NULL,
  `collectionId` varchar(64) NOT NULL,
  `locale` enum('en','ar') NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `story` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `collection_translations_id` PRIMARY KEY(`id`)
);

CREATE UNIQUE INDEX `collection_locale_unique` ON `collection_translations` (`collectionId`,`locale`);

CREATE TABLE `product_translations` (
  `id` varchar(64) NOT NULL,
  `productId` varchar(64) NOT NULL,
  `locale` enum('en','ar') NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `story` text,
  `fabric` varchar(255),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `product_translations_id` PRIMARY KEY(`id`)
);

CREATE UNIQUE INDEX `product_locale_unique` ON `product_translations` (`productId`,`locale`);

CREATE TABLE `product_color_variants` (
  `id` varchar(64) NOT NULL,
  `productId` varchar(64) NOT NULL,
  `colorKey` varchar(16) NOT NULL,
  `swatchNameEn` varchar(120),
  `swatchNameAr` varchar(120),
  `sortOrder` int DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `product_color_variants_id` PRIMARY KEY(`id`)
);

CREATE UNIQUE INDEX `product_color_unique` ON `product_color_variants` (`productId`,`colorKey`);

CREATE TABLE `product_variant_images` (
  `id` varchar(64) NOT NULL,
  `variantId` varchar(64) NOT NULL,
  `imageUrl` varchar(512) NOT NULL,
  `altTextEn` varchar(255),
  `altTextAr` varchar(255),
  `sortOrder` int DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `product_variant_images_id` PRIMARY KEY(`id`)
);
