import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../theme'

const LitmusDocsThemeProvider = ({ children }) => {
	return (
		<ThemeProvider theme={theme()}>			
			<main>{children}</main>			
		</ThemeProvider>
	)
}

export { LitmusDocsThemeProvider }
