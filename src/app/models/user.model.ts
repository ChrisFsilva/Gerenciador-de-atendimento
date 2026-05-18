// Padronização das regras para integração dos usuários

export interface UsuarioModel {

  id: number;

  nome: string;

  email: string;

  cargo: 'vendedor' | 'gestor';

  unidadeId: number;

}