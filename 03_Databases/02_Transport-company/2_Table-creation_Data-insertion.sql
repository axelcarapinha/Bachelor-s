/*
 _____     _          _           
|_   _|_ _| |__   ___| | __ _ ___ 
  | |/ _` | '_ \ / _ \ |/ _` / __|
  | | (_| | |_) |  __/ | (_| \__ \
  |_|\__,_|_.__/ \___|_|\__,_|___/
                                  
*/ 

CREATE TABLE Pessoa (
    nif VARCHAR(20) CONSTRAINT ChavePessoa PRIMARY KEY CHECK (nif ~ '^[0-9]+$'),
    nome VARCHAR(50) NOT NULL,
    residencia VARCHAR(50)
);

CREATE TABLE Cliente (
	nif VARCHAR(20) CONSTRAINT ChaveCliente PRIMARY KEY CHECK (nif ~ '^[0-9]+$'),
	telefone DECIMAL NOT NULL, --> prefixo "+" é subentendido
	numCartCred VARCHAR(16) CHECK (numCartCred ~ '^[0-9]+$') NOT NULL,
  
	Constraint fk_nif FOREIGN KEY (nif) REFERENCES Pessoa(nif)
);

CREATE TABLE Veiculo (
  	matricula VARCHAR(15) CONSTRAINT ChaveVeiculo PRIMARY KEY,
  	capacidade DECIMAL NOT NULL, -- controlar quantidade de clientes transportados, evitar ilegalidades
  	categoria VARCHAR(15)
);

CREATE TABLE Condutor (
    nif VARCHAR(20) CONSTRAINT ChaveCondutor PRIMARY KEY CHECK (nif ~ '^[0-9]+$'),
  	numCartCond VARCHAR(20) NOT NULL,
  	nib VARCHAR(30) NOT NULL,
  	nacionalidade VARCHAR(50),
  	
    CONSTRAINT fk_nif FOREIGN KEY (nif) REFERENCES Pessoa(nif)
);

CREATE TABLE Pedido (
  	nif VARCHAR(20) NOT NULL CHECK (nif ~ '^[0-9]+$'),
  	dataPedido CHAR(12)  NOT NULL CHECK (dataPedido ~ '^[0-9]+$'), -- formato YYYYMMDDhhmm 
  	origem VARCHAR(40)  NOT NULL,
  	destino VARCHAR(40) NOT NULL,
  
  	CONSTRAINT ChavePedido PRIMARY KEY (nif, dataPedido),
  	
  	CONSTRAINT fk_nif FOREIGN KEY (nif) REFERENCES Pessoa(nif)
);

CREATE TABLE Servico (
  	nif VARCHAR(20) NOT NULL CHECK (nif ~ '^[0-9]+$'),
  	dataInicio CHAR(12) NOT NULL CHECK (dataInicio ~ '^[0-9]+$'),
  	dataFim    CHAR(12) NOT NULL CHECK (dataFim ~ '^[0-9]+$' AND dataFim > dataInicio),
  	valor FLOAT NOT NULL CHECK (valor >= 0.0),
  
  	CONSTRAINT ChaveServico PRIMARY KEY (nif, dataInicio),
  	
  	CONSTRAINT fk_nif FOREIGN KEY (nif) REFERENCES Pessoa(nif)
);

CREATE TABLE telefone_cond (
	nif VARCHAR(20) CHECK (nif ~ '^[0-9]+$') NOT NULL,
  	telefone DECIMAL NOT NULL,
  
  	CONSTRAINT ChaveTelefone_cond PRIMARY KEY (nif, telefone),
  	
  	CONSTRAINT fk_nif FOREIGN KEY (nif) REFERENCES Pessoa(nif)
);

CREATE TABLE cliPontua (
  	nif_cli VARCHAR(20) NOT NULL CHECK (nif_cli ~ '^[0-9]+$'),
  	nif_con VARCHAR(20) NOT NULL CHECK (nif_con ~ '^[0-9]+$'),
  	dataInicio CHAR(12) NOT NULL CHECK (dataInicio ~ '^[0-9]+$'),
  	pontuacao DECIMAL NOT NULL CHECK (pontuacao BETWEEN 0 AND 5),
  
  	CONSTRAINT ChaveCliPontua PRIMARY KEY (nif_con, dataInicio),
  	
  	CONSTRAINT fk_nif_cli FOREIGN KEY (nif_cli) REFERENCES Pessoa(nif),
  	CONSTRAINT fk_nif_con FOREIGN KEY (nif_con) REFERENCES Pessoa(nif),
	CONSTRAINT fk_servico FOREIGN KEY (nif_con, dataInicio) REFERENCES Servico(nif, dataInicio)
);

