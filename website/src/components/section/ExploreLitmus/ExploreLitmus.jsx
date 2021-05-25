import React from 'react'
import styled from 'styled-components'
import { SectionLight } from '../../layout'
import { exploreLitmusData, advancedLitmusData } from './data'

const ExploreLitmusDiv = styled.div`
	width: 400px;
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
	grid-template-columns: ${(props) => (props.theme.screens.sm ? '1fr 1fr' : '1fr 1fr 1fr')};
	grid-gap: 5rem;
	row-gap: 2rem;
`

const ExploreLitmus = ({ type }) => {
	return (
		<SectionLight>
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
		</SectionLight>
	)
}

export { ExploreLitmus }
