# Questão 2

## Entidades 

Pessoa (<u>nif</u>, nome, residencia)
Cliente (<u>nif</u>, telefone, numCartCred)

Condutor (<u>nif</u>, numCartCond, nib, nacionalidade, matricula)
telefone_cond(<u>telefone</u>, <u>nif</u>)
matricula_cond(<u>matricula</u>, <u>nif</u>)

Veiculo (<u>matricula</u>, capacidade, categoria)
Pedido (<u>dataPedido</u>, <u>nif</u>, origem, destino)
Servico(<u>dataInicio</u>, <u>nif</u>, dataFim, custo) 

## Relações
cliPontua  (<u>dataInicio</u>, <u>nif_con</u>, nif_cli, pontuacao)
conPontua (<u>dataInicio</u>, <u>nif</u>, pontuacao)
conduzidoPor (<u>matricula</u>, nif)
pedidoAceite(data, nif_cli, <u>dataInicio</u>, <u>nif_con</u>)

Não se necessita de representar as relações pedidoPor e fezServiço
dado que são relações fracas

---
# Questão 3

## (1 / 12) Pessoa
Cada pessoa tem um e um só nome.
(nif -> nome)

Cada pessoa tem uma e uma só residência registada na base de dados.
(nif -> residencia)

Cada pessoa tem um e um só NIF.  

## (2 / 12) Cliente
Um cliente tem um e um só telefone.
(nif -> telefone)

Um telefone não pode estar associado a mais do que um cliente.
(telefone -> nif)

Um cliente apenas tem apenas um cartão de credito associado.
(nif -> numCartCred) 

Um cartão de crédito pode ser usado por mais do que um cliente.

## (3 / 12) Condutor
Um condutor tem uma e uma só carta de condução.
(nif -> numCartCond)

Uma carta de condução pertence a um e um só condutor.
(numCartCond -> nif)

Um condutor tem um e um só NIB.
(numCartCond -> nib)

Não pode haver dois condutores com o mesmo NIF.
(nib -> numCartCond)

Um condutor apenas pode ter uma nacionalidade associada.
(numCartCond -> nacionalidade)

Um condutor pode ter mais do que um veículo

## (4 / 12) telefone_cond
Cada telefone apenas pode estar associado a um condutor.
(telefone -> numCartCond)

## (5 / 12) matricula_cond 
Uma matrícula apenas pode estar associada a um condutor.
(matricula -> numCartCond)

Um condutor pode ter mais do que um telefone.

## (6 / 12) Veículo
Um veículo apenas pode ter uma capacidade.
(matricula -> capacidade)

Um veículo apenas pode pertencer a uma categoria.
(matricula -> categoria)

## (7 / 12) Pedido
Podem haver dois clientes a fazer um mesmo pedido.

Cada pedido de um cliente apenas se pode referir a uma data.
(nif dataPedido -> origem, destino)

Pode haver mais do que um passageiro, mas apenas um cliente faz o pedido.

## (8 / 12) Servico
Cada serviço apenas pode ter um condutor associado numa certa data.
(dataInicio, nif -> dataFim, custo)

## (9 / 12) cliPontua
Cada condutor pode ser pontuado quanto a um serviço apenas uma vez.
(nif_con, dataInicio -> nif_cli, pontuacao)

Cada cliente pode pontuar um serviço apenas uma vez.
(nif_cli, dataInicio -> nif_con, pontuacao)

## (10 / 12) conPontua
Cada condutor pode ser pontuado quanto a um serviço apenas uma vez)
(dataInicio, nif -> pontuacao)

## (11 / 12) conduzidoPor
Cada veiculo deve estar associado apenas a um condutor. 
(matricula -> nif)

Um condutor pode ter mais do que um veículo.

## (12 / 12) pedidoAceite
Cada serviço apenas pode derivar de um pedido.
(dataInicio, nif_con -> data, nif_cli)


---
# Questão 4 

## (1 / 12) Pessoa
(1) nif -> nome
(2) nif -> residencia

### União de 1 e 2
nif -> nome residencia

### Retirar atributos extra à direita (se houver)
nome é extra à direita?
F' = F - {nif -> nome residencia} + {nif -> residencia}
(nif)+ = residencia
Não inclui nome, logo nome não é extra à direita

