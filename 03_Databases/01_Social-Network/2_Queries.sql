/*
  ___                  _           
 / _ \ _   _  ___ _ __(_) ___  ___ 
| | | | | | |/ _ \ '__| |/ _ \/ __|
| |_| | |_| |  __/ |  | |  __/\__ \
 \__\_\\__,_|\___|_|  |_|\___||___/
*/    


CREATE VIEW AgathaISBNs as (
	SELECT AutoriaISBN as ISBN
	FROM Autoria JOIN Autor ON AutoriaCoda = Autor.Coda
	WHERE Autor.Nome = 'Agatha Christie'
);

-- Usada em b), d), g), h)
CREATE VIEW GostaAgatha AS (
	SELECT DISTINCT GostaIdMemb as IdMemb
 	FROM Gosta JOIN AgathaISBNs ON GostaISBN = AgathaISBNs.ISBN
);

----------------------------	
-- Usada em e), f), i), q)
CREATE VIEW AmigosOleitor AS (
	SELECT IdAmigo1 AS IdMemb
	FROM Amigo 
	WHERE IdAmigo2 = 'oleitor'
	   
	UNION
	   	
	SELECT IdAmigo2 AS IdMemb
	FROM Amigo 
	WHERE IdAmigo1 = 'oleitor'
);

----------------------------	
CREATE VIEW FranciscoISBNs as (
	SELECT AutoriaISBN as ISBN
	FROM Autoria JOIN Autor ON AutoriaCoda = Autor.Coda
	WHERE Autor.Nome = 'Francisco José Viegas'
);

-- Usada em g), h)
CREATE VIEW GostaFrancisco AS (
	SELECT DISTINCT GostaIdMemb as IdMemb
 	FROM Gosta JOIN FranciscoISBNs ON GostaISBN = FranciscoISBNs.ISBN
);

----------------------------	
-- Usada em l), m), n)
CREATE VIEW  LivrosStats AS (
	SELECT l.ISBN as ISBN,
		   l.Titulo,
		   COUNT(DISTINCT Genero.Genero)     as numGeneros,
		   COUNT(DISTINCT Gosta.GostaIdMemb) as numGostos
	FROM Livro AS l, Genero, Gosta
	WHERE l.ISBN = GeneroISBN AND
  		  l.ISBN = GostaISBN
	GROUP BY ISBN
	ORDER BY ISBN
);

----------------------------	
CREATE VIEW AmigosSimetrico AS (
  SELECT IdAmigo1 as IdMemb, IdAmigo2 as Idamigo
  FROM Amigo 
  
  UNION
  
  SELECT idamigo2 as IdMemb, IdAmigo1 as idAmigo
  FROM Amigo 
);

-- Usada em o), p)
CREATE VIEW numAmigos AS (
	SELECT idmemb, COUNT(Idamigo) as  n
	FROM AmigosSimetrico
	GROUP BY idmemb
	ORDER BY n DESC
);

COMMIT;

-------------------------------------
-------------------------------------
-------------------------------------
--> a) "Qual é o nome dos autores de obras do género drama?"
/*


SELECT Autor.Nome
FROM Autor, Autoria, Genero 
WHERE 
	Genero     = 'Drama'     AND 
	GeneroISBN = AutoriaISBN AND 
	Coda       = AutoriaCoda
ORDER BY Nome
;


*/

-------------------------------------
--> b) "Qual o nome dos membros que gostam de livros da Agatha Christie?"
/*


SELECT Membro.nome 
FROM Membro 
WHERE Membro.IdMemb IN (SELECT IdMemb from GostaAgatha)
ORDER BY Nome
;

*/

-------------------------------------
--> c) "Qual o nome dos membros que gostam de um livro 
--> 	de um autor que nasceu no seu país?"
/*


SELECT DISTINCT Membro.nome 
FROM Membro, Gosta, Autor, Autoria
WHERE 
	Membro.IdMemb       = GostaIdMemb AND
	Autoria.autoriaisbn = GostaISBN   AND
	AutoriaCoda = Autor.Coda AND
	Membro.Pais = Autor.Pais 
ORDER BY Nome
;

*/

-------------------------------------
--> d) "Quais os membros que NÃO gostam de algum livro da Agatha Christie?"
/*


SELECT Membro.nome 
FROM Membro 
WHERE Membro.IdMemb NOT IN (SELECT IdMemb from GostaAgatha)
ORDER BY Nome
;

*/

-------------------------------------
--> e) "Quais os membros que NÃO são amigos do membro que com o idMemb oleitor?"
/*


SELECT Membro.nome
FROM Membro
WHERE Membro.IdMemb NOT IN (SELECT IdMemb FROM AmigosOleitor)
ORDER BY Nome
;


*/

-------------------------------------
--> f) "Qual o nome dos amigos do oleitor que são mais jovens que ele?"
/*


SELECT DISTINCT m1.Nome
FROM Membro AS m1
	INNER JOIN Membro AS m2  ON m1.DataNasc > m2.DataNasc
	INNER JOIN AmigosOleitor ON m1.IdMemb = AmigosOleitor.IdMemb
WHERE m2.IdMemb = 'oleitor'
;


*/
-------------------------------------
--> g) "Qual o nome dos membros que gostam de livros da Agatha Christie
--> 	E do Francisco José Viegas?"
/*


SELECT Membro.nome 
FROM Membro JOIN GostaAgatha ON Membro.IdMemb = GostaAgatha.IdMemb

INTERSECT

SELECT Membro.nome
FROM Membro JOIN GostaFrancisco ON Membro.IdMemb = GostaFrancisco.IdMemb

ORDER BY Nome
;

*/
      
