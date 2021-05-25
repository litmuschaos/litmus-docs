import styled from "styled-components";

const BoundedContainer = styled.div`
  max-width: 40rem;
  margin: ${props =>
    props.theme.screens[props.breakpoint] ? "1rem 0" : props.margin};
  width: ${props =>
    props.theme.screens[props.breakpoint] ? "100%" : props.width};
`;

export { BoundedContainer };
