function parseRow(row: Element, fields: NodeListOf<Element>) {
  const rowData = row?.querySelectorAll('TD')
  const result: any = {}
    
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i]?.getAttribute('name')
    const dataType = fields[i]?.getAttribute('datatype')
    let value: any = rowData?.[i]?.textContent
    
    if (dataType === 'float' || dataType === 'double') {
      value = parseFloat(value as string)
    } else if (dataType === 'int') {
      value = parseInt(value as string)
    }
    
    if (!!key) result[key] = value
  }

  return result
}


export function parseVotable(data: string, maxRows?: number): object[] {
  const parser = new DOMParser()
  const xml = parser.parseFromString(data, 'application/xml')
  const nRows = xml.querySelector('VOTABLE > RESOURCE > INFO[name="TableRows"]')?.getAttribute('value')
  
  const table = []
  if (!!nRows && parseInt(nRows) > 0) {
    maxRows = maxRows || parseInt(nRows)
    const fields = xml.querySelectorAll('VOTABLE > RESOURCE > TABLE > FIELD')
    const rows = xml.querySelectorAll('VOTABLE > RESOURCE > TABLE > DATA > TABLEDATA > TR')
    
    for (let i = 0; i < Math.min(rows.length, maxRows); i++) {
      table.push(parseRow(rows[i], fields))
    }
  }

  return table
}