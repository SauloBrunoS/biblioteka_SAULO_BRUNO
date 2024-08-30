import axios from 'axios'
import type { Emprestimo } from '@/types'
import httpClient from '@/api/HttpClient'

export default {
  async create(leitorId: number, livroId: number, senha: string): Promise<Emprestimo> {
    try {
      const { data } = await httpClient({
        method: 'post',
        url: `/emprestimos/emprestar`,
        params: {
          leitorId: leitorId,
          livroId: livroId,
          senha: senha
        }
      })
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(JSON.stringify(error.response?.data))
      }
      throw error
    }
  },

  async getById(id: number): Promise<Emprestimo> {
    try {
      const { data } = await httpClient.get(`/emprestimos/${id}`)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data)
      }
      throw error
    }
  }
}