residencia é extra à direita?
F' = F - {nif -> nome residencia} + {nif -> nome}
(nif)+ = nome
Não inclui residencia, logo residencia não é extra à direita

### Fica:
nif -> nome residencia

## (2 / 12) Cliente
(1) nif -> telefone
(2) telefone -> nif
(3) nif -> numCartCred

### União de 1 e 3
nif -> telefone numCartCred

### Retirar atributos extra à direita (se houver)
telefone é extra à direita?
F' = F - {nif -> telefone numCartCred} + {nif -> numCartCred}
(nif)+ = numCartCred
Não inclui telefone, logo telefone não é extra à direita

numCartCred é extra à direita?
F' = F - {nif -> telefone numCartCred} + {nif -> telefone}
(nif)+ = telefone
Não inclui numCartCred, logo numCartCred não é extra à direita

### Fica:
nif -> telefone numCartCred
telefone -> nif

## (3 / 12) Condutor
(1) nif -> numCartCond
(2) numCartCond -> nif
(3) numCartCond -> nib
(4) nib -> numCartCond
(5) numCartCond -> nacionalidade

### União de 2 e 3
numCartCond -> nif nib

### Retirar atributos extra à direita (se houver)
nib é extra à direita?
F' = F - {numCartCond -> nif nib} + {numCartCond -> nif}
(numCartCond)+ = nif
Não inclui nib, logo nib não é extra à direita

nif é extra à direita?
F' = F - {numCartCond -> nif nib} + {numCartCond -> nib}
(numCartCond)+ = nib
Não inclui nif, logo nif não é extra à direita

### Fica:
numCartCond -> nif nib
nif -> numCartCond
nib -> numCartCond
numCartCond -> nacionalidade

## (4 /12) telefone_cond
telefone -> numCartCond

Apenas tem uma dependência, logo o conjunto de dependências funcionais desta relação já está na forma canónica.

### Fica:
telefone -> numCartCond


## (5 /12) matricula_cond 
matricula -> numCartCond

Apenas tem uma dependência, logo o conjunto de dependências funcionais desta relação já está na forma canónica.

### Fica:
matricula -> numCartCond

## (6 /12) Veículo
(1) matricula -> capacidade
(2) matricula -> categoria

### União de 1 e 2
matricula -> capacidade categoria

### Retirar atributos extra à direita (se houver)
capacidade é extra à direita?
F' = F - {matricula -> capacidade categoria} + {matricula -> categoria}
(matricula)+ = categoria
Não inclui capacidade, logo capacidade não é extra à direita

categoria é extra à direita?
F' = F - {matricula -> capacidade categoria} + {matricula -> capacidade}
(matricula)+ = capacidade
Não inclui categoria, logo categoria não é extra à direita

### Fica:
matricula -> capacidade categoria

## (7 / 12) Pedido
nif dataPedido -> origem, destino
É a única dependência funcional, logo F já se encontra na forma canónica.

## (8 / 12) Servico
dataInicio, nif -> dataFim, custo
É a única dependência funcional, logo F já se encontra na forma canónica.

## (9 / 12) cliPontua
(1) nif_con, dataInicio -> nif_cli, pontuacao
(2) nif_cli, dataInicio -> nif_con, pontuacao

### Retirar atributos extra à ESQUERDA em 1 (se houver)
Em 1...
nif_con é extra à esquerda?
(dataInicio)+ = dataInicio
Não inclui nif_cli nem pontuacao, logo nif_con não é extra aqui

dataInicio é extra à esquerda?
(nif_con)+ = nif_con
Não inclui nif_cli nem pontuacao, logo dataInicio não é extra aqui

Em 2...
nif_cli é extra à esquerda?
(dataInicio)+ = dataInicio
Não inclui nif_con nem pontuacao, logo nif_cli não é extra aqui

dataInicio é extra à esquerda?
(nif_cli)+ = nif_cli
Não inclui nif_con nem pontuacao, logo dataInicio não é extra aqui

### Retirar atributos extra à DIREITA em 1 (se houver)
Em 1...
nif_cli é extra à direita?
F' = F - {nif_con, dataInicio -> nif_cli, pontuacao} + {nif_con, dataInicio -> pontuacao}
(nif_con, dataInicio)+ = pontuacao
Não inclui nif_cli, logo nif_cli não é extra à direita

