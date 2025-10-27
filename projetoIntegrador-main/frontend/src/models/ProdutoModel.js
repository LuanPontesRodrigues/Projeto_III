// Define o modelo de dados Produto (estrutura que um produto deve ter)

export class Produto {
    constructor(id, nome, codigo) {
      this.id = id;       // Identificador único do produto
      this.nome = nome;   // Nome do produto
      this.codigo = codigo; // Código do produto
    }
  }
  