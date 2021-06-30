import React from 'react'
import '../../../css/home.css'
import { TutorialData } from '../data'
import { TutorialCard } from '../TutorialCard/TutorialCard'

const Tutorials = () => {
	return (
		<div className="tutorialContainer">
			{TutorialData.map((tutorials) => (
				<TutorialCard props={tutorials} />
			))}
		</div>
	)
}
export { Tutorials }
