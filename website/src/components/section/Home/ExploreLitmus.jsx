import React from 'react'
import styled from 'styled-components'
import { advancedLitmusData, exploreLitmusData } from './data'

const ExploreLitmusDiv = styled.div`
	height: 130px;
	margin-bottom: 60px;
`
const Heading = styled.div`
	color: rgba(91, 68, 186, 1);
	font-size: 16px;
	padding-top: 13px;
`
const Description = styled.div`
	color: rgba(119, 114, 136, 1);
	font-size: 16px;
	padding: 13px 0 13px 0;
`
const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	grid-gap: 5rem;
	row-gap: 2rem;
`

const ExploreLitmus = ({ type }) => {
	return (
		<>
			{type === 'basic' ? (
				<>
					<h2 style={{ marginBottom: '60px' }}>Explore using Litmus</h2>
					<Grid>
						{exploreLitmusData.map((exploreData) => (
							<ExploreLitmusDiv>
								<img src={exploreData.icon} alt={exploreData.icon} />
								<Heading>{exploreData.heading}</Heading>
								<Description>{exploreData.description}</Description>
							</ExploreLitmusDiv>
						))}
					</Grid>
				</>
			) : type === 'advance' ? (
				<>
					<h2 style={{ marginBottom: '60px' }}>Litmus for Advanced Users</h2>
					<Grid>
						{advancedLitmusData.map((exploreData) => (
							<ExploreLitmusDiv>
								<img src={exploreData.icon} alt={exploreData.icon} />
								<Heading>{exploreData.heading}</Heading>
								<Description>{exploreData.description}</Description>
							</ExploreLitmusDiv>
						))}
					</Grid>
				</>
			) : (
				<></>
			)}
		</>
	)
}

export { ExploreLitmus }
