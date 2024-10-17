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


export class SimpleConeSearchClient {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async search(ra: number, dec: number, radius: number) {
    const resp = await queryClient.fetchQuery({
      queryKey: ['scs', ra, dec],
      queryFn: () => axios.get(this.url, {
        signal: semaphore.getSignal(),
        params: {
          ra: ra,
          dec: dec,
          sr: radius,
        },
        transformResponse: (data) => {
          const parser = new DOMParser()
          const xml = parser.parseFromString(data, 'application/xml')
          const nRows = xml.querySelector('VOTABLE > RESOURCE > INFO[name="TableRows"]')?.getAttribute('value')
          
          if (!!nRows && parseInt(nRows) > 0) {
            const fields = xml.querySelectorAll('VOTABLE > RESOURCE > TABLE > FIELD')
            const row = xml.querySelector('VOTABLE > RESOURCE > TABLE > DATA > TABLEDATA > TR')
            const rowData = row?.querySelectorAll('TD')
            const result: any = {}
            
            for (let i = 0; i < fields.length; i++) {
              const key = fields[i]?.getAttribute('name')
              const dataType = fields[i].getAttribute('datatype')
              let value: any = rowData?.[i]?.textContent
              
              if (dataType === 'float' || dataType === 'double') {
                value = parseFloat(value as string)
              } else if (dataType === 'int') {
                value = parseInt(value as string)
              }
              
              if (!!key) {
                result[key] = value
              }
            }
            return result
          }
        }
      }),
    })
    return resp.data
  }
}