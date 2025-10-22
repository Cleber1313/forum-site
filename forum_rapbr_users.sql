-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: forum_rapbr
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT 'https://via.placeholder.com/55',
  `bio` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'3213213123','2025-10-08','dawdwadaa','$2b$10$gkaK96HpRcEd5lxXLyWcUO1aUuQaNarmCx5cu/MYiFl6tk5olpwEe','https://via.placeholder.com/55',NULL),(2,'Cleber pereira serafim','1998-10-29','cleberpscampeao2@gmail.com','$2b$10$zI2wJT46s8mtlxW8hDyfVOOGSPuAD9cZflpbivnTRna5Ms2ACkOs6','https://via.placeholder.com/55',NULL),(3,'aa','2025-10-07','aa','$2b$10$jLk4Ooq0sueVeOo.eu9CM.AelwovjUwTBbWZuh/./FIjkuuTtZzUC','https://via.placeholder.com/55',NULL),(4,'cleber','1998-10-29','cleber@gmail.com','$2b$10$Nu6Bkkly2dSJeZ.L.n5lkOmGJtPzVlNOmC75dV8H..3VjvdB1Y6cO','https://rollingstone.com.br/wp-content/uploads/mano_brown_vaicinacao_vacina_pandemia_shows_racionais_mcs.jpg','sou fa de rap'),(5,'Emanuelle mendes serafim','2003-02-03','manu@gmail.com','$2b$10$VL9SKcYvutnWoZrhaIkLGubpYF90nN6RQczM4Fj4jPxWDXNxgHX46','https://via.placeholder.com/55',NULL),(6,'anonimo','2024-08-21','anonimo@gmail.com','$2b$10$9JspKHk6vLYjISSTRqylxusFLrBLNgEzG4E/5wBKHMMglhVu3JV2S','https://thumbs.dreamstime.com/b/homem-nimo-que-veste-uma-m%C3%A1scara-31518503.jpg','');
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

-- Dump completed on 2025-10-19 16:44:03
