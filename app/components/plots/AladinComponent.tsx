import { useCallback, useEffect } from 'react'
import A from 'aladin-lite'
import { useXTableConfig } from '@/contexts/XTableConfigContext'


type AladinWrapperProps = {
  width: number | string
  height: number | string
}

export default function AladinComponent({ width, height }: AladinWrapperProps) {
  const { tcState } = useXTableConfig()

  useEffect(() => {
    A.init.then(() => {
      let raField = tcState.table.columns?.[tcState.table.raIndex as number]
      let decField = tcState.table.columns?.[tcState.table.decIndex as number]
      raField = `tab:${raField}`
      decField = `tab:${decField}`

      const configs: any = {
        survey: 'CDS/P/DESI-Legacy-Surveys/DR10/color',
        fov: 180, 
        projection: "AIT", 
        cooFrame: 'ICRSd', 
        showCooGridControl: true, 
        showSimbadPointerControl: true, 
        showCooGrid: true,
      }
      if (tcState.grid.data?.[0]) {
        configs.target = `${tcState.grid.data[0][raField]} ${tcState.grid.data[0][decField]}`
      }

      const aladin = A.aladin('#aladin-lite-div', configs)
      aladin.setImageSurvey('CDS/P/DESI-Legacy-Surveys/DR10/color')

      const sources = tcState.grid.data?.map((row: any) => {
        const ra = row[raField]
        const dec = row[decField]
        const filteredRow = Object.entries(row).reduce((obj: any, [key, value]) => {
          if (key.startsWith('tab:')) {
            obj[key.slice(4)] = value
          }
          return obj
        }, {})
        return A.source(ra, dec, filteredRow)
      })
      const cat = A.catalog({name: 'Input Table', raField, decField, onClick: 'showPopup'})
      cat.addSources(sources)
      aladin.addCatalog(cat)
    })
  }, [
    tcState.grid.data, 
    tcState.table.columns, 
    tcState.table.raIndex, 
    tcState.table.decIndex
  ])

  return (
    <div id="aladin-lite-div" style={{ width, height }}></div>
  )
}