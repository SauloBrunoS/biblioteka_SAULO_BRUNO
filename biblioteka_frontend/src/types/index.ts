import { Nacionalidade } from "./enum"

export interface Colecao {
  id: number
  nome: string
  descricao: string
}

export interface Autor {
  id: number
  nomeCompleto: string
  dataNascimento: Date,
  nacionalidade: keyof typeof Nacionalidade,
  biografia: string
}

export interface InfoDataTableServer {
  id?: number
  page: number
  itemsPerPage: number
  sortBy: [{ key: string; order: string }]
  search: string
}

export interface ApplicationError {
  name: string
  message: string
  details?: string[]
}

export interface Notificacao {
  mensagem: string
  tipoMensagem: string
  visibilidade: boolean
}
