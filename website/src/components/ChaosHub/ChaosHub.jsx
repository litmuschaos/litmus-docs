import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../css/home.css'

const ChaosHub = () => {
	return (
		<div>
			<p className="chaosHubHeader">Litmus ChaosHub hosts chaos experiments for Kubernetes</p>
			<div className="chaosHubDiv">
				<div className="chaosHubInfo">
					<h3>Chaos Experiments for Kubernetes</h3>
					<p className="chaosHubDescription">
						Use Litmus ChaosHub to use and tune the predefined experiemnts ready to be used for workflow creations.
					</p>
					<a href="http://hub.litmuschaos.io/" target="_blank">
						<div className="chaosHubExplore">
							<p className="chaosHubExploreText">Explore the experiments at Chaoshub</p>
							<img
								src={useBaseUrl("/docs/assets/arrow.png")}								
								alt="Chaos hub"
								height="14"
								width="7"
								className="chaosHubImage"
							/>
						</div>
					</a>
				</div>
				<div>
					<img src={useBaseUrl("/docs/assets/chaos-hub.png")} alt="Chaos hub" />
				</div>
			</div>
		</div>
	)
}

export { ChaosHub }
