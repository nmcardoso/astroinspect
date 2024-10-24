import { parseVotable } from '@/lib/votable'
import axios from 'axios'
import { semaphore } from '../lib/Semaphore'
import { QueryClient } from '@tanstack/react-query'
import { timeConvert } from '../lib/utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: timeConvert(1, 'day', 'ms'),
    },
  },
})

export class TapService {
  public url

  constructor(url: string) {
    this.url = url
  }

  async getSchemas(): Promise<{name: string, description: string}[]> {
    const resp = await queryClient.fetchQuery({
      queryKey: ['tap', 'schema', this.url],
      queryFn: () => axios.get(this.url, {
        // signal: semaphore.getSignal(),
        params: {
          LANG: 'ADQL',
          REQUEST: 'doQuery',
          QUERY: 'SELECT schema_name, description FROM TAP_SCHEMA.schemas',
        },
        transformResponse: (data): {schema_name: string, description: string}[] => {
          return (parseVotable(data) as {schema_name: string, description: string}[])
        }
      }),
    })
    return resp.data
  }


  async getTables(schema: string): Promise<string[]> {
    const resp = await queryClient.fetchQuery({
      queryKey: ['tap', 'table', schema, this.url],
      queryFn: () => axios.get(this.url, {
        // signal: semaphore.getSignal(),
        params: {
          LANG: 'ADQL',
          REQUEST: 'doQuery',
          QUERY: `SELECT table_name, description FROM TAP_SCHEMA.tables WHERE schema_name='${schema}'`,
        },
        transformResponse: (data): {table_name: string, description: string}[] => {
          return (parseVotable(data) as {table_name: string, description: string}[])
        }
      }),
    })
    return resp.data
  }


  async getColumns(table: string): Promise<any> {
    const resp = await queryClient.fetchQuery({
      queryKey: ['tap', 'column', table, this.url],
      queryFn: () => axios.get(this.url, {
        // signal: semaphore.getSignal(),
        params: {
          LANG: 'ADQL',
          REQUEST: 'doQuery',
          QUERY: `SELECT column_name, description FROM TAP_SCHEMA.columns WHERE table_name='${table}'`,
        },
        transformResponse: (data): {column_name: string, description: string}[] => {
          return (parseVotable(data) as {column_name: string, description: string}[])
        }
      }),
    })
    return resp.data
  }
}