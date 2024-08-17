/*
  ___                  _           
 / _ \ _   _  ___ _ __(_) ___  ___ 
| | | | | | |/ _ \ '__| |/ _ \/ __|
| |_| | |_| |  __/ |  | |  __/\__ \
 \__\_\\__,_|\___|_|  |_|\___||___/
*/

-- Usado em c), f)
CREATE VIEW cliPonAvgView AS (
	SELECT pA.nif_cli as nif_cli, ROUND(AVG(conP.pontuacao),1) as avgEstrelas
  FROM conPontua as conP JOIN pedidoAceite as pA ON conP.nif = pA.nif_con
  GROUP BY nif_cli
  ORDER BY avgEstrelas DESC
);

-- Usado em b), m)
CREATE VIEW conVeicPesView AS (
  SELECT cP.nif
  FROM conduzidoPor as cP JOIN veiculo as v ON cP.matricula = v.matricula 
  WHERE v.capacidade = 6
);

COMMIT;

-------------------------------------------------
--> a) "Que condutores tem veículos com capacidade para 6 passageiros ?"
/*


SELECT Pessoa.Nome
FROM Pessoa NATURAL INNER JOIN conVeicPesView
;


*/
-------------------------------------------------
--> b) "Que condutores e clientes fizeram serviços de transporte 
-- de Évora para Montemor em Novembro de 2023?"
/*


SELECT DISTINCT Pessoa.Nome
FROM Pessoa
	JOIN Pedido ON Pedido.nif = Pessoa.nif 
    JOIN pedidoAceite as pA ON pA.nif_cli = Pedido.nif 
    JOIN Servico ON Servico.nif = pA.nif_con --> para dataFim
WHERE pA.dataPedido = Pedido.dataPedido AND 
	  Pedido.origem  like '%Évora%'     AND
	  Pedido.destino LIKE '%Montemor%'  AND (
      	-- SQL --> AND has higher precedence
      	Servico.dataInicio LIKE '202311%' OR 
       	Servico.dataFim    LIKE '202311%'
    )
;


*/
-------------------------------------------------
--> c) "Que clientes têm uma média de 5 estrelas?"
/*


SELECT Pessoa.Nome as nomeCli
FROM Pessoa JOIN cliponavgview ON Pessoa.nif = cliponavgview.nif_cli
WHERE cliponavgview.avgEstrelas >= 4.5
ORDER BY nomeCli 
;


*/
-------------------------------------------------
--> d) "Que condutores nunca fizeram um serviço para Beja?"

 -- FORMA 1 (1.085 + 0.333 = 1.418 ms) - RESPOSTA A CONSIDERAR
  /*


  SELECT DISTINCT Pessoa.Nome as nomeCon
  FROM Pessoa JOIN pedidoAceite as pA ON Pessoa.nif = pA.nif_con

  EXCEPT

  SELECT DISTINCT Pessoa.Nome as nomeCon
  FROM Pessoa 
  	JOIN pedidoAceite as pA ON Pessoa.nif = pA.nif_con
  	JOIN Pedido on Pedido.datapedido = pA.datapedido
  WHERE Pedido.dataPedido = pA.dataPedido AND
  	    Pedido.Destino LIKE '%Beja%'

  ORDER BY nomeCon
  ;


  */
  -- FORMA 2 (1.444 + 0.331 = 1.775 ms)
  /*


  select pessoa.nome
  from pessoa
  where pessoa.nif in (select nif from condutor) and pessoa.nif not in (select pedidoaceite.nif_con
  					                              from pedido, pedidoaceite 
  						                      where pedido.datapedido = pedidoaceite.datapedido and pedido.nif = pedidoaceite.nif_cli and destino like '%Beja');


  */
-------------------------------------------------
--> (e) "Indique os telefones do condutor 
-- que fez um serviço para Viana do Alentejo 
-- para o cliente Manuel Santos em 20/12/2023."

