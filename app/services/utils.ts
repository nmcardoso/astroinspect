export async function processResponse(func: () => Promise<any>) {
  try {
    const resp = await func()
    return {
      statusCode: resp.status,
      error: false,
      data: resp.data
    }
  } catch (e: any) {
    return {
      error: true,
      statusCode: e?.status,
      data: undefined,
    }
  }
}