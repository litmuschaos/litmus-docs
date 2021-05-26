import React from 'react'
import { Layout, SectionLight } from '../components/layout'
import { ExploreLitmus, Header } from '../components/section/Home'

const Home = () => {
	return (
		<Layout>
			{/* Pages Components */}
			<SectionLight>
				<Header />
				<br />
				<ExploreLitmus type={'basic'} />
				<br />
				<ExploreLitmus type={'advance'} />
			</SectionLight>
		</Layout>
	)
}

export default Home