-- Forma 1 (1.420 + 0.321 = 1.741 ms) - RESPOSTA A CONSIDERAR
/*


select distinct telefone
from telefone_cond 
where nif in (select nif_con
			  from pedido, pedidoaceite
			  where pedido.datapedido = pedidoaceite.datapedido and pedido.nif = pedidoaceite.nif_cli and pedido.datapedido like '20231220%' 
			  and pedido.destino like '%Viana do Alentejo' and pedido.nif in (select pessoa.nif from pessoa where pessoa.nome = 'Manuel Santos'))
;


*/
-- Forma 2 (2.791 + 0.393 = 3.184 ms)
/*

--EXPLAIN ANALYSE
SELECT DISTINCT tc.telefone
FROM telefone_cond as tc 
    JOIN pedidoAceite as pA ON tc.nif = pA.nif_con
    JOIN Pedido  on Pedido.datapedido = pA.datapedido 
    JOIN Pessoa  on Pedido.nif = Pessoa.nif
    JOIN Servico on tc.nif = Servico.nif
WHERE Pedido.destino LIKE '%Viana do Alentejo%' AND
	  Pessoa.Nome LIKE 'Manuel Santos' AND (
      	pA.datainicio   LIKE '20231220%' OR
        Servico.datafim LIKE '20231220%'
      )
;


*/
-------------------------------------------------
--> (f) "Para cada cliente indique a média de estrelas que tem."
/*


SELECT Pessoa.Nome as nomeCli, cliponavgview.avgEstrelas 
FROM Pessoa JOIN cliPonAvgView ON Pessoa.nif = cliponavgview.nif_cli
ORDER BY avgEstrelas DESC, nomeCli ASC
;


*/
-------------------------------------------------
--> g) "Para cada Condutor indique o total dos servi¸cos feitos."
/*


SELECT Pessoa.Nome as nome, COUNT(pA.datainicio) as nServicos
FROM Pessoa JOIN pedidoAceite as pA ON pa.nif_con = Pessoa.nif
GROUP BY nome
ORDER BY nServicos DESC
;


*/
-------------------------------------------------
--> h) "Qual é o cliente 
-- que deu a média de estrelas mais alta 
-- ao condutor Joaquim Gomes?"
/*


WITH estrelas_JoaquimGomes AS (
  SELECT cP.nif_cli as nif, ROUND(AVG(cP.pontuacao), 1) as avg_estrelas
  FROM cliPontua AS cP 
  	JOIN Pessoa ON (cP.nif_con = Pessoa.nif AND Pessoa.nome LIKE 'Joaquim Gomes')
  GROUP BY cP.nif_cli
)

SELECT Pessoa.Nome
	FROM Pessoa JOIN estrelas_JoaquimGomes as e_JG ON e_JG.nif = Pessoa.nif
LIMIT 1
;  


*/
-------------------------------------------------
--> i) "Qual é o cliente que teve mais pedidos cancelados?"
/*


WITH 
nPedidos AS (
  SELECT nif, COUNT(dataPedido) as n
  FROM Pedido
  GROUP BY nif
  ORDER BY n DESC
),
nServicos AS (
  SELECT nif_cli as nif, COUNT(dataInicio) as n
  FROM pedidoAceite 
  GROUP BY nif 
  ORDER BY n DESC
),
nCancelados AS (
  SELECT nP.nif as nif, (nP.n - nS.n) as n -- COUNT() retorna zero na ausência de casos  => COALESCE não é necessário
  FROM nPedidos as nP JOIN nServicos as nS ON nP.nif = nS.nif
  ORDER BY n DESC
)

SELECT Pessoa.nome as nome
FROM Pessoa NATURAL INNER JOIN nCancelados 
WHERE n = (SELECT MAX(n) FROM nCancelados)
ORDER BY nome
;


*/
-------------------------------------------------
--> j) "Que condutores podem fazer um serviço 
-- de Évora para Portel no dia 20/12/2023 às 9 horas?"

-- "Hora" interpretada APENAS como hora de começo.
/*


SELECT Pessoa.Nome 
FROM Pessoa 
	JOIN pedidoAceite as pA ON Pessoa.nif = pA.nif_con
  JOIN Pedido ON pA.datapedido = Pedido.datapedido
WHERE Pedido.origem LIKE '%Évora%'AND
	    Pedido.destino LIKE '%Portel%' AND
      pA.datainicio LIKE '2023122009%'
;


*/
-------------------------------------------------
--> k) " Qual foi a origem e o destino do serviço com o valor mais alto em Dezembro de 2023?"

-- Forma 1 (1.109 + 0.221 = 1.330 ms) - RESPOSTA A CONSIDERAR
/*


--EXPLAIN ANALYSE
SELECT P.origem, P.destino, s.valor
FROM Pedido as p
	JOIN pedidoAceite as pA ON p.datapedido = pA.dataPedido
  JOIN Servico as s ON s.dataInicio = pA.dataInicio
WHERE pA.dataInicio LIKE '202312%' OR s.dataFim LIKE '202312%'
ORDER BY s.valor DESC 
LIMIT 1
;


*/
-- Forma 2 (1.422 + 0.328 = 1.750 ms)
/*


SELECT P.origem, P.destino, s.valor
FROM Pedido as p
	JOIN pedidoAceite as pA ON p.datapedido = pA.dataPedido
  JOIN Servico as s ON s.dataInicio = pA.dataInicio
WHERE pA.dataInicio LIKE '202312%' OR s.dataFim LIKE '202312%'
ORDER BY s.valor DESC 
LIMIT 1
;


*/
-------------------------------------------------
--> l) "Qual é o condutor que tem a soma do valor dos serviços 
-- feitos em Novembro de 2023 mais alta?"
/*


SELECT Pessoa.Nome nomeCon, ROUND(SUM(s.valor)::NUMERIC,1) as n
FROM Pessoa NATURAL INNER JOIN Servico as s
WHERE s.dataInicio LIKE '202311%' OR  
      s.dataFim    LIKE '202311%'
GROUP BY Pessoa.Nome
ORDER BY n DESC
LIMIT 1
;


*/
-------------------------------------------------
--> m) "Qual o cliente que teve serviços feitos 
-- por todos os condutores que têm veiculos com
-- capacidade para 6 passageiros?"
/*


SELECT DISTINCT P.Nome as nomeCli
FROM Pessoa as P JOIN pedidoAceite as pA ON P.nif = pA.nif_cli
WHERE not EXISTS (
	SELECT nif FROM conVeicPesView 
  	
  	EXCEPT
  
 	SELECT pedidoAceite.nif_con 
  FROM pedidoAceite
  WHERE pedidoAceite.nif_cli = pA.nif_cli
)
;


*/











    




      


    






