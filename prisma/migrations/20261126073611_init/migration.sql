-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(128) NOT NULL,
    `family_id` VARCHAR(128) NOT NULL,
    `user_id` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `family_expires_at` DATETIME(3) NOT NULL,
    `used_at` DATETIME(3) NULL,
    `claims` JSON NULL,

    INDEX `refresh_tokens_family_id_idx`(`family_id`),
    INDEX `refresh_tokens_user_id_idx`(`user_id`),
    INDEX `refresh_tokens_family_expires_at_idx`(`family_expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revoked_refresh_token_families` (
    `family_id` VARCHAR(128) NOT NULL,
    `family_expires_at` DATETIME(3) NULL,
    `revoked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `revoked_refresh_token_families_family_expires_at_idx`(`family_expires_at`),
    PRIMARY KEY (`family_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
