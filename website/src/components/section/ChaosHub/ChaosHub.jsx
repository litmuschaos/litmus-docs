import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/chaoshub.css'
import { ResponsiveRow } from '../../layout'
import { Heading, SubText } from '../../texts'

const ChaosHub = () => {
  return (
    <div>
      <div className="header">
        <img className="chaoshubIcon" src={useBaseUrl('/img/chaos-hub.svg')} alt="ChaosHub Icon" />
        <Heading fontWeight={600}>Chaoshubs</Heading>
      </div>
      <SubText color={'#6f6f6f'}>Litmus ChaosHub hosts chaos experiments for Kubernetes</SubText>
      <br />
      <ResponsiveRow>
        <div>
          <h3>Chaos Experiments for Kubernetes</h3>
          <p className="chaosHubDescription">
            Use Litmus ChaosHub to use and tune the predefined experiemnts ready to be used for workflow creations.
          </p>
          <a href="http://hub.litmuschaos.io/" target="_blank">
            <div className="chaosHubExplore">
              <p className="chaosHubExploreText">Explore the experiments at Chaoshub</p>
              <img src={useBaseUrl('/img/arrow.png')} alt="Chaos hub" height="14" width="7" className="chaosHubImage" />
            </div>
          </a>
        </div>
        <img className="chaosbird" src={useBaseUrl('/img/chaos-hub.png')} alt="Chaos hub" />
      </ResponsiveRow>
    </div>
  )
}

export { ChaosHub }
