interface IResourceFetch {
  fetch(): Promise<AxiosResponse<any, any>>
}