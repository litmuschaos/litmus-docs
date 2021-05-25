import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  border-radius: 50%;
  margin-right: 2.5rem;
`;

const Avatar = () => {
  const data = useStaticQuery(graphql`
    query {
      icon: file(relativePath: { eq: "avatar.png" }) {
        childImageSharp {
          fixed(height: 80, width: 80) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `);

  const imageData = data.icon.childImageSharp.fixed;
  return (
    <Wrapper>
      <Img fixed={imageData} alt="Avatar" />
    </Wrapper>
  );
};

export { Avatar };
