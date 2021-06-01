import React from 'react'
import { Layout, SectionDark, SectionLight } from '../components/layout'
import { ExploreLitmus, Header } from '../components/section/Home'
import { GetStartedHeader } from '../components/section/Home/GetStartedHeader'
import { MoreResources } from '../components/section/Home/MoreResources'

const Home = () => {
	return (
		<Layout>
			{/* Pages Components */}
			<div className="homeMainContent">
				<SectionLight>
					<Header />
					<br />
					<GetStartedHeader />
					<br />
					<ExploreLitmus type={'basic'} />					
					<ExploreLitmus type={'advance'} />					
					<br />
				</SectionLight>
				<SectionDark>
					<MoreResources />
				</SectionDark>
			</div>
		</Layout>
	)
}

export default Home