CREATE TABLE conPontua (
  	nif VARCHAR(20) NOT NULL CHECK (nif ~ '^[0-9]+$'),
  	dataInicio CHAR(12) NOT NULL CHECK (dataInicio ~ '^[0-9]+$'),
  	pontuacao DECIMAL NOT NULL CHECK (pontuacao BETWEEN 0 AND 5),
  
  	CONSTRAINT ChaveConPontua PRIMARY KEY (nif, dataInicio),
  	CONSTRAINT fk_Servico FOREIGN KEY (nif, dataInicio) REFERENCES Servico(nif, dataInicio)
);

CREATE TABLE conduzidoPor (
    nif VARCHAR(20) CHECK (nif ~ '^[0-9]+$'),
  	matricula VARCHAR(15) NOT NULL,
  
  	CONSTRAINT ChaveConduzidoPor PRIMARY KEY (nif, matricula),
  
    CONSTRAINT fk_nif FOREIGN KEY (nif) REFERENCES Pessoa(nif),
    CONSTRAINT fk_matricula FOREIGN KEY (matricula) REFERENCES Veiculo(matricula)
);

CREATE TABLE pedidoAceite (
  	nif_cli VARCHAR(20) NOT NULL CHECK (nif_cli ~ '^[0-9]+$'),
  	nif_con VARCHAR(20) NOT NULL CHECK (nif_con ~ '^[0-9]+$'),
  	dataInicio CHAR(12) NOT NULL CHECK (dataInicio ~ '^[0-9]+$'),
  	dataPedido CHAR(12) NOT NULL CHECK (dataPedido ~ '^[0-9]+$'),
  
  	CONSTRAINT ChavePedidoAceite PRIMARY KEY (nif_con, dataInicio),
  
  	CONSTRAINT fk_Pedido FOREIGN KEY (nif_cli, dataPedido) REFERENCES Pedido(nif, dataPedido),
  	CONSTRAINT fk_Servico FOREIGN KEY (nif_con, dataInicio) REFERENCES Servico(nif, dataInicio)	
);
COMMIT;



/*
 ____            _           
|  _ \  __ _  __| | ___  ___ 
| | | |/ _` |/ _` |/ _ \/ __|
| |_| | (_| | (_| | (_) \__ \
|____/ \__,_|\__,_|\___/|___/
                             
*/

INSERT INTO Pessoa(nif, nome, residencia) VALUES 
    -- Clientes
    ('015830249711', 'Maria Silva', 'Portugal, Évora'),
    ('910294518847', 'Manuel Santos', 'Portugal, Coimbra'),
    ('123456789012', 'Conway', 'United States, New York'),
    ('987654321098', 'Grace Hopper', 'United Kingdom, Oxford'),
    ('456789012345', 'Richard Stallman', 'Spain, Madrid'), 
    ('789012345678', 'Ada Lovelace', 'France, Paris'),
    ('234567890123', 'Alan Turing', 'Germany, Berlin'),
    ('345678901234', 'Guido van Rossum', 'Italy, Rome'),
    ('567890123456', 'Carlos Slim', 'Mexico, Mexico City'),
    ('890123456789', 'Taka Takata', 'Japan, Tokyo'),

    -- Condutores
    ('678901234567', 'Olga Petrov', 'Russia, Moscow'),
    ('345678912345', 'Joaquim Gomes', 'Argentina, Buenos Aires'),
    ('901234567890', 'Katarina Nowak', 'Poland, Krakow'),
    ('123459876543', 'Ahmed Khalid', 'Egypt, Alexandria'),
    ('987654398765', 'Xia Peisu', 'China, Shanghai')
;
COMMIT;

INSERT INTO Cliente(nif, telefone, numCartCred) VALUES 
    ('015830249711', '123956789012', '4859271038475832'), -- Maria Silva
    ('910294518847', '209984756123', '6912348756237845'), -- Manuel Santos
    ('123456789012', '839291746352', '7890123654789012'), -- Conway
    ('987654321098', '475936291034', '1234567890123456'), -- Grace Hopper
    ('456789012345', '632997459820', '9876543210987654'), -- Richard Stallman
    ('789012345678', '564389291045', '2345678901234567'), -- Ada Lovelace
    ('234567890123', '920394856123', '8765432109876543'), -- Alan Turing
    ('345678901234', '789129045672', '3456789012345678'), -- Guido van Rossum
    ('567890123456', '931459876302', '4567890123456789'), -- Carlos Slim
    ('890123456789', '974563920134', '8901234567890123')  -- Taka Takata
;
COMMIT;

