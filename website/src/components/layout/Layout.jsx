import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '../../theme'
// Components
// import { Footer } from "../footer";
import { Nav } from '../nav'
import { PreFooter } from '../pre-footer'

const Layout = ({ children }) => {
	return (
		<ThemeProvider theme={theme()}>
			<Nav />
			<main>{children}</main>
			<PreFooter />
		</ThemeProvider>
	)
}

export { Layout }
