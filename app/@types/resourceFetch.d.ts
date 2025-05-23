interface IResourceFetchConfig {
  id?: number
}

interface IResourceFetch {
  fetch(configs: IResourceFetchConfig): Promise<AxiosResponse<any, any>>
}