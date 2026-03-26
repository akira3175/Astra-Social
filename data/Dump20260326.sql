-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: astra_social
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('REFRESH','OTP_EMAIL','OTP_PASS','PASSWORD_RESET') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `auth_tokens_user_id_foreign` (`user_id`),
  CONSTRAINT `auth_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (1,1,'f24fe3113a8a09c77ca1f02f20648abf7a3aeb16182264d8a582fa36a283b8cb','REFRESH','2026-02-08 18:50:32',1),(2,1,'a646f85e47956b98164f29c65fcf56b614cb647b62344a54a7440b4a2af2296c','REFRESH','2026-02-08 18:54:29',1),(3,1,'ae5783739f5b5a50a5c384b81ea83ad8ee86fe8c80cd804e6ca59c7993e22844','REFRESH','2026-02-08 19:02:40',1),(4,2,'faef500baacb935f21f70ff9ab0ca74cda0734d6d224ad5b6a2ccbc98e3370fe','REFRESH','2026-02-08 19:04:26',0),(5,1,'779fe1b2b9a2dd45ad33db4a309d0e7bef611e109bbcbfacc5fe909a6b48dda5','REFRESH','2026-02-08 19:52:17',1),(6,1,'384a1d10bc1c2475cbd1913507984ad4098a6978dd84bb821bfc283a9d4555b5','REFRESH','2026-02-08 21:07:19',1),(7,1,'aa565a228044cde012af74bad9d753ecd26b18069be3b70ac033b8617114694b','REFRESH','2026-02-08 21:08:52',1),(8,1,'651630ac9e9a19081ccb51b1827361efc9fb9fd44e42bbdb9979e4f4adbb67d2','REFRESH','2026-02-08 21:11:05',1),(9,1,'cc4cc11f3753c6a4cd60e400c387a611e9e144794a135e1a63720178807dba3e','REFRESH','2026-02-11 23:47:13',1),(10,1,'f895a8ba2298740915f03984a7f48f5f5543b5d6d44d4275cea24dc4865d4743','REFRESH','2026-02-11 23:47:29',1),(11,1,'64a044e4fabfda25bdf87f5822a12e9de28ae788ee27e532c5bcfae151bfdd08','REFRESH','2026-02-12 00:41:48',1),(12,1,'0c2d5eb465372a3b5cf8d4ba18fb50480b62676d6afad35ff0b62a64c8e61847','REFRESH','2026-02-12 01:11:14',1),(13,1,'668f964f25a8dce2c0c96d211b95a27e048181fcc6300af1c3108be0cadd7806','REFRESH','2026-02-15 15:26:39',1),(14,1,'6f8dcf5d23ab370716844a6190f188d0422bd07e2125ef2992251016a01c12c6','REFRESH','2026-02-18 16:44:11',1),(15,1,'5c6839a399f588eb6f757f33ec614bc9c4d23622fa2b7a0b6161dc9257e56a81','REFRESH','2026-02-19 00:03:10',1),(16,1,'d45c62724e6e13f7019b1590fb69218ba4f56b9f34baee00c8ee594d4edb7a71','REFRESH','2026-02-19 00:06:10',1),(17,1,'8083837981f608c6aba9b4628fec6fd528e9032523008589cc6ad5491d669976','REFRESH','2026-02-19 01:12:38',1),(18,1,'5482e6696bb610fb7ca9d9b58d903130993e18c894bb6fc10fa5c96d7adec4d0','REFRESH','2026-02-19 02:22:18',1),(19,1,'bf177cbe7e74312f0e735c6d90512e916664b2e65a29e0d5c67bb3e1f112917e','REFRESH','2026-03-09 11:54:29',1),(20,3,'7f1e7208abc8948605a0ae3ee3feb5706469346244bd59df3701f8ceeadde528','REFRESH','2026-03-19 01:22:46',1),(21,1,'19749b8bf9911a4810aeea7b174a11af89303d01babaaf99fcc59257c25f7583','REFRESH','2026-03-19 01:25:02',1),(22,1,'88c02bae08d13912a7db869d2f456647ab1710f5cbfa21743048d9a5ee7f671f','REFRESH','2026-03-19 01:51:58',1),(23,3,'115efdb62a37f297e67125c765f98c3b195e40c22ec753c498ed6517c44b2b98','PASSWORD_RESET','2026-03-05 03:10:19',1),(24,3,'d6475851e8989464a183b816edfcfb6df4a8659bfedf11aaf09ad53cab5651b6','REFRESH','2026-03-19 02:11:43',1),(25,3,'d8e71471417a3daaf3a34508a803f11baf83149c865e109ecda1f87c19ee59b1','REFRESH','2026-03-19 02:17:32',1),(26,1,'5134193bfc18df6ea57e5c1ea71b469b877129c36c97a48bb0e414a08b6d1d5a','REFRESH','2026-03-19 02:53:48',1),(27,1,'e92f7aca045525645c21dad294454e3d3a71277352ef3fd5aca861445c70a7b6','REFRESH','2026-04-01 08:58:10',1),(28,5,'f3436d528f6eba1192d4a1fdaf131e977365a8726a9f4d4e0d176d34cf3c0933','REFRESH','2026-04-01 09:12:54',1),(29,1,'7885eff547bacf9009e24469f204cbe1e52a5aa9ba810dbf8104b424743d5b11','REFRESH','2026-04-01 09:16:11',1),(30,1,'894fdc9a5c6e3d7d339dbc6500707177af0da6f1ccbc70bbaff30800f235688e','REFRESH','2026-04-01 10:31:47',1),(31,1,'5bfce5d3d5241a3e8f3ee61c85d4a1ccb1ff3499a57833e7ccf65e9e713d403c','REFRESH','2026-04-02 02:15:44',1),(32,1,'e4c4d0e76f88680a1a95034dda3db55b9c89ad2f9ae9c595cc7d2653e3b5ca67','REFRESH','2026-04-02 03:10:59',1),(33,1,'a0b5271de3ef17eb584035cced9719fd6ee7842055ec06e2d412a5f258e7aa6d','REFRESH','2026-04-04 13:36:59',1),(34,3,'72b6b31a2cfccca08ad2340d2699db54cbfb5c8fc6279b16400abd27b0307508','PASSWORD_RESET','2026-03-21 15:37:14',1),(35,1,'5060882cd527ff371de2d4d28f390dc9ab9d5088340c657b717f20d5f10c5931','REFRESH','2026-04-04 14:39:17',1),(36,3,'508f45e17f9fbea3a5f18137293c5c8f8959d89ad853dee4ae94b69b0fb83d7c','REFRESH','2026-04-04 14:39:46',0),(37,1,'2c72f5123dc5a85519789f5d7078f67e969cfe5514ba13a9fdab2c3875b66138','REFRESH','2026-04-06 16:19:15',1),(38,107,'e86d4fec09642318ee3e8f76f2b31685c6919fbbf153fcf8b237f6e433ed961d','REFRESH','2026-04-06 16:26:31',0),(39,1,'a6e35c388a823b0708a95b9c023ac22271bde5517faf07a11b29b8a983ebb3d2','REFRESH','2026-04-06 17:07:25',1),(40,1,'7a7fd20cd882040d7a1d6a331879f3fc44972aa76d6fad0fa07343ce2f453684','REFRESH','2026-04-06 17:22:32',1),(41,1,'13c7c19e329a6cb6eb9b93f393de071706fa4710814b1c845094d59dcda53a4c','REFRESH','2026-04-06 17:31:55',1),(42,1,'b91476ca9330ee27b602575364b7f655a450b0933af3468f712c38b724779155','REFRESH','2026-04-07 07:03:32',1),(43,1,'ab651ba625f37f7f204c471bbc6dce3625fd25dd1b92b077bbe88a64d16d2410','REFRESH','2026-04-08 00:10:38',1),(44,1,'61bfb6217aab1722fb9828fffb5d6f0d196c2fddd0e4c6552754503870f64acf','REFRESH','2026-04-08 05:59:47',1),(45,1,'d7998c1f0c41aef30d634b90dce350aa859a444b52e26a91529bcb4869fc6d52','REFRESH','2026-04-08 09:13:31',1),(46,1,'4641b5554b6832a6fd2d683a2443632cb218e6eb0c97e814acc3cdfabf534a0a','REFRESH','2026-04-08 09:13:51',1),(47,3,'1aa942038d217f4f9d1ed727d9a0dc75f832c63b074206568a3caeaebec72126','PASSWORD_RESET','2026-03-25 10:20:23',0),(48,1,'76c446fdaa6f225483905f44caec45c7152611d8970344c3c1a8139ed13d736b','REFRESH','2026-04-08 14:16:13',1),(49,1,'5d094552e22c123fdf87347c3fda2b4ce5d27f8cd3e1046ff0f9623b73b40c7c','REFRESH','2026-04-08 15:18:33',1),(50,1,'5d40ec3510458470182da2f9f1e4dd8975d4f59db837742c0aa818d7025387e5','REFRESH','2026-04-08 15:25:36',1),(51,108,'e94f259818b49fbf7ecdbd0c4a66b3bfa42dd0b696bef9c397f521737382a317','REFRESH','2026-04-08 15:51:24',0),(52,1,'27266f07fbc0f8523ce28c10bdc59071dc74cdd8213969dee11f008b23ac3913','REFRESH','2026-04-08 16:16:43',1),(53,1,'01a32be0822623122dfc7d9f9ebd89fc71b1c49e742dc5be569b0bcfa8bcb742','REFRESH','2026-04-08 16:41:16',1),(54,1,'e7f84d7ed6d1181e6757b59add35301328f6bd6658630541eeb90cf3d3de2ed3','REFRESH','2026-04-08 17:02:32',0);
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-register_otp_f70e1bc62fc345e0e2e1be4855c0ba48','a:5:{s:8:\"username\";s:14:\"akira317584215\";s:5:\"email\";s:21:\"akira317584@gmail.com\";s:8:\"password\";s:6:\"123456\";s:7:\"profile\";a:3:{s:10:\"first_name\";s:4:\"John\";s:9:\"last_name\";s:5:\"Smith\";s:10:\"birth_date\";s:10:\"2004-02-14\";}s:3:\"otp\";s:60:\"$2y$12$VOdXVTgDqyFHf4btxn8iyendaYT7D9w5zr8drbCLLLCRWxrVAZuk6\";}',1774483785);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `comment_likes_comment_id_user_id_unique` (`comment_id`,`user_id`),
  KEY `comment_likes_user_id_foreign` (`user_id`),
  CONSTRAINT `comment_likes_comment_id_foreign` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_post_id_foreign` (`post_id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_parent_id_foreign` (`parent_id`),
  CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,35,1,NULL,'qdwce','2026-03-19 02:15:55','2026-03-19 02:15:55',NULL),(2,34,1,NULL,'hedcaio','2026-03-19 02:16:22','2026-03-19 02:16:22',NULL),(3,9,4,NULL,'Cumque.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(4,4,16,NULL,'Quasi inventore.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(5,2,19,NULL,'Facere vitae.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(6,12,11,NULL,'Saepe et.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(7,8,5,NULL,'Natus eos.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(8,9,8,NULL,'Ea.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(9,9,6,NULL,'Fuga cum.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(10,11,1,NULL,'Amet.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(11,9,12,NULL,'Qui aspernatur.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(12,14,4,NULL,'Quaerat.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(13,19,13,NULL,'Nesciunt facere.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(14,2,16,NULL,'Illo consequatur.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(15,8,7,NULL,'Eos.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(16,9,5,NULL,'Et praesentium.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(17,12,6,NULL,'Et earum.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(18,10,1,NULL,'Qui illum.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(19,10,6,NULL,'Cupiditate recusandae.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(20,10,1,NULL,'Similique necessitatibus.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(21,12,6,NULL,'Non.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(22,13,2,NULL,'Quas porro.','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(23,20,14,NULL,'Vero et.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(24,19,19,NULL,'Soluta molestiae.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(25,16,4,NULL,'Dolores.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(26,18,15,NULL,'Laborum.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(27,8,4,NULL,'Et voluptatem.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(28,20,20,NULL,'Nisi.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(29,1,6,NULL,'Molestiae aspernatur.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(30,1,18,NULL,'Dolorem voluptatum.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(31,17,18,NULL,'Voluptatem ullam.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(32,12,3,NULL,'Voluptate ducimus.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(33,18,2,NULL,'Delectus facilis.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(34,2,14,NULL,'Unde.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(35,11,4,NULL,'Facere.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(36,19,4,NULL,'Error ad.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(37,3,18,NULL,'Doloremque.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(38,13,5,NULL,'Consectetur minima.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(39,19,20,NULL,'Tempora.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(40,14,7,NULL,'Sunt.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(41,10,5,NULL,'Quam.','2026-03-19 03:04:50','2026-03-19 03:04:50',NULL),(42,17,20,NULL,'Corrupti enim.','2026-03-19 03:04:50','2026-03-21 13:59:52','2026-03-21 13:59:52'),(43,98,1,NULL,'qử3w','2026-03-21 15:20:37','2026-03-21 15:20:37',NULL),(44,103,1,NULL,'đêc','2026-03-23 12:28:43','2026-03-23 12:28:43',NULL),(45,103,1,44,'how','2026-03-23 12:33:34','2026-03-23 12:33:34',NULL),(46,93,1,NULL,'a','2026-03-23 12:39:23','2026-03-23 12:39:23',NULL),(47,93,1,NULL,'b','2026-03-23 12:39:28','2026-03-23 12:39:28',NULL),(48,93,1,NULL,'c','2026-03-23 12:39:31','2026-03-23 12:39:31',NULL),(49,1,1,NULL,'test','2026-03-23 18:28:14','2026-03-23 18:28:14','2026-03-23 18:34:59'),(50,1,1,NULL,'Verified comment',NULL,NULL,'2026-03-23 18:34:50'),(51,103,1,44,'aaa',NULL,NULL,NULL),(52,103,1,44,'aaa',NULL,NULL,NULL),(53,103,1,NULL,'aaa',NULL,NULL,NULL),(54,1,1,NULL,'test json',NULL,NULL,NULL),(55,1,1,NULL,'final test json','2026-03-23 18:41:40',NULL,NULL),(56,103,1,NULL,'aaa','2026-03-23 18:41:48',NULL,NULL),(57,105,1,NULL,'aaa','2026-03-23 18:42:07',NULL,NULL),(58,103,1,NULL,'bbb','2026-03-23 18:42:41',NULL,NULL),(59,112,1,NULL,'Shet','2026-03-25 09:24:00',NULL,NULL),(60,105,1,57,'Bbb','2026-03-25 15:27:09',NULL,NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation_members`
--

DROP TABLE IF EXISTS `conversation_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_members` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `role` enum('ADMIN','MEMBER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEMBER',
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversation_members_conversation_id_user_id_unique` (`conversation_id`,`user_id`),
  KEY `conversation_members_user_id_foreign` (`user_id`),
  CONSTRAINT `conversation_members_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversation_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_members`
--

LOCK TABLES `conversation_members` WRITE;
/*!40000 ALTER TABLE `conversation_members` DISABLE KEYS */;
INSERT INTO `conversation_members` VALUES (11,6,3,'MEMBER','2026-03-23 22:44:28','2026-03-23 15:44:28','2026-03-23 15:44:28'),(12,6,1,'MEMBER','2026-03-23 22:44:28','2026-03-23 15:44:28','2026-03-23 15:44:28'),(13,7,3,'MEMBER','2026-03-23 22:56:14','2026-03-23 15:56:14','2026-03-23 15:56:14'),(14,7,4,'MEMBER','2026-03-23 22:56:14','2026-03-23 15:56:14','2026-03-23 15:56:14'),(16,8,3,'ADMIN','2026-03-23 23:28:24','2026-03-23 16:28:24','2026-03-23 16:29:16'),(17,8,107,'MEMBER','2026-03-23 23:28:24','2026-03-23 16:28:24','2026-03-23 16:28:24'),(18,9,1,'ADMIN','2026-03-23 23:28:25','2026-03-23 16:28:25','2026-03-23 16:28:25'),(19,9,3,'ADMIN','2026-03-23 23:28:25','2026-03-23 16:28:25','2026-03-23 17:12:53'),(20,9,107,'ADMIN','2026-03-23 23:28:25','2026-03-23 16:28:25','2026-03-23 17:12:51'),(21,10,1,'ADMIN','2026-03-24 00:13:41','2026-03-23 17:13:41','2026-03-23 17:13:41'),(22,10,3,'MEMBER','2026-03-24 00:13:41','2026-03-23 17:13:41','2026-03-23 17:13:41'),(23,10,107,'MEMBER','2026-03-24 00:13:41','2026-03-23 17:13:41','2026-03-23 17:13:41');
/*!40000 ALTER TABLE `conversation_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('PRIVATE','GROUP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRIVATE',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (6,'PRIVATE',NULL,NULL,'2026-03-23 16:06:30','2026-03-23 15:44:28','2026-03-23 16:06:30'),(7,'PRIVATE',NULL,NULL,'2026-03-23 15:56:14','2026-03-23 15:56:14','2026-03-23 15:56:14'),(8,'GROUP','Make Astra Great Again',NULL,'2026-03-23 16:28:24','2026-03-23 16:28:24','2026-03-23 16:28:24'),(9,'GROUP','Make Astra Great',NULL,'2026-03-23 16:40:41','2026-03-23 16:28:25','2026-03-23 16:40:41'),(10,'GROUP','ABC',NULL,'2026-03-23 17:13:40','2026-03-23 17:13:40','2026-03-23 17:13:40');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `follower_id` bigint unsigned NOT NULL,
  `followee_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`,`followee_id`),
  KEY `follows_follower_id_index` (`follower_id`),
  KEY `follows_followee_id_index` (`followee_id`),
  CONSTRAINT `follows_followee_id_foreign` FOREIGN KEY (`followee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follows_follower_id_foreign` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendships`
--

DROP TABLE IF EXISTS `friendships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendships` (
  `requester_id` bigint unsigned NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `status` enum('pending','accepted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`requester_id`,`receiver_id`),
  KEY `friendships_receiver_id_foreign` (`receiver_id`),
  CONSTRAINT `friendships_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `friendships_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendships`
--

LOCK TABLES `friendships` WRITE;
/*!40000 ALTER TABLE `friendships` DISABLE KEYS */;
INSERT INTO `friendships` VALUES (1,3,'accepted','2026-03-23 20:46:19','2026-03-23 13:48:41'),(1,7,'pending','2026-03-25 15:27:04',NULL),(1,60,'pending','2026-03-24 00:22:45',NULL),(1,107,'pending','2026-03-25 17:11:40',NULL),(2,4,'accepted','2026-03-19 09:25:44','2026-03-19 03:04:49'),(3,4,'accepted','2026-03-19 09:25:44','2026-03-19 03:04:49'),(107,3,'pending','2026-03-23 23:35:41',NULL);
/*!40000 ALTER TABLE `friendships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hashtags`
--

DROP TABLE IF EXISTS `hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hashtags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posts_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hashtags_name_unique` (`name`),
  KEY `hashtags_name_index` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtags`
--

LOCK TABLES `hashtags` WRITE;
/*!40000 ALTER TABLE `hashtags` DISABLE KEYS */;
INSERT INTO `hashtags` VALUES (1,'comfyvibes',0,'2026-03-21 15:18:06','2026-03-25 16:16:23'),(2,'selfietime',2,'2026-03-21 15:21:04','2026-03-21 15:21:11'),(3,'chillvibes',2,'2026-03-21 15:21:04','2026-03-21 15:21:11'),(4,'kínhtròn',2,'2026-03-21 15:21:04','2026-03-21 15:21:11'),(5,'máyẢnh',2,'2026-03-21 15:21:04','2026-03-21 15:21:11'),(6,'khoảnhkhắc',2,'2026-03-21 15:21:04','2026-03-21 15:21:11'),(7,'cáiÔm',0,'2026-03-23 12:24:20','2026-03-23 12:24:20'),(8,'ẤmÁp',1,'2026-03-23 12:24:21','2026-03-23 12:24:21'),(9,'tìnhyêu',1,'2026-03-23 12:24:21','2026-03-23 12:24:21'),(10,'hạnhphúc',1,'2026-03-23 12:24:21','2026-03-23 12:24:21'),(11,'bìnhyên',1,'2026-03-23 12:24:21','2026-03-23 12:24:21'),(12,'chàobuổisáng',1,'2026-03-23 16:35:05','2026-03-23 16:35:05'),(13,'ngàymới',2,'2026-03-23 16:35:06','2026-03-25 06:10:34'),(14,'nănglượng',1,'2026-03-23 16:35:06','2026-03-23 16:35:06'),(15,'vuivẻ',2,'2026-03-23 16:35:06','2026-03-25 06:10:34'),(16,'goodmorning',1,'2026-03-23 16:35:06','2026-03-23 16:35:06'),(17,'astrasocial',1,'2026-03-23 18:48:38','2026-03-23 18:48:38'),(18,'innovation',1,'2026-03-23 18:48:39','2026-03-23 18:48:39'),(19,'animeart',1,'2026-03-25 06:07:14','2026-03-25 06:07:14'),(20,'fantasy',1,'2026-03-25 06:07:15','2026-03-25 06:07:15'),(21,'magicalgirl',1,'2026-03-25 06:07:15','2026-03-25 06:07:15'),(22,'forestnight',1,'2026-03-25 06:07:15','2026-03-25 06:07:15'),(23,'dreamyvibes',1,'2026-03-25 06:07:15','2026-03-25 06:07:15'),(24,'chàobạn',1,'2026-03-25 06:10:34','2026-03-25 06:10:34'),(25,'nănglượngtíchcực',1,'2026-03-25 06:10:34','2026-03-25 06:10:34'),(26,'khởiĐầumới',1,'2026-03-25 06:10:34','2026-03-25 06:10:34');
/*!40000 ALTER TABLE `hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_attachments`
--

DROP TABLE IF EXISTS `media_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` enum('IMAGE','VIDEO','FILE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FILE',
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint unsigned DEFAULT NULL,
  `entity_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `media_attachments_entity_type_entity_id_index` (`entity_type`,`entity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_attachments`
--

LOCK TABLES `media_attachments` WRITE;
/*!40000 ALTER TABLE `media_attachments` DISABLE KEYS */;
INSERT INTO `media_attachments` VALUES (1,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769985307/posts/1/o7f2u2i7wm7uwoci1mc3.png','IMAGE',NULL,NULL,'POST',18,'2026-02-01 15:35:04'),(2,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769987183/posts/1/xbiblmsaqoosod7sxgss.png','IMAGE',NULL,NULL,'POST',19,'2026-02-01 16:06:20'),(3,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769987186/posts/1/rle8iwdu2xbny5qombue.jpg','IMAGE',NULL,NULL,'POST',19,'2026-02-01 16:06:23'),(4,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769987188/posts/1/c5vrafyqnp6ppo1q3nke.jpg','IMAGE',NULL,NULL,'POST',19,'2026-02-01 16:06:25'),(5,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769987192/posts/1/efy00bfq2vkao8bt6gmq.jpg','IMAGE',NULL,NULL,'POST',19,'2026-02-01 16:06:31'),(10,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769987713/posts/1/ugyhwsjdycmkwacfjmsf.webp','IMAGE',NULL,NULL,'POST',21,'2026-02-01 16:15:10'),(11,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769987716/posts/1/bbkdpenxqvbqw3ykjljq.jpg','IMAGE',NULL,NULL,'POST',21,'2026-02-01 16:15:13'),(12,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769988847/posts/1/sktospugsdnxw4gt3d3a.png','IMAGE',NULL,NULL,'POST',22,'2026-02-01 16:34:03'),(13,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769988849/posts/1/xcfrosinqkuvbxazdy11.jpg','IMAGE',NULL,NULL,'POST',22,'2026-02-01 16:34:05'),(14,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1769988850/posts/1/e8b0jtbdwtfwm8duymcx.webp','IMAGE',NULL,NULL,'POST',22,'2026-02-01 16:34:07'),(15,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1773852141/posts/1/z6tfq9rtmgerikck2nv4.jpg','IMAGE',NULL,NULL,'POST',35,'2026-03-18 09:42:23'),(16,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1774131296/posts/1/xucmbamvb3v0h4dq5uts.jpg','IMAGE',NULL,NULL,'POST',98,'2026-03-21 15:14:55'),(19,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1774303800/messages/oyl61fv3yqjiflhhzx2p.png','IMAGE','screenshot_1697111912.png',450146,'MESSAGE',9,'2026-03-23 15:10:01'),(20,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1774306069/messages/zxkhitbbevlrsiqr7gw7.png','IMAGE','screenshot_1697111912.png',450146,'MESSAGE',12,'2026-03-23 15:47:50'),(21,'https://res.cloudinary.com/dbcuulbcp/raw/upload/v1774306933/messages/j4pcmnskfbkkxls1a27w.docx','FILE','NguyenNhatTruong_GK_ĐACN.docx',3969003,'MESSAGE',15,'2026-03-23 16:02:14'),(22,'https://res.cloudinary.com/dbcuulbcp/video/upload/v1774306984/messages/aqkdo983pg5pohklaas3.mp4','VIDEO','AQP42KALyjxhOerHkdnif7FiPBUtmKLIbEnFlM_fopMpTnTFUYjb2e-Av9UGzRYONx4hiyUNBm83hmmP1Bj-PcOtrnhmtIPKIBf6918.mp4',2693929,'MESSAGE',16,'2026-03-23 16:03:06'),(23,'https://res.cloudinary.com/dbcuulbcp/raw/upload/v1774307189/messages/fhhdim8bij4dg9gdtkxd.txt','FILE','novel.txt',80747,'MESSAGE',17,'2026-03-23 16:06:30'),(24,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1774444039/posts/1/zknltkkbon27y2nfn8ak.webp','IMAGE','300171f5-058a-4e17-9cd5-beb8cf218a42.webp',2051236,'POST',112,'2026-03-25 06:07:21'),(25,'https://res.cloudinary.com/dbcuulbcp/video/upload/v1774481608/posts/1/iz2mfydcaxgvxr5drkmd.mp4','VIDEO','AQP42KALyjxhOerHkdnif7FiPBUtmKLIbEnFlM_fopMpTnTFUYjb2e-Av9UGzRYONx4hiyUNBm83hmmP1Bj-PcOtrnhmtIPKIBf6918.mp4',2693929,'POST',117,'2026-03-25 16:33:31');
/*!40000 ALTER TABLE `media_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint unsigned NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TEXT',
  `attachments` json DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_conversation_id_foreign` (`conversation_id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (10,6,3,'hud','TEXT',NULL,0,'2026-03-23 15:44:28','2026-03-23 15:44:28'),(11,6,1,'qqjv','TEXT',NULL,0,'2026-03-23 15:45:40','2026-03-23 15:45:40'),(12,6,1,NULL,'TEXT',NULL,0,'2026-03-23 15:47:47','2026-03-23 15:47:47'),(13,7,3,'â','TEXT',NULL,0,'2026-03-23 15:56:14','2026-03-23 15:56:14'),(14,6,1,'haizz','TEXT',NULL,0,'2026-03-23 15:56:22','2026-03-23 15:56:22'),(15,6,1,NULL,'TEXT',NULL,0,'2026-03-23 16:02:08','2026-03-23 16:02:08'),(16,6,1,NULL,'TEXT',NULL,0,'2026-03-23 16:02:59','2026-03-23 16:02:59'),(17,6,3,NULL,'TEXT',NULL,0,'2026-03-23 16:06:28','2026-03-23 16:06:28'),(18,8,1,'dev đã tạo nhóm: Make Astra Great Again','TEXT',NULL,0,'2026-03-23 16:28:24','2026-03-23 16:28:24'),(19,9,1,'dev đã tạo nhóm: Make Astra Great Again','TEXT',NULL,0,'2026-03-23 16:28:25','2026-03-23 16:28:25'),(20,8,1,'[Hệ thống] Đã rời nhóm','TEXT',NULL,0,'2026-03-23 16:29:16','2026-03-23 16:29:16'),(21,8,1,'[Hệ thống] Đã tự động chỉ định Admin mới','TEXT',NULL,0,'2026-03-23 16:29:16','2026-03-23 16:29:16'),(22,9,1,'hú','TEXT',NULL,0,'2026-03-23 16:29:30','2026-03-23 16:29:30'),(23,9,1,'ngu si','TEXT',NULL,0,'2026-03-23 16:29:48','2026-03-23 16:29:48'),(24,9,1,'[Hệ thống] Đã đổi tên nhóm thành: Make Astra Great','TEXT',NULL,0,'2026-03-23 16:40:41','2026-03-23 16:40:41'),(25,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:21','2026-03-23 17:12:21'),(26,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:27','2026-03-23 17:12:27'),(27,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:31','2026-03-23 17:12:31'),(28,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:48','2026-03-23 17:12:48'),(29,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:51','2026-03-23 17:12:51'),(30,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:51','2026-03-23 17:12:51'),(31,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:52','2026-03-23 17:12:52'),(32,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:52','2026-03-23 17:12:52'),(33,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:52','2026-03-23 17:12:52'),(34,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:53','2026-03-23 17:12:53'),(35,9,1,'[Hệ thống] Đã cấp quyền Admin cho một thành viên','TEXT',NULL,0,'2026-03-23 17:12:53','2026-03-23 17:12:53'),(36,10,1,'dev đã tạo nhóm: ABC','TEXT',NULL,0,'2026-03-23 17:13:41','2026-03-23 17:13:41');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000001_create_cache_table',1),(2,'0001_01_01_000002_create_jobs_table',1),(3,'0001_01_01_000003_create_roles_table',1),(4,'0001_01_01_000004_create_users_table',1),(5,'0001_01_01_000005_create_auth_tokens_table',1),(6,'2026_01_22_080849_create_sessions_table',1),(7,'2026_01_26_010958_create_profiles_table',1),(8,'2026_01_26_014136_create_posts_table',1),(9,'2026_01_29_160000_create_media_attachments_table',2),(10,'2026_02_02_000333_add_cover_position_to_profiles_table',3),(11,'2026_02_05_073955_create_reports_table',4),(12,'2026_02_24_141738_create_friendships_table',4),(13,'2026_02_27_031020_create_notifications_table',4),(14,'2026_03_05_090931_add_password_reset_to_auth_tokens_type',4),(15,'2026_03_05_085925_create_permissions_table',5),(16,'2026_03_05_091204_create_role_permissions_table',5),(17,'2026_03_12_041208_create_comments_table',5),(18,'2026_03_13_000001_create_user_blocks_table',5),(19,'2026_03_18_155703_add_deleted_at_to_users_table',6),(20,'2026_03_05_090645_create_hashtags_table',7),(21,'2026_03_09_145053_create_post_hashtags_table',7),(22,'2026_03_16_160906_create_post_likes_table',7),(23,'2026_03_18_161142_add_deleted_at_to_multiple_tables',8),(24,'2026_03_18_175758_create_comment_likes_table',8),(25,'2026_03_22_000001_create_follows_table',9),(26,'2026_03_21_040937_create_conversations_table',10),(27,'2026_03_21_040938_create_conversation_members_table',10),(28,'2026_03_21_040938_create_messages_table',10),(29,'2026_03_23_220757_add_details_to_media_attachments_table',11),(31,'2026_03_25_230610_add_type_to_notifications_table',12);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `receiver_id` bigint unsigned NOT NULL,
  `actor_id` bigint unsigned NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` enum('POST','FRIEND','USER','SYSTEM','COMMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_receiver_id_foreign` (`receiver_id`),
  KEY `notifications_actor_id_foreign` (`actor_id`),
  CONSTRAINT `notifications_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,1,NULL,'POST',73,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-21 13:40:38','2026-03-23 16:10:20'),(2,1,1,NULL,'POST',97,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-21 13:41:30','2026-03-23 16:10:15'),(3,1,1,NULL,'POST',30,'Bài viết của bạn đã bị gỡ bỏ do Ngôn từ kích động thù ghét',1,'2026-03-21 13:51:28','2026-03-23 16:08:56'),(4,20,1,NULL,'COMMENT',42,'Bình luận của bạn đã bị gỡ bỏ',0,'2026-03-21 13:59:52','2026-03-21 13:59:52'),(5,1,1,NULL,'POST',1,'Bài viết của bạn đã bị gỡ bỏ do Velit neque deleniti ipsam et esse vitae iste sit illum placeat dignissimos neque omnis excepturi eos amet quia amet ut natus non recusandae quos ratione magni et maxime sint vero commodi aut placeat tempore et ea nulla fugiat aspernatur aliquam sed quibusdam est autem error autem in cupiditate commodi at architecto voluptatum rerum neque quia animi minima quia iusto et nobis eos iure sunt recusandae minus sunt magni inventore eligendi illum aut fugit ut.',1,'2026-03-23 17:28:46','2026-03-23 17:31:45'),(6,1,1,NULL,'POST',96,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:35:58','2026-03-23 17:44:14'),(7,1,1,NULL,'POST',95,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:05','2026-03-23 17:44:14'),(8,1,1,NULL,'POST',94,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:09','2026-03-23 17:44:14'),(9,1,1,NULL,'POST',93,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:11','2026-03-23 17:44:14'),(10,1,1,NULL,'POST',92,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:14','2026-03-23 17:44:14'),(11,1,1,NULL,'POST',91,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:18','2026-03-23 17:44:14'),(12,1,1,NULL,'POST',90,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:21','2026-03-23 17:44:14'),(13,1,1,NULL,'POST',89,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:24','2026-03-23 17:44:14'),(14,1,1,NULL,'POST',88,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:28','2026-03-23 17:44:14'),(15,1,1,NULL,'POST',87,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:32','2026-03-23 17:44:14'),(16,1,1,NULL,'POST',86,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:35','2026-03-23 17:44:14'),(17,1,1,NULL,'POST',85,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:43','2026-03-23 17:44:14'),(18,1,1,NULL,'POST',84,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:47','2026-03-23 17:44:14'),(19,1,1,NULL,'POST',83,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:50','2026-03-23 17:44:14'),(20,1,1,NULL,'POST',82,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:53','2026-03-23 17:44:14'),(21,1,1,NULL,'POST',81,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:55','2026-03-23 17:44:14'),(22,1,1,NULL,'POST',80,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:36:59','2026-03-23 17:44:14'),(23,1,1,NULL,'POST',79,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:01','2026-03-23 17:44:14'),(24,1,1,NULL,'POST',78,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:06','2026-03-23 17:44:14'),(25,1,1,NULL,'POST',77,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:10','2026-03-23 17:44:14'),(26,1,1,NULL,'POST',76,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:14','2026-03-23 17:44:14'),(27,1,1,NULL,'POST',75,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:21','2026-03-23 17:44:14'),(28,1,1,NULL,'POST',74,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:24','2026-03-23 17:44:14'),(29,1,1,NULL,'POST',72,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:28','2026-03-23 17:44:14'),(30,1,1,NULL,'POST',71,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:31','2026-03-23 17:44:14'),(31,1,1,NULL,'POST',70,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:34','2026-03-23 17:44:14'),(32,1,1,NULL,'POST',69,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:38','2026-03-23 17:44:14'),(33,1,1,NULL,'POST',68,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:41','2026-03-23 17:44:14'),(34,1,1,NULL,'POST',67,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:45','2026-03-23 17:44:14'),(35,1,1,NULL,'POST',66,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 17:37:49','2026-03-23 17:44:14'),(36,1,1,NULL,'POST',2,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 18:31:08','2026-03-23 18:33:07'),(37,1,1,NULL,'POST',3,'Bài viết của bạn đã bị gỡ bỏ',1,'2026-03-23 18:31:16','2026-03-23 18:33:07'),(38,1,1,NULL,'COMMENT',50,'Bình luận của bạn đã bị gỡ bỏ',1,'2026-03-23 18:34:50','2026-03-25 06:08:28'),(39,1,1,NULL,'COMMENT',49,'Bình luận của bạn đã bị gỡ bỏ',1,'2026-03-23 18:34:59','2026-03-25 06:08:28'),(40,1,108,'LIKE','POST',112,'đã thích bài viết của bạn',1,'2026-03-25 15:51:39','2026-03-25 16:24:53');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_slug_unique` (`slug`),
  UNIQUE KEY `permissions_description_unique` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'user.view','USER','Xem danh sách người dùng','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(2,'user.ban','USER','Khóa/Mở khóa tài khoản','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(3,'user.assign_role','USER','Gán vai trò cho người dùng','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(4,'post.view','POST','Xem tất cả bài viết','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(5,'post.delete','POST','Xóa bài viết','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(6,'post.restore','POST','Khôi phục bài viết đã xóa','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(7,'comment.view','COMMENT','Xem tất cả bình luận','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(8,'comment.delete','COMMENT','Xóa bình luận','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(9,'report.view','REPORT','Xem danh sách báo cáo','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(10,'report.resolve','REPORT','Xử lý báo cáo (xóa nội dung)','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(11,'report.reject','REPORT','Từ chối báo cáo','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(12,'role.view','ROLE','Xem danh sách vai trò','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(13,'role.create','ROLE','Tạo vai trò mới','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(14,'role.edit','ROLE','Chỉnh sửa vai trò','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(15,'role.delete','ROLE','Xóa vai trò','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(16,'dashboard.view','DASHBOARD','Xem trang tổng quan','2026-03-19 02:25:44','2026-03-19 02:25:44',NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_hashtags`
--

DROP TABLE IF EXISTS `post_hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_hashtags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `hashtag_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_hashtags_post_id_hashtag_id_unique` (`post_id`,`hashtag_id`),
  KEY `post_hashtags_hashtag_id_foreign` (`hashtag_id`),
  CONSTRAINT `post_hashtags_hashtag_id_foreign` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_hashtags_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_hashtags`
--

LOCK TABLES `post_hashtags` WRITE;
/*!40000 ALTER TABLE `post_hashtags` DISABLE KEYS */;
INSERT INTO `post_hashtags` VALUES (1,99,1,NULL,NULL),(2,100,1,NULL,NULL),(3,101,2,NULL,NULL),(4,101,3,NULL,NULL),(5,101,4,NULL,NULL),(6,101,5,NULL,NULL),(7,101,6,NULL,NULL),(8,102,2,NULL,NULL),(9,102,3,NULL,NULL),(10,102,4,NULL,NULL),(11,102,5,NULL,NULL),(12,102,6,NULL,NULL),(13,103,7,NULL,NULL),(14,103,8,NULL,NULL),(15,103,9,NULL,NULL),(16,103,10,NULL,NULL),(17,103,11,NULL,NULL),(18,105,12,NULL,NULL),(19,105,13,NULL,NULL),(20,105,14,NULL,NULL),(21,105,15,NULL,NULL),(22,105,16,NULL,NULL),(23,108,17,NULL,NULL),(24,108,18,NULL,NULL),(25,112,19,NULL,NULL),(26,112,20,NULL,NULL),(27,112,21,NULL,NULL),(28,112,22,NULL,NULL),(29,112,23,NULL,NULL),(30,113,24,NULL,NULL),(31,113,13,NULL,NULL),(32,113,25,NULL,NULL),(33,113,15,NULL,NULL),(34,113,26,NULL,NULL);
/*!40000 ALTER TABLE `post_hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_likes`
--

DROP TABLE IF EXISTS `post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_likes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_likes_post_id_user_id_unique` (`post_id`,`user_id`),
  KEY `post_likes_user_id_foreign` (`user_id`),
  CONSTRAINT `post_likes_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
INSERT INTO `post_likes` VALUES (1,34,1,'2026-03-19 09:21:08'),(2,37,1,'2026-03-19 09:21:21'),(7,103,1,'2026-03-23 19:45:28'),(8,98,1,'2026-03-23 19:48:19'),(12,112,108,'2026-03-25 22:51:39'),(13,117,1,'2026-03-25 23:41:32');
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `privacy` enum('PUBLIC','FRIENDS','ONLY_ME') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLIC',
  `likes_count` int NOT NULL DEFAULT '0',
  `comments_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_user_id_created_at_index` (`user_id`,`created_at`),
  KEY `posts_parent_id_index` (`parent_id`),
  CONSTRAINT `posts_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,NULL,'Hello world!','PUBLIC',0,2,'2026-01-26 01:54:16','2026-03-23 17:28:46'),(2,1,NULL,'Hello world!','PUBLIC',0,3,'2026-01-26 01:54:40','2026-03-23 18:31:08'),(3,1,NULL,'Hello world!','PUBLIC',0,1,'2026-01-26 01:55:10','2026-03-23 18:31:16'),(4,1,NULL,'Hello world!','PUBLIC',0,1,'2026-01-26 01:55:41',NULL),(5,1,NULL,'Hello world!','PUBLIC',0,0,'2026-01-26 01:55:49',NULL),(6,1,NULL,'Hello world!','PUBLIC',0,0,'2026-01-26 01:56:17',NULL),(7,1,NULL,'Hello world!','PUBLIC',0,0,'2026-01-26 01:56:43',NULL),(8,1,NULL,'Hello world!','PUBLIC',0,3,'2026-01-26 01:56:49',NULL),(9,1,NULL,'Hello world!','PUBLIC',0,5,'2026-01-26 01:58:45',NULL),(10,1,NULL,'Hello world!','PUBLIC',0,4,'2026-01-26 02:02:29',NULL),(11,1,NULL,'CUTE','PUBLIC',0,2,'2026-01-29 10:03:46',NULL),(12,1,NULL,'CUTE','PUBLIC',0,4,'2026-01-29 10:03:56',NULL),(13,1,NULL,'CUTE','PUBLIC',0,2,'2026-01-29 10:04:47',NULL),(14,1,NULL,NULL,'PUBLIC',0,2,'2026-01-29 10:11:35','2026-02-01 16:29:11'),(15,1,NULL,'àvregvfcaszrew','PUBLIC',0,0,'2026-01-29 10:16:45','2026-02-01 16:29:04'),(16,1,NULL,NULL,'PUBLIC',0,1,'2026-02-01 22:26:58','2026-02-01 16:23:42'),(17,1,NULL,NULL,'PUBLIC',0,1,'2026-02-01 22:33:26','2026-02-01 16:23:35'),(18,1,NULL,NULL,'PUBLIC',0,2,'2026-02-01 22:35:01',NULL),(19,1,NULL,'Sylvia','PUBLIC',0,4,'2026-02-01 23:06:14',NULL),(20,1,NULL,'Sylvia','PUBLIC',0,2,'2026-02-01 23:07:05','2026-02-01 16:13:39'),(21,1,NULL,NULL,'PUBLIC',0,0,'2026-02-01 23:15:05',NULL),(22,1,NULL,'Benchmark giữa session id và jwt (rs256). Sử dụng redis là nơi lưu trữ session. web server là redis sử dụng docker trên cùng 1 máy để giảm thiểu độ trễ mạng, chỉ focus vào cpu overhead. CPU được đo bằng pidstat.\n\nTrong ảnh lần lượt là throughput / cpu của session id và jwt. Các chỉ số chỉ rõ rằng sử dụng session id có throughtput 7k cao gấp đôi so với jwt 3k, trong khi cpu không chênh nhau quá nhiều.\nĐiều này có nghĩa là cpu overhead của phương án session id là thấp hơn hẳn so với jwt. Khi triển khai thực tế, thì redis thường sẽ nằm ở 1 máy chủ khác, sự chênh lệch về CPU overhead càng nhiều vì không phải gánh redis. Tất nhiên đừng nhầm lẫn về HIỆU NĂNG TỔNG THỂ và CPU Overhead. Latency/Throughput bị sẽ ảnh hưởng qua network, nhưng kết luận về CPU overhead KHÔNG THAY ĐỔI.\nJWT bản thân nó là stateless, các phương án để thu hồi chỉ là các cách chống chế đi ngược lại nguyên lý ban đầu của JWT.  Điểm yếu của JWT vẫn không đi đâu cả, bản thân nó không thể giải quyết được, điểm yếu nó vẫn nằm ở đó và được khắc phục bằng các phương án bên ngoài bằng cách trade-off, như blacklist whitelist, hay expire ngắn.\nVòng đời token ngắn cũng không giải quyết được triệt để, đặc biệt là ở vấn đề bảo mật, và nếu để ngắn quá thì giống như là uống độc để giải khát: khi đó số lượng request để lấy token mới lại tăng vọt....\nTất nhiên không có gì là hoàn hảo và phải đánh đối cho phù hợp với tình huống thực tế, nên mình cũng đã nói rất rõ:\n\"Jwt là giải pháp rất tốt cho việc trao đổi giữa các microservice hay SSO, hay các hệ thống có cả ứng dụng mobile, nhưng nếu chỉ là quản lý phiên đăng nhập web bình thường, Session truyền thống (kết hợp Redis) vẫn là giải pháp an toàn hơn, nhanh hơn và tiết kiệm tài nguyên hơn\". → nhưng không ai chịu đọc.','PUBLIC',0,0,'2026-02-01 23:34:00',NULL),(23,3,NULL,'Dau','FRIENDS',0,0,'2026-03-05 08:24:22',NULL),(24,1,NULL,'mưedsn','PUBLIC',0,0,'2026-03-05 09:12:36',NULL),(25,1,NULL,'Nihil ab tempora sapiente velit quae aut quo magnam quia at vero qui qui explicabo vel quaerat eaque temporibus qui doloremque facere delectus quae dolore et quos necessitatibus dolores enim veniam repellendus rerum consequuntur pariatur repudiandae explicabo aut iste nemo explicabo magni sit illum quidem minima magnam quis debitis deleniti nobis repellendus et repudiandae optio vel fuga qui et laboriosam molestias repellat eius nisi dolorum id libero nihil asperiores neque esse aut nisi corporis eos occaecati enim totam earum et molestiae voluptatem ullam debitis et reiciendis autem praesentium harum et dolor magni tenetur cum occaecati repellendus ad consequatur sunt rerum unde enim maiores ipsam.','FRIENDS',0,0,'2026-03-05 09:50:21',NULL),(26,1,NULL,'Deserunt saepe occaecati in eius molestias totam repudiandae ducimus minima est dolorum omnis sint amet porro eveniet dignissimos expedita amet sit aperiam ut quo nesciunt non qui rerum sit qui necessitatibus qui minus ut suscipit et velit distinctio aspernatur labore quidem inventore consequatur cumque qui ex aut pariatur ratione pariatur delectus facilis et dicta alias ut voluptatem ea veniam ad non voluptate non voluptatibus nihil iusto iusto asperiores dolorum enim mollitia saepe sunt debitis incidunt ullam fugiat et placeat voluptatem repellendus ipsa ipsa ut repellat repellendus illo adipisci saepe ex eos aut libero qui molestiae veniam consequuntur voluptatibus consequatur aut nesciunt aut excepturi quidem inventore cum aut beatae rerum animi quo enim occaecati omnis in error nihil modi porro eaque similique architecto inventore rem dolores aspernatur eaque et ullam.','PUBLIC',0,0,'2026-03-05 09:50:21',NULL),(27,1,NULL,'Consequatur voluptas culpa nemo impedit repudiandae in eveniet ut pariatur corrupti ratione officia ad quos optio eos quia est iusto cum tempora sunt vitae sapiente quisquam vel eius molestiae amet iste eligendi hic voluptates quaerat tenetur laborum voluptatum perspiciatis dicta qui et nobis neque sunt debitis tempora odio dolorem est velit dolore magnam explicabo dicta distinctio dolores similique consequuntur libero placeat nisi ab aut quia debitis quod sequi debitis at non ducimus quis commodi nobis occaecati odit voluptatem suscipit voluptas dicta quis qui repellat sed.','FRIENDS',0,0,'2026-03-05 09:50:21',NULL),(28,1,NULL,'Sit eum magni explicabo sapiente omnis sit voluptatem vitae ut est doloremque quos ipsam quia adipisci eum dolorum nihil magni aut quo consequatur incidunt minima consequatur doloremque minus facilis id quia quo tenetur consequatur enim ipsam quia sed dolorem in distinctio modi placeat nihil minima corporis aliquid adipisci et error enim sint eligendi eos dolore eos reprehenderit saepe quos id eveniet velit sed iure sunt consequatur fugiat modi reprehenderit et quaerat est magni nemo delectus possimus fuga vel et ut ipsam deserunt illo qui voluptas reiciendis aut consectetur autem unde voluptatum sit beatae autem labore qui et reiciendis aut facere reprehenderit rem aut sapiente et aliquid vel error voluptas autem aliquam illo et ducimus sit.','PUBLIC',0,0,'2026-03-05 09:50:21',NULL),(29,1,NULL,'Natus in omnis minus cum quisquam molestiae ad harum placeat inventore quia eligendi omnis vel quos excepturi qui vel iure aut nihil consequatur possimus sunt ut est aut doloremque qui eos odit ullam unde aut sed assumenda dicta dignissimos culpa non aliquam ut voluptas explicabo nesciunt ea nihil illum suscipit eligendi distinctio molestias beatae ea totam qui rerum quo magni perspiciatis nihil fugit delectus fugit praesentium minima voluptatibus blanditiis ad dolores delectus dolorem doloremque quo neque id laudantium sed blanditiis impedit sunt est laudantium vitae ut.','ONLY_ME',0,0,'2026-03-05 09:50:21',NULL),(30,1,NULL,'Quisquam sed optio fugiat molestiae amet aut aut vel provident blanditiis eum delectus sed voluptate accusamus dolore sed non minus enim ea tempora veniam est facilis error nobis eligendi unde qui officia architecto occaecati dicta nostrum nemo id velit consectetur doloremque earum in neque omnis dolore eos iure fugiat doloribus aspernatur sunt dolorum molestiae quam fuga voluptatem reiciendis doloribus natus corrupti perspiciatis cum ratione repellendus et delectus magni nostrum unde facere sint ut aut et exercitationem et provident neque aliquam sint quia id sunt quo repellat et labore labore officia incidunt quo consequuntur ut accusamus sit neque nesciunt odit deserunt et molestiae eligendi exercitationem et veniam dolorem eos autem assumenda sed ullam itaque sint.','PUBLIC',0,0,'2026-03-05 09:50:21','2026-03-21 13:51:28'),(31,1,NULL,'Libero nisi necessitatibus nisi fugit accusantium et nam quia quia sequi quo amet commodi sed eveniet sunt nemo quae expedita pariatur voluptatem consequatur autem qui id nam ipsam aut placeat nobis est voluptatem omnis iste eum omnis delectus minima est eius laboriosam qui iste voluptatem nam deleniti autem ex velit sint et earum et ab aliquam praesentium laudantium alias ad harum et fuga ipsa voluptatem accusantium necessitatibus ex officiis id veniam dolorem et exercitationem non provident sed quam et repudiandae et quidem assumenda aut velit quam id architecto rerum est omnis nostrum.','ONLY_ME',0,0,'2026-03-05 09:50:21',NULL),(32,1,NULL,'Voluptatibus perferendis error deserunt est esse reiciendis aut vel rerum nostrum maiores est cum consectetur veritatis quos perferendis dolor sed saepe quasi odit iure et ut quia quia quia non qui quia sint provident consequatur accusantium laboriosam vitae ut non sit neque ipsa perferendis eveniet error consequatur dolor maxime enim ex quia qui assumenda possimus occaecati doloremque quis qui quis voluptas nihil enim ipsum eius odio placeat impedit voluptas voluptates labore libero consequatur et a aut alias aliquam necessitatibus sed voluptas eligendi ut minima eum et quas.','FRIENDS',0,0,'2026-03-05 09:50:21',NULL),(33,1,NULL,'In itaque ut aut facere quia eius voluptatum vel est nesciunt vitae est vitae cumque sapiente mollitia qui maxime quibusdam assumenda sunt voluptatem quo officiis autem velit eaque ipsa autem incidunt et pariatur repudiandae ut possimus excepturi non est sed reiciendis rerum mollitia eveniet sint consequatur excepturi quos omnis dolor ut hic consequuntur ut consequuntur praesentium accusantium et dolor eaque et similique facilis vitae laborum ex nobis quia cumque deserunt est impedit vel sunt dolores ut ut minima illo alias sit minima quod ipsam id doloribus perspiciatis quo accusamus culpa enim qui consequatur est tenetur nostrum eos consequatur sint quasi ex voluptatem eos ex eaque et illum ut placeat labore nisi aliquid aliquam ad delectus rem maiores et sit aperiam dolorem mollitia quo quia rerum perferendis ratione laboriosam aut quia laborum enim iste esse odit ab id.','ONLY_ME',0,0,'2026-03-05 09:50:21',NULL),(34,1,NULL,'Nobis non rem explicabo omnis dolorum hic inventore ex eos aliquid explicabo sit beatae quia velit ut possimus culpa repellat asperiores ut quia suscipit unde nemo quia itaque libero similique dolore ea dolorem id rem cum quo debitis eligendi et ut dolorum ipsum dicta quo velit dolores sunt non similique dolorem laboriosam at placeat expedita dolores laborum ut perspiciatis in aut nisi totam possimus nisi veniam odit ut possimus tempore magnam eum occaecati.','FRIENDS',1,1,'2026-03-05 09:50:21',NULL),(35,1,NULL,NULL,'PUBLIC',0,1,'2026-03-18 16:42:19',NULL),(36,1,7,NULL,'PUBLIC',0,0,'2026-03-19 09:16:47',NULL),(37,1,34,NULL,'FRIENDS',1,0,'2026-03-19 09:16:55','2026-03-25 15:59:52'),(38,1,NULL,'Quibusdam nihil eaque alias inventore dolores quia officia deleniti architecto ut ad facilis dolor eum tenetur consectetur minima dignissimos sed incidunt est dolorem id ducimus reprehenderit est quae quaerat nihil quis eligendi qui alias nisi rem possimus nemo et optio ipsa aliquid corporis in porro quibusdam dolorum praesentium ad voluptas nemo libero placeat quam est est quas consequatur consectetur perspiciatis nostrum omnis et nihil ea dolores illum beatae at et et doloremque rerum qui qui quia sunt voluptatibus sed.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(39,1,NULL,'Ut doloribus earum vel autem est qui eos mollitia aut ipsam eum cum qui sit qui totam cum fugiat assumenda nostrum quibusdam iste adipisci debitis nihil excepturi dolor et voluptates perspiciatis sit officia expedita aspernatur quidem error beatae inventore consequatur id enim dolor ratione eligendi consequatur est nesciunt ipsum at ipsa repellat corrupti aperiam enim hic ipsam non vel praesentium corrupti labore ea impedit veritatis expedita rem quaerat aspernatur molestias quia dolorum doloribus nobis deserunt ex consequatur dicta ex veritatis est dolorem molestias sed fugiat tenetur.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(40,1,NULL,'Nostrum qui omnis beatae amet nam voluptas dolorem omnis sit aliquid voluptas aut aut cum iure similique quas animi ab distinctio nisi libero impedit optio est sit quia officiis ipsum sunt ratione tempore et eos qui veritatis ex officia aspernatur doloribus tempora maxime eligendi rerum et esse eum blanditiis vero sit quis amet et molestiae aut sint eveniet pariatur tempore autem incidunt occaecati fugiat magnam qui ducimus.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(41,1,NULL,'Facilis fuga sint debitis vitae et aut consequatur qui deserunt dignissimos labore quas in voluptatem assumenda aut quaerat eius reiciendis aut vel magni ut asperiores sapiente dolor necessitatibus delectus consequuntur esse est dolorem fuga numquam in quo rerum quod rerum commodi voluptatibus commodi quidem sed maiores ut illo ullam accusamus ut officia est eos velit harum pariatur atque maiores quo temporibus dolorum dolorem iure assumenda quam reprehenderit iste enim aut voluptas quam adipisci ea dolorem sapiente porro dolorum sequi tempora accusantium natus voluptate dicta incidunt sapiente molestiae error mollitia sed incidunt suscipit voluptate dignissimos voluptatem ad nesciunt consequatur doloremque a quod voluptas vero impedit et animi cupiditate.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(42,1,NULL,'Quam excepturi corporis beatae et velit amet iste laborum vitae voluptate ullam cupiditate vitae voluptatibus id quae quia excepturi unde omnis iusto ea quis quia doloribus et distinctio consequatur saepe in nihil non sit reprehenderit odio ducimus est sit tempora non ratione maxime voluptatem molestiae qui nisi ab id provident vel nihil autem sit maxime non rerum sunt enim aut ea blanditiis odit est autem aperiam dicta qui mollitia nisi qui molestiae qui natus quaerat beatae impedit aut consequatur autem quasi et quaerat quis et quidem voluptatem delectus esse esse numquam enim magni odio minima harum nihil expedita aliquid perspiciatis cumque sed consequatur rerum sit saepe dicta fuga dolorum provident vel quia facilis et atque laboriosam eum atque cum eos enim eligendi dolor sequi earum expedita ut reiciendis et alias vel voluptatem tenetur qui in voluptas distinctio non vero nulla.','FRIENDS',0,0,'2026-03-19 09:25:44',NULL),(43,1,NULL,'A et sed autem optio laudantium optio saepe sit est ad et tenetur omnis perferendis labore animi reiciendis facilis aliquam exercitationem illum minima facilis tenetur natus architecto impedit aut quo quasi autem quis eius laboriosam non dolores quis occaecati qui dolor impedit in molestiae ipsam voluptate fugit impedit voluptas reiciendis aperiam enim minus odit velit et voluptate saepe quia velit consequatur nulla ducimus debitis doloremque dolorem aut nostrum nulla esse aut maxime rerum.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(44,1,NULL,'Sit ut eum eos odio accusantium porro ut ea animi dolores vitae blanditiis sunt et ratione rerum in et amet voluptas aut ducimus consequatur totam odio illum dolorem iure porro quia eum dolores est velit voluptates error sit asperiores autem libero est eum velit totam incidunt quis placeat repudiandae est tempore sed porro eius quod blanditiis et similique possimus quae repellat et et qui magni ducimus aut sed libero unde doloremque eum quisquam placeat possimus quidem odit.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(45,1,NULL,'Sequi et sed pariatur maiores et est voluptatibus totam expedita est quo aspernatur nisi iste corrupti repellat nam aspernatur qui quam consequatur voluptatem eveniet odit et excepturi porro dolorum est odio cumque ipsam quos mollitia exercitationem inventore dolorem molestiae eligendi non qui et unde omnis rerum tempore et ipsum sequi quaerat maxime debitis tempore illo quia autem quis sequi et incidunt et minima odit voluptas quia aut omnis et unde inventore tempore illo enim labore consequuntur exercitationem labore minus ex eveniet ratione voluptate vel nisi ratione nobis quis molestiae dicta sed et ut voluptas est omnis rerum autem amet culpa autem deserunt ut rem.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(46,1,NULL,'Unde autem cum ratione inventore enim beatae reprehenderit molestiae sunt sunt voluptatum iure laboriosam aut corrupti minus minus et ut voluptatum laboriosam molestiae magnam saepe est illo corrupti sunt ab aut fugit voluptas provident maxime quo asperiores nam voluptate quod quos quas mollitia quo non harum pariatur laborum ut deleniti perspiciatis nihil inventore ipsam quisquam est distinctio aut et et facere minima reiciendis quasi consectetur aut alias voluptatibus nesciunt qui est cupiditate sint sint laborum cumque ipsum placeat sit praesentium illum rerum atque suscipit quidem a minima excepturi corrupti amet voluptas nisi beatae iure illo.','FRIENDS',0,0,'2026-03-19 09:25:44',NULL),(47,1,NULL,'Quos explicabo ut recusandae animi quae non magnam fuga sed laudantium ut ullam aut a aut rerum repellat distinctio asperiores deleniti et vel quaerat rerum facere quo praesentium facere eum qui odio sed ducimus nulla delectus officiis dolor sit nostrum aut ut quia voluptas non ab hic blanditiis veritatis ducimus autem et ipsum velit minus minima quia voluptatum tenetur eum quasi et enim magni voluptatibus accusantium et minima id aut fugiat quidem voluptatem ut dicta.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(48,1,NULL,'Ut qui maiores explicabo quasi ut recusandae dicta rerum aperiam voluptatem consectetur quia corrupti ex quasi architecto expedita ipsam eius voluptas commodi voluptatum incidunt rerum et eveniet et sunt sed accusantium aperiam ducimus ab velit cupiditate iure consequatur corporis vel cupiditate cumque non rerum quis voluptate reiciendis alias qui illo et eveniet quia sint minima quis dignissimos quibusdam qui non dolorem repudiandae et quam nemo in omnis et occaecati.','FRIENDS',0,0,'2026-03-19 09:25:44',NULL),(49,1,NULL,'Et sed id ipsam est et sint voluptas et ducimus non qui consequatur quo nihil qui blanditiis quis eligendi at velit rerum recusandae qui ut a voluptatum et ex autem aut voluptatem molestiae praesentium dignissimos maxime eos ut praesentium quae rem nemo accusamus temporibus ipsum odio laboriosam et vitae quod in aperiam reprehenderit exercitationem saepe repellat dolor et quod quia voluptatem et neque sit sunt possimus accusamus occaecati voluptatum necessitatibus deleniti sed adipisci voluptas non sed sed tenetur corporis quia explicabo sint non deserunt occaecati soluta ratione omnis aut cum ut rerum et sint architecto pariatur et in ea debitis dolor magni ducimus et saepe consequuntur quidem quis vel ratione possimus illo aut voluptates aliquid voluptas a voluptatem qui eos rem amet nulla qui voluptatum ut officia rerum qui praesentium repellat ratione aut sit.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(50,1,NULL,'Laboriosam ut vitae cum vel est amet ipsum veniam debitis dolore omnis eligendi impedit pariatur provident est sed quaerat ipsum eos excepturi esse similique voluptatem et fugiat nulla aut repellendus deleniti autem autem assumenda velit numquam non vitae at non neque aliquid vitae sed voluptatem consectetur et magni a iure ut minima aut est et dolorum hic quia rem id quia quasi iste quia quam unde tenetur quidem nulla quaerat adipisci maxime eos dicta porro eligendi qui veniam blanditiis aut voluptatibus in sint laboriosam aut voluptate rem perferendis quam provident ea aspernatur fugiat incidunt voluptatum possimus a sed dolorem debitis vel ut consequatur reiciendis minima qui quae mollitia veniam quo culpa et ipsam quos qui et dolor in recusandae.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(51,1,NULL,'Dolorum nesciunt dolorum ut voluptas architecto rem quaerat tenetur velit aliquam cupiditate sit magni eos velit et placeat et aut eligendi aliquid ipsum suscipit et aut dolor quia repudiandae quae quis in numquam corrupti consequatur non fugit quam voluptas voluptatibus libero numquam est eaque voluptates vitae mollitia iusto sequi error maiores quod consequatur odio illum numquam rerum ducimus dolor et velit commodi molestiae autem excepturi libero ducimus qui dolore dignissimos et accusantium quo et ut optio laborum enim perspiciatis mollitia autem saepe omnis unde reiciendis architecto voluptatem fugiat aut.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(52,1,NULL,'Culpa et aut aspernatur assumenda et consequatur aut quo et inventore ea itaque ea est labore animi modi et veritatis praesentium qui accusamus veniam nostrum quasi voluptatem quasi beatae aliquid laboriosam qui ea omnis voluptas quas repellat a voluptatem ipsum omnis quia laboriosam eaque nobis assumenda esse incidunt vitae dolores consequatur adipisci voluptatum dolor vitae suscipit perferendis ad sed aut iusto veniam maxime consequatur optio vero aut quo quis ut omnis unde rerum veniam non sunt ipsum laboriosam consequatur perferendis illo illum numquam asperiores beatae maxime aspernatur sapiente accusamus perferendis quidem totam quis eligendi dolores consequatur placeat tempora ut sed accusantium omnis voluptatem sunt at blanditiis.','FRIENDS',0,0,'2026-03-19 09:25:44',NULL),(53,1,NULL,'Magnam et quam sint porro nobis dolor nobis in nostrum exercitationem voluptas excepturi voluptatem doloremque et aut placeat dolorum soluta recusandae sunt aut autem quia minus voluptatum inventore rem nihil quia sed in possimus autem saepe recusandae molestiae magnam nulla adipisci inventore dolore ab sint iusto est iure reprehenderit sint unde id saepe sed minima at ut praesentium perspiciatis sequi libero vero dicta reprehenderit id quo sit quas dolor quisquam ipsam recusandae velit et accusamus culpa molestias dolorum culpa quo praesentium non voluptatem impedit sit autem sunt fuga vitae voluptas.','FRIENDS',0,0,'2026-03-19 09:25:44',NULL),(54,1,NULL,'Voluptates qui ut accusamus quis necessitatibus delectus et nulla dicta laudantium quod id eaque quas commodi aperiam impedit aut et voluptatibus blanditiis minus explicabo quos aut quo laboriosam eum unde sit quos suscipit odio consectetur deleniti ea provident nisi sit voluptatem impedit culpa totam necessitatibus et quasi et at sequi autem mollitia illo inventore ex et quia ea ipsam exercitationem accusamus iste blanditiis qui fugiat qui sunt numquam perspiciatis inventore hic voluptate a doloremque itaque rerum quae earum quisquam iusto vitae omnis quis est in laborum fugiat at natus quis eum magni praesentium qui sunt dolorem et maxime atque autem et illum et possimus tenetur sint ab adipisci veniam qui quis incidunt quod hic minus nesciunt eaque libero sunt praesentium fugiat quod laboriosam fugit saepe quis possimus fugit debitis rerum accusantium debitis rerum mollitia et vitae veniam.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(55,1,NULL,'Optio esse sint saepe molestiae cupiditate molestiae autem quia minus voluptatum eaque magnam quo et eum asperiores beatae accusantium voluptatum odit minima molestiae corrupti sunt ut ratione est illum maxime eveniet placeat et veniam quo magni suscipit quia iure vitae aut veniam eum quae quas nobis voluptatem fuga repudiandae aut explicabo omnis non temporibus dolor nobis consectetur quisquam illo nihil excepturi alias sit velit amet fugit quia et quis dolores nisi minima totam quibusdam velit voluptatibus quos ut numquam corporis qui molestias impedit velit similique consequatur deserunt ut inventore similique qui est corporis nemo odio qui laudantium eum quae illo similique sed commodi dolore et doloribus eveniet culpa pariatur accusantium odit est incidunt corrupti adipisci cumque eligendi dolores magni est dolorem.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(56,1,NULL,'Et quidem quae eum vitae dolorem nesciunt nam quidem et consequatur quo vel quae ut aut ad eaque qui impedit quae cum quo dignissimos consequatur et dolores qui dolor praesentium eius nulla qui voluptas natus sunt dicta voluptatum facilis eos pariatur enim doloremque incidunt eos reiciendis et sequi aut quae nesciunt eius itaque quis qui at illum maxime atque architecto dolore modi eligendi natus est maxime autem vitae iste et quia eos voluptas quos tempore itaque commodi tempora ut.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(57,1,NULL,'Ducimus dolores quia beatae voluptates quos harum veniam id optio impedit asperiores commodi velit autem itaque eum quos omnis sunt nemo libero qui hic neque inventore perferendis dolore rerum ratione dolor distinctio exercitationem et rerum tempora facilis dolores quasi voluptas quas magni vel aperiam id consequatur id vero fugit qui voluptate nostrum qui est libero et qui quo dolorem et voluptas doloremque voluptates velit nemo eum pariatur eaque rerum ut est atque excepturi consequuntur impedit quo ad delectus aut qui iusto placeat mollitia doloremque itaque eveniet autem est recusandae repellendus aut aut ducimus est quisquam qui vitae ea quam nobis libero aut maxime omnis corporis vero illum adipisci beatae ipsam nisi quidem voluptas numquam aliquam corrupti ut et ut impedit natus vero praesentium illo dolores dignissimos qui cumque alias et nesciunt.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(58,1,NULL,'Perspiciatis iusto pariatur quae eveniet accusantium molestias et architecto repellat et asperiores enim cum nisi id non sed corporis amet nisi sint quos et reiciendis qui eum ea eos voluptatibus neque voluptates doloremque fugiat quo harum consequatur facilis necessitatibus iusto doloribus dolorem quaerat sed maxime expedita hic ipsa similique quo dolorem eius iure ad qui qui quia eum dicta vitae quis tenetur qui est atque deleniti laborum velit rerum quo dignissimos omnis ex quia sapiente nihil voluptatum repellendus corporis et corporis rerum ab.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(59,1,NULL,'Quae in voluptatibus consequatur iusto veritatis eligendi magnam nulla dicta optio sapiente optio cumque perspiciatis doloremque veniam unde animi ea vero rerum dicta quibusdam omnis dolorem ut accusamus saepe repudiandae nesciunt optio explicabo est nemo mollitia assumenda sunt molestias aut necessitatibus earum reiciendis voluptate error est in ad molestiae nisi modi nam expedita nostrum facere architecto consequatur ea illum qui quia perferendis dolorum enim nihil non voluptatum laborum sint occaecati dicta voluptatem deserunt dolor vero natus qui doloribus ab provident ab ducimus.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(60,1,NULL,'Reprehenderit doloribus dolores earum doloribus rerum praesentium et sit cupiditate laboriosam ab labore mollitia deserunt est voluptatem consequatur nihil aspernatur qui nulla tempora mollitia quia reiciendis itaque vel voluptatem eum aut suscipit fugiat non vitae ullam dolores voluptate sit voluptatem rerum ut ut illum quam ut explicabo magni maiores rerum asperiores neque quo saepe deleniti rerum et consectetur ad explicabo quam sunt nihil aut cupiditate sunt odit assumenda eligendi voluptas autem sit et doloribus sed modi maxime dolores perferendis voluptates tempora aliquid nulla aut et quia nesciunt in odit ea dicta assumenda illo et quis perspiciatis molestias dolorem non qui ex vitae corporis voluptas cumque facilis illum et quia et autem qui nesciunt perspiciatis suscipit sint recusandae sapiente consequatur ab ut deleniti veritatis illo nobis quia cupiditate a quo qui ipsam iste amet odit eius a facere eum.','FRIENDS',0,0,'2026-03-19 09:25:44',NULL),(61,1,NULL,'Eum id est voluptatem mollitia sunt est ratione odit aperiam velit distinctio ut fuga vel dolorum saepe architecto omnis exercitationem eos aut voluptates aut neque et velit dolorum harum molestiae cupiditate eligendi officia nisi neque occaecati minus possimus atque vel amet animi esse rem eos fuga a quaerat voluptatem sint nihil fugit aut ducimus voluptates officia ducimus tenetur eligendi molestias facere numquam perferendis et repudiandae nulla incidunt vel et quia incidunt omnis harum itaque voluptatum iste dignissimos neque voluptatem quo ut sint minima non et consequatur maiores fuga praesentium inventore amet sunt porro et voluptatem nam animi vel atque repellendus voluptatem sit aut hic officiis consequatur est ut ipsum ut sit enim occaecati.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(62,1,NULL,'Rerum enim quibusdam blanditiis et beatae rerum magnam sit ut cumque dolorum perspiciatis commodi harum tenetur ut laudantium sunt dolores incidunt provident quam cupiditate odit repellat assumenda harum rerum qui sint consequatur non asperiores voluptas numquam officia cumque aut non in non magnam quibusdam et voluptatum aut atque earum voluptas aliquid dolorem labore sed et nisi expedita iusto suscipit aperiam nemo occaecati dolorem similique molestias architecto officiis magnam cupiditate animi voluptatem ipsam nisi ea est vel ea magni error esse qui id sunt error quia odit doloremque accusamus sint quae modi quo facere ut fuga debitis maxime qui omnis voluptas ut vel dolore quo quia quidem est expedita et quae sint ea est rem inventore perferendis voluptatibus architecto est.','ONLY_ME',0,0,'2026-03-19 09:25:44',NULL),(63,1,NULL,'Molestiae sunt harum et sed eum culpa eos et harum repellat omnis molestiae iste ut molestiae quis est minus ut et nihil ea vel minima eveniet facere nemo dolores ad magnam commodi velit et enim corporis quo voluptatem sint architecto id dolores delectus amet sapiente ipsa et laudantium ut qui aut autem eligendi qui maxime architecto aliquid repellendus similique eveniet maiores iure autem aperiam a et quia.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(64,1,NULL,'Voluptas rem consequuntur doloremque nulla voluptatem dolorum aspernatur iste at fugit quos veritatis recusandae et qui error vero itaque perspiciatis ut impedit et odio facere odit consequatur esse magnam sit nesciunt vel quisquam sit eum est deserunt quia odio nisi corrupti earum similique quaerat sunt eos ea neque quia id sit quasi consectetur sit facilis fugit voluptates quisquam minus at odit est occaecati fuga mollitia velit ut laborum ut magnam aut architecto eius omnis ipsa minima ut est eveniet quidem dolorum voluptatem aut voluptatem sit nemo aut quam ex aut dolor ut possimus voluptatum aliquid non ipsa magni earum tempora architecto earum explicabo provident et sapiente ut in nam ut omnis atque sed inventore veritatis qui voluptas minima consequatur quaerat iure voluptas error quidem qui fugit mollitia quae vel ipsam pariatur impedit commodi.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(65,1,NULL,'Id esse repellat rerum est fugit saepe repellat temporibus ratione laborum vel alias et harum non voluptatem odio dolor voluptatem dolorem repellat voluptatem cumque aut iste sunt corrupti commodi numquam officia aperiam odio deserunt sint qui deleniti sunt illo quae a dolorem est eum beatae ratione eum assumenda qui labore ab iure et et natus officiis tempore distinctio ut molestias error repellat qui dolore harum explicabo iusto debitis provident voluptas corporis vitae et reprehenderit labore possimus sint et deserunt dolores rerum fuga impedit quas autem at aut beatae et qui debitis magnam voluptatem sapiente officia nihil eius omnis aut architecto aliquam.','PUBLIC',0,0,'2026-03-19 09:25:44',NULL),(66,1,NULL,'Distinctio dicta qui iure suscipit explicabo voluptatem ratione eos omnis cum necessitatibus voluptates ut natus et recusandae voluptas blanditiis architecto mollitia voluptate tenetur et exercitationem ut et voluptatem est enim ut sint nesciunt dolores ut quidem saepe voluptatem enim dolor quis aut voluptas aut autem adipisci molestiae quia et nobis a aliquam qui aut dicta quis et totam laboriosam quidem odio vel et facere enim rerum earum vel qui blanditiis fugit rerum velit et quidem vero quo sapiente laudantium aperiam voluptatem illum consequatur perspiciatis sit voluptatum ut qui repellendus magni officiis dolor possimus ut aliquid ut officia animi nemo quasi est libero recusandae explicabo esse non labore magni nam aut voluptatem sed et perspiciatis totam eos eum id nemo illum similique sit pariatur quia quod ipsum voluptatem enim voluptas totam consequatur ut vero dolor sint optio odit deleniti deserunt aperiam.','ONLY_ME',0,0,'2026-03-19 09:25:44','2026-03-23 17:37:49'),(67,1,NULL,'Velit natus ut rerum et et cumque mollitia id dolore et ut doloribus eveniet aut harum commodi ut sunt veniam qui iste incidunt sint quis nobis et veniam rerum quaerat veniam amet voluptate molestiae rerum voluptas nisi recusandae sit modi non numquam mollitia iusto officia qui deserunt quasi dignissimos ad amet consectetur commodi repudiandae officia recusandae omnis rem quia voluptatum corrupti est quidem veritatis corporis tempore reiciendis eveniet dolor voluptatem voluptatibus velit quia sit et est omnis dicta ut nostrum hic earum blanditiis voluptates optio iusto aliquid rem cupiditate repudiandae sit maiores quis harum quidem earum aut voluptatem nemo officiis accusamus temporibus qui et aut accusamus veritatis aut rem maiores ab autem eum doloremque unde quis a voluptatem et consequatur ut consequuntur et tenetur ut.','ONLY_ME',0,0,'2026-03-19 09:25:44','2026-03-23 17:37:45'),(68,1,NULL,'Ut quos soluta quo hic voluptates minus quam qui aut expedita voluptas qui ut repudiandae non perspiciatis laudantium vero totam perspiciatis sint ad eos quia quaerat qui quam aperiam iusto sit eos provident nemo nemo tempore aut non qui nesciunt a voluptatem magnam sequi et officia laboriosam facere voluptas deserunt quia earum unde dolor modi quos et tempora officia culpa ipsum optio rem voluptatem.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:41'),(69,1,NULL,'Qui corporis laudantium doloremque facilis excepturi illum voluptatem voluptas commodi sint numquam quisquam odit rerum molestias optio placeat consequuntur molestias ut ratione voluptatem et corrupti et dolor magnam accusantium nemo et qui cum iure fugit laborum veniam cumque molestias quibusdam voluptatem cupiditate autem rerum ipsum repudiandae voluptatem ea eveniet est nisi libero accusantium et eos eveniet iste sit consequatur eius fugit veritatis optio quo saepe et ex ut fugit omnis dolor consequatur molestias natus aliquid eos molestiae tempora soluta placeat occaecati veniam autem aspernatur dolorem nam consequatur voluptatibus sequi illum et voluptatibus ut et qui consectetur voluptas iusto nisi doloremque vero officiis cumque odio ab sit molestiae quos temporibus unde iste ipsa vel aut qui consectetur placeat temporibus est.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:38'),(70,1,NULL,'Laboriosam iste tempore voluptatem laborum sed deserunt nam in in labore alias architecto dicta et dignissimos minus quia et nulla voluptates et sed quidem minima doloribus aut accusantium dignissimos odio suscipit error ducimus provident atque quaerat aut quidem nesciunt ut esse qui ut omnis consequatur sint cupiditate iste quasi reiciendis velit corrupti in sunt laboriosam non quae magnam minima omnis molestias autem earum velit iusto et quis at reprehenderit fugit qui sit corporis quidem quia dolor aut facilis ut ea sunt magni eum sint aut quam quas aperiam voluptate cum deserunt consequatur.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:34'),(71,1,NULL,'Dolorem porro animi sit consequatur doloribus quasi corrupti iure dolorum magnam occaecati voluptatibus in adipisci soluta et quas qui temporibus in pariatur doloremque qui unde possimus fugit et debitis qui vitae reprehenderit dolore sint facere debitis porro facilis in sint quo molestiae cum et impedit aut aut vel consequatur quaerat ipsum excepturi commodi molestias voluptas voluptas amet necessitatibus eaque in quibusdam molestias ut repellendus commodi aut earum eum aut aliquid quisquam quis ea nihil omnis ducimus voluptatem possimus ea aut porro eos doloremque alias quo a nostrum similique et quia.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:31'),(72,1,NULL,'Odit provident sed quasi in distinctio nobis molestiae consectetur nostrum ea nihil dolorum vitae atque facere corrupti quo dolore beatae voluptate velit expedita ut et harum incidunt et voluptas vero necessitatibus et dolores reiciendis nulla ratione aut porro optio et saepe magnam omnis rerum consequatur rerum aut hic neque sapiente in itaque animi eos aut rerum est molestias magnam culpa dolores id laborum in dolore rerum natus ut dolorum ratione eius eveniet aliquam.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:28'),(73,1,NULL,'Delectus excepturi ea molestias eum dolorem et dolorem non modi occaecati animi vero autem quia sapiente quia sit ratione autem sit aut sit voluptatum numquam accusamus distinctio ipsum possimus voluptatibus consectetur accusantium nulla itaque et eligendi labore excepturi sapiente aspernatur totam sit veritatis voluptatem quod dolorem qui nam rerum veniam mollitia dolorem praesentium et vel ex rerum aut aut ea vel commodi quia sunt corporis doloremque sapiente et nihil.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-21 13:40:38'),(74,1,NULL,'Facere ea nihil eos recusandae facere labore voluptas animi enim voluptas officia eos qui adipisci aut facere velit aspernatur iure molestias iste temporibus eveniet expedita commodi voluptatibus et qui culpa tempora et sed at sit velit perferendis autem id non consequuntur est et esse odit veritatis vel sint provident debitis facilis magnam rem velit fuga vitae consequatur rerum laboriosam ex sit doloribus illo id earum est ut est perferendis temporibus qui facere labore sed officia unde et placeat id expedita nisi dolorem cupiditate vero nulla occaecati ducimus consequatur distinctio aut animi et explicabo at in eius id numquam vitae distinctio adipisci eum temporibus laborum consequatur nulla deserunt repellat totam sint voluptatem perferendis ut accusamus ullam qui iure laboriosam doloribus quas tenetur suscipit minus neque perferendis dolorem omnis veritatis reiciendis quibusdam occaecati voluptatibus neque beatae est dignissimos perferendis quibusdam ea.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:24'),(75,1,NULL,'Facere nostrum iste itaque tempora vel aut et et vitae et commodi alias dolor magni quas distinctio officiis ea nisi quia a ea sint ut eligendi aliquam tempore ut distinctio voluptas rerum a quibusdam aut iure ut eos eius vel qui eum itaque temporibus ratione quasi in tempore nihil et est provident nemo atque fugiat voluptate ratione tempore expedita aliquid consequuntur eligendi laboriosam modi iure dicta voluptas asperiores odit inventore est quis perspiciatis rerum ad consequuntur autem tenetur aperiam totam quidem corrupti voluptas laudantium.','PUBLIC',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:21'),(76,1,NULL,'Non rem vel repellendus tenetur velit aut ratione nobis voluptas recusandae ipsam quis sunt sunt dolorem qui velit cupiditate iure et cumque accusamus molestiae magnam non quod velit ut quia aliquam est quidem aut illo sit architecto ut id vel fugit vitae veritatis dolore qui voluptate at sunt eius eius sed saepe eos quas quidem dolore odit quasi enim eos labore dolor illum ut ut qui aut officiis repellat sapiente molestiae molestias aut nulla ex aperiam earum rerum expedita optio eos.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:14'),(77,1,NULL,'Cumque architecto itaque consectetur cupiditate aut corrupti enim rerum suscipit in quia vel excepturi ad voluptas temporibus a quia et aliquid et et labore consequatur ad deserunt laboriosam delectus tempore ratione amet sed sunt impedit quod incidunt eaque et at qui dolorum sunt eaque est eaque quia exercitationem sed vel molestiae dolorem eos saepe voluptatem laborum aperiam vero dolores magnam exercitationem aspernatur corporis architecto dolorum cupiditate consequuntur ratione necessitatibus ex praesentium iusto fugiat qui aliquid maxime explicabo aut quo iste aut iure excepturi eos atque tenetur veniam debitis illo animi sit omnis.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:10'),(78,1,NULL,'Rerum qui eligendi necessitatibus quia dolores error minus enim exercitationem voluptatem qui et praesentium labore aliquid molestiae doloremque qui necessitatibus rerum ut quo id voluptatem sint porro vel consequatur sint voluptas recusandae et repellat nemo quo cupiditate et maiores odit consectetur excepturi vitae tempore necessitatibus consequatur blanditiis nobis nobis voluptatem voluptatum explicabo et autem perspiciatis officia qui ut est sit maiores porro debitis qui sit reprehenderit voluptas officiis ipsam et corrupti qui blanditiis dolor velit et sint est tenetur quidem consequatur magni eos esse ut ab est dolor inventore vitae temporibus nisi ratione numquam qui numquam quaerat.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:06'),(79,1,NULL,'Enim est aut amet nobis ut esse voluptatem est facilis magni incidunt non ut reprehenderit delectus odit aliquid distinctio ea asperiores facere veritatis excepturi id libero dolorem sit sunt nihil aut qui iusto ipsa quae recusandae magnam minima nesciunt nam quibusdam illo aliquid sunt quos totam consectetur eius est reprehenderit magnam aut tempore itaque iusto impedit laudantium dolor temporibus iusto odit suscipit hic sunt commodi architecto suscipit laborum asperiores voluptatem quia pariatur consequatur omnis nobis ut maiores nam.','PUBLIC',0,0,'2026-03-19 10:04:50','2026-03-23 17:37:01'),(80,1,NULL,'Nulla pariatur dicta mollitia labore deserunt sunt molestias magnam asperiores id consequatur cupiditate sed repudiandae velit iusto nam earum recusandae explicabo suscipit nisi doloribus maiores fugit ut eos voluptatem veritatis est consectetur quia fugit odio dicta molestiae porro blanditiis perspiciatis ipsum quis ut hic consequatur qui quo enim error occaecati minima officiis eum dolor et error suscipit consequuntur modi ea vero dolorem sed voluptatem quia culpa quam est vero doloremque nesciunt omnis aspernatur.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:59'),(81,1,NULL,'Magnam facere sed fugiat aut sunt quos quia id expedita in voluptatem nostrum laudantium quisquam veritatis et suscipit perferendis sit ducimus non neque aut quia autem vero labore non ad quibusdam vero neque sed facere sed neque natus unde iure aut neque est et beatae aut dicta fugit aliquam consectetur minima eum totam debitis quia eligendi aut ut velit tenetur doloremque ut id mollitia qui harum laboriosam voluptatem est iste ea expedita rerum eos perferendis officia quia aliquam ducimus voluptatum voluptatibus quasi aut ipsam quibusdam deserunt quia consequatur exercitationem quaerat corporis porro voluptates fugiat earum esse veniam nihil iusto aut sint unde odit aut explicabo voluptas ut ea voluptatem sunt consequuntur et reprehenderit repellendus ut odit iusto dolor rerum quas occaecati.','PUBLIC',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:55'),(82,1,NULL,'Omnis minus sint sint voluptatem autem qui alias fuga praesentium rerum eligendi omnis ducimus in rem deleniti aut dolores quia et et expedita distinctio magni et iste reiciendis doloremque perferendis quod earum odit dolores doloremque suscipit voluptatem id natus nesciunt unde excepturi culpa quod qui facilis et doloremque harum accusantium vel id illum consectetur praesentium aut nulla deserunt corrupti deserunt magni officiis voluptatem asperiores doloribus quo porro qui similique molestiae eaque aut voluptatem beatae quidem asperiores id ut ut et ut est dolor et beatae id eligendi delectus.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:53'),(83,1,NULL,'Et quod officia dolorem et adipisci excepturi cumque dignissimos unde beatae eos nostrum maxime odio culpa laudantium dolor possimus nostrum sit aliquam iure enim non nesciunt quaerat sapiente neque voluptatem sequi unde sunt tempore nam omnis enim rem quo in architecto incidunt fugit molestias unde vero quis distinctio laudantium id explicabo magnam qui fugiat nisi omnis sed quia nihil omnis quia iusto adipisci molestias atque in sit et quae dicta dolores in laborum praesentium laborum magni sit molestiae maxime provident voluptatum qui quia omnis voluptatem natus provident minus est doloremque asperiores quam nihil ipsam voluptatem culpa et dolor ea voluptatem quibusdam optio et nisi officiis porro porro ullam consequatur placeat sunt maxime similique soluta ad cumque veniam optio dolorem voluptatem id impedit facilis ut iusto reprehenderit repellat dolor vero molestiae molestiae architecto qui rem corrupti distinctio et.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:50'),(84,1,NULL,'Eum omnis ab itaque magnam consequatur amet sed expedita dolorem necessitatibus odio odit hic at quo tempora voluptas id asperiores quisquam praesentium et dolorum corporis deleniti pariatur nulla qui quidem numquam est esse aliquam veniam qui ab qui laudantium dolorum corporis neque enim quis ducimus est molestias ipsam eum placeat voluptatem amet harum in amet nesciunt aut repudiandae ut quo nihil porro magni ut repudiandae et nihil in maxime nemo praesentium nam et tenetur expedita saepe.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:47'),(85,1,NULL,'Illo sequi sit inventore laudantium sit aut facere incidunt ad aut possimus non illum atque quo doloribus delectus dolor veniam cupiditate explicabo omnis quo ratione eligendi praesentium mollitia quaerat ab perferendis tenetur officia animi suscipit quis voluptas nihil mollitia voluptatum occaecati suscipit qui debitis iste quis qui rerum natus consectetur iure quae maxime aut temporibus ut aut dicta cupiditate voluptas voluptatem officia eos non itaque veniam vel et fuga non et vel iure commodi fugit distinctio recusandae totam et nemo laborum eos sint at aut et quaerat a voluptate ipsa saepe maiores doloremque minus rerum voluptatem qui consectetur voluptatem sit quo sit quis fugiat explicabo accusamus perspiciatis voluptate iure est assumenda accusamus eos repudiandae.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:43'),(86,1,NULL,'Laudantium eos et quidem vero aliquam facere provident labore assumenda ducimus totam similique ullam excepturi quam velit dolor ea dolorum exercitationem ipsa qui praesentium repellendus quidem sint cumque voluptate sed facere voluptatum ut sapiente est non omnis excepturi ducimus impedit enim dolores id velit enim quia atque error et quia a dolores cum molestias ipsa autem reiciendis voluptas sit cumque laudantium fuga id provident et alias qui assumenda non sunt ea omnis recusandae dolorem eius magni doloremque fugit laborum ex minus excepturi aut aut nam itaque et provident reprehenderit officia possimus earum in et illo consequatur harum itaque accusamus quia sed corporis natus culpa.','PUBLIC',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:35'),(87,1,NULL,'Magnam optio sed tenetur vero qui excepturi architecto ipsa sunt enim itaque expedita praesentium eum aliquam quia perferendis nobis occaecati voluptate rerum eligendi commodi id omnis dicta dolor sit quas corporis deleniti voluptatibus deserunt porro est praesentium ipsam corporis maxime nam repellat omnis dolorem officiis inventore voluptatem blanditiis voluptatem perspiciatis voluptatum cumque doloribus qui et ipsam ipsum autem ab blanditiis omnis vel non quis autem qui officia quia quam sint id odio excepturi beatae sit cupiditate quidem quod reprehenderit excepturi ex ex nostrum ad quam vel quo quis quibusdam doloribus.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:32'),(88,1,NULL,'Ducimus laudantium sit velit quia quaerat similique laudantium non dolorem amet et aut dolorem dolorum qui consectetur placeat alias accusantium atque voluptatem nesciunt non quo expedita enim tempora mollitia sed quam hic aut autem ratione quod eligendi incidunt quis sapiente reprehenderit quidem saepe laboriosam id aut inventore et aspernatur enim pariatur et temporibus dolorem aut eligendi officia exercitationem aliquam accusamus sint sunt suscipit ut ipsum exercitationem iusto illum et maiores et voluptas cumque omnis illo dolore numquam consequuntur atque sunt eum est molestiae quis et praesentium voluptas aperiam ipsa et soluta molestias in quo dolor aut praesentium vel recusandae ratione qui mollitia non facilis et qui hic iure tempora et sed atque consequuntur ratione rem consequatur tempora minus nam dicta aut voluptatem et molestiae nesciunt asperiores sint facere est dolorem labore omnis rerum.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:28'),(89,1,NULL,'Dicta quod autem hic et optio nihil eum neque enim sunt nostrum omnis deleniti facilis eum porro neque sed nesciunt doloremque aut iste in vel excepturi quia cumque et voluptas vel animi neque sit repellat ea saepe ullam perspiciatis qui sint sit delectus molestias sed omnis ipsam odio id aut ut molestiae amet eos molestiae assumenda saepe ex sed odit reprehenderit facere quasi cum maxime sed vel sunt adipisci quo sequi saepe eaque praesentium aspernatur amet sit laboriosam quos vitae laudantium aut adipisci quos ipsum ut sed incidunt omnis reprehenderit enim qui et explicabo et necessitatibus in sit eum perspiciatis incidunt quo sint quam vero ea unde sit rerum quo optio qui exercitationem dolor autem accusamus accusantium doloribus reiciendis hic nobis impedit molestiae iste tempore enim atque sunt sequi reiciendis sapiente non consequatur aliquam sed deleniti dolor reiciendis autem ipsa voluptatibus.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:24'),(90,1,NULL,'Inventore ut aperiam cum sit et necessitatibus sunt magnam qui sint quo quia voluptatum cum tenetur ex velit officiis dolores qui velit omnis nihil unde culpa vel commodi tenetur est sunt aliquam dignissimos aut rerum non qui iusto nesciunt quibusdam quo ea eveniet molestias maxime dolor quo expedita iure quod itaque facilis aut ut excepturi dolores aut cumque aut qui eum molestias qui illum vero temporibus ullam est molestiae veniam quod esse ipsa minus deleniti perferendis explicabo iure id error eum repudiandae delectus quaerat ea mollitia amet aut praesentium consectetur ullam explicabo at itaque numquam sunt doloribus excepturi dolorem itaque nihil repellendus non sit dicta deleniti omnis natus distinctio sunt quasi numquam natus ad quia reprehenderit cumque facere non.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:21'),(91,1,NULL,'Est ipsa debitis harum ut assumenda et dolor ipsa id facilis aperiam sint atque ea repellat voluptatem dolorem unde eveniet et molestiae maxime ut non beatae qui nulla aut quia magni nihil itaque rem non omnis vel dolorum quos nihil possimus dolorem nobis voluptatem quia quos quia libero adipisci ipsam sint eos maiores soluta omnis sit quia et porro nisi tempore ratione dolorum rerum vel quas et voluptatem totam ut magnam earum iste sequi aut quasi repellendus nesciunt incidunt iusto suscipit architecto vitae sit eius cumque ipsa animi.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:18'),(92,1,NULL,'Quo et delectus vel officiis at rerum amet fuga sed iure rem temporibus consequuntur exercitationem aut dolores et consequatur id harum autem expedita molestiae autem quia harum facere sit qui est saepe et quis itaque omnis eaque debitis minus eius non saepe distinctio officiis recusandae minus et nihil quisquam voluptatem facilis aspernatur aut porro facere ut explicabo nobis dolorem omnis blanditiis expedita nostrum autem sed voluptates consequatur sint voluptas ut voluptatum expedita reprehenderit alias ea unde non voluptas ea iure repellendus adipisci illo molestiae quis corrupti eum est quia ipsum eius itaque earum magnam neque velit dolor omnis voluptatem aliquid sed quidem fugit non sint eos perspiciatis deleniti assumenda vitae dolores ducimus incidunt vero optio sit est aliquam officiis quia occaecati minus repellat velit ea non dolorem aut aut mollitia quia rerum ex illum voluptas.','ONLY_ME',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:14'),(93,1,NULL,'Neque itaque sit unde quia error esse rerum quia aut maxime assumenda error ratione voluptatem voluptatem autem dolorem doloremque omnis et eos est suscipit quidem consequuntur dolorum illo laboriosam et eaque facilis cumque culpa quia earum voluptatem ab placeat tenetur animi assumenda officia aliquam ad earum dignissimos sunt ut incidunt necessitatibus debitis blanditiis placeat quisquam nihil facere aliquid odit sunt earum beatae omnis aperiam nemo sed fugiat cum qui possimus iusto fugiat animi sunt odio at molestias natus enim modi repellat eum sit quia pariatur omnis repellat mollitia quod nihil qui illum saepe unde voluptatem eaque quisquam in quibusdam doloribus quae hic et quia a temporibus ut autem dignissimos et aut laboriosam non veritatis sed temporibus ullam vel ea quo natus similique quia voluptas asperiores est impedit eos in et repellat minima ut aut nulla non fugiat voluptas.','ONLY_ME',0,3,'2026-03-19 10:04:50','2026-03-23 17:36:11'),(94,1,NULL,'Qui rerum nesciunt quam quod fuga autem non adipisci tempora voluptatem nemo quas dolorem rem perspiciatis fuga quibusdam sequi ea culpa officiis quo eligendi sunt aut odit ratione sed dolorem dolores recusandae illo est enim mollitia et ipsum corporis veniam ullam nemo aperiam ex expedita id nihil veritatis nostrum suscipit repellendus at nulla nulla alias fuga repudiandae cumque consectetur dolor voluptates aut dolor consectetur porro odit est sint dolorem.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:09'),(95,1,NULL,'Repellat perspiciatis provident voluptatem perspiciatis et consequatur ducimus voluptatibus provident cupiditate voluptas sapiente accusantium ut et dicta laborum est quis voluptates eligendi harum laboriosam minima exercitationem ex maiores molestiae ea minima maxime nostrum optio incidunt velit aperiam vel sit aperiam voluptate nobis magni sint quaerat debitis consequatur laudantium repudiandae a deserunt provident tempora sunt officiis distinctio nihil non sint sint voluptas sed alias.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:36:05'),(96,1,NULL,'Dolores occaecati ut nemo voluptatem sed distinctio minus voluptas et odit deleniti dolores in neque quasi rem reprehenderit provident dicta nulla molestiae minima voluptas quia voluptate nemo magnam rerum et quos et quia ipsum aut sapiente necessitatibus est repellendus vel ipsa et quo facilis pariatur voluptatem consequuntur iste possimus animi qui nostrum et rem dolores et porro inventore non expedita ducimus laudantium laudantium labore ducimus omnis dignissimos voluptatem quae commodi ut voluptatem at laboriosam nihil iusto voluptatem aperiam unde ratione neque qui numquam.','FRIENDS',0,0,'2026-03-19 10:04:50','2026-03-23 17:35:58'),(97,1,NULL,'Eos id aut et non sed nobis sit quod sunt tempora recusandae dolor itaque rerum natus id et eos recusandae tenetur laboriosam beatae et asperiores non dolores modi ut nam non recusandae et et saepe dicta modi quia vel qui qui aut voluptatem ullam quis autem enim molestiae neque consequuntur repudiandae quas perspiciatis eveniet aut saepe molestiae temporibus autem sed molestiae repellat sit aut aperiam illo perferendis enim laboriosam qui non quia sapiente excepturi quasi enim similique aliquid pariatur enim qui.','PUBLIC',0,0,'2026-03-19 10:04:50','2026-03-21 13:41:30'),(98,1,NULL,'Bạn sẽ chọn bên nào? ?? Một bên ngọt ngào, dịu dàng nhưng đầy','PUBLIC',1,1,'2026-03-21 22:14:54',NULL),(99,1,NULL,'Chế độ cún con onnn ? ở nhà mà cũng phải cute lạc lối thế này cơ! Đồ ngủ xinh xắn, mũ lông ấm áp, thêm cái ốp Powerpuff Girls nữa là đủ bộ thư giãn cuối tuần rồi. Ai cùng team mê đồ cute nào?\r\n\r\n#comfyvibes #cutestuff #doghat #weekendchill #pajamastyle','PUBLIC',0,0,'2026-03-21 22:18:06','2026-03-25 16:16:23'),(100,1,NULL,'Chế độ cún con onnn ? ở nhà mà cũng phải cute lạc lối thế này cơ! Đồ ngủ xinh xắn, mũ lông ấm áp, thêm cái ốp Powerpuff Girls nữa là đủ bộ thư giãn cuối tuần rồi. Ai cùng team mê đồ cute nào?\r\n\r\n#comfyvibes #cutestuff #doghat #weekendchill #pajamastyle','PUBLIC',0,0,'2026-03-21 22:19:13',NULL),(101,1,NULL,'Tự chụp một tấm nhẹ nhàng cho ngày cuối tuần thư thái ✨ Kính tròn, máy ảnh và chiếc V-sign quen thuộc của mình nè ? Chúc cả nhà một ngày thật nhiều niềm vui và năng lượng tích cực nha!\r\n\r\n#SelfieTime #ChillVibes #KínhTròn #MáyẢnh #KhoảnhKhắc','PUBLIC',0,0,'2026-03-21 22:21:04',NULL),(102,1,NULL,'Tự chụp một tấm nhẹ nhàng cho ngày cuối tuần thư thái ✨ Kính tròn, máy ảnh và chiếc V-sign quen thuộc của mình nè ? Chúc cả nhà một ngày thật nhiều niềm vui và năng lượng tích cực nha!\r\n\r\n#SelfieTime #ChillVibes #KínhTròn #MáyẢnh #KhoảnhKhắc','PUBLIC',0,0,'2026-03-21 22:21:11',NULL),(103,1,NULL,'Một cái ôm thật chặt, thật dịu dàng. Nhìn hai bạn này mà thấy bình yên và ấm áp lạ thường. Có lẽ đây chính là hạnh phúc nhỏ bé mà ai cũng mong muốn: được che chở và sẻ chia mọi thứ. ? Ai cũng cần một vòng tay như vậy đúng không?\n\n#CáiÔm #TìnhYêu #HạnhPhúc #BìnhYên','ONLY_ME',1,7,'2026-03-23 19:24:20','2026-03-25 09:17:11'),(104,1,103,NULL,'PUBLIC',0,0,'2026-03-23 23:13:49','2026-03-25 12:50:13'),(105,107,NULL,'Heyyy, chào buổi sáng cả nhà! ☀️ Chúc mọi người một ngày mới tràn đầy năng lượng và thật nhiều niềm vui nhé!\r\n\r\n#ChàoBuổiSáng #NgàyMới #NăngLượng #VuiVẻ #GoodMorning','PUBLIC',0,2,'2026-03-23 23:35:05',NULL),(106,1,NULL,'Verification post','PUBLIC',0,0,'2026-03-24 01:32:02',NULL),(107,1,NULL,'aaaa','PUBLIC',0,0,'2026-03-24 01:36:12',NULL),(108,1,NULL,'Test hashtag #AstraSocial #Innovation','PUBLIC',0,0,'2026-03-23 18:48:38',NULL),(109,1,103,NULL,'PUBLIC',0,0,'2026-03-23 18:49:18','2026-03-25 12:49:53'),(110,1,NULL,'as','PUBLIC',0,0,'2026-03-24 07:15:32',NULL),(111,1,NULL,'Mọe nó','ONLY_ME',0,0,'2026-03-24 07:15:52',NULL),(112,1,NULL,'Lạc bước vào khu rừng đêm huyền ảo, nàng thơ tóc bạch kim với đôi mắt xanh biếc như hồ nước, khoác lên mình chiếc váy trắng tinh khôi bay bồng bềnh trong gió. Tay cầm cây trượng pha lê phát sáng, dẫn lối bởi ánh sáng lung linh của những đốm đom đóm. Toàn bộ khung cảnh cứ như một giấc mơ cổ tích có thật, vừa mong manh vừa đầy sức mạnh. Bạn có cảm nhận được sự huyền bí đang bao trùm không?\r\n\r\n#AnimeArt #Fantasy #MagicalGirl #ForestNight #DreamyVibes','PUBLIC',1,1,'2026-03-25 06:07:14',NULL),(113,1,NULL,'Chào bạn! ? Chúc bạn có một ngày thật tuyệt vời, tràn đầy năng lượng và niềm vui nhé! ?\r\n#ChàoBạn #NgàyMới #NăngLượngTíchCực #VuiVẻ #KhởiĐầuMới','PUBLIC',0,0,'2026-03-25 06:10:34',NULL),(114,1,112,NULL,'PUBLIC',0,0,'2026-03-25 12:35:54','2026-03-25 15:59:34'),(115,1,112,NULL,'PUBLIC',0,0,'2026-03-25 12:49:06','2026-03-25 15:59:27'),(116,1,NULL,'Hú buổi sáng','FRIENDS',0,0,'2026-03-25 15:54:41',NULL),(117,1,NULL,NULL,'PUBLIC',1,0,'2026-03-25 16:33:23',NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `user_id` bigint unsigned NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_position` tinyint unsigned NOT NULL DEFAULT '50',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `profiles_phone_unique` (`phone`),
  CONSTRAINT `profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,'John','Smith','Hello world!','https://res.cloudinary.com/dbcuulbcp/image/upload/v1769991966/avatars/z5oumdr8wjyiqewuvlem.webp','https://res.cloudinary.com/dbcuulbcp/image/upload/v1769992167/covers/h5yracek62nzahylkptn.jpg',18,'0528005118','168 Lê Đức Thọ, Phường 15','2004-04-17','FEMALE'),(2,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,NULL,NULL),(3,'Ngọc Duyên','Nguyễn',NULL,NULL,NULL,50,NULL,NULL,'2004-04-17',NULL),(4,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,NULL,NULL),(5,'Trường','Nguyễn Nhật',NULL,NULL,NULL,50,NULL,NULL,'2004-02-17',NULL),(6,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,NULL,NULL),(13,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,NULL,NULL),(107,'Văn A','Nguyễn',NULL,'https://res.cloudinary.com/dbcuulbcp/image/upload/v1774308437/avatars/j6w0iqqevthjecqo27pa.png','https://res.cloudinary.com/dbcuulbcp/image/upload/v1774308809/covers/wymoiqtbpsmnpsp2qtdz.png',79,NULL,NULL,'2004-02-24',NULL),(108,'Ngoa','Nam',NULL,NULL,NULL,50,NULL,NULL,'2006-03-15',NULL);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reporter_id` bigint unsigned NOT NULL,
  `target_author_id` bigint unsigned NOT NULL,
  `target_preview` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` enum('POST','USER','COMMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` bigint unsigned NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','RESOLVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_target_author_id_foreign` (`target_author_id`),
  KEY `reports_reporter_id_foreign` (`reporter_id`),
  CONSTRAINT `reports_reporter_id_foreign` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reports_target_author_id_foreign` FOREIGN KEY (`target_author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,1,'Atque rerum laboriosam voluptates aut repellat velit quam odio ad maiores vitae accusantium pariatur est sit incidunt qui deleniti perferendis ea ut sit corrupti qui temporibus aut a praesentium ipsam eaque maxime voluptatem aut ipsum ut velit et eum tempora quos suscipit quis sed expedita et voluptatibus provident asperiores magnam quia aut ipsam aut non doloremque et at fugit minima eos debitis aut sit dignissimos voluptatem ipsam impedit excepturi non ut eos ut qui omnis non et qui et est eum non accusamus iusto totam aut adipisci delectus rem ullam dolor sit ad perspiciatis blanditiis sint dolore velit est voluptatem cum earum ad quod amet quia et sequi ut placeat aut magnam qui fugiat nemo culpa et dolorem doloribus facilis quia ex.','COMMENT',1,'Recusandae dolor architecto repellendus sint eos cupiditate necessitatibus ipsam et aut tempora quo voluptas est ut pariatur vel quo repellat dignissimos iste dolores ea eveniet consectetur ut aut pariatur et corrupti ullam placeat minima quo architecto nihil ut et autem minima consectetur dolores perspiciatis blanditiis impedit aut et voluptatem et laboriosam mollitia repellendus ullam quo doloremque libero odit aliquam et sunt qui natus quo recusandae ut dolorum recusandae quos dolorum minus exercitationem voluptates libero odio amet corporis cum a fuga.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(2,1,1,'Corporis voluptatem ducimus ut non possimus ex velit dolores vitae dolorem nobis sint voluptatem dignissimos placeat pariatur distinctio ad non sunt expedita iure accusamus excepturi qui ab facere laboriosam magnam ut officia a inventore et nihil porro et enim officia mollitia deleniti maxime distinctio dolores eius quis minima quis illo laboriosam occaecati voluptas eos quia iure enim voluptatem rerum non beatae laboriosam laudantium animi commodi exercitationem numquam similique ea id aut omnis ea voluptate cum aut omnis est et molestias quidem labore nemo et rerum quae minima est tenetur aut voluptas tenetur aut est iure non enim error quod aut sunt qui explicabo unde dolor.','COMMENT',1,'Unde quaerat blanditiis voluptates neque magnam voluptate harum asperiores esse amet sunt recusandae reiciendis assumenda voluptas quae alias quis sequi doloribus recusandae adipisci molestias ipsum quisquam perferendis aut modi eaque minus sit in et qui corporis molestias ut quasi quisquam magnam nam nihil aut qui velit fuga nostrum eos laborum aut possimus rerum perspiciatis nobis rerum a in ut error asperiores non et nobis nulla dolore fuga vel officiis explicabo aperiam unde numquam et velit eos quasi facere modi quam nisi sed voluptatibus et dolores maiores fuga ab iusto adipisci porro eos in facere modi consectetur est non quas sed a hic architecto aut eveniet est aut rem et enim eligendi.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(3,1,1,'Architecto odio aliquam dolorum asperiores iure unde quam neque dolores vel eveniet vel sit doloremque deleniti inventore quidem quos iste eveniet iusto alias voluptas temporibus velit repellendus ut et autem eligendi magnam veritatis reprehenderit magni est et similique et voluptas suscipit similique illum voluptas sed sed consequatur dolores sit expedita velit explicabo omnis aut aut vitae velit aut cum quae eos ut distinctio quia et ducimus est a quod iste neque sed rerum voluptatibus voluptatem et sint odit excepturi voluptas fugiat corrupti iste vel quis sed iusto vero quis vero repellat aut dolorem ea nam aperiam est officia ut sed perferendis molestiae occaecati totam dolorem voluptas adipisci nam distinctio voluptatum ipsam nobis sit porro.','USER',1,'Ad ut omnis in facilis quia quia dolor molestias suscipit nihil facilis non pariatur odio esse beatae sed id vero quia occaecati cumque deserunt sapiente rerum et quia nulla debitis nesciunt nobis laborum exercitationem ullam inventore explicabo temporibus vero aperiam dolor et nihil est aspernatur ut eos itaque sint asperiores tenetur omnis non voluptas culpa quas est ut nihil nam quisquam dolores reprehenderit consequatur laborum est est tempore cum et quasi aperiam aut eligendi velit sed quasi maxime quo tenetur mollitia omnis vel veniam dolorem corporis quo.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(4,1,1,'Sed fuga nobis unde et non dolorem qui doloribus at recusandae laborum et at assumenda corrupti qui eaque excepturi nihil nostrum ratione quos molestias reprehenderit maxime quo commodi nihil non possimus ad alias repellat quo quibusdam repellat fugit in rerum voluptas labore saepe veniam similique est adipisci dolor eius in quis aut autem molestiae accusantium qui dolorum amet blanditiis beatae alias aspernatur sed labore est fuga modi quae voluptatem omnis sit ducimus quis ducimus harum ipsam tempora architecto accusantium voluptates perspiciatis eveniet mollitia aut dolorem quidem alias aut qui ut illum qui sit est sed perspiciatis nostrum voluptas magnam doloremque animi et illo ad praesentium non nisi voluptate voluptatem quis.','USER',1,'Ut fugiat velit iste numquam autem voluptatum non distinctio sed quis ipsa inventore temporibus fugit provident ullam id cumque reprehenderit autem laudantium repellat reprehenderit velit eaque nemo autem tempora voluptatem incidunt ut aspernatur repudiandae repellat ab dignissimos ut ullam nobis laborum rem vero sed eveniet aut delectus quasi omnis accusantium sint officiis iste nemo non doloremque est provident libero id numquam dolores dolores vero corrupti dolore est officia repellendus porro illum repellat et veniam vero velit officia ut atque atque dolores laudantium hic eius unde provident voluptatem sit quo perspiciatis voluptas ut saepe enim voluptas cum repellat qui ut sit unde sed repudiandae saepe exercitationem excepturi quibusdam aut at inventore sit inventore ipsum cupiditate.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(5,1,1,'Est quam eum quidem cum distinctio error atque fuga et aut eos ut non tempore ut libero ut ex placeat dolorem delectus illo ad enim dolor sunt perferendis et voluptates voluptas iste omnis vel enim sed sit rem quisquam sit perferendis iure at non reprehenderit dicta doloremque deserunt inventore dolorem quasi itaque repellendus qui voluptatibus ut sequi est repudiandae cumque voluptas quia magnam magnam tempora maiores provident dolores et inventore harum in minus alias qui est quia aut molestias porro et dolore at dolorem architecto non quos illum culpa dolorem minus maxime qui est velit vero aspernatur quia voluptas voluptas quibusdam eveniet sunt nam dolor tempore distinctio et vero sed magnam culpa temporibus sed consectetur quo et omnis accusantium est aperiam perferendis perferendis minima quis nihil et sit blanditiis ab id ea asperiores veritatis autem.','USER',1,'Hic maiores architecto eum animi sit possimus corporis facere quia neque aliquam dolores id magni et qui magni voluptatibus quia earum aspernatur quas autem esse ea ipsum ea iste voluptatem voluptatem voluptatem voluptate rerum qui saepe voluptatum sunt sit ut eligendi modi in fugiat id iure nemo quis qui occaecati rerum voluptates numquam aut autem laboriosam distinctio laboriosam est omnis voluptate magni dolor repudiandae aspernatur dolore deleniti eos molestias necessitatibus beatae veritatis autem ut porro adipisci earum reiciendis blanditiis molestias nobis modi perferendis esse voluptas voluptatem ad unde blanditiis sint distinctio magni adipisci necessitatibus maxime aspernatur cum quaerat repellendus aliquid provident vel dicta eum iusto quas ut.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(6,1,1,'Error necessitatibus dolorum dolores molestias consequatur laboriosam corporis sapiente similique illum unde ex adipisci nulla tenetur eos et rerum inventore quis dolor eaque reiciendis et maxime qui adipisci soluta quasi inventore consectetur facere dolorem dolor alias nisi qui autem pariatur ipsum quod ut ut in ducimus voluptatem vero quos occaecati corporis quas ipsam doloremque nihil sint beatae libero delectus ea minima accusamus eveniet suscipit tempore qui eligendi cumque omnis sit nisi maxime facilis odit temporibus at esse et quibusdam voluptatum aliquam iure veniam omnis consectetur minima sed corrupti aut quae ut est expedita architecto omnis animi incidunt voluptatibus optio sequi quia debitis enim nulla omnis voluptas ut nemo ratione cum magnam dolor eveniet culpa deleniti corporis ut quae quam voluptatem animi hic voluptate nulla temporibus enim distinctio delectus distinctio deleniti natus ut id impedit.','COMMENT',1,'Sint ab rerum illo eveniet sequi nemo sit dignissimos et id id nihil et eum perferendis eum in dolore molestias et et explicabo facilis incidunt in esse est aut incidunt modi et atque aut in repellendus accusantium voluptatem impedit et molestias iure ea doloremque est perferendis est occaecati officia aut ut aut eos porro deserunt est alias eos facere quam consequatur optio nobis explicabo incidunt vel minus labore corrupti aut nostrum aut quia nihil distinctio tempore ut omnis porro soluta neque temporibus voluptates.','REJECTED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(7,1,1,'Omnis unde illum voluptas eos omnis expedita non tempore excepturi eius quia occaecati eos qui eum doloremque eaque cumque unde quia possimus saepe sapiente expedita autem deserunt amet eaque pariatur tenetur dolores consequuntur ex beatae dolorem amet praesentium nulla rerum asperiores in deleniti ut ab eligendi molestiae aut doloribus quos quis consequatur amet non voluptas fuga distinctio reiciendis esse maiores at iusto eum veniam porro rerum recusandae itaque reprehenderit quia ut vero.','POST',1,'Pariatur amet maiores corrupti hic impedit quia reiciendis dolore laudantium ad perspiciatis voluptatibus quas iusto illo aut quasi esse qui maiores dolor ut possimus laboriosam nam animi autem ducimus excepturi quo tempore ea at ut dignissimos quasi sint aliquid architecto omnis qui non distinctio vitae iure sit eum error commodi debitis voluptatem debitis dolores qui id ut inventore iure consequatur corporis corporis et eveniet veritatis inventore minus est dolorem nesciunt dignissimos fugiat similique beatae ut aut ea officia ut in ab natus non id quidem quia pariatur sit nisi et ratione vitae sint illo voluptates debitis quidem sit non omnis minima ducimus perspiciatis earum voluptas alias quis voluptate qui quidem excepturi maiores tempora dolorem optio officiis quia corporis molestiae ipsum dicta sapiente sunt non dolorem laboriosam natus illo sapiente qui voluptatem ea vel vero autem necessitatibus voluptatem non.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(8,1,1,'Nobis vel accusamus facilis sed sit et temporibus itaque aliquid et ex voluptatem voluptatem totam est perspiciatis eum cum corporis dolorum aliquam commodi magnam delectus impedit et vitae eligendi officia assumenda occaecati ut qui non aut aut minus minima et ea quia molestiae delectus minus vel ad cupiditate ea accusantium distinctio excepturi facilis eaque sint velit ut non earum temporibus quo sequi et placeat vero pariatur non error sequi officia quisquam saepe numquam vero et beatae perferendis ut repellat hic harum vel dolore autem numquam et aut sint consectetur non et vel sapiente assumenda qui harum et amet impedit est at qui sunt voluptas qui nam cupiditate.','POST',1,'Velit asperiores mollitia vel qui voluptatem debitis fuga ut placeat iusto iste qui quia voluptas illo hic laudantium numquam architecto at ab dolor et a corporis itaque provident maxime autem delectus odit illum nihil assumenda sunt rerum reiciendis est culpa harum fuga enim delectus consequatur fugiat corrupti delectus molestiae facere dolorem in accusamus cumque quaerat unde et eius ipsa eum maxime sint unde ex rerum ullam error alias dolore eos consequatur aliquid id inventore deleniti at quasi sit exercitationem officiis.','REJECTED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(9,1,1,'Corporis delectus corporis at et quaerat similique voluptatem pariatur et libero fuga aperiam officia aliquid et et qui aliquid sint et eum incidunt laborum officiis consectetur ipsam soluta velit eligendi totam est rerum quia pariatur debitis ipsam necessitatibus quis unde ducimus a ipsum vel maiores est commodi alias et quos fugit aliquid aut ipsa sunt perspiciatis earum reprehenderit laborum commodi neque quibusdam maxime illo sint dolores aliquam eius tempore aspernatur.','COMMENT',1,'Et suscipit repellendus sed consequatur dolorem esse voluptas et dolor enim et dolorum libero ut minima maiores a eos sequi omnis voluptatem repudiandae nisi sit consequatur porro molestias consequatur enim veritatis ea qui voluptate cum rerum accusantium eum ipsa molestiae earum quidem iusto alias voluptates enim impedit dicta deleniti perferendis repellat cum dolores ab accusantium odio vel ab non quia consequatur explicabo perferendis doloremque laborum qui nostrum voluptas quis sed vitae voluptatibus consequatur architecto laboriosam suscipit praesentium natus beatae consequuntur qui ut rerum quo aut quod rerum et ut enim maxime eaque in aliquid eum culpa laborum sed.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(10,1,1,'Ab quis voluptatem esse architecto esse fugit sit molestiae sed eum fuga velit recusandae omnis voluptas voluptates maxime repudiandae recusandae at dolores aut et voluptatibus voluptas optio voluptates aut nostrum molestiae animi corporis blanditiis eaque dolor velit doloribus voluptatem distinctio voluptatibus accusantium debitis non vero sit dignissimos blanditiis aut repudiandae eveniet reprehenderit vero eveniet vitae nihil expedita unde dolorem facere sint iusto ut architecto beatae voluptatem atque repellendus unde dolor iste in eos ab tempora quaerat facilis ea est dolore dicta dolore facilis nihil temporibus ab iste delectus perferendis ut qui eius perferendis aut earum nobis ducimus dolores consequatur molestias libero eveniet exercitationem deleniti eligendi vero quia fugiat placeat occaecati fugiat sit quia ut odio nulla cum dolorum sequi aut asperiores debitis minima inventore nobis et doloremque pariatur fuga totam est praesentium ducimus.','USER',1,'Inventore pariatur animi molestiae perspiciatis autem quisquam consectetur non deleniti laborum quaerat voluptatibus porro praesentium quasi velit omnis quia cum consequuntur debitis molestiae blanditiis corrupti consequatur qui ut officia numquam modi et laborum molestias laboriosam aut nam cum voluptates sint voluptates quisquam labore non sit omnis autem ut blanditiis aliquid et rerum atque et consequatur optio maiores reprehenderit sit eaque quod recusandae provident suscipit et ab voluptatem numquam et dolor quasi dolore dolores impedit omnis.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(11,1,1,'Sed tempore perferendis unde sed ipsam a amet eaque et sit aperiam qui eos inventore velit repellendus quo eaque et eius ea sunt qui quidem temporibus porro ipsum magnam repellendus amet quod officiis ab reiciendis non non modi et commodi dolorem soluta doloremque aut velit vero et perferendis cupiditate id provident inventore deleniti facilis voluptas sit earum assumenda ut sequi ea ea dicta aliquid libero fugit sint aliquam rerum quae qui voluptas magnam libero ut rem molestias ut voluptate omnis autem quia quo et soluta vel impedit dolorem eligendi id illum.','USER',1,'Eum optio vel sit animi accusantium non animi rem quaerat perferendis vitae atque excepturi quo repellendus voluptatem quia dignissimos voluptatem voluptates qui asperiores deserunt debitis ea quam expedita officiis officiis ab placeat sint rerum est excepturi voluptas quo consequatur aperiam quo aut iusto unde eaque itaque illo repellendus atque quas voluptatem quo quasi fuga aut quibusdam beatae magnam deserunt est quos explicabo ad et suscipit ipsa cumque impedit et sed accusantium beatae quidem pariatur necessitatibus officiis ullam id.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(12,1,1,'Voluptatibus quae at ut omnis qui necessitatibus et eum alias aspernatur fugit id sed nesciunt rerum aut eos ea maxime dolorem tenetur sapiente voluptas possimus nisi modi laborum qui quaerat possimus blanditiis ducimus et quis iure qui incidunt dolore et praesentium est quis aut quae iusto sint dolorem inventore delectus saepe quia totam repellat repellat sit et sunt quia minima in quibusdam qui hic deserunt nam odio magni mollitia mollitia facere mollitia ullam ea et excepturi quo velit eos quidem dicta rem quod magni ut cum similique quidem omnis molestias quas recusandae dolorum laborum aut numquam vitae ut dicta reiciendis omnis impedit distinctio ut voluptas qui harum aut eligendi ut dolor consequatur incidunt dignissimos ut vitae doloribus soluta rerum tempore tempore dolorum est nisi nihil nulla molestiae beatae voluptatibus asperiores nemo illum sit dolores est assumenda.','COMMENT',1,'Dolorum assumenda deleniti deserunt ut adipisci autem excepturi quia sequi voluptate optio eveniet tempora tenetur consequatur eum deleniti facilis facere accusamus assumenda et doloribus eligendi facere consequatur sunt possimus nisi dolore odio molestiae aut consequatur odio molestiae aut et voluptates exercitationem perferendis et fugiat officiis molestiae maxime accusantium labore id quod id aperiam dolores ipsam voluptatum dolore consequatur placeat nihil quisquam qui repellendus occaecati minus harum autem excepturi.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(13,1,1,'Autem soluta laborum quaerat aut doloremque aut id tempora fuga debitis fugiat ut aliquid iure quo in id a inventore impedit beatae et molestias ad quasi alias ipsa velit vel et excepturi delectus iste modi atque laudantium nihil voluptates provident itaque quae placeat fuga perferendis hic cumque nostrum repellat recusandae maiores culpa quia ipsam quo eligendi repudiandae ipsum aut quis et maiores incidunt tenetur perferendis suscipit non voluptatem.','USER',1,'Accusantium explicabo enim doloribus temporibus officiis ut odit id officia necessitatibus natus error eos sit incidunt omnis quidem eos recusandae laboriosam omnis in quidem sequi sint officiis exercitationem perspiciatis qui eaque repellendus qui qui sed atque sit ea dolores autem voluptatum aut debitis saepe reiciendis laboriosam et in maxime ipsum qui repellendus optio tempore voluptatibus nisi reprehenderit sapiente voluptatibus et eligendi et commodi repellendus ea sit minus est.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(14,1,1,'Sunt earum aut repudiandae quidem ut ratione nulla tempore ratione dolores explicabo quo provident dolorem ullam corporis consequatur et fuga consectetur facere quod porro distinctio animi officia odio dolore quo voluptatibus magnam ea commodi esse officia impedit nihil ut officia quia amet enim est sint ipsam id similique ducimus ut quia nesciunt est qui quaerat quaerat quia quasi in excepturi dolorem nisi ipsam rerum recusandae sapiente rem voluptas et rerum consequatur culpa rem consequatur sed sunt tempore voluptatem consectetur architecto aspernatur.','COMMENT',1,'Aut eveniet praesentium pariatur minima veritatis quae dolorem assumenda itaque minima dolor vitae laborum omnis non enim iste consectetur a eum sint corporis est nostrum quo molestiae voluptas qui aperiam quis suscipit in voluptate iste facere et consequatur qui pariatur vel suscipit consequatur quibusdam nostrum praesentium in voluptas et rerum cumque et vitae ut aut minima quasi doloremque quasi et quia pariatur cumque sunt voluptatum rerum aut totam possimus eveniet similique et qui rem omnis quia minima alias in laudantium occaecati explicabo eius doloribus eaque et.','RESOLVED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(15,1,1,'Tempora aut eaque hic et voluptas voluptatem voluptas veritatis praesentium modi ut ea minus voluptatem cupiditate doloremque ut commodi et doloribus sint et temporibus dolore rerum minima rerum vel recusandae aut totam enim ipsam nemo perspiciatis sint accusamus ipsa quaerat fuga nemo voluptatem expedita iure est neque fugit ea non necessitatibus perspiciatis ullam aut beatae qui est possimus exercitationem et culpa voluptatem dignissimos ratione odio voluptatem eum eius illo eos optio nam ut sed quibusdam qui quas error dignissimos accusamus adipisci fugiat et soluta aut incidunt consequatur cupiditate corporis.','POST',1,'Temporibus et ratione tenetur maxime aliquam amet explicabo consequatur nam esse doloremque officia debitis error omnis porro laudantium id velit iure soluta quos autem fuga neque cupiditate atque qui accusantium quo architecto at molestiae officiis quisquam ut placeat corporis veniam culpa architecto omnis magni animi asperiores sit blanditiis aliquid provident quisquam possimus exercitationem harum adipisci eaque architecto voluptatem officiis est aut dicta sunt vitae maxime et rerum alias consequuntur maxime aperiam voluptatum magnam quo temporibus fuga deleniti dolore necessitatibus corrupti voluptates ullam aut provident quos et et libero molestiae rem dignissimos nam.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(16,1,1,'Ut in ut officiis repudiandae ipsa impedit iure alias possimus placeat est odit architecto ab ea sed dolorum aut natus ut ipsa id et exercitationem quasi voluptatem sequi alias et sit ab a aspernatur deserunt nobis autem eligendi aspernatur iste eveniet distinctio eum nulla mollitia sapiente quae eum fugit voluptatem ipsum distinctio ullam quibusdam nihil sed doloremque ea asperiores incidunt odit dolores quia ipsam est et voluptates dignissimos ea deleniti veniam explicabo iusto laudantium est reiciendis maiores sed expedita enim ut repellat eos consequatur magni consequatur ducimus qui debitis saepe voluptas libero dolor assumenda iure qui quis ex optio illo non excepturi eum illum et quia voluptatem autem optio vel magnam id tempora laborum debitis qui perspiciatis quo.','POST',1,'Illo voluptatem hic assumenda rerum possimus eveniet accusantium temporibus atque minus repellat rerum fugit natus quia iusto ipsa quia quibusdam tempore laborum quod qui dolor ipsum ut sunt est nam corrupti veniam accusamus velit dignissimos velit sed veniam autem sunt hic rerum eligendi similique velit sapiente ab repellat perferendis qui modi odio pariatur illo sed enim at repellat blanditiis aliquid dolorem ea officia sit aspernatur est perferendis aut aut officia doloribus porro suscipit quia rerum animi enim totam est minima omnis beatae numquam error et autem exercitationem doloribus voluptatibus nulla dolor quis placeat adipisci quia fugiat accusantium a molestias aspernatur aspernatur aut deserunt odit corporis.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(17,1,1,'Laborum quidem animi voluptatem eum est repellendus hic esse esse quod pariatur quam voluptas rerum dolor nesciunt ea dicta accusamus dolores voluptatum exercitationem dolor et omnis accusantium ab quasi nam culpa dolorem ab vel odit adipisci tenetur possimus aliquid est est cupiditate excepturi dolor ea enim sit voluptatem reiciendis ad aspernatur eaque autem voluptate deleniti reiciendis saepe blanditiis deserunt laborum ut nostrum alias labore in maxime in sit quae.','COMMENT',1,'Perferendis perspiciatis odit occaecati sit placeat quisquam consequuntur est iure rerum dolores fugiat eius voluptas dolorem error ut unde laborum adipisci in qui eveniet laborum qui quam qui et harum rem quia et repellat id laudantium reprehenderit in molestiae itaque laudantium ut aut accusantium et delectus ea eos aut nesciunt dolorem sed eius vel nostrum porro fugit consectetur maiores cum ipsa distinctio unde at et praesentium eaque fuga exercitationem quia ex saepe est beatae quo maxime ex perspiciatis eos incidunt praesentium voluptatem perspiciatis aut vitae quis illo accusamus explicabo id quam eaque est aut et quibusdam ipsum placeat omnis repellat nihil facere nulla ea explicabo velit ea vitae soluta aut voluptatem sit beatae quam sint aperiam et enim et.','REJECTED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(18,1,1,'Possimus est at totam quisquam dignissimos ea itaque dolorem est est quo blanditiis accusantium natus et et velit qui autem voluptatibus explicabo unde officia rerum nemo voluptatem vitae amet deserunt qui eveniet architecto dolorem est accusamus porro deleniti repudiandae expedita sint qui dolorem repellat iure rerum vitae veniam eveniet hic magni quo quia rem odit aut quia deserunt quia dolorem eum est eaque recusandae sit delectus suscipit hic eum doloremque maxime laborum voluptatem velit qui quo sit possimus eius deleniti est in illo vitae dolores doloribus et dolore eveniet deserunt modi est minus enim pariatur natus minima quos doloribus soluta placeat vel sit ea pariatur et nostrum qui est quia veritatis.','COMMENT',1,'Consequatur molestiae voluptate quis vel dolor ea ut ullam alias consectetur perferendis repellat earum corrupti nesciunt sapiente expedita quas doloremque placeat ipsa et porro eligendi perspiciatis et consequatur fugit nihil expedita modi iure sunt quia fuga dolor harum nam qui voluptatem reiciendis consequatur explicabo quasi aut culpa aut saepe architecto natus consequatur voluptas cum facilis non voluptatem alias harum tempora et quasi non autem et voluptas animi nobis laudantium ipsum et explicabo quidem blanditiis minima dolores adipisci dignissimos dignissimos maxime sunt necessitatibus blanditiis adipisci et totam qui cupiditate atque doloribus quidem neque autem non.','REJECTED','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(19,1,1,'Voluptas iure neque ut aut quasi vero est magnam et itaque rem magni laboriosam perferendis est voluptatem et unde veritatis sapiente id consequuntur nisi ipsum placeat earum aliquid et iure quam soluta sapiente assumenda qui quod unde ullam quo sint distinctio fuga illo id tempore eum adipisci et excepturi officiis iure in est distinctio neque error praesentium soluta nisi iure ad nisi ut et a sunt ipsum labore excepturi qui fuga corrupti rerum nulla nihil qui ipsa consequatur magni quos quis ab voluptas dicta expedita et odit quia repellendus dolorum ea numquam soluta voluptatem enim vel minima esse sed qui adipisci omnis odit quis velit quia et molestias enim itaque et nihil debitis.','POST',1,'Consequatur quod eaque doloremque nulla est ea eligendi quia quisquam illo eveniet sed neque iure enim velit omnis iusto vel quas quia dolores voluptates magnam sint itaque totam neque dignissimos reiciendis iure pariatur fugiat quasi ratione ullam nihil nihil nihil esse animi soluta fuga impedit dolorem aut reiciendis pariatur magnam rem in error est dolor odit vero nostrum culpa quas ipsam provident ipsum laboriosam quasi aut eaque maxime et consectetur odit unde ab debitis ut expedita sit excepturi nulla eum quis mollitia quasi libero quo modi ut aut magni tenetur maxime accusamus sint voluptates quidem velit rerum tempore nam voluptatem dolorum qui quam veniam nihil fugiat.','PENDING','2026-03-05 02:50:21','2026-03-05 02:50:21',NULL),(20,1,1,'Ea et doloremque repellendus quia numquam sequi necessitatibus voluptatem aut aut autem ducimus nisi inventore hic nemo nulla eligendi maxime pariatur ullam est ut tempora ipsa qui dolor assumenda sunt nulla alias dolorem et nulla earum voluptate libero maiores et sunt nisi laboriosam vel molestiae necessitatibus velit rerum rerum quo consequuntur perferendis distinctio vero sed et quisquam fugit consequatur voluptas quo alias vel quia placeat nulla velit sit assumenda ut ex iste reprehenderit autem veritatis ea sed doloremque qui cumque laudantium magni ipsam itaque dolorem possimus nesciunt commodi dolores et nemo iusto saepe dolorum in et voluptates quia quae soluta porro quia ducimus asperiores omnis reprehenderit ut reprehenderit neque consectetur.','POST',1,'Velit neque deleniti ipsam et esse vitae iste sit illum placeat dignissimos neque omnis excepturi eos amet quia amet ut natus non recusandae quos ratione magni et maxime sint vero commodi aut placeat tempore et ea nulla fugiat aspernatur aliquam sed quibusdam est autem error autem in cupiditate commodi at architecto voluptatum rerum neque quia animi minima quia iusto et nobis eos iure sunt recusandae minus sunt magni inventore eligendi illum aut fugit ut.','RESOLVED','2026-03-05 02:50:21','2026-03-23 17:28:46',NULL),(21,1,1,'sqf3','POST',30,'Ngôn từ kích động thù ghét','RESOLVED','2026-03-18 10:27:26','2026-03-21 13:51:28',NULL);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_id_permission_id_unique` (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,1,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(2,1,2,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(3,1,3,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(4,1,4,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(5,1,5,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(6,1,6,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(7,1,7,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(8,1,8,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(9,1,9,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(10,1,10,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(11,1,11,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(12,1,12,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(13,1,13,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(14,1,14,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(15,1,15,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(16,1,16,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(17,2,1,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(18,2,2,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(19,3,3,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(20,4,1,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(21,4,2,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(22,4,3,'2026-03-19 02:25:44','2026-03-19 02:25:44',NULL),(23,2,3,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(24,2,4,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(25,2,5,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(26,2,6,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(27,2,7,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(28,2,8,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(29,2,9,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(30,2,10,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(31,2,11,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(32,2,12,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(33,2,13,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(34,2,14,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(35,2,15,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL),(36,2,16,'2026-03-21 13:39:22','2026-03-21 13:39:22',NULL);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','Quản trị viên hệ thống, có toàn quyền.',NULL),(2,'Dev','Nhà phát triển hệ thống.',NULL),(3,'Mod','Người kiểm duyệt nội dung.',NULL),(4,'User','Người dùng thông thường.',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('KrRE5q6qk5Bm5VAuTQI4bMuktb2rpwNLUPgf9Uma',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXlqWW9STmRQWlVCeWhTYVhLY3JuVTR4dDdtZGw0REJmcUlwc2dOaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1769984749),('slWDMQfWzMsZNt5MY9T1JrNyR535zvDTodQqbB71',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1FiSEo3VFg0SG4yaWlzVzN3UW9oSEVhc3BqcmF0WWgxaGVBZXNmdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1774361351);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_blocks`
--

DROP TABLE IF EXISTS `user_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_blocks` (
  `blocker_id` bigint unsigned NOT NULL,
  `blocked_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`blocker_id`,`blocked_id`),
  KEY `user_blocks_blocked_id_foreign` (`blocked_id`),
  CONSTRAINT `user_blocks_blocked_id_foreign` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_blocks_blocker_id_foreign` FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_blocks`
--

LOCK TABLES `user_blocks` WRITE;
/*!40000 ALTER TABLE `user_blocks` DISABLE KEYS */;
INSERT INTO `user_blocks` VALUES (1,4,'2026-03-25 22:34:59'),(108,1,'2026-03-26 00:18:36');
/*!40000 ALTER TABLE `user_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dev','dev@example.com','$2y$12$Tc4uEbXYQM0gCoBx1Fy4jeBihrmzwkmpv55QAJM/.IR0j4pT6Nf7i',2,1,1,'2026-03-25 17:02:32','2026-01-26 01:48:23',NULL),(2,'user2','user2@example.com','$2y$12$lJfQ8KFRkVeXIJnndBAdtegCIP6d0NcL9W.vO2n9tjsxs8qTcQY6G',4,1,0,NULL,'2026-01-26 02:04:26',NULL),(3,'akira3175','akira31758421@gmail.com','$2y$12$hH7kg7aHQ2BTdUotkFmWgeEBoIwgUguLLq1pcQNlkOyIhxyugXL26',4,1,1,'2026-03-21 14:39:46','2026-03-05 08:22:46',NULL),(4,'user1','user1@example.com','$2y$12$/QFCMa9d92sOrdX5yutjbuj1ZToqK6Ff0F9S9ZfYgud4eEN536K4K',4,1,0,NULL,'2026-03-05 09:50:19',NULL),(5,'akiclone3','akiclone3@gmail.com','$2y$12$J1jI8mgtXEx3VtjjCpZu/.duHiX4Dc5BAE8EFtxY3ae4Vcoba6ZJa',4,0,1,NULL,'2026-03-18 16:12:54',NULL),(6,'Dolores Rosenbaum','gmraz@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(7,'Stone Kulas','tamara05@example.org','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(8,'Prof. Rolando Gottlieb IV','alejandrin05@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(9,'Ms. Kristy Friesen II','larson.jarvis@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(10,'Kaya Satterfield','gina.homenick@example.org','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(11,'Mack Jakubowski','zion.maggio@example.org','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(12,'Kareem Krajcik','ycollins@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(13,'Prof. Gavin Green','lolita98@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(14,'Cullen Legros','bobby67@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(15,'Aditya Durgan','scottie43@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(16,'Leanna Spencer','glen.ryan@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(17,'Rowena Hoppe','hodkiewicz.rodrick@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(18,'Mr. Leif Mann III','arlie.stehr@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(19,'Prof. Valentin Witting','cgottlieb@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(20,'Sibyl Conn','else.luettgen@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(21,'Allen Waters','karlie02@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(22,'Mr. Justice Boyer','torp.antone@example.net','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(23,'Vida Maggio','tyra.johns@example.org','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(24,'Nikita Volkman','moses.yundt@example.org','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(25,'Ofelia Shields','tressie49@example.com','$2y$12$pe1sTDjFEy/xz2PT1I4yc.NHpGsveDAtraXvGHTtt2uqIYexl5jd.',4,1,0,NULL,'2026-03-19 09:25:44',NULL),(26,'admin','admin@example.com','$2y$12$eyXXg.ICvyHUkLwBkSS76Ot2CiVo4JHpY2nmqT5wiHskwA9L9pV8q',1,1,1,NULL,'2026-03-19 09:53:00',NULL),(27,'joshuah.terry','murazik.jade@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(28,'larson.lurline','beatty.weston@example.org','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(29,'alexis78','tbeer@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(30,'huels.jevon','chelsea74@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(31,'serenity.haley','ehagenes@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(32,'thelma.shields','fatima.labadie@example.org','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(33,'khegmann','altenwerth.marianna@example.org','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(34,'brekke.miguel','maxine.berge@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(35,'hyatt.everett','yterry@example.com','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(36,'marianna.kling','marianne.schmeler@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(37,'upurdy','aimee.upton@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(38,'klocko.alexander','maida.rolfson@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(39,'dee.damore','alf.bergnaum@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(40,'alexa58','tlemke@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(41,'savion45','nfritsch@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(42,'gschuppe','mkuhlman@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(43,'kihn.marilou','nmurray@example.org','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(44,'considine.estella','uframi@example.org','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(45,'ondricka.rosalind','cecile72@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(46,'vpaucek','garrison56@example.net','$2y$12$0MhDNuiZpVj25yF2MMiOTey6oj5gICcKl2qdy00uJci5pbVJFs4Ra',4,1,0,NULL,'2026-03-19 09:53:01',NULL),(47,'goldner.kennedy','verda.purdy@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(48,'rodolfo96','wiza.gregg@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(49,'coby.brekke','lizzie92@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(50,'ledner.philip','okon.nasir@example.org','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(51,'fmertz','celestine34@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(52,'schroeder.zola','ohara.vinnie@example.net','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(53,'white.ernestine','claud.rice@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(54,'amiya.heller','fay.enola@example.net','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(55,'xboyer','lessie.renner@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(56,'bernier.alvera','thilpert@example.net','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(57,'dovie.grimes','zboncak.augustus@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(58,'elna.ohara','thiel.mortimer@example.com','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(59,'ryder.jacobson','cormier.deshaun@example.org','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(60,'wzulauf','hackett.maggie@example.org','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(61,'cschimmel','cummerata.dolores@example.net','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(62,'arturo.bins','arnold.howell@example.org','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(63,'estelle.mclaughlin','crawford16@example.org','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(64,'dorothea42','connelly.matt@example.net','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(65,'berge.mireya','rose.baumbach@example.net','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(66,'iva.grimes','kaley.gaylord@example.org','$2y$12$JgrSxwPoXL0x6dWe9lfgFumSX5337ynGfe1qycHTiOGcAOPlT0Pq6',4,1,0,NULL,'2026-03-19 09:54:21',NULL),(67,'maeve95','erwin.kessler@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(68,'hbailey','jacobs.betsy@example.com','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(69,'oma.hermann','pearline.leuschke@example.com','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(70,'urempel','davin22@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(71,'jeanette97','sporer.eula@example.com','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(72,'marvin.adriana','boyer.casimer@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(73,'eschowalter','jdaugherty@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(74,'kirlin.cassie','wendell93@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(75,'kellen.kovacek','alana.bartell@example.net','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(76,'kjohns','mwyman@example.com','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(77,'vwolf','rebekah.lakin@example.net','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(78,'qhagenes','andreane94@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(79,'polly.wuckert','cbode@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(80,'rickey76','okoepp@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(81,'alejandrin80','jamal16@example.com','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(82,'lonie49','reyes95@example.net','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(83,'hyatt.alexandre','princess.becker@example.net','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(84,'allison41','keira33@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(85,'elda09','nader.evelyn@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(86,'regan55','lisette41@example.org','$2y$12$/iA0UtDVNVKDCvNzb0q3E.eouqIl0/D07iBIAxu4LecdCo65KZ1cy',4,1,0,NULL,'2026-03-19 10:03:33',NULL),(87,'tharber','alena80@example.net','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(88,'bschowalter','beulah.simonis@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,0,0,NULL,'2026-03-19 10:04:49',NULL),(89,'considine.isac','krenner@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(90,'stoltenberg.cara','ena.mclaughlin@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(91,'spencer.osborne','tyra.dare@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(92,'maye73','balistreri.casandra@example.net','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(93,'epollich','runolfsson.mozell@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(94,'preston90','pfranecki@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(95,'annette64','schuppe.emery@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(96,'tkirlin','dwight64@example.net','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(97,'jodie.grant','fharber@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(98,'hailey.streich','wilkinson.annamae@example.net','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(99,'gmcclure','green.daija@example.net','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(100,'oscar.lesch','wyost@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(101,'grant91','yullrich@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(102,'osborne10','kaley13@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(103,'kara56','deanna.hill@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(104,'zaltenwerth','tyra57@example.org','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(105,'pstanton','jamie51@example.net','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,0,0,NULL,'2026-03-19 10:04:49',NULL),(106,'jedidiah.schuster','jonas.howe@example.com','$2y$12$D3J8ksALDP3QoRvwnT4wTu/Ap/ZhSnmBBY9O.oDBIlMrRrGrk5trq',4,1,0,NULL,'2026-03-19 10:04:49',NULL),(107,'akiclone20','akiclone20@gmail.com','$2y$12$pJfS.UGBJx8M5vuyEanXC.hYJAE/Mpjp2EEfJwvCBp7peYrgqPq1W',4,1,1,NULL,'2026-03-23 23:26:31',NULL),(108,'truong3175','truong3175@gmail.com','$2y$12$RsQgAkAGQZbcz0JIa8Qp1eL8qCIbFUPtl3BFbJm.n.n5A.QDI31e.',4,1,1,NULL,'2026-03-25 22:51:24',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-26  7:21:10
