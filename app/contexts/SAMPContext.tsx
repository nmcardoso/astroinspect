'use client'

import { createContext, useContext, useReducer, useState, useMemo, useEffect } from 'react'
import { samp } from 'sampjs'

export const SAMPContext = createContext<any>({ connect: () => { }, disconnect: () => { }, isConnected: false })


const APP_NAME = 'AstroInspect'
const APP_META = {
  'samp.name': 'AstroInspect',
  'samp.description': 'Visual inspection tool',
  // 'samp.icon.url': baseUrl + "clientIcon.gif",
}


export function SAMPProvider(props: React.PropsWithChildren) {
  const [isConnected, setConnected] = useState<boolean>(false)
  const [client, setClient] = useState<any>(undefined)

  const state = useMemo(() => ({
    connect: () => {
      if (!isConnected) {
        const tracker = new samp.ClientTracker()
        const callHandler = tracker.callHandler

        callHandler['samp.app.ping'] = function (senderId, message, isCall) {
          if (isCall) {
            console.log({ text: "ping to you, " + client.tracker.getName(senderId) })
            return { text: "ping to you, " + client.tracker.getName(senderId) };
          }
        }
  
        callHandler['table.load.votable'] = function (senderId, message, isCall) {
          const params = message['samp.params']
          const origUrl = params['url']
          console.log(message)
          console.log('params', params)
          console.log('origUrl', origUrl)
          console.log('senderId', senderId)
          // const proxyUrl = origUrl
          const proxyUrl = client.tracker.connection.translateUrl(origUrl)
          console.log('proxyUrl', proxyUrl)
          const xhr = samp.XmlRpcClient.createXHR()
          var e
          xhr.open('GET', proxyUrl)
          xhr.onload = function () {
            var xml = xhr.responseXML
            if (xml) {
              try {
                // displayVotable(xml)
                // tableId = params['table-id']
                // tableUrl = origUrl
                console.log('table-id', params['table-id'])
                console.log('xml', xml)
              }
              catch (e) {
                // showTableError("Error displaying table:\n" + e.toString())
              }
            }
            else {
              // showTableError("No XML response")
            }
          }
          xhr.onerror = function (err) {
            // showTableError("Error getting table " + origUrl + "\n" + "(" + err + ")")
          }
          xhr.send(null)
        }

        const subs = tracker.calculateSubscriptions()
        const connector = new samp.Connector(APP_NAME, APP_META, tracker, subs)
        setClient({ connector, tracker, callHandler })
        setConnected(v => !v)
      }
    },
    disconnect: () => {
      if (!!client?.connector) {
        client.connector.unregister()
      }
      setClient(undefined)
      setConnected(false)
    },
    isConnected: isConnected,
  }), [isConnected, client])


  useEffect(() => {
    if (isConnected && !!client?.connector) {
      client.connector.runWithConnection(conn => conn.notifyAll([
        new samp.Message('samp.app.ping', {})
      ]))
    }
  }, [isConnected, client])


  return (
    <SAMPContext.Provider value={state}>
      {props.children}
    </SAMPContext.Provider>
  )
}


export function useSAMP() {
  return useContext(SAMPContext)
}