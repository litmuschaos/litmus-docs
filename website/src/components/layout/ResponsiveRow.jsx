import styled, { css } from "styled-components";

const ResponsiveRow = styled.div`
  width: 100%;
  display: flex;
  ${props =>
    props.theme.screens[props.breakpoint]
      ? css`
          flex-direction: column;
          align-items: ${props.alignItems ?? "center"};
        `
      : css`
          flex-direction: row;
          justify-content: ${props.justifyContent ?? "center"};
        `};
`;

export { ResponsiveRow };
