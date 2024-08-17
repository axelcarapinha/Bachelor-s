/*
 _____     _          _           
|_   _|_ _| |__   ___| | __ _ ___ 
  | |/ _` | '_ \ / _ \ |/ _` / __|
  | | (_| | |_) |  __/ | (_| \__ \
  |_|\__,_|_.__/ \___|_|\__,_|___/
                                  
*/

CREATE TABLE Membro (
	Nome VARCHAR(50) NOT NULL,
	IdMemb CHAR(20) CONSTRAINT ChaveMembro PRIMARY KEY,
	Pais VARCHAR(50),
	Cidade VARCHAR(50),
	DataNasc DECIMAL CHECK (DataNasc >= 01011900)
	   --> Pessoas nascidas desde 01/01/1900 (inclusive)
);

CREATE TABLE Amigo (
	IdAmigo1 VARCHAR(20), 
	IdAmigo2 VARCHAR(20),
	CONSTRAINT ChaveAmigo PRIMARY KEY (IdAmigo1, IdAmigo2),
	FOREIGN KEY (IdAmigo1) REFERENCES Membro(IdMemb),
	FOREIGN KEY (IdAmigo2) REFERENCES Membro(IdMemb)
);

CREATE TABLE Livro (
	ISBN DECIMAL(13) CONSTRAINT ChaveLivro PRIMARY KEY,
	Titulo VARCHAR(50) NOT NULL
);

CREATE TABLE Gosta (
	GostaIdMemb VARCHAR(20) NOT NULL, --> NOT NULL porque é boa prática, mesmo que faça parte da chave
	GostaISBN DECIMAL(13) NOT NULL, 
	CONSTRAINT ChaveGosta PRIMARY KEY (GostaIdMemb, GostaISBN),
	FOREIGN KEY (GostaIdMemb) REFERENCES Membro(IdMemb),
	FOREIGN KEY (GostaISBN) REFERENCES Livro(ISBN)
);

CREATE TABLE Genero (
	GeneroISBN DECIMAL(13) NOT NULL, 
	Genero VARCHAR(20) NOT NULL,
	CONSTRAINT ChaveGenero PRIMARY KEY (GeneroISBN, Genero),
	FOREIGN KEY (GeneroISBN) REFERENCES Livro (ISBN)
);

CREATE TABLE Autor (
	Coda VARCHAR(20) CONSTRAINT ChaveAutor PRIMARY KEY,
	Nome VARCHAR(50) NOT NULL,
	Pais VARCHAR(50)
);

CREATE TABLE Autoria (
	AutoriaISBN DECIMAL(13) NOT NULL,
	AutoriaCoda VARCHAR(20) NOT NULL,
	CONSTRAINT ChaveAutoria PRIMARY KEY (AutoriaISBN, AutoriaCoda),
	FOREIGN KEY (AutoriaISBN) REFERENCES Livro(ISBN),
	FOREIGN KEY (AutoriaCoda) REFERENCES Autor (Coda)
);

COMMIT;


/*
 ____            _           
|  _ \  __ _  __| | ___  ___ 
| | | |/ _` |/ _` |/ _ \/ __|
| |_| | (_| | (_| | (_) \__ \
|____/ \__,_|\__,_|\___/|___/
*/

