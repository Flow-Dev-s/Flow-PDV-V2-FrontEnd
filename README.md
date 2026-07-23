# 🛒 FlowPDV - Front-end (Caixa / PDV)

Interface moderna, rápida e responsiva para operação de Caixa e Ponto de Venda. Construída com foco na experiência do usuário (UX) para garantir que as operações do dia a dia sejam ágeis, evitando cliques desnecessários e prevenindo erros de operação.

## 🚀 Tecnologias Utilizadas

* **React** com **TypeScript**
* **Tailwind CSS** para estilização rápida e responsiva
* **Lucide React** para iconografia elegante
* **Vite** (ou Create React App) como bundler

## ⚙️ Principais Funcionalidades

* **Frente de Caixa (PDV):**
  * Busca e adição rápida de produtos ao carrinho.
  * Cálculo em tempo real de subtotais e totais.
* **Seleção Inteligente de Pagamento:**
  * Opções de PIX, Dinheiro, Cartão e Conta (Fiado).
  * **Trava de Segurança:** A opção "Conta" só é habilitada (e permitida) se um cliente estiver previamente selecionado na memória do caixa, prevenindo vendas fiadas anônimas.
* **Painel do Cliente:**
  * Visualização de cadastro e limite de crédito.
  * **Histórico Detalhado:** Modal sobreposto para inspecionar compras passadas, listando os produtos específicos, quantidades e subtotais daquela data.

## 🛠️ Como Executar o Projeto

1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. Clone o repositório e navegue até a pasta do front-end.
3. Instale as dependências executando:
   ```bash
   npm install
   # ou
   yarn install
   ```
4. Inicie o servidor de desenvolvimento:

  ```Bash
  npm run dev
  # ou
  yarn start
  O sistema abrirá no seu navegador (geralmente em http://localhost:5173 ou 3000).
  ```
