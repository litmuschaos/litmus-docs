import React from "react";
import {SectionLight} from "../components/layout"
import {Layout} from "../components/layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const Home = () => {
	return (
		<Layout>
			{/* Pages Components */}
			<SectionLight>
				<h1>Hello</h1>
			</SectionLight>
		</Layout>
	);
}

export default Home;