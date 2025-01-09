import axios from 'axios'
import { semaphore } from '../lib/Semaphore'
import { QueryClient } from '@tanstack/react-query'
import { findFileList, timeConvert } from '../lib/utils'


// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 0,
//     },
//   },
// })


// export class CustomImage implements IResourceFetch {
//   private url

//   constructor(
//     prepend: string,
//     append: string,
//     riColumn: string,
//   ) {
//     this.url = url
//   }

//   async fetch() {
//     return await queryClient.fetchQuery({
//       queryKey: [this.url],
//       queryFn: () => axios.get(this.url, { 
//         responseType: 'blob', 
//         signal: semaphore.getSignal(),
//       })
//     })
//   }
// }



export class CustomImageFromUrl implements IResourceFetch {
  private prepend
  private append
  private ri

  constructor(preprend: string, append: string, ri: string) {
    this.prepend = preprend
    this.append = append
    this.ri = ri
  }

  async fetch() {
    return `${this.prepend || ''}${this.ri || ''}${this.append || ''}`
  }
}




export class CustomImageFromFolder implements IResourceFetch {
  private prepend
  private append
  private ri
  private filelist

  constructor(preprend: string, append: string, ri: string, filelist: FileList) {
    this.prepend = preprend
    this.append = append
    this.ri = ri
    this.filelist = filelist
  }

  async fetch() {
    const filename = `${this.prepend || ''}${this.ri || ''}${this.append || ''}`
    const file = findFileList(filename, this.filelist)
    // console.log(filename, file)
    if (!!file) {
      return { data: file }
    }
    return undefined
    // throw new Error('File not found in FileList object')
  }
}