import React from 'react';
import { Paragraph, SubHeading } from '../../../components/texts';
import '../../../css/home.css';
import { advancedLitmusData, exploreLitmusData } from './data';

const ExploreLitmus = ({ type }) => {
	return (
		<>
			{type === 'basic' ? (
				<>
					<SubHeading>Explore using Litmus</SubHeading>
					<div className="grid">
						{exploreLitmusData.map((exploreData) => (
							<div className="exploreLitmusDiv">
								<img src={exploreData.icon} alt={exploreData.icon} />
								<div className="subHeading">{exploreData.heading}</div>
								<Paragraph>{exploreData.description}</Paragraph>
							</div>
						))}
					</div>
				</>
			) : (
				<>
					<SubHeading>Litmus for Advanced Users</SubHeading>
					<div className="grid">
						{advancedLitmusData.map((exploreData) => (
							<div className="exploreLitmusDiv">
								<img src={exploreData.icon} alt={exploreData.icon} />
								<div className="subHeading">{exploreData.heading}</div>
								<Paragraph>{exploreData.description}</Paragraph>
							</div>
						))}
					</div>
				</>
			)}
		</>
	)
}

export { ExploreLitmus };

