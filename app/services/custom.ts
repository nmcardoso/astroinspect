import axios from 'axios'
import { semaphore } from '../lib/Semaphore'
import { QueryClient } from '@tanstack/react-query'
import { timeConvert } from '../lib/utils'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})



export class CustomImage implements IResourceFetch {
  private url
  
  constructor(
    url: string,
  ) {
    this.url = url
  }

  async fetch() {
    return await queryClient.fetchQuery({
      queryKey: [this.url],
      queryFn: () => axios.get(this.url, { 
        responseType: 'blob', 
        signal: semaphore.getSignal(),
      })
    })
  }
}