// AppWrapper.js
import React from 'react'
import { PaperProvider } from 'react-native-paper'
import App from './index'

const AppWrapper = () => {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  )
}

export default AppWrapper