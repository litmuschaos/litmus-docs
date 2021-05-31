import React from 'react'
import { Layout, SectionLight } from '../components/layout'
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
					<GetStartedHeader />
					<br />
					<br />
					<ExploreLitmus type={'basic'} />
					<br />
					<br />
					<ExploreLitmus type={'advance'} />
					<br />
					<br />
					<MoreResources />
				</SectionLight>
			</div>
		</Layout>
	)
}

export default Home
