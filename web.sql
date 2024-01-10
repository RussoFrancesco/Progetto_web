-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Creato il: Gen 10, 2024 alle 15:37
-- Versione del server: 8.0.32
-- Versione PHP: 8.1.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `allenamenti`
--

CREATE TABLE `allenamenti` (
  `id` int NOT NULL,
  `data` date NOT NULL,
  `user` int DEFAULT NULL,
  `scheda` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `allenamenti`
--

INSERT INTO `allenamenti` (`id`, `data`, `user`, `scheda`) VALUES
(21, '2023-12-20', 3, 26),
(22, '2023-12-21', 3, 26),
(23, '2023-12-21', 3, 26),
(24, '2024-01-06', 3, 28),
(25, '2024-01-09', 3, 33),
(26, '2024-01-09', 3, 34);

-- --------------------------------------------------------

--
-- Struttura della tabella `a_e`
--

CREATE TABLE `a_e` (
  `allenamento` int NOT NULL,
  `esercizio` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `peso` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `a_e`
--

INSERT INTO `a_e` (`allenamento`, `esercizio`, `peso`) VALUES
(21, 'croci ai cavi', 20),
(22, 'croci ai cavi', 15),
(26, 'croci ai cavi', 10),
(24, 'leg press', 20),
(22, 'panca inclinata', 12),
(24, 'panca scott', 10),
(23, 'rematore', 10),
(23, 'rowing', 10),
(25, 'spinte', 10),
(25, 'squatt', 10),
(26, 'trazioni', 15);

-- --------------------------------------------------------

--
-- Struttura della tabella `bmi`
--

CREATE TABLE `bmi` (
  `id` int NOT NULL,
  `user` int DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `data` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `bmi`
--

INSERT INTO `bmi` (`id`, `user`, `bmi`, `data`) VALUES
(2, 3, 24.22, '2023-12-21'),
(3, 3, 28.22, '2023-12-22'),
(4, 3, 24.22, '2024-01-10'),
(5, 3, 19.39, '2024-01-10');

-- --------------------------------------------------------

--
-- Struttura della tabella `esercizi`
--

CREATE TABLE `esercizi` (
  `nome` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gruppo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `esercizi`
--

INSERT INTO `esercizi` (`nome`, `gruppo`) VALUES
('abduttori', 'gambe'),
('adduttori', 'gambe'),
('affondi', 'gambe'),
('alzate 90 gradi', 'spalle'),
('alzate laterali', 'spalle'),
('alzate laterali singole', 'spalle'),
('calf in piedi', 'gambe'),
('calf seduto', 'gambe'),
('croci ai cavi', 'pettorali'),
('croci panca orizzontale', 'pettorali'),
('crunch', 'addome'),
('crunch laterale', 'addome'),
('curl bilanciere', 'bicipiti'),
('curl manubri', 'bicipiti'),
('french basso cavi', 'tricipiti'),
('french press', 'tricipiti'),
('lat machine avanti', 'dorsali'),
('lat machine dietro', 'dorsali'),
('lat machine presa stretta', 'dorsali'),
('leg curling', 'gambe'),
('leg extension', 'gambe'),
('leg press', 'gambe'),
('panca declinata', 'pettorali'),
('panca inclinata', 'pettorali'),
('panca piana', 'pettorali'),
('panca scott', 'bicipiti'),
('parallele', 'pettorali'),
('pectoral machine', 'pettorali'),
('plank', 'addome'),
('pulley basso', 'dorsali'),
('pullover', 'pettorali'),
('rematore', 'dorsali'),
('rowing', 'dorsali'),
('sit up', 'addome'),
('spinte', 'pettorali'),
('spinte in basso', 'dorsali'),
('spinte in basso cavi', 'tricipiti'),
('spinte in basso fune', 'tricipiti'),
('spinte manubri', 'spalle'),
('squatt', 'gambe'),
('stacchi', 'gambe'),
('stacchi bilanciere', 'dorsali'),
('trazioni', 'dorsali');

-- --------------------------------------------------------

--
-- Struttura della tabella `e_s`
--

CREATE TABLE `e_s` (
  `scheda` int NOT NULL,
  `esercizio` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `serie` int DEFAULT NULL,
  `ripetizioni` int DEFAULT NULL,
  `recupero` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `e_s`
--

INSERT INTO `e_s` (`scheda`, `esercizio`, `serie`, `ripetizioni`, `recupero`) VALUES
(8, 'croci ai cavi', 1, 1, 1),
(8, 'parallele', 1, 1, 1),
(9, 'croci ai cavi', 1, 1, 1),
(10, 'croci ai cavi', 4, 6, 8),
(10, 'crunch laterale', 3, 8, 9),
(10, 'leg press', 1, 3, 5),
(11, 'croci ai cavi', 1, 2, 4),
(11, 'croci panca orizzontale', 1, 1, 1),
(11, 'crunch laterale', 2, 4, 5),
(11, 'french basso cavi', 11, 1, 1),
(26, 'croci ai cavi', 1, 1, 5),
(26, 'panca inclinata', 2, 1, 1),
(26, 'rematore', 1, 1, 1),
(26, 'rowing', 1, 1, 1),
(27, 'panca inclinata', 1, 2, 3),
(28, 'leg press', 1, 2, 3),
(28, 'panca scott', 1, 1, 1),
(29, 'panca inclinata', 1, 1, 1),
(29, 'panca scott', 1, 1, 1),
(29, 'pulley basso', 1, 1, 1),
(29, 'spinte', 1, 1, 1),
(30, 'alzate 90 gradi', 1, 2, 3),
(30, 'alzate laterali singole', 1, 2, 3),
(30, 'croci ai cavi', 1, 2, 3),
(30, 'squatt', 1, 2, 3),
(31, 'spinte', 1, 1, 1),
(32, 'spinte', 1, 1, 1),
(33, 'spinte', 1, 1, 1),
(33, 'squatt', 1, 1, 1),
(34, 'croci ai cavi', 1, 1, 1),
(34, 'trazioni', 1, 1, 1),
(37, 'panca declinata', 1, 1, 1),
(37, 'spinte', 1, 1, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `schede`
--

CREATE TABLE `schede` (
  `id` int NOT NULL,
  `data_inizio` date NOT NULL,
  `data_fine` date DEFAULT NULL,
  `user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `schede`
--

INSERT INTO `schede` (`id`, `data_inizio`, `data_fine`, `user`) VALUES
(1, '2023-11-11', NULL, 2),
(2, '2023-12-14', NULL, 2),
(3, '2023-12-14', NULL, 2),
(4, '2023-12-14', NULL, 2),
(5, '2023-12-14', NULL, 2),
(6, '2023-12-14', NULL, 2),
(7, '2023-12-14', NULL, 2),
(8, '2023-12-15', '2023-12-16', 3),
(9, '2023-12-15', '2023-12-16', 3),
(10, '2023-12-16', '2023-12-16', 3),
(11, '2023-12-16', '2023-12-20', 3),
(26, '2023-12-20', '2023-12-22', 3),
(27, '2023-12-22', '2023-12-22', 3),
(28, '2023-12-22', '2024-01-07', 3),
(29, '2024-01-07', '2024-01-08', 3),
(30, '2024-01-08', '2024-01-08', 3),
(31, '2024-01-08', '2024-01-08', 3),
(32, '2024-01-09', '2024-01-09', 3),
(33, '2024-01-09', '2024-01-09', 3),
(34, '2024-01-09', '2024-01-09', 3),
(37, '2024-01-09', NULL, 3);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cognome` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `pswrd` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `nome`, `cognome`, `pswrd`, `email`, `telefono`, `session_id`) VALUES
(2, 'domenico', 'villari', 'c6e4478835f3171c957c0976dc4ee6c68906ec51c79d8dcdf64f37255c8005fd', 'domenico@example.com', '3889012346', '7enut4430savinf4nre0le97b5'),
(3, 'Francesco', 'Russo', '0c64a5de4e73621e2a897ab683823b9323e935110e3d11877d0461b7c9b61c0a', 'francesco@gmail.com', '', '237ff92c8dfe4cc945ee58a41a661711');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `allenamenti`
--
ALTER TABLE `allenamenti`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user`),
  ADD KEY `fk_scheda` (`scheda`);

--
-- Indici per le tabelle `a_e`
--
ALTER TABLE `a_e`
  ADD PRIMARY KEY (`esercizio`,`allenamento`),
  ADD KEY `allenamento` (`allenamento`);

--
-- Indici per le tabelle `bmi`
--
ALTER TABLE `bmi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bmi_ibfk_1` (`user`);

--
-- Indici per le tabelle `esercizi`
--
ALTER TABLE `esercizi`
  ADD PRIMARY KEY (`nome`);

--
-- Indici per le tabelle `e_s`
--
ALTER TABLE `e_s`
  ADD PRIMARY KEY (`scheda`,`esercizio`),
  ADD KEY `esercizio` (`esercizio`);

--
-- Indici per le tabelle `schede`
--
ALTER TABLE `schede`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `allenamenti`
--
ALTER TABLE `allenamenti`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT per la tabella `bmi`
--
ALTER TABLE `bmi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `schede`
--
ALTER TABLE `schede`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `allenamenti`
--
ALTER TABLE `allenamenti`
  ADD CONSTRAINT `fk_scheda` FOREIGN KEY (`scheda`) REFERENCES `schede` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Limiti per la tabella `a_e`
--
ALTER TABLE `a_e`
  ADD CONSTRAINT `a_e_ibfk_1` FOREIGN KEY (`allenamento`) REFERENCES `allenamenti` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `a_e_ibfk_2` FOREIGN KEY (`esercizio`) REFERENCES `esercizi` (`nome`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Limiti per la tabella `bmi`
--
ALTER TABLE `bmi`
  ADD CONSTRAINT `bmi_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Limiti per la tabella `e_s`
--
ALTER TABLE `e_s`
  ADD CONSTRAINT `e_s_ibfk_1` FOREIGN KEY (`scheda`) REFERENCES `schede` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `e_s_ibfk_2` FOREIGN KEY (`esercizio`) REFERENCES `esercizi` (`nome`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Limiti per la tabella `schede`
--
ALTER TABLE `schede`
  ADD CONSTRAINT `schede_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