INSERT INTO Veiculo(matricula, capacidade, categoria) VALUES 
    ('AB123456', 4, 'medium'), --> Olga Petrov
    ('CD234567', 4, 'medium'), --> Joaquim Gomes
    ('EF345678', 4, 'medium'), --> Katarina Nowak
    ('GH456789', 6, 'heavy'),  --> Ahmed Khalid
    ('IJ567890', 6, 'heavy')   --> Xia Peisu
;
COMMIT;

INSERT INTO Condutor(nif, numCartCond, nib, nacionalidade) VALUES 
  	-- Olga Petrov
    ('678901234567', '3567894567890123', 'RU50002700000001234567833', 'Russian'),
  	
  	--Joaquim Gomes
    ('345678912345', '3123456789012345', 'AR50002700000001234567834', 'Argentinian'),
  
  	-- Katarina Nowak
    ('901234567890', '3980123456789012', 'PL50002700000001234567835', 'Polish'),
  
  	-- Ahmed Khalid
    ('123459876543', '3876543210987654', 'EG50002700000001234567836', 'Egyptian'),
  
  	-- Xia Peisu
    ('987654398765', '3654321098765432', 'CN50002700000001234567837', 'Chinese')
;
COMMIT;

INSERT INTO Pedido(nif, dataPedido, origem, destino) VALUES 
    -- Maria Silva (10 aceites)
    ('015830249711', '202301012154', 'Portugal, Évora', 'Portugal, Beja'),
    ('015830249711', '202301021245', 'Portugal, Beja', 'Portugal, Évora'),
    ('015830249711', '202301031356', 'Portugal, Évora', 'Portugal, Beja'),
    ('015830249711', '202301040803', 'Portugal, Beja', 'Portugal, Évora'),
    ('015830249711', '202301050912', 'Portugal, Évora', 'Portugal, Beja'),

    ('015830249711', '202301061037', 'Portugal, Beja', 'Portugal, Évora'),
    ('015830249711', '202301071908', 'Portugal, Évora', 'Portugal, Beja'),
    ('015830249711', '202301080819', 'Portugal, Beja', 'Portugal, Évora'),
    ('015830249711', '202301092011', 'Portugal, Évora', 'Portugal, Beja'),
    
    -- Serviço feito DE Beja, e não PARA Beja
    ('015830249711', '202301102013', 'Portugal, Beja', 'Portugal, Évora'),

    -- Maria Silva (2 recusados)
    ('015830249711', '202301112213', 'Portugal, Viana do Alentejo', 'Portugal, Lisboa'),
    ('015830249711', '202301122130', 'Portugal, Lisboa', 'Portugal, Évora'),

    -----------
    -- Manuel Santos (9 aceites)
    ('910294518847', '202301010815', 'Portugal, Lisboa', 'Portugal, Porto'),
    ('910294518847', '202301020012', 'Portugal, Porto', 'Portugal, Lisboa'),
    ('910294518847', '202301121245', 'Portugal, Coimbra', 'Portugal, Lisboa'),
    
    ('910294518847', '202301031450', 'Portugal, Lisboa', 'Portugal, Porto'),
    ('910294518847', '202301041400', 'Portugal, Porto', 'Portugal, Lisboa'),
    ('910294518847', '202301111555', 'Portugal, Lisboa', 'Portugal, Coimbra'),
    ('910294518847', '202301061819', 'Portugal, Porto', 'Portugal, Lisboa'),
    ('910294518847', '202301071720', 'Portugal, Lisboa', 'Portugal, Porto'),

    ('910294518847', '202312201732', 'Portugal, Porto', 'Portugal, Viana do Alentejo'),

    -- Manuel Santos (2 recusados)
    ('910294518847', '202301091323', 'Portugal, Lisboa', 'Portugal, Porto'),
    ('910294518847', '202301101752', 'Portugal, Porto', 'Portugal, Lisboa'),

    -----------
    -- Conway (8 aceites)
    ('123456789012', '202306152320', 'United States, New York', 'United States, Philadelphia'),
    ('123456789012', '202306252214', 'United States, Philadelphia', 'United States, Washington, D.C.'),
    ('123456789012', '202307100816', 'United States, Washington, D.C.', 'United States, Baltimore'),
    ('123456789012', '202307250937', 'United States, Baltimore', 'United States, Philadelphia'),
    ('123456789012', '202308050850', 'United States, Philadelphia', 'United States, New York'),
    ('123456789012', '202308200728', 'United States, New York', 'United States, Boston'),
    ('123456789012', '202401100249', 'United States, Boston', 'United States, Providence'),
    ('123456789012', '202312200810', 'Portugal, Évora', 'Portugal, Portel'),

    -- Conway (2 recusados)
    ('123456789012', '202402150012', 'United States, Providence', 'United States, Hartford'),
    ('123456789012', '202403202311', 'United States, Hartford', 'United States, New Haven'),

    -----------
    -- Grace Hopper (7 aceites)
    ('987654321098', '202201152019', 'United Kingdom, Oxford', 'United Kingdom, Cambridge'),
    ('987654321098', '202912102230', 'United Kingdom, Oxford', 'United Kingdom, Newcastle'),
    ('987654321098', '202309052100', 'United Kingdom, Oxford', 'United Kingdom, Cambridge'),
    ('987654321098', '202410152347', 'United Kingdom, Cambridge', 'United Kingdom, Bristol'),
    ('987654321098', '202511101956', 'United Kingdom, Oxford', 'United Kingdom, Cambridge'),
    ('987654321098', '202611051717', 'United Kingdom, Cambridge', 'United Kingdom, Oxford'),
    ('987654321098', '202812151320', 'United Kingdom, Cambridge', 'United Kingdom, Leeds'),

    -- Grace Hopper (2 recusados)
    ('987654321098', '202812151223', 'United Kingdom, Cambridge', 'United Kingdom, Oxford'),
    ('987654321098', '202912101225', 'United Kingdom, Oxford', 'United Kingdom, Cambridge'),

    -----------
    -- Richard Stallman (6 aceites)
    ('456789012345', '202209101919', 'Spain, Madrid', 'Spain, Seville'),
    ('456789012345', '202212051934', 'Spain, Seville', 'Spain, Madrid'),
    ('456789012345', '202303152018', 'Spain, Madrid', 'Spain, Seville'),
    ('456789012345', '202610152029', 'Spain, Madrid', 'Portugal, Faro'),
    ('456789012345', '202404101502', 'Spain, Madrid', 'Spain, Seville'),
    ('456789012345', '202505051109', 'Spain, Seville', 'Spain, Madrid'),
  
    -- Richard Stallman (2 recusados)
    ('456789012345', '202610151345', 'Spain, Madrid', 'Spain, Seville'),
    ('456789012345', '202712201123', 'Spain, Seville', 'Spain, Madrid'),

    -----------
    -- Ada Lovelace (5 aceites)
    ('789012345678', '202201151856', 'France, Paris', 'France, Lyon'),
    ('789012345678', '202203102000', 'France, Paris', 'France, Lyon'),
    ('789012345678', '202311200818', 'Portugal, Évora', 'Portugal, Montemor'),
    ('789012345678', '202311200823', 'France, Lyon', 'France, Paris'),
    ('789012345678', '202408101123', 'France, Paris', 'France, Lyon'),

    -- Ada Lovelace (2 recusados)
    ('789012345678', '202610152122', 'France, Paris', 'Spain, Barcelona'),
    ('789012345678', '202712201245', 'Spain, Barcelona', 'France, Perpignan'),

    -----------
    -- Alan Turing (4 aceites)
    ('234567890123', '202302151130', 'Germany, Berlin', 'Germany, Potsdam'),
    ('234567890123', '202305101550', 'Germany, Potsdam', 'Germany, Brandenburg'),
    
    ('234567890123', '202410151120', 'Germany, Berlin', 'Germany, Neuruppin'),
    ('234567890123', '202406300315', 'Germany, Brandenburg', 'Germany, Oranienburg'),

    -- Alan Turing (2 recusados)
    ('234567890123', '202311201509', 'Portugal, Évora', 'Portugal, Montemor'),
    ('234567890123', '202404051212', 'Germany, Potsdam', 'Germany, Brandenburg'),

    -----------
    -- Guido van Rossum (3 aceites e 0 RECUSADOS)
    ('345678901234', '202305151900', 'Italy, Rome', 'Italy, Florence'),
    ('345678901234', '202308102035', 'Italy, Florence', 'Italy, Pisa'),
    ('345678901234', '202312052246', 'Italy, Pisa', 'Italy, Rome'),

    -----------
    -- Carlos Slim (2 aceites)
    ('567890123456', '202203152016', 'Mexico, Mexico City', 'Mexico, Puebla'),
    ('567890123456', '202206101923', 'Mexico, Puebla', 'Mexico, Toluca'),

    -- Carlos Slim (2 recusados)
    ('567890123456', '202209052355', 'Mexico, Toluca', 'Mexico, Querétaro'),
    ('567890123456', '202212010912', 'Mexico, Querétaro', 'Mexico, Mexico City'),

    -----------
    -- Taka Takata (1 aceite)
    ('890123456789', '202303201155', 'Japan, Tokyo', 'Japan, Yokohama'),

    -- Taka Takata (2 recusados)
    ('890123456789', '202303212312', 'Japan, Yokohama', 'Japan, Tokyo'),
    ('890123456789', '202304071023', 'Japan, Tokyo', 'Japan, Yokohama')