pontuacao é extra à direita?
F' = F - {nif_con, dataInicio -> nif_cli, pontuacao} + {nif_con, dataInicio -> nif_cli}
(nif_con, dataInicio)+ = nif_cli
Não inclui pontuacao, logo pontuacao não é extra à direita

Em 2...
nif_con é extra à direita?
F' = F - {nif_cli, dataInicio -> nif_con, pontuacao} + {nif_cli, dataInicio -> pontuacao}
(nif_cli, dataInicio)+ = pontuacao
Não inclui nif_con, logo nif_con não é extra à direita

pontuacao é extra à direita?
F' = F - {nif_cli, dataInicio -> nif_con, pontuacao} + {nif_cli, dataInicio -> nif_con}
(nif_cli, dataInicio)+ = nif_con
Não inclui pontuacao, logo pontuacao não é extra à direita

### Fica:
nif_con, dataInicio -> nif_cli, pontuacao
nif_cli, dataInicio -> nif_con, pontuacao

## (10 / 12) conPontua
dataInicio, nif -> pontuacao
É a única dependência funcional, logo F já se encontra na forma canónica.

## (11 / 12) conduzidoPor
matricula -> nif
É a única dependência funcional, logo F já se encontra na forma canónica.

## (12 / 12) pedidoAceite
dataInicio, nif_con -> data, nif_cli
É a única dependência funcional, logo F já se encontra na forma canónica.


---
# Questão 5

## (1 / 12) Pessoa
nif -> nome residencia

(nif)+ = nif, nome, residencia = Pessoa
Logo, Pessoa está na BCNF

## (2 / 12) Cliente
nif -> telefone numCartCred
telefone -> nif

(nif)+ = nif, telefone, numCartCred = Cliente
(telefone)+ = telefone, nif, numCartCred = Cliente
Todos as dep. func. têm o lado esquerdo superchave, logo Cliente está na BCNF

## (3 / 12) Condutor
numCartCond -> nif nib
nif -> numCartCond
nib -> numCartCond
numCartCond -> nacionalidade

(nif)+ = nif, numCartCond, nib, nacionalidade = Condutor
(nib)+ = nib, numCartCond, nif, nacionalidade = Condutor
(numCartCond)+ = numCartCond, nif, nib, nacionalidade = Condutor

Todos as dep. func. têm o lado esquerdo superchave, 
logo Condutor está na BCNF

## (4 /12) telefone_cond
telefone -> numCartCond
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (5 /12) matricula_cond 
matricula -> numCartCond
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (6 /12) Veículo
matricula -> capacidade categoria
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (7 / 12) Pedido
nif dataPedido -> origem, destino
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (8 / 12) Servico
dataInicio, nif -> dataFim, custo
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (9 / 12) cliPontua
nif_con, dataInicio -> nif_cli, pontuacao
nif_cli, dataInicio -> nif_con, pontuacao

(nif_con, dataInicio)+ = nif_con, dataInicio, nif_cli, pontuacao = cliPontua
(nif_cli, dataInicio)+ = nif_cli, dataInicio, nif_con, pontuacao = cliPontua

Todos as dep. func. têm o lado esquerdo superchave, 
logo cliPontua está na BCNF

## (10 / 12) conPontua
dataInicio, nif -> pontuacao
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (11 / 12) conduzidoPor
matricula -> nif
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF

## (12 / 12) pedidoAceite
dataInicio, nif_con -> data, nif_cli
É uma dep. func. trivial (e única da relação), logo telefone_cond está na BCNF


---
# Questão 6

Todas as dependências de cada relação podem ser verificadas na mesma, dado que cada relação possui os atributos pertencentes a estas.
Portanto, não é necessário colocar-se na 3NF.

---
# Questão 7

## (1 / 12) Pessoa (<u>nif</u>, nome, residencia)
### Cálculos (comprovativos do modelo E-R)
(nif)+ = nif, nome, residencia = Pessoa
Logo nif é superchave de Pessoa.

### Chaves Primárias
Nif, pois é minimal.

