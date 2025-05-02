-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
<<<<<<< HEAD
-- Tempo de geração: 02/05/2025 às 15:25
=======
-- Tempo de geração: 22/02/2025 às 16:00
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `systab`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `chamados`
--

CREATE TABLE `chamados` (
  `idChamado` int(11) NOT NULL,
  `idTomb` int(11) NOT NULL,
  `status` enum('Aberto','Fechado') NOT NULL,
  `item` tinyint(1) NOT NULL,
  `descricao` text DEFAULT NULL,
  `dataEntrada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresas`
--

CREATE TABLE `empresas` (
  `idEmp` int(11) NOT NULL,
  `nomeEmp` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `empresas`
--

INSERT INTO `empresas` (`idEmp`, `nomeEmp`) VALUES
(1, 'EVEREST'),
(2, 'IBGE'),
(3, 'TREMA');

-- --------------------------------------------------------

--
-- Estrutura para tabela `regionais`
--

CREATE TABLE `regionais` (
  `idReg` int(11) NOT NULL,
  `numReg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `regionais`
--

INSERT INTO `regionais` (`idReg`, `numReg`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tablets`
--

CREATE TABLE `tablets` (
  `idTomb` int(11) NOT NULL,
<<<<<<< HEAD
  `imei` varchar(15) NOT NULL,
=======
  `imei` varchar(50) NOT NULL,
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4
  `idUser` int(11) NOT NULL,
  `idEmp` int(11) NOT NULL,
  `idUnidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

<<<<<<< HEAD
--
-- Despejando dados para a tabela `tablets`
--

INSERT INTO `tablets` (`idTomb`, `imei`, `idUser`, `idEmp`, `idUnidade`) VALUES
(208474, '355637052256005', 4, 3, 4);

=======
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4
-- --------------------------------------------------------

--
-- Estrutura para tabela `unidades`
--

CREATE TABLE `unidades` (
  `idUnidade` int(11) NOT NULL,
  `nomeUnidade` varchar(120) NOT NULL,
  `idReg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `unidades`
--

INSERT INTO `unidades` (`idUnidade`, `nomeUnidade`, `idReg`) VALUES
(1, 'USF MARIA DULCE SIMÕES (QUITANDINHA)', 1),
(2, 'USF ENGENHO VELHO - EQUIPE 1 ', 1),
(3, 'USF ENGENHO VELHO - EQUIPE  2', 1),
(4, 'USF VICENTE ALBERTO CARICIO MALVINAS - EQUIPE 1 ', 1),
(5, 'USF VICENTE ALBERTO CARICIO MALVINAS - EQUIPE  2', 1),
(6, 'USF QUADROS I', 1),
(7, 'USF QUADROS II', 1),
(8, 'USF LOTE 56', 1),
(9, 'USF JOÃO BATISTA DE FIGUEIREDO - LOTE 92 - Equipe 1 ', 1),
(10, 'USF JOÃO BATISTA DE FIGUEIREDO - LOTE 92 - Equipe 2', 1),
(11, 'USF SANTO ALEIXO - EQUIPE 1', 1),
(12, 'USF SANTO ALEIXO - EQUIPE 2', 1),
(13, 'USF SANTO ALEIXO - EQUIPE 3', 1),
(14, 'USF FREI DAMIÃO - EQUIPE 1', 1),
(15, 'USF FREI DAMIÃO - EQUIPE 2', 1),
(16, 'USF ENGENHO MACUJÉ', 1),
(17, 'USF SOCORRO', 1),
(18, 'USF LOTEAMENTO COLÔNIA', 1),
(19, 'UBS MARIA DA LUZ - LOTE 19/31', 1),
(20, 'UBS AMÉLIA LUCENA TEIXEIRA', 1),
(21, 'USF VILA RICA', 1),
(22, 'USF VILA PIEDADE I', 1),
(23, 'USF VILA PIEDADE II', 1),
(24, 'USF JOSÉ COELHO PEREIRA', 2),
(25, 'USF EDUARDO MENEZES', 2),
(26, 'USF JARDIM MONTE VERDE', 2),
(27, 'USF N. S. DO PERPETUO SOCORRO', 2),
(28, 'USF ALTO DOIS CARNEIROS - EQUIPE II', 2),
(29, 'USF DOIS CARNEIROS BAIXO EQUIPE I ', 2),
(30, 'USF DOIS CARNEIROS BAIXO EQUIPE II', 2),
(31, 'USF RETIRO', 2),
(32, 'USF NOSSA SENHORA DOS PRAZERES', 2),
(33, 'USF ALTO DO RESERVATÓRIO', 2),
(34, 'USF MARIA DE SOUZA RAMOS UR 6 - EQUIPE 1', 2),
(35, 'USF MARIA DE SOUZA RAMOS UR 6 - EQUIPE 2', 2),
(36, 'USF JOSÉ CARLOS RIBEIRO', 2),
(37, 'USF DOIS CARNEIROS BAIXO III - EQUIPE 3 ', 2),
(38, 'UBS SUCUPIRA', 2),
(39, 'USF ALTO DOIS CARNEIROS EQUIPE I', 2),
(40, 'USB MARIO SANTIAGO DA SILVA', 2),
(41, 'USF ALTO DA COLINA', 2),
(42, 'USF ALTO DO CRISTO', 2),
(43, 'USF ALTO SÃO SEBASTIÃO', 2),
(44, 'UBS - UR6 MARIA DE SOUZA RAMOS', 2),
(45, 'USF SITÍO DAS QUEIMADAS', 2),
(46, 'USF CURADO I - EQUIPE 1', 3),
(47, 'USF CURADO II - EQUIPE 1', 3),
(48, 'USF CURADO II - EQUIPE 2', 3),
(49, 'USF CURADO III - EQUIPE 1 ', 3),
(50, 'USF CURADO III - EQUIPE 2', 3),
(51, 'USF CURADO V', 3),
(52, 'USF CURADO IV EQUIPE I ', 3),
(53, 'USF CURADO IV EQUIPE II', 3),
(54, 'USF CRISTO REDENTOR', 3),
(55, 'REGIONAL III - COORD DE SAÚDE', 3),
(56, 'USF VILA PALMARES 1', 4),
(57, 'USF VILA PALMARES 2', 4),
(58, 'USF JARDIM MURIBECA 1', 4),
(59, 'USF INTEGRAÇÃO MURIBECA', 4),
(60, 'USF INALDO ALVES DE FRANÇA - EQUIPE 1', 4),
(61, 'USF INALDO ALVES DE FRANÇA - EQUIPE 2', 4),
(62, 'UBS MURIBECA DOS GUARARAPES', 4),
(63, 'UBS SEVERINO ROBERVAL DE MOURA', 4),
(64, 'USF ODORICO MELO', 4),
(65, 'USF PORTAL DOS PRAZERES I', 4),
(66, 'USF PORTAL DOS PRAZERES II', 4),
(67, 'USF COMPORTAS I', 5),
(68, 'USF COMPORTAS II', 5),
(69, 'USF JARDIM PRAZERES - EQUIPE 1', 5),
(70, 'USF JARDIM PRAZERES - EQUIPE 2', 5),
(71, 'USF LAGOA DAS GARÇAS', 5),
(72, 'USF VILA JOÃO DE DEUS', 5),
(73, 'USF VILA SOTAVE - EQUIPE 1', 5),
(74, 'USF VILA SOTAVE - EQUIPE 2', 5),
(75, 'USF JARDIM COQUEIRAL', 5),
(76, 'USF VERA LUCIA TIETA', 5),
(77, 'USF JARDIM DO NAUTICO', 5),
(78, 'USF N S DO CARMO', 5),
(79, 'USF MASSARANDUBA DO CAMPO', 5),
(80, 'USF NOVA DIVINEIA 1', 5),
(81, 'USF NOVA DIVINEIA 2', 5),
(82, 'USF PORTA LARGA', 5),
(83, 'USF PETRÔNIO PORTELA I', 5),
(84, 'USF PETRÔNIO PORTELA II', 5),
(85, 'USF VAQUEJADA', 5),
(86, 'UBS CAJUEIRO SECO', 5),
(87, 'USF CURCURANA I', 6),
(88, 'USF CURCURANA II', 6),
(89, 'USF CURCURANA III', 6),
(90, 'USF PARQUE DA BARRA', 6),
(91, 'USF BARRA DE JANGADA I', 6),
(92, 'USF BARRA DE JANGADA II', 6),
(93, 'USF NOVO HORIZONTE', 6),
(94, 'USF LORETO I', 6),
(95, 'USF LORETO II', 6),
(96, 'USF VIETNA', 6),
(97, 'USF JARDIM PIEDADE 1', 6),
(98, 'USF JARDIM PIEDADE 2', 6),
(99, 'USF TANCREDO NEVES', 6),
(100, 'USF GRUPIARA', 6),
(101, 'USF CATAMARÃ', 6),
(102, 'UBS GALBA MATOS ( CAROLINA)', 6),
(103, 'UBS DOM HELDER CÂMARA', 6),
(104, 'UBS PRAIA DO SOL', 6),
(105, 'USF JARDIM COPACABANA', 6),
(106, 'USF SANTA FELICIDADE', 6),
(107, 'USF BUENO AYRES', 6),
(108, 'USF CORREGO DA BATALHA - EQUIPE 1 ', 7),
(109, 'USF CORREGO DA BATALHA - EQUIPE 2', 7),
(110, 'USF CÓRREGO DA GAMELEIRA', 7),
(111, 'USF RIO DAS VELHAS - EQUIPE 1', 7),
(112, 'USF NOVA DESCOBERTA I ', 7),
(113, 'USF NOVA DESCOBERTA II', 7),
(114, 'USF CAJA', 7),
(115, 'USF JARDIM JORDÃO', 7),
(116, 'USF GUARARAPES 1', 7),
(117, 'USF GUARARAPES 2', 7),
(118, 'USF LADEIRA DA IGREJA', 7),
(119, 'USF SANTO ANTÔNIO', 1),
(120, 'USF BELO HORIZONTE', 1),
(121, 'USF PACHECO', 2),
(122, 'UBS  MARCOS FREIRE', 4),
<<<<<<< HEAD
(123, 'USF CURADO I - EQUIPE 2', 3),
(124, 'Não Cadastrado', 1);
=======
(123, 'USF CURADO I - EQUIPE 2', 3);
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `idUser` int(11) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `nomeUser` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
<<<<<<< HEAD
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`idUser`, `cpf`, `nomeUser`) VALUES
(1, '04419980036', 'Pedro Augusto'),
(2, '91380236010', 'Testador Oficial'),
(3, '82019178044', 'cabeção'),
(4, '0', 'Não Cadastrado');

--
=======
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `chamados`
--
ALTER TABLE `chamados`
  ADD PRIMARY KEY (`idChamado`),
  ADD KEY `idTomb` (`idTomb`);

--
-- Índices de tabela `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`idEmp`);

--
-- Índices de tabela `regionais`
--
ALTER TABLE `regionais`
  ADD PRIMARY KEY (`idReg`);

--
-- Índices de tabela `tablets`
--
ALTER TABLE `tablets`
  ADD PRIMARY KEY (`idTomb`),
  ADD UNIQUE KEY `imei` (`imei`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idEmp` (`idEmp`),
  ADD KEY `idUnidade` (`idUnidade`);

--
-- Índices de tabela `unidades`
--
ALTER TABLE `unidades`
  ADD PRIMARY KEY (`idUnidade`),
  ADD KEY `idReg` (`idReg`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chamados`
--
ALTER TABLE `chamados`
  MODIFY `idChamado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `empresas`
--
ALTER TABLE `empresas`
  MODIFY `idEmp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `unidades`
--
ALTER TABLE `unidades`
<<<<<<< HEAD
  MODIFY `idUnidade` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;
=======
  MODIFY `idUnidade` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
<<<<<<< HEAD
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
=======
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT;
>>>>>>> 0dae163b15bf2a29f7de1e0cfe3cff3458b48cc4

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `chamados`
--
ALTER TABLE `chamados`
  ADD CONSTRAINT `chamados_ibfk_1` FOREIGN KEY (`idTomb`) REFERENCES `tablets` (`idTomb`);

--
-- Restrições para tabelas `tablets`
--
ALTER TABLE `tablets`
  ADD CONSTRAINT `tablets_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `usuarios` (`idUser`),
  ADD CONSTRAINT `tablets_ibfk_2` FOREIGN KEY (`idEmp`) REFERENCES `empresas` (`idEmp`),
  ADD CONSTRAINT `tablets_ibfk_3` FOREIGN KEY (`idUnidade`) REFERENCES `unidades` (`idUnidade`);

--
-- Restrições para tabelas `unidades`
--
ALTER TABLE `unidades`
  ADD CONSTRAINT `unidades_ibfk_1` FOREIGN KEY (`idReg`) REFERENCES `regionais` (`idReg`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