;
COMMIT;

INSERT INTO Servico(nif, dataInicio, dataFim, valor) VALUES 
    -- Maria Silva (5 serviços do Joaquim Gomes)
    ('345678912345', '202301012259', '202301012359', 3.20), 
    ('345678912345', '202301021345', '202301021550', 5.00), 
    ('345678912345', '202301031451', '202301031551', 2.53),
    ('345678912345', '202301040900', '202301041900', 7.85), 
    ('345678912345', '202301051012', '202301051129', 12.40), 
  
  	-- Maria Silva (5 serviços do Ahmed Kalid)
    ('123459876543', '202301061134', '202301061234', 8.75), 
    ('123459876543', '202301072001', '202301072101', 6.20), 
    ('123459876543', '202301080917', '202301081034', 9.30), 
    ('123459876543', '202301092119', '202301092229', 15.60),

    -- Maria Silva (1 serviço da Xia Peisu)
    ('987654398765', '202301102113', '202301102312', 11.45), 

  	------------
    -- Manuel Santos (3 serviços da Xia Peisu)
    ('987654398765', '202311010915', '202311011927', 10.25), 
    ('987654398765', '202301020112', '202301020212', 13.50), 
    ('987654398765', '202301121345', '202301121445', 6.75), 
  	
  	-- Manuel Santos (6 serviços da Katarina Nowak)
    ('901234567890', '202301031550', '202301031650', 8.90), 
    ('901234567890', '202301041600', '202301041719', 11.20), 
    ('901234567890', '202301111755', '202301111850', 14.75),
    ('901234567890', '202301061819', '202301062034', 9.60), 
    ('901234567890', '202301071920', '202301072123', 7.30),
    ('901234567890', '202312202032', '202312202140', 12.15), 
   
  	------------
    -- Conway (8 serviços do Ahmed Khalid)
    ('123459876543', '202306150011', '202306150123', 8.75),
    ('123459876543', '202306252311', '202306260029', 12.40),
    ('123459876543', '202307101023', '202307101135', 6.20),
    ('123459876543', '202307251134', '202307251247', 9.30),
    ('123459876543', '202308050911', '202308051034', 15.60),
    ('123459876543', '202308200813', '202308200910', 11.45),
    ('123459876543', '202401100434', '202401100645', 10.25),
    ('123459876543', '202312200900', '202312202344', 13.50),
  
  	------------
    -- Grace Hopper (7 serviços da Olga Petrov)
    ('678901234567', '202201152212', '202201152312', 9.60),
    ('678901234567', '202912102345', '202912110045', 7.30),
    ('678901234567', '202309052133', '202309052259', 15.60),
    ('678901234567', '202410150012', '202410150114', 11.45),
    ('678901234567', '202511102031', '202511102131', 10.25),
    ('678901234567', '202611051812', '202611051927', 13.50),
    ('678901234567', '202812151432', '202812151538', 8.75),
  
  	------------
    -- Richard Stallman (6 serviços do Joaquim Gomes)
    ('345678912345', '202209102018', '202209102120', 6.75),
    ('345678912345', '202212052017', '202212052117', 8.90),
	  ('345678912345', '202303152135', '202303152223', 11.20),
	  ('345678912345', '202610152116', '202610152216', 14.75),
	  ('345678912345', '202404101639', '202404101717', 9.60),
	  ('345678912345', '202505051248', '202505051345', 7.30),

  	------------
	-- Ada Lovelace (5 serviços da Katarina Nowak)
	('901234567890', '202201151923', '202201152123', 10.25),
	('901234567890', '202203102213', '202203110013', 13.50),
	('901234567890', '202311201015', '202311202230', 6.75),
	('901234567890', '202311200918', '202311201018', 8.90),
	('901234567890', '202408101232', '202408101332', 11.20),

  	------------
	-- Alan Turing (4 serviços)
  
  	-- 2 serviços da Xia Peisu
	('987654398765', '202302151221', '202302151234', 15.60),
	('987654398765', '202305101935', '202305102035', 11.45),
  
  	-- 2 serviços do Joaquim Gomes
	('345678912345', '202410151212', '202410151312', 10.25),
	('345678912345', '202406300516', '202406300620', 13.50),

  	------------
	-- Guido van Rossum (3 serviços da Katarina Nowak)
	('901234567890', '202305152000', '202305152047', 8.75),
	('901234567890', '202308102100', '202308102200', 12.40),
	('901234567890', '202312050000', '202312050139', 9.60),
  	
  	------------
	-- Carlos Slim (2 serviços da Olga Petrov)
	('678901234567', '202203152117', '202203152256', 7.30),
	('678901234567', '202206102033', '202206102140', 14.75),
  
  	------------
	-- Taka Takata (1 serviço da Katarina Nowak)
	('901234567890', '202303201230', '202303201334', 9.60)

