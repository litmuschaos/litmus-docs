import styled from "styled-components";

const SectionLight = styled.section`
  background-color: ${(props) => props.theme.colors.backgroundLight};
  padding: ${(props) => (props.theme.screens.lg ? "3rem 2rem" : "1rem 20%")};

  & > div {
    max-width: 112.5rem;
    margin: 0 auto;
  }
`;

const SectionDark = styled.section`
  background-color: ${(props) => props.theme.colors.backgroundDark};
  padding: ${(props) => (props.theme.screens.lg ? "3rem 2rem" : "1rem 20%")};

  & > div {
    max-width: 112.5rem;
    margin: 0 auto;
  }
`;

export { SectionLight, SectionDark };
