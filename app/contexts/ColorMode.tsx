'use client'

import { createContext, useContext, useReducer, useState, useMemo, useEffect } from 'react'
import themeFactory from '@/lib/theme'
import { ThemeProvider } from '@mui/material/styles'
import localforage from 'localforage'
import useMediaQuery from '@mui/material/useMediaQuery'


export const ColorModeContext = createContext<any>({ toggleColorMode: () => {} })


export function ToggleColorMode(props: React.PropsWithChildren) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light')
  
  useEffect(() => {
    localforage.getItem('colorMode', (error, value) => {
      if (value == 'light' || value == 'dark') {
        setMode(value as any)
      }
    })
  }, [setMode])
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  useEffect(() => {
    localforage.setItem('colorMode', mode)
  }, [mode])

  const themeWithColorMode = useMemo(() => themeFactory(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={themeWithColorMode}>
        { props.children }
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}


export function useColorMode() {
  return useContext(ColorModeContext)
}