;
COMMIT;

INSERT INTO telefone_cond(nif, telefone) VALUES 
  	-- Olga Petrov
    ('678901234567', '780012345678'), -- Russian phone numbers
    ('678901234567', '780012345679'),
    ('678901234567', '780012345680'),
    
  	-- Joaquim Gomes
    ('345678912345', '541123456789'), -- Argentinian phone numbers
    ('345678912345', '541123456791'),
    
  	-- Katarina Nowak
    ('901234567890', '480012345678'), -- Polish phone numbers
    ('901234567890', '480012345679'),
    ('901234567890', '480012345680'),
    
  	-- Ahmed Kalid
    ('123459876543', '201123456789'), -- Egyptian phone numbers
 
  	-- Xia Peisu
    ('987654398765', '862123456789'), -- Chinese phone numbers
    ('987654398765', '862123456790'),
    ('987654398765', '862123456791')
;
COMMIT;

-- Nem todos os serviços foram pontuados pelo CLIENTE, para tornar mais realista.
INSERT INTO cliPontua(nif_cli, nif_con, dataInicio, pontuacao) VALUES 
	-- Maria Silva (10 pedidos aceites -> 8 pontuados)
  
  	-- Pontuar o Joaquim Gomes
	  ('015830249711', '345678912345', '202301012259', 4), 
    ('015830249711', '345678912345', '202301021345', 5), 
  	('015830249711', '345678912345', '202301031451', 5),
    ('015830249711', '345678912345', '202301040900', 4), 
    ('015830249711', '345678912345', '202301051012', 5), 
  
  	-- Pontuar o Ahmed Khalid
    ('015830249711', '123459876543', '202301061134', 4), 
    ('015830249711', '123459876543', '202301072001', 4), 
    ('015830249711', '123459876543', '202301080917', 4), 
    ('015830249711', '123459876543', '202301092119', 4), 

    --> Pontuar Xia Peisu
    ('015830249711', '987654398765', '202301102113', 3), 
  
  	----------
  	-- Manuel Santos (10 pedidos aceites -> 6 pontuados)
  
  	-- Pontuar Xia Peisu
    ('910294518847', '987654398765', '202311010915', 3), 
    ('910294518847', '987654398765', '202301020112', 3), 
    ('910294518847', '987654398765', '202301121345', 5), 
  
  	-- Pontuar Katarina Nowak
    ('910294518847', '901234567890', '202301031550', 4), 
    ('910294518847', '901234567890', '202301041600', 4), 
    ('910294518847', '901234567890', '202312202032', 5), 
  
 	----------
  	-- Conway (8 pedidos aceites -> 8 pontuados)
  
  	-- Pontuar Ahmed Khalid
    ('123456789012', '123459876543', '202306150011', 4),
    ('123456789012', '123459876543', '202306252311', 4),
    ('123456789012', '123459876543', '202307101023', 4),
    ('123456789012', '123459876543', '202307251134', 5),
    ('123456789012', '123459876543', '202308050911', 5),
    ('123456789012', '123459876543', '202308200813', 4),
    ('123456789012', '123459876543', '202401100434', 5),
    ('123456789012', '123459876543', '202312200900', 5),
  
  	----------
  	-- Grace Hopper (7 pedidos aceites -> 7 pontuados)
  
    -- Pontuar Olga Petrov
    ('987654321098', '678901234567', '202201152212', 3),
    ('987654321098', '678901234567', '202912102345', 3),
    ('987654321098', '678901234567', '202309052133', 5),
    ('987654321098', '678901234567', '202410150012', 5),
    ('987654321098', '678901234567', '202511102031', 5),
    ('987654321098', '678901234567', '202611051812', 5),
    ('987654321098', '678901234567', '202812151432', 4),
  
  	----------
    -- Richard Stallman (6 pedidos aceites -> 4 pontuados)
  
  	-- Pontuar Joaquim Gomes
	('456789012345', '345678912345', '202209102018', 4),
	('456789012345', '345678912345', '202610152116', 4),
	('456789012345', '345678912345', '202404101639', 3),
	('456789012345', '345678912345', '202505051248', 4),

  	----------
	-- Ada Lovelace (5 pedidos aceites -> 1 pontuado)
  
  	-- Pontuar Katarina Nowak
	('789012345678', '901234567890', '202311201015', 5),

  	----------
	-- Alan Turing (4 pedidos aceites -> 4 pontuados)
  
  	-- Pontuar Xia Peisu
	('234567890123', '987654398765', '202302151221', 0),
	('234567890123', '987654398765', '202305101935', 1),
  
  	-- Pontuar Joaquim Gomes
	('234567890123', '345678912345', '202410151212', 0),
	('234567890123', '345678912345', '202406300516', 0),
  
  	----------
	-- Guido van Rossum (3 pedidos aceites -> 3 pontuados)
  
  	-- Pontuar Katarina Nowak
	('345678901234', '901234567890', '202305152000', 2),
	('345678901234', '901234567890', '202308102100', 5),
	('345678901234', '901234567890', '202312050000', 5),
  
  	----------
  	-- Carlos Slim (2 pedidos aceites -> 1 pontuado)
  
  	-- Pontuar Olga Petrov
	('567890123456', '678901234567', '202203152117', 5),
  
  	----------
  	-- Taka Takata (1 pedidos aceites -> 1 pontuado)
 		
  	-- Pontuar Katarina Nowak
	('890123456789','901234567890','202303201230', 5)
;
COMMIT;

-- TODOS os serviços foram pontuados pelos condutores
INSERT INTO conPontua(nif, dataInicio, pontuacao) VALUES 
  -- Olga Petrov (9 serviços -> 8 pontuados)
  
  -- Pontuar Grace Hopper
  ('678901234567', '202201152212', 3),
	('678901234567', '202912102345', 3),
  ('678901234567', '202309052133', 5),
  ('678901234567', '202410150012', 5),
  ('678901234567', '202511102031', 5),
  ('678901234567', '202611051812', 5),
  ('678901234567', '202812151432', 4),
  
  -- Pontuar por Carlos Slim
  ('678901234567', '202203152117', 5),
  	
  ----------
	-- Joaquim Gomes (13 serviços -> 11 pontuados)
  
  -- Pontuar Maria Silva
	('345678912345', '202301012259', 4), 
  ('345678912345', '202301021345', 5), 
  ('345678912345', '202301031451', 5),
  ('345678912345', '202301040900', 4), 
  ('345678912345', '202301051012', 5), 
  
  -- Pontuar Richard Stallman
  ('345678912345', '202209102018', 4),
	('345678912345', '202610152116', 4),
	('345678912345', '202404101639', 3),
	('345678912345', '202505051248', 4),
  
  -- Pontuar Alan Turing
  ('345678912345', '202410151212', 0),
	('345678912345', '202406300516', 0),
  
  ----------
  -- Katarina Nowak (15 serviços -> 8 pontuados)
  
  -- Pontuar Manuel Santos
  ('901234567890', '202301031550', 4), 
  ('901234567890', '202301041600', 4), 
  ('901234567890', '202312202032', 5), 
  
  -- Pontuar Taka Takata
  ('901234567890','202303201230', 5),
  
  -- NÃO pontuou Ada Lovelace nem Guido van Rossum
  ----------
  -- Ahmed Khalid (13 serviços -> 13 pontuados)
  
  -- Pontuar 
  ('123459876543', '202301061134', 4), 
  ('123459876543', '202301072001', 5), 
  ('123459876543', '202301080917', 4), 
  ('123459876543', '202301092119', 5), 
  
  -- Pontuar Conway	
  ('123459876543', '202306150011', 2),
  ('123459876543', '202306252311', 3),
  ('123459876543', '202307101023', 4),
  ('123459876543', '202307251134', 4),
  ('123459876543', '202308050911', 4),
  ('123459876543', '202308200813', 3),
  ('123459876543', '202401100434', 5),
  ('123459876543', '202312200900', 5),
  
  ----------
  -- Xia Peisu (5 serviços -> 5 pontuados)

  -- Pontuar Maria Silva
  ('987654398765', '202301102113', 4),
  
  -- Pontuar Manuel Santos
  ('987654398765', '202311010915', 5), 
  ('987654398765', '202301020112', 3), 
  ('987654398765', '202301121345', 5), 
  
  -- Pontuar Alan Turing
  ('987654398765', '202302151221', 4),
	('987654398765', '202305101935', 4)
;
COMMIT;

INSERT INTO conduzidoPor(nif, matricula) VALUES 
  	-- Olga Petrov
    ('678901234567', 'AB123456'),
  
  	-- Joaquim Gomes
    ('345678912345', 'CD234567'), 
    
  	-- Katarina Nowak
    ('901234567890', 'EF345678'), 
    
  	-- Ahmed Khalid
    ('123459876543', 'GH456789'), 
 
  	-- Xia Peisu
    ('987654398765', 'IJ567890')
;
COMMIT;

INSERT INTO pedidoAceite (nif_cli, nif_con, dataInicio, dataPedido) VALUES 
  -- Maria Silva 
  
  -- 5 serviços do Joaquim Gomes
  ('015830249711', '345678912345', '202301012259', '202301012154'),
  ('015830249711', '345678912345', '202301021345', '202301021245'), 
  ('015830249711', '345678912345', '202301031451', '202301031356'),
  ('015830249711', '345678912345', '202301040900', '202301040803'), 
  ('015830249711', '345678912345', '202301051012', '202301050912'), 

  -- 4 serviços do Ahmed Kalid
  ('015830249711', '123459876543', '202301061134', '202301061037'), 
  ('015830249711', '123459876543', '202301072001', '202301071908'), 
  ('015830249711', '123459876543', '202301080917', '202301080819'), 
  ('015830249711', '123459876543', '202301092119', '202301092011'), 

  -- 1 serviço da Xia Peisu
  ('015830249711', '987654398765', '202301102113', '202301102013'), 

  ----------
  -- Manuel Santos
  
  -- 3 serviços da Xia Peisu
  ('910294518847', '987654398765', '202311010915', '202301010815'), 
  ('910294518847', '987654398765', '202301020112', '202301020012'), 
  ('910294518847', '987654398765', '202301121345', '202301121245'), 
  
  -- 6 serviços da Katarina Nowak
  ('910294518847', '901234567890', '202301031550', '202301031450'), 
  ('910294518847', '901234567890', '202301041600', '202301041400'), 
  ('910294518847', '901234567890', '202301111755', '202301111555'),
  ('910294518847', '901234567890', '202301061819', '202301061819'), 
  ('910294518847', '901234567890', '202301071920', '202301071720'),

  ('910294518847', '901234567890', '202312202032', '202312201732'),

  ----------
  -- Conway

  -- 8 serviços do Ahmed Khalid
  ('123456789012', '123459876543', '202306150011', '202306152320'),
  ('123456789012', '123459876543', '202306252311', '202306252214'),
  ('123456789012', '123459876543', '202307101023', '202307100816'),
  ('123456789012', '123459876543', '202307251134', '202307250937'),
  ('123456789012', '123459876543', '202308050911', '202308050850'),
  ('123456789012', '123459876543', '202308200813', '202308200728'),
  ('123456789012', '123459876543', '202401100434', '202401100249'),
  ('123456789012', '123459876543', '202312200900', '202312200810'),

  ----------
  -- Grace Hopper

  -- 7 serviços da Olga Petrov
  ('987654321098', '678901234567', '202201152212', '202201152019'),
  ('987654321098', '678901234567', '202912102345', '202912102230'),
  ('987654321098', '678901234567', '202309052133', '202309052100'),
  ('987654321098', '678901234567', '202410150012', '202410152347'),
  ('987654321098', '678901234567', '202511102031', '202511101956'),
  ('987654321098', '678901234567', '202611051812', '202611051717'),
  ('987654321098', '678901234567', '202812151432', '202812151320'),

  ----------
  -- Richard Stallman 

  -- 6 serviços do Joaquim Gomes
  ('456789012345', '345678912345', '202209102018', '202209101919'),
  ('456789012345', '345678912345', '202212052017', '202212051934'),
  ('456789012345', '345678912345', '202303152135', '202303152018'),
  ('456789012345', '345678912345', '202610152116', '202610152029'),
  ('456789012345', '345678912345', '202404101639', '202404101502'),
  ('456789012345', '345678912345', '202505051248', '202505051109'),

  ----------
  -- Ada Lovelace

  -- 5 serviços da Katarina Nowak
  ('789012345678', '901234567890', '202201151923', '202201151856'),
  ('789012345678', '901234567890', '202203102213', '202203102000'),
  ('789012345678', '901234567890', '202311201015', '202311200818'),
  ('789012345678', '901234567890', '202311200918', '202311200823'),
  ('789012345678', '901234567890', '202408101232', '202408101123'),

  ----------
  -- Alan Turing (4 serviços)

  -- 2 serviços da Xia Peisu
  ('234567890123', '987654398765', '202302151221', '202302151130'),
  ('234567890123', '987654398765', '202305101935', '202305101550'),

  -- 2 serviços do Joaquim Gomes
  ('234567890123', '345678912345', '202410151212', '202410151120'),
  ('234567890123', '345678912345', '202406300516', '202406300315'),

  ----------
  -- Guido van Rossum

  -- 3 serviços da Katarina Nowak
  ('345678901234', '901234567890', '202305152000', '202305151900'),
  ('345678901234', '901234567890', '202308102100', '202308102035'),
  ('345678901234', '901234567890', '202312050000', '202312052246'),

  ----------
  -- Carlos Slim (2 serviços da Olga Petrov)
  ('567890123456', '678901234567', '202203152117', '202203152016'),
  ('567890123456', '678901234567', '202206102033', '202206101923'),

  ----------
  -- Taka Takata 
    
  -- 1 serviço da Katarina Nowak
  ('890123456789', '901234567890', '202303201230', '202303201155')
;
COMMIT;








