import React from 'react'
import { SectionLight } from '../components/layout'
import { Layout } from '../components/layout'
import { ExploreLitmus } from '../components/section/ExploreLitmus'

const Home = () => {
	return (
		<Layout>
			{/* Pages Components */}
			<SectionLight>
				<h1>Litmus</h1>
			</SectionLight>
			<ExploreLitmus type={'basic'} />
			<ExploreLitmus type={'advance'} />
		</Layout>
	)
}

export default Home
