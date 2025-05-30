export function computeQuantiles(arr: number[]): { q1: number, q3: number, iqr: number, maxValue: number, minValue: number } {
  let values, q1, q3, iqr, maxValue, minValue

  values = arr.slice().sort((a, b) => a - b) //copy array fast and sort

  if ((values.length / 4) % 1 === 0) { //find quartiles
    q1 = 1 / 2 * (values[(values.length / 4)] + values[(values.length / 4) + 1])
    q3 = 1 / 2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1])
  } else {
    q1 = values[Math.floor(values.length / 4 + 1)]
    q3 = values[Math.ceil(values.length * (3 / 4) + 1)]
  }

  iqr = q3 - q1
  maxValue = q3 + iqr * 2.5
  minValue = q3 - iqr * 2.5

  return {
    q1, q3, iqr, maxValue, minValue
  }
}


export function maskOutliersUnivariate(arr: number[]) {
  if (arr.length < 4)
    return arr

  const stats = computeQuantiles(arr)

  return arr.map((x) => {
    if ((x >= stats.minValue) && (x <= stats.maxValue)) {
      return x
    }
    return undefined
  })
}


export function maskOutliersBivariate(arr1: number[], arr2: number[]) {
  if (arr1.length < 4 || arr2.length < 4)
    return [arr1, arr2]

  const stats1 = computeQuantiles(arr1)
  const stats2 = computeQuantiles(arr2)
  const a1 = []
  const a2 = []

  for (let i = 0; i < arr1.length; i++) {
    const e1 = arr1[i]
    const e2 = arr2[i]
    const cond = ((e1 >= stats1.minValue) && (e1 <= stats1.maxValue)) &&
      ((e2 >= stats2.minValue) && (e2 <= stats2.maxValue))

    if (cond) {
      a1.push(e1)
      a2.push(e2)
    } else {
      a1.push(undefined)
      a2.push(undefined)
    }
  }

  return [a1, a2]
}


export function maskOutliersTrivariate(arr1: number[], arr2: number[], arr3: number[]) {
  if (arr1.length < 4 || arr2.length < 4 || arr3.length < 4)
    return [arr1, arr2, arr3]

  const stats1 = computeQuantiles(arr1)
  const stats2 = computeQuantiles(arr2)
  const stats3 = computeQuantiles(arr3)
  const a1 = []
  const a2 = []
  const a3 = []

  for (let i = 0; i < arr1.length; i++) {
    const e1 = arr1[i]
    const e2 = arr2[i]
    const e3 = arr3[i]
    const cond = ((e1 >= stats1.minValue) && (e1 <= stats1.maxValue)) &&
      ((e2 >= stats2.minValue) && (e2 <= stats2.maxValue)) &&
      ((e3 >= stats3.minValue) && (e3 <= stats3.maxValue))

    if (cond) {
      a1.push(e1)
      a2.push(e2)
      a3.push(e3)
    } else {
      a1.push(undefined)
      a2.push(undefined)
      a3.push(undefined)
    }
  }

  return [a1, a2, a3]
}