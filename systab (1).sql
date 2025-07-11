-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 11-Jul-2025 às 14:29
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

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
-- Estrutura da tabela `chamados`
--

CREATE TABLE `chamados` (
  `idChamado` int(11) NOT NULL,
  `idTab` int(11) NOT NULL,
  `status` enum('Aberto','Fechado') NOT NULL,
  `item` enum('Carregador','Carregador e Capinha','Capinha','Nenhum') DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `dataEntrada` timestamp NOT NULL DEFAULT current_timestamp(),
  `dataSaida` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `chamados`
--

INSERT INTO `chamados` (`idChamado`, `idTab`, `status`, `item`, `descricao`, `dataEntrada`, `dataSaida`) VALUES
(13, 15, 'Aberto', 'Carregador e Capinha', 'Não liga, defeito na bateria', '2025-07-08 13:28:29', NULL),
(14, 17, 'Aberto', 'Carregador e Capinha', 'Tela com listras na parte superior e inferior, problema no display', '2025-07-08 18:33:38', NULL),
(15, 18, 'Aberto', 'Capinha', 'Tela quebrada, destruida. Tablet entregue sem carregador, somente capinha. Portador alega que o pino quebrou e o mesmo jogou fora.', '2025-07-09 12:53:30', NULL),
(16, 19, 'Aberto', 'Carregador e Capinha', 'Não carrega', '2025-07-09 17:29:58', NULL),
(17, 22, 'Aberto', 'Carregador e Capinha', 'Tela tremendo e bordas escuras.', '2025-07-10 18:02:49', NULL),
(18, 23, 'Aberto', 'Carregador e Capinha', 'Travando muito e tela com toques fantasmas', '2025-07-10 18:17:23', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `empresas`
--

CREATE TABLE `empresas` (
  `idEmp` int(11) NOT NULL,
  `nomeEmp` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `empresas`
--

INSERT INTO `empresas` (`idEmp`, `nomeEmp`) VALUES
(1, 'EVEREST'),
(2, 'IBGE'),
(3, 'TREMA');

-- --------------------------------------------------------

--
-- Estrutura da tabela `login`
--

CREATE TABLE `login` (
  `idLogin` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nivel` enum('admin','padrao') DEFAULT 'padrao',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `login`
--

INSERT INTO `login` (`idLogin`, `nome`, `senha`, `nivel`, `criado_em`) VALUES
(1, 'admin', '$2a$12$/eRMbw6zIYna2jyYMVORROGOE8pStJ/AHSZGT7BTfyboyZo4tQwNK', 'admin', '2025-07-04 12:52:52'),
(2, 'padrao', '$2a$12$YDqbimINg4ZZOLU5T6SIPu2c.qbyv1F631hXGqkzLbG244s9ceBuG', 'padrao', '2025-07-04 12:52:52');

-- --------------------------------------------------------

--
-- Estrutura da tabela `regionais`
--

CREATE TABLE `regionais` (
  `idReg` int(11) NOT NULL,
  `numReg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `regionais`
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
-- Estrutura da tabela `tablets`
--

CREATE TABLE `tablets` (
  `idTab` int(11) NOT NULL,
  `idTomb` int(11) NOT NULL,
  `imei` varchar(15) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `idEmp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `tablets`
--

INSERT INTO `tablets` (`idTab`, `idTomb`, `imei`, `idUser`, `idEmp`) VALUES
(15, 208565, '355637050173616', 18, 3),
(17, 203323, '355637053618971', 20, 1),
(18, 211454, '355637053688479', 23, 1),
(19, 203232, '355637053245551', 24, 1),
(22, 203028, '355637052813490', 25, 1),
(23, 208561, '355637051016756', 26, 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `unidades`
--

CREATE TABLE `unidades` (
  `idUnidade` int(11) NOT NULL,
  `nomeUnidade` varchar(120) NOT NULL,
  `idReg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `unidades`
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
(123, 'USF CURADO I - EQUIPE 2', 3),
(128, 'USF QUADROS III', 1),
(131, 'Não Alocado', 1),
(132, 'USF QUADROS III - Equipe 3', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `idUser` int(11) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `nomeUser` varchar(100) NOT NULL,
  `telUser` varchar(20) DEFAULT NULL,
  `idUnidade` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`idUser`, `cpf`, `nomeUser`, `telUser`, `idUnidade`) VALUES
(18, '075.624.594-01', 'Torgana Rizomar Tenorio da Silva', '(81) 98345-7137', 78),
(20, '065.261.214-89', 'Geise Da Costa Nascimento', '(81) 99236-3334', 9),
(22, '000.000.000-00', 'Não Cadastrado', '', NULL),
(23, '111.430.924-90', 'Emmanuel Franciego da Silva Santos', '(81) 98339-8493', 87),
(24, '030.419.924-93', 'Edilma Maria da Silva', '(81) 99916-9200', 50),
(25, '010.083.924-05', 'Josinaldo Bento da Silva Junior', '(81) 98859-3233', 115),
(26, '934.668.204-30', 'Luciana Penha da Silva', '(81) 98196-1402', 78),
(27, '784.445.944-15', 'Geniere Costa do Nascimento', '', NULL),
(28, '025.579.624-22', 'Maria Cristina Correia', '', NULL),
(29, '060.225.184-23', 'Everson Pereira da Silva', '', NULL),
(30, '766.502.944-20', 'Maria Lionor do Nascimento', '(81) 98889-7411', NULL),
(31, '085.526.374-13', 'Walter Ferreira Melo de Oliveira', '', NULL),
(32, '028.653.404-57', 'Rosali Bezerra', '', NULL),
(35, '649.936.804-06', 'MAURICEA JOSEFA DO NASCIMENTO DE OGRACA', '(81) 98747-9623', NULL),
(36, '053.457.434-36', 'Flávio Francisco da Silva', '', NULL),
(37, '905.336.404-82', 'Edina Maria Oliveira dos Santos', '(81) 98578-6473', NULL),
(38, '685.637.364-34', 'Merijane Pereira de Souza', '', NULL),
(39, '918.936.154-72', 'Viviane Borges Alves', '', NULL),
(40, '062.424.024-08', 'Neuzangela Maria Mendes', '', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `chamados`
--
ALTER TABLE `chamados`
  ADD PRIMARY KEY (`idChamado`),
  ADD KEY `idTab` (`idTab`);

--
-- Índices para tabela `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`idEmp`);

--
-- Índices para tabela `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`idLogin`);

--
-- Índices para tabela `regionais`
--
ALTER TABLE `regionais`
  ADD PRIMARY KEY (`idReg`);

--
-- Índices para tabela `tablets`
--
ALTER TABLE `tablets`
  ADD PRIMARY KEY (`idTab`),
  ADD UNIQUE KEY `imei` (`imei`),
  ADD UNIQUE KEY `idTomb` (`idTomb`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idEmp` (`idEmp`);

--
-- Índices para tabela `unidades`
--
ALTER TABLE `unidades`
  ADD PRIMARY KEY (`idUnidade`),
  ADD KEY `idReg` (`idReg`);

--
-- Índices para tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD KEY `fk_unidade_usuarios` (`idUnidade`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chamados`
--
ALTER TABLE `chamados`
  MODIFY `idChamado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `empresas`
--
ALTER TABLE `empresas`
  MODIFY `idEmp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `login`
--
ALTER TABLE `login`
  MODIFY `idLogin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tablets`
--
ALTER TABLE `tablets`
  MODIFY `idTab` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de tabela `unidades`
--
ALTER TABLE `unidades`
  MODIFY `idUnidade` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `chamados`
--
ALTER TABLE `chamados`
  ADD CONSTRAINT `chamados_ibfk_1` FOREIGN KEY (`idTab`) REFERENCES `tablets` (`idTab`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tablets`
--
ALTER TABLE `tablets`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`idUser`) REFERENCES `usuarios` (`idUser`) ON DELETE SET NULL,
  ADD CONSTRAINT `tablets_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `usuarios` (`idUser`),
  ADD CONSTRAINT `tablets_ibfk_2` FOREIGN KEY (`idEmp`) REFERENCES `empresas` (`idEmp`);

--
-- Limitadores para a tabela `unidades`
--
ALTER TABLE `unidades`
  ADD CONSTRAINT `unidades_ibfk_1` FOREIGN KEY (`idReg`) REFERENCES `regionais` (`idReg`);

--
-- Limitadores para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_unidade_usuarios` FOREIGN KEY (`idUnidade`) REFERENCES `unidades` (`idUnidade`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
