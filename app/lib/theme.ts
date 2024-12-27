'use client'
// import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

// const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// })

const themeFactory = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode: mode,
  },
  // typography: {
  //   fontFamily: roboto.style.fontFamily,
  // },
  // components: {
  //   MuiAlert: {
  //     styleOverrides: {
  //       root: ({ ownerState }) => ({
  //         ...(ownerState.severity === 'info' && {
  //           backgroundColor: '#60a5fa',
  //         }),
  //       }),
  //     },
  //   },
  // },
});

export default themeFactory