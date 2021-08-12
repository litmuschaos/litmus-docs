import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React from 'react'
import { SectionDark, SectionLight } from '../components/layout'
import { ExploreLitmus, Header } from '../components/section/Home'
import { MoreResources } from '../components/section/Home/MoreResources'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main>
        {/* Pages Components */}
        <div className="homeMainContent">
          <SectionLight>
            <Header />
            <br />
            <ExploreLitmus type={'basic'} />
            <ExploreLitmus type={'advance'} />
            <br />
          </SectionLight>
          <SectionDark>
            <MoreResources />
          </SectionDark>
        </div>
      </main>
    </Layout>
  )
}
