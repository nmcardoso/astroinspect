import { useEffect } from 'react'
import localforage from 'localforage'
import { SCHEMA_VERSION, useXTableConfig } from '../../contexts/XTableConfigContext'


export default function LoadInitialState() {
  const { tcDispatch } = useXTableConfig()

  useEffect(() => {
    localforage.getItem<any>('tableConfigState', (err, loadedState) => {
      if (!err && loadedState !== null) {
        // Essa implementação está ok por agora, mas descartar o estado salvo
        // a cada atualização do schema não é um boa ideia do ponto de vista
        // de experiência de usuário. No futuro, esta implementação deve
        // comparar e mesclar os estados caso a versão seja diferente
        if (loadedState.schemaVersion === SCHEMA_VERSION) {
          tcDispatch({ type: 'loadSavedState', payload: loadedState })
        }
      }
    })
  }, [tcDispatch])

  return null
}