-------------------------------------
--> h) "Qual o nome dos membros que gostam de livros da Agatha Christie
--> 	OU do Francisco José Viegas?"
/*


SELECT Membro.nome 
FROM Membro JOIN GostaAgatha ON Membro.IdMemb = GostaAgatha.IdMemb

UNION

SELECT Membro.nome
FROM Membro JOIN GostaFrancisco ON Membro.IdMemb = GostaFrancisco.IdMemb

ORDER BY Nome
;


*/

-------------------------------------
--> i) "Quantos amigos tem o membro oleitor?"
/*


SELECT COUNT(IdMemb) 
FROM AmigosOleitor
;

*/

-------------------------------------
--> j) "Qual é o membro que tem mais amigos?"
/*


WITH MembroMaisAmigos AS (
	SELECT IdMemb, n
	FROM NumAmigos
	ORDER BY n DESC
	LIMIT 1
)

SELECT Membro.Nome
FROM Membro JOIN MembroMaisAmigos ON Membro.IdMemb = MembroMaisAmigos.IdMemb
;


*/

-------------------------------------
--> k) "Qual o nome dos membros que são amigos do membro que gosta de mais livros?"
/*


WITH MaiorFaLivros AS (
	SELECT Membro.IdMemb as IdMemb, COUNT(GostaISBN) as n
  	FROM Membro JOIN Gosta ON Membro.IdMemb = GostaIdMemb
  	GROUP BY IdMemb
  	ORDER BY n DESC
  	LIMIT 1
)

SELECT Membro.Nome as Nome
FROM Membro 
	JOIN Amigo ON Membro.IdMemb = IdAmigo1
	JOIN MaiorFaLivros ON IdAmigo2 = MaiorFaLivros.IdMemb
    
UNION

SELECT Membro.Nome as Nome
FROM Membro 
	JOIN Amigo ON Membro.IdMemb = IdAmigo2
	JOIN MaiorFaLivros ON IdAmigo1 = MaiorFaLivros.IdMemb
;


*/

-------------------------------------
--> l) "Para cada livro, indique o número de géneros."
/*


SELECT Titulo, numGeneros
FROM LivrosStats
ORDER BY Titulo DESC, numGeneros DESC
;

*/

-------------------------------------
--> m) "Para cada livro, indique o número de géneros e o número de gostos."
/*


SELECT Titulo, numGeneros, numGostos
FROM LivrosStats
ORDER BY numGeneros
;

*/

-------------------------------------
--> n) "Para cada autor, indique 
--	    o número de livros,
-- 		o número de géneros
--      e o número de gostos."
/*


WITH GenerosAutores AS (
	SELECT DISTINCT AutoriaCoda as Coda, Genero
	FROM Autoria INNER JOIN Genero ON AutoriaISBN = GeneroISBN
	ORDER BY Coda
)

SELECT Autor.Nome as Autor
      ,COUNT(DISTINCT AutoriaISBN) as NumLivros
      ,COUNT(DISTINCT GenerosAutores.Genero) AS NumGeneros
      ,SUM(DISTINCT numGostos) as NumGostos
FROM Autoria
	INNER JOIN Autor          ON AutoriaCoda = Autor.Coda
    INNER JOIN GenerosAutores ON AutoriaCoda = GenerosAutores.Coda
	INNER JOIN LivrosStats    ON AutoriaISBN = LivrosStats.ISBN
GROUP BY Autor
ORDER BY Autor
;


*/

-------------------------------------
--> o) "Para cada membro, nome, indique 
--	   o número de amigos e 
--     o número de livros de que gosta."
/* 


SELECT Membro.Nome 
	  ,NumAmigos.n as NumAmigos
	  ,COUNT(GostaISBN) as NumLivrosGosta
FROM Membro
	INNER JOIN NumAmigos ON Membro.IdMemb = NumAmigos.IdMemb
	INNER JOIN Gosta       ON Membro.IdMemb = GostaIdMemb
GROUP BY Nome, NumAmigos
ORDER BY numLivrosGosta DESC
;


*/

-------------------------------------
--> p) "Qual o nome dos membros que são amigos de todos os membros?"
/*


WITH AmigosTodosMembros AS (
	Select IdMemb 
	FROM NumAmigos 
		INNER JOIN (SELECT COUNT(Membro.IdMemb) - 1 as NumMembros FROM Membro)
    	ON n = NumMembros
)

SELECT Membro.nome
FROM Membro NATURAL JOIN AmigosTodosMembros 
;


*/

-------------------------------------
--> q) "Quais os títulos dos livros de que todos os amigos do leitor gostam?"
/*


SELECT Titulo
FROM Livro as l
WHERE NOT EXISTS (
	SELECT IdMemb FROM AmigosOleitor
  
  	EXCEPT
  
  	SELECT GostaIdMemb 
  	FROM Gosta
  	WHERE GostaIsbn = l.Isbn
)
;


*/