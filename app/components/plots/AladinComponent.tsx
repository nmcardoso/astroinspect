import { useCallback, useEffect } from 'react'
import A from 'aladin-lite'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import  pickBy  from 'lodash/pickBy'


type AladinWrapperProps = {
  width: number | string
  height: number | string
}

export default function AladinComponent({ width, height }: AladinWrapperProps) {
  const { tcState } = useXTableConfig()

  useEffect(() => {
    A.init.then(() => {
      const configs = {
        source: 'CDS/P/DESI-Legacy-Surveys/DR10/color',
        fov: 360, 
        projection: "AIT", 
        cooFrame: 'ICRSd', 
        showCooGridControl: true, 
        showSimbadPointerControl: true, 
        showCooGrid: true,
      }
      const aladin = A.aladin('#aladin-lite-div', configs)
      aladin.setImageSurvey('CDS/P/DESI-Legacy-Surveys/DR10/color')
      const raField = tcState.table.columns?.[tcState.table.raIndex as number]
      const decField = tcState.table.columns?.[tcState.table.decIndex as number]
      const sources = tcState.grid.data?.map((row: any) => {
        const ra = row[`tab:${raField}`]
        const dec = row[`tab:${decField}`]
        // const filteredRow = pickBy(row, (value, key) => {
        //   return key.startsWith('tab:')
        // })
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
      console.log(cat)
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