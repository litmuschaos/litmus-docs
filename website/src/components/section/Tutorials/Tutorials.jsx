import React from 'react'
import '../../../css/tutorials.css'
import { TutorialData } from './data'
import { TutorialCard } from './TutorialCard'

const Tutorials = () => {
  return (
    <div className="tutorialContainer">
      {TutorialData.map(tutorials => (
        <TutorialCard key={tutorials.heading} props={tutorials} />
      ))}
    </div>
  )
}
export { Tutorials }
