CREATE TABLE `platform`  (
  `id` varchar(32) NOT NULL,
  `type` varchar(128) NOT NULL COMMENT '1. github\n2. gitee',
  `user_id` varchar(32) NOT NULL,
  `token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`),
  INDEX `type_and_user_id_01`(`type`, `user_id`)
);

CREATE TABLE `task`  (
  `id` varchar(32) NOT NULL,
  `platform_id` varchar(32) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `repository` varchar(255) NOT NULL,
  `branch` varchar(255) NOT NULL,
  `run_script` varchar(255) NULL,
  `build_script` varchar(255) NULL,
  `build_path` varchar(255) NULL,
  `server_port` varchar(255) NULL,
  `template_id` varchar(32) NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `run_log` varchar(255) NULL COMMENT '日志存放文件',
  `status` int NULL COMMENT '任务状态',
  PRIMARY KEY (`id`)
);

CREATE TABLE `task_child`  (
  `id` varchar(32) NOT NULL,
  `status` int NULL,
  `build_log` varchar(255) NULL COMMENT '日志存放位置',
  `deploy_log` varchar(255) NULL COMMENT '日志存放位置',
  `task_id` varchar(32) NULL,
  `build_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `deploy_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`)
);

CREATE TABLE `template`  (
  `id` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(128) NULL,
  `type` varchar(32) NULL COMMENT 'static / dynamic',
  `path` varchar(255) NULL COMMENT '模版文件位置',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`)
);

CREATE TABLE `user`  (
  `id` varchar(32) NOT NULL,
  `nickname` varchar(128) NULL COMMENT '昵称',
  `password` varchar(255) NULL COMMENT '密码',
  `avatar` varchar(255) NULL COMMENT '头像',
  `email` varchar(128) NOT NULL COMMENT '邮箱',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_uniqe`(`email`)
);

ALTER TABLE `platform` ADD CONSTRAINT `platform_id_on_user_id01` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
ALTER TABLE `task` ADD CONSTRAINT `task_id_on_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
ALTER TABLE `task` ADD CONSTRAINT `task_on_platform_id` FOREIGN KEY (`platform_id`) REFERENCES `platform` (`id`);
ALTER TABLE `task` ADD CONSTRAINT `template_id_task_id` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`);
ALTER TABLE `task_child` ADD CONSTRAINT `task_id_task_child_id_on` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`);

