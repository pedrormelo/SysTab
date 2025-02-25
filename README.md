# SysTab


Documentação do Sistema de Gerenciamento de Tablets
## **1. Introdução**

Este documento apresenta o planejamento, estrutura e desenvolvimento do **Sistema de Gerenciamento de Tablets**, uma aplicação local desenvolvida para otimizar o controle de dispositivos utilizados na Secretaria de Saúde. O sistema permite a **consulta, edição e exclusão** de dados dos tablets, bem como o gerenciamento de **chamados de manutenção** e a geração de **Ordens de Serviço (O.S.)** para impressão.

## **2. Objetivo**

O sistema visa proporcionar um gerenciamento eficiente dos tablets, garantindo que cada dispositivo esteja corretamente registrado e que chamados de manutenção possam ser acompanhados de maneira organizada.

## **3. Tecnologias Utilizadas**

Para garantir um desenvolvimento ágil e eficiente, foram escolhidas as seguintes tecnologias:

- **Backend:** Node.js + Express
- **Banco de Dados:** MySQL (via XAMPP)
- **Frontend:** Vue.js
- **Servidor Local:** PM2 para gerenciamento do backend

## **4. Estrutura do Banco de Dados**

A modelagem do banco de dados foi projetada para armazenar e relacionar os dispositivos e os chamados de manutenção. As principais tabelas são:

- **`tablets`**: Contém os dados principais de cada dispositivo, como número de tombamento, número de série (NS), usuário, unidade, regional e empresa.
- **`usuarios`**: Representa os usuários dos tablets. Cada tablet é associado a um único usuário, e cada usuário pode possuir apenas um tablet.
- **`unidades`**: Representa as unidades onde os tablets estão alocados. Cada unidade pertence a uma regional específica.
- **`regionais`**: Contém as regionais às quais as unidades estão vinculadas.
- **`chamados`**: Controla os chamados de manutenção, armazenando a **data de entrada, descrição do problema, indicação se o dispositivo veio com carregador** (campo booleano) e **status do chamado** (Aberto/Fechado).

## **5. Alimentação de Dados**

Os dados dos tablets serão importados a partir de uma **planilha do Excel** para o banco de dados. O sistema não permite o cadastro manual de novos dispositivos, mas disponibiliza funcionalidades para **edição e correção de registros**. Caso um usuário precise ser alterado, será possível cadastrá-lo na tabela `usuarios` e associá-lo a um novo dispositivo.

## **6. Funcionalidades**

O sistema oferece as seguintes funcionalidades principais:  
✅ **Consulta de dispositivos** por tombamento ou número de série (NS).  
✅ **Edição e exclusão** de registros para correções.  
✅ **Gerenciamento de chamados**, com registro de problemas e acompanhamento do status.  
✅ **Geração de Ordens de Serviço (O.S.)**, incluindo os dados do tablet e do chamado.  
✅ **Emissão da O.S. para impressão**, utilizando um template padronizado.

## **7. Desenvolvimento e Implementação**

O desenvolvimento do sistema segue a seguinte sequência de etapas:

1. **Configuração do ambiente**: Instalação de **Node.js, XAMPP e PM2**.
2. **Modelagem do banco de dados**: Criação das tabelas e relações no MySQL.
3. **Desenvolvimento do backend**: Implementação das APIs REST com **Node.js e Express**.
4. **Desenvolvimento do frontend**: Construção da interface gráfica utilizando **Vue.js**.
5. **Integração e testes**: Validação das funcionalidades e ajustes necessários.
6. **Geração e impressão da O.S.**: Implementação do modelo de impressão com os dados relevantes.