import AIGrid from '@/components/table/AIGrid'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { useRouter } from 'next/navigation'
import { ChangeEventHandler, useEffect } from 'react'
import { loadPyodide } from 'pyodide'

export default function Index() {
  const { tcState } = useXTableConfig()
  const router = useRouter()

  // useEffect(() => {
  //   if (!tcState.grid.data) {
  //     router.push('/')
  //   }
  // }, [])

  // useEffect(() => {
  //   loadPyodide({
  //     indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
  //     stderr: (text) => {
  //       console.log('An error occured:', text)
  //     },
  //     stdout: (text) => {
  //       console.log('Python output:', text)
  //     },
  //     jsglobals: {
  //       broca: [0, 1]
  //     },
  //   }).then((py) => {
  //     py.runPython(String.raw`
  //       import sys
  //       print(sys.version)
  //       from js import broca
  //       print(type(broca.to_py()))
  //     `)
  //   }).catch(console.error)
  // }, [])

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const buffer = await e.target.files?.[0].arrayBuffer()
    loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      stderr: (text) => {
        console.log('An error occured:', text)
      },
      stdout: (text) => {
        console.log('Python output:', text)
      },
      jsglobals: {
        broca: buffer
      },
      packages: ['astropy']
    }).then((py) => {
      py.runPython(String.raw`
        from astropy.io import ascii
        from js import broca

        print(type(broca.to_py()))
        print(broca.to_py())

        data = ascii.read(broca)
        print(broca)
      `)
    }).catch(console.error)
  }

  return (
    <>
      <input type="file" onChange={handleChange} />
    </>
  )
}