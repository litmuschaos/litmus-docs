import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../theme";
import { Button } from "../button";
import {
	BoundedContainer,
	Center,
	ResponsiveRow,
	SectionDark,
} from "../layout";
import { Heading, Paragraph, PurpleText } from "../texts";

const CNCFText = styled.div`
	position: relative;
	z-index: 2;
	${({ theme }) =>
		theme.screens.lg
			? css`
					margin: 0 auto;
					width: 90%;
			  `
			: css`
					width: 20rem;
					margin: 0 auto;					
			  `}
`;

const CNCFLogoDiv = styled.div`
	background: white;
	box-shadow: 0px 8.55652px 24.9565px rgba(0, 0, 0, 0.06);
	border-radius: 0.625rem;
	padding: 1.375rem 1.875rem;
	margin-bottom: 2rem;

	img {
		margin: 0 auto;
		width: ${(props) => (props.theme.screens.sm ? "90%" : "60%")};
	}
`;

const PreFooterTop = () => {
	const { lg } = useTheme().screens;
	return (
		<SectionDark>
			<ResponsiveRow breakpoint="lg">
				<BoundedContainer breakpoint="lg" width="50%" margin="0 3rem 0 0">
					<Center>
						<div>
							<Heading>Create, Manage and Monitor Chaos on Kubernetes</Heading>
							<Paragraph style={{ margin: "1rem 0" }}>
								Litmus is highly extensible and integrates with other tools to
								enable the creation of custom experiments. Kubernetes developers
								& SREs use Litmus to manage chaos in a declarative manner and
								find weaknesses in their applications and infrastructure
							</Paragraph>
							<br />
							<a
								rel="noopener noreferrer"
								target="_blank"
								href="https://docs.litmuschaos.io/docs/getstarted/">
								<Button gradientColor="purple">Get started with Litmus</Button>
							</a>
						</div>
					</Center>
				</BoundedContainer>

				<BoundedContainer breakpoint="lg" width="50%" margin="0">
					{lg ? (
						<CNCFLogoDiv>
							<img src="/svg/cncf-color.svg" alt="CNCF Logo" />
						</CNCFLogoDiv>
					) : (
						// <CNCFLogo />
						<></>
					)}
					<CNCFText>
						<Paragraph textAlign="center">
							We are a{" "}
							<a
								rel="noopener noreferrer"
								target="_blank"
								href="https://www.cncf.io/">
								<PurpleText
									fontSize="paragraph"
									fontWeight={400}
									style={{ display: "inline" }}>
									Cloud Native Computing Foundation
								</PurpleText>{" "}
							</a>
							sandbox project
						</Paragraph>
					</CNCFText>
				</BoundedContainer>
			</ResponsiveRow>
		</SectionDark>
	);
};

export { PreFooterTop };