--> Alínea a)
INSERT INTO Membro (Nome, IdMemb, Pais, Cidade, DataNasc) VALUES

	-- Leitores
	 ('Alan Turing',      'alanturing',         'United Kingdom',  'London',           19120623)
	,('Grace Hopper',     'gracehopper',        'United States',   'Washington, D.C.', 19060912)
	,('Tim Berners-Lee',  'timbernerslee',      'United Kingdom',  'Lisboa',           19550806)
	,('Ada Lovelace',     'adalovelace',        'United Kingdom',  'London',           18151210)
	,('Linus Torvalds',   'linustorvaldsoffic', 'Finland',         'Helsinki',         19691228)
	,('Donald Knuth',     'donaldknuth',        'United States',   'Milwaukee',        19380110)
	,('Shafi Goldwasser', 'shafigoldwasser',    'Israel',          'Luanda',           19580411)
	,('Edsger Dijkstra',  'edsgerdijkstra',     'Netherlands',     'Porto',            19300511)
	,('John von Neumann', 'johnvonneumann',     'Hungary',         'Évora',            19031228)
	,('Barbara Liskov',   'barbaraliskov',      'United States',   'Elvas',            19351107)
	,('Dennis Ritchie',   'dennisritchie',      'United States',   'Bronxville',       19410909)
	,('Adele Goldberg',   'adelegoldberg',      'United States',   'Évora',            19451007)
	,('Vint Cerf',        'vintcerf',           'United States',   'Aveiro',           19430623)
	,('Ken Thompson',     'kenthompson',        'United States',   'Évora',            19430204)
	,('Claude Shannon',   'claudeshannon',      'Germany',         'Berlin',           19780816)
	,('Fay Weldon',       'fayweldon',          'United Kingdom',  'Rome',             19310922)
	,('Ole-Johan Dahl',   'olejohandahl',       'Norway',          'Mandal',           19301012)
	,('Kristen Nygaard',  'kristennygaard',     'Norway',          'Elvas',            19260627)
	,('Andrei Năstase',   'andreinastase',      'Moldova',         'Chișinău',         19750206)
	,('Elon Musk',        'elonmusk',           'United States',   'Aveiro',           19710628)
	,('José Saramago',    'oleitor',            'Portugal',        'Azinhaga',         19221116)

	-- Escritores (também registados como membros)
	-- ,('Axel C.',          'axelc',              'Portugal',        'Évora',            20030419)
	-- ,('Leonel C.',        'leonelc',            'Angola',          'Évora',            20000820) 
	-- ,('Robert M.',        'uncleb',             'United States',   'Porto',            19521205)
	-- ,('Agatha C.', 	      'agathac',            'England',         'Greenway',         18900915)
	-- ,('Edgar C.',         'edgarc',             'England',         'Lisbon',           19230819)
	-- ,('Francisco V.',     'franciscov',  	    'Portugal',        'Estoril',          19620314) 
;
COMMIT;

-------------------------------------------------------------------------------
--> Alínea b)

INSERT INTO Livro (ISBN, Titulo) VALUES
	 (9781926751092, 'Program in C - The Musical')
	,(9781516731092, 'The 3 hidden towers of Verney')
	,(9781753957092, 'The Unexpected Guest')
	,(9781236528092, 'Python: o assassino da velocidade') 
	,(9781165456092, 'Why you should use VIM as your editor')
	,(9781123794092, 'Computer science JOKES for begginers')
	,(9781696457092, 'Solving the octagon - a CES mistery')
	,(9781349167092, 'Cryptography - the 101')
	,(9781741859092, 'Graphical Model and the cursed child')
	,(9781369163092, 'MySQL VS PostgreSQL - detailed comparision')
	,(9781846163092, 'A Luz de Pequim')
;
COMMIT;

INSERT INTO Autor (Coda, Nome, Pais) VALUES
	 ('axelcarapinha',   'Axel A. Carapinha',     'Portugal')       
	,('leonelcaetano',   'Leonel Caetano',        'Angola')         
	,('unclebob',        'Robert C. Martin',      'United States')  
	,('agathachristie',  'Agatha Christie',       'England')        
	,('edgarfcodd',      'Edgar F. Codd',         'England')        
	,('franciscoviegas', 'Francisco José Viegas', 'Portugal')       
;
COMMIT;

INSERT INTO Autoria (AutoriaISBN, AutoriaCoda) VALUES
	--> Program in C - The Musical
	 (9781926751092, 'axelcarapinha') 
	,(9781926751092, 'leonelcaetano') 
	,(9781926751092, 'unclebob') 
	
	--> The 3 hidden towers of Verney
	,(9781516731092, 'axelcarapinha')
	,(9781516731092, 'franciscoviegas') 
	
	--> The Unexpected Guest
	,(9781753957092, 'agathachristie') 
	
	--> Python: o assassino da velocidade
	,(9781236528092, 'leonelcaetano') 
	,(9781236528092, 'agathachristie') 
	,(9781236528092, 'axelcarapinha') 
	
	--> Why you should use VIM as your editor
	,(9781165456092, 'edgarfcodd') 
	,(9781165456092, 'unclebob') 
	
	--> Computer science JOKES for begginers
	,(9781123794092, 'leonelcaetano') 
	,(9781123794092, 'axelcarapinha') 
	
	--> Solving the octagon - a CES mistery
	,(9781696457092, 'agathachristie') 
	,(9781696457092, 'axelcarapinha') 
	,(9781696457092, 'franciscoviegas')
	
	--> Cryptography - the 101
	,(9781349167092, 'axelcarapinha') 
	
	--> Graphical Model and the cursed child
	,(9781741859092, 'agathachristie') 
	
	--> MySQL VS PostgreSQL - detailed comparision
	,(9781369163092, 'leonelcaetano') 
	,(9781369163092, 'edgarfcodd') 
	
	--> A Luz de Pequim
	,(9781846163092, 'franciscoviegas')
