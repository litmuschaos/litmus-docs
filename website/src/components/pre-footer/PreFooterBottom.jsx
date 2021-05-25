import React from "react";
import styled from "styled-components";
import { BoundedContainer, Center, Row, SectionDark } from "../layout";
import { SubHeading } from "../texts";
import { top_adopters } from "./data";

const Image = styled.img`
  height: 4rem;
  width: auto;
  line-height: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.theme.screens.sm ? "1fr 1fr" : "1fr 1fr 1fr 1fr"};
  grid-gap: 5rem;
  row-gap: 2rem;
`;

const PreFooterBottom = () => {
  return (
    <SectionDark>
      <BoundedContainer breakpoint="md" width="65%" margin="0 0 0 2rem">
        <Center>
          <SubHeading
            style={{
              color: "#000",
              fontSize: "1.2rem",
              margin: "-2rem 0 3rem 0",
            }}
          >
            The #1 OSS Chaos engineering system is loved and adopted by
          </SubHeading>
          <Row wrap="wrap">
            <Grid>
              {top_adopters.links.map((link) => (
                <Image
                  key={link.name}
                  src={link.image}
                  alt={`${link.name} logo`}
                />
              ))}
            </Grid>
          </Row>
        </Center>
      </BoundedContainer>
    </SectionDark>
  );
};

export { PreFooterBottom };