### Chaves Candidatas
Nif (a única chave primária).

### Chaves Estrangeiras
Não tem.

	
## (2 / 12) Cliente (<u>nif</u>, telefone, numCartCred)
### Cálculos (comprovativos do modelo E-R)
(nif)+ = nif, telefone, numCartCred = Cliente
Logo nif é superchave de Cliente.

### Chaves Primárias
nif, pois é minimal.

### Chaves Candidatas
nif (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (3 / 12)Condutor (<u>nif</u>, numCartCond, nib, nacionalidade, matricula)
### Cálculos (comprovativos do modelo E-R)
(nif)+ = nif, telefone, numCartCred = Condutor
Logo nif é superchave de Condutor.

### Chaves Primárias
nif, pois é minimal.

### Chaves Candidatas
nif (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (4 / 12) telefone_cond(<u>telefone</u>, <u>nif</u>)
### Cálculos (comprovativos do modelo E-R)
(nif)+ = nif != telefone_cond
(telefone)+ = telefone != telefone_cond

### Chaves Primárias
{telefone, nif} (a única superchave).

### Chaves Candidatas
{telefone, nif} (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (5 / 12) matricula_cond (<u>matricula</u>, <u>nif</u>)
### Cálculos (comprovativos do modelo E-R)
(matricula)+ = matricula != matricula_cond
(nif)+ = nif != matricula_cond

### Chaves Primárias
{matricula, nif} (a única superchave)

### Chaves Candidatas
{matricula, nif} (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (6 / 12) Veiculo (<u>matricula</u>, capacidade, categoria)
### Cálculos (comprovativos do modelo E-R)

### Chaves Primárias
matricula (a única superchave)

### Chaves Candidatas
matricula (a única chave primária).

### Chaves Estrangeiras
Não tem.


## (7 / 12) Pedido (<u>dataPedido</u>, <u>nif</u>, origem, destino)
### Cálculos (comprovativos do modelo E-R)
(data)+ = data != Pedido
(nif)+ = nif != Pedido

### Chaves Primárias
{data, nif} (a única superchave)

### Chaves Candidatas
{data, nif} (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (8 / 12) Servico(<u>dataInicio</u>, <u>nif</u>, dataFim, custo) 
### Cálculos (comprovativos do modelo E-R)
(dataInicio)+ = data != Servico
(nif)+ = nif != Servico

### Chaves Primárias
{dataInicio, nif} (a única superchave)

### Chaves Candidatas
{dataInicio, nif} (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (9 / 12) cliPontua  (<u>dataInicio</u>, <u>nif_con</u>, nif_cli, pontuacao)
### Cálculos (comprovativos do modelo E-R)
(dataInicio)+ = dataInicio != cliPontua
(nif_con)+ = nif_con != cliPontua

### Chaves Primárias
{dataInicio, nif_con} (a única superchave)

### Chaves Candidatas
{dataInicio, nif_con} (a única chave primária).

### Chaves Estrangeiras
nif_con, que referencia Pessoa(nif).



## (10 / 12) conPontua (<u>dataInicio</u>, <u>nif</u>, pontuacao)
### Cálculos (comprovativos do modelo E-R)
(dataInicio)+ = dataInicio != conPontua
(nif)+ = nif != conPontua

### Chaves Primárias
{dataInicio, nif} (a única superchave)

### Chaves Candidatas
{dataInicio, nif} (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (11 / 12) conduzidoPor (<u>matricula</u>, nif)
### Chaves Primárias
matricula (a única superchave, que já é minimal).

### Chaves Candidatas
matricula (a única chave primária).

### Chaves Estrangeiras
nif, que referencia Pessoa(nif).


## (12 / 12) pedidoAceite(data, nif_cli, <u>dataInicio</u>, <u>nif_con</u>)
### Cálculos (comprovativos do modelo E-R)
(dataInicio)+ = dataInicio != pedidoAceite
(nif_con)+ = nif_con != pedidoAceite

### Chaves Primárias
{dataInicio, nif_con} (a única superchave, que já é minimal).

### Chaves Candidatas
{dataInicio, nif_con} (a única chave primária).

### Chaves Estrangeiras
nif_con e nif_cli, que referenciam Pessoa(nif).









