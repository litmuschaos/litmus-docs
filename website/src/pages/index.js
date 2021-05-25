import React from "react";
import clsx from "clsx";
import {Layout} from "../components/layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

export default function Home() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />">
				Yo		
		</Layout>
	);
}