import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/tutorials.css'
import { Heading, Paragraph } from '../../texts'

const Header = () => {
  return (
    <div>
      <div className="flex">
        <img className="tutorialIcon" src={useBaseUrl('/img/tutorials.svg')} alt="Tutorial Icon" />
        <Heading fontWeight={600}>Tutorials</Heading>
      </div>
      <Paragraph>
        The tutorials help you to quickly learn some of the standard day-0 to day-n flows associated with the
        LitmusChaos framework (and Chaos Engineering in general). Each tutorial is created with a definitive objective.
        If you believe the objective is not met, please create issues on the Github repository stating what is missing.
      </Paragraph>
    </div>
  )
}

export { Header }
