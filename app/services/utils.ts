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

export function getReplicaUrl(replicas: string[], id: number) {
  const n = replicas.length
  for (let i = n; i > 0; i--) {
    if (id % i === 0) return replicas[i-1]
  }
  return replicas[0]
}