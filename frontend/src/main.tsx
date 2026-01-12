// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { RouterProvider } from 'react-router'
import router from './routes'
import { mantineTheme } from './theme/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={mantineTheme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)