;
COMMIT;

INSERT INTO Genero (GeneroISBN, Genero) VALUES 
	--> Program in C - The Musical
	 (9781926751092, 'Comedy')
	,(9781926751092, 'Non-fiction')
	
	--> The 3 hidden towers of Verney
	,(9781516731092, 'Adventure')
	,(9781516731092, 'Mistery')
	,(9781516731092, 'Romance')
	
	--> The Unexpected Guest
	,(9781753957092, 'Crime')
	,(9781753957092, 'Suspense')
	
	--> Python: o assassino da velocidade
	,(9781236528092, 'Crime')
	,(9781236528092, 'Science Fiction')
	,(9781236528092, 'Drama')
	
	--> Why you should use VIM as your editor
	,(9781165456092, 'Non-fiction')
	,(9781165456092, 'Education')
	
	-->Computer science jokes for begginers
	,(9781123794092, 'Non-fiction')
	,(9781123794092, 'Humor')
	
	--> Solving the octagon - a CES mistery
	,(9781696457092, 'Suspense')
	,(9781696457092, 'Adventure')
	,(9781696457092, 'Romance')
	
	--> Cryptography - the 101
	,(9781349167092, 'Non-fiction')
	,(9781349167092, 'Education')
	
	--> Graphical Model and the cursed child
	,(9781741859092, 'Mistery')
	,(9781741859092, 'Thriller')
	
	--> MySQL VS PostgreSQL - detailed comparision
	,(9781369163092, 'Non-fiction')
	,(9781369163092, 'History')
	,(9781369163092, 'Education')
	
    --> A Luz de Pequim
	,(9781846163092, 'Romance')
;
COMMIT;

-------------------------------------------------------------------------------
--> Alínea c)

INSERT INTO Amigo (IdAmigo1, IdAmigo2) VALUES
	--> Pelo menos 3 amigos (1/5)
	 ('alanturing', 'adalovelace')
	,('alanturing', 'edsgerdijkstra')
	,('alanturing', 'kristennygaard')
	
	,('gracehopper', 'kenthompson')
	
	--> Pelo menos 3 amigos (2/5)
	,('adalovelace','elonmusk')
	,('adalovelace','gracehopper')
	,('adalovelace','vintcerf')
	
	--> Amigo 1/2 de 'oleitor'
	,('adalovelace','oleitor')
	
	--> Utilizador que é amigo de todos os outros utilizadores
	--> Pelo menos 3 amigos (3/5)
	,('linustorvaldsoffic','alanturing')
	,('linustorvaldsoffic','gracehopper')
	,('linustorvaldsoffic','timbernerslee')
	,('linustorvaldsoffic','adalovelace')
	,('linustorvaldsoffic','donaldknuth')
	,('linustorvaldsoffic','shafigoldwasser')
	,('linustorvaldsoffic','edsgerdijkstra')
	,('linustorvaldsoffic','johnvonneumann')
	,('linustorvaldsoffic','barbaraliskov')
	,('linustorvaldsoffic','dennisritchie')
	,('linustorvaldsoffic','adelegoldberg')
	,('linustorvaldsoffic','vintcerf')
	,('linustorvaldsoffic','kenthompson')
	,('linustorvaldsoffic','claudeshannon')
	,('linustorvaldsoffic','fayweldon')
	,('linustorvaldsoffic','olejohandahl')
	,('linustorvaldsoffic','kristennygaard')
	,('linustorvaldsoffic','andreinastase')
	,('linustorvaldsoffic','elonmusk')

	-- Amigo 2 / 3 de 'oleitor'
	,('linustorvaldsoffic','oleitor')
	
	
	--> Pelo menos 3 amigos (4/5)
	,('donaldknuth', 'claudeshannon')
	,('donaldknuth', 'kristennygaard')
	,('donaldknuth', 'johnvonneumann')
	,('donaldknuth', 'adalovelace')
	
	--> Pelo menos 3 amigos (5/5)
	,('shafigoldwasser', 'fayweldon')
	,('shafigoldwasser', 'elonmusk')
	,('shafigoldwasser', 'vintcerf')
	
	,('edsgerdijkstra', 'gracehopper')
	
	,('johnvonneumann', 'kristennygaard')
	,('johnvonneumann', 'edsgerdijkstra')
	
	--> Amigo 3/3 de 'oleitor'
	,('oleitor', 'vintcerf')	
;
COMMIT;

-------------------------------------------------------------------------------
-- Alínea d)
INSERT INTO Gosta (GostaIdMemb, GostaISBN) VALUES
	 ('alanturing',         9781926751092) --> Program in C - The Musical
	
	,('gracehopper',        9781926751092) --> Program in C - The Musical
	
	,('timbernerslee',      9781165456092) --> Why you should use VIM as your editor

	,('adalovelace',        9781369163092) --> MySQL VS PostgreSQL - detailed comparision

	,('linustorvaldsoffic', 9781516731092) --> The 3 Hidden Towers of Verney
	,('linustorvaldsoffic', 9781369163092) --> MySQL VS PostgreSQL - detailed comparision

	,('donaldknuth',        9781516731092) --> The 3 Hidden Towers of Verney
	,('donaldknuth',        9781696457092) --> Solving the octagon - a CES mistery

	,('shafigoldwasser',    9781349167092) --> Cryptography: the 101
	,('shafigoldwasser',    9781753957092) --> The Unexpected Guest
	
	,('edsgerdijkstra',     9781753957092) --> The Unexpected Guest
	,('edsgerdijkstra',     9781349167092) --> Cryptography: the 101
	,('edsgerdijkstra',     9781696457092) --> Solving the octagon - a CES mistery
	,('edsgerdijkstra',     9781741859092) --> Graphical Model and the Cursed child

	--> Membro que gosta de todos os livros de um autor (Agatha Christie, neste caso)
	,('johnvonneumann',     9781753957092) --> The Unexpected Guest
	,('johnvonneumann',     9781236528092) --> Python: o assassino da velocidade
	,('johnvonneumann',     9781696457092) --> Solving the octagon - a CES mistery
	,('johnvonneumann',     9781741859092) --> Graphical Model and the cursed child

	,('barbaraliskov',      9781926751092) --> Program in C - The Musical
	,('barbaraliskov',      9781753957092) --> The Unexpected Guest
	,('barbaraliskov',      9781846163092) --> A Luz de Pequim

	,('dennisritchie',      9781123794092) --> Computer Science JOKES for begginers
    
	,('adelegoldberg',      9781349167092) --> Cryptography: the 101

	,('vintcerf',           9781926751092) --> Program in C - The Musical
	,('vintcerf',           9781369163092) --> MySQL VS PostgreSQL - detailed comparision

	,('kenthompson',        9781369163092) --> MySQL VS PostgreSQL - detailed comparision

	,('claudeshannon',      9781236528092) --> Python: o assassino da velocidade
	,('claudeshannon',      9781846163092) --> A Luz de Pequim
	
	,('fayweldon',          9781741859092) --> Graphical model and the cursed child
	
	,('olejohandahl',       9781369163092) --> MySQL VS PostgreSQL - detailed comparision
	
	,('kristennygaard',     9781741859092) --> Graphical Model and the cursed child
	
	,('andreinastase',      9781753957092) --> The Unexpected Guest

	,('elonmusk',           9781696457092) --> Solving the octagon - a CES mistery
	,('elonmusk',           9781753957092) --> The Unexpected Guest

	,('oleitor',            9781516731092) --> The 3 hidden towers of Verney
	,('oleitor',            9781696457092) --> Solving the octagon - a CES mistery
	,('oleitor',            9781741859092) --> Graphical Model and the cursed child
	,('oleitor', 		    9781846163092) --> A Luz de Pequim
	,('oleitor', 	        9781753957092) --> The Unexpected Guest
;
COMMIT;
