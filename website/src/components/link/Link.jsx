import { Link as GatsbyLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled(GatsbyLink)`
  display: block;
  color: ${props => props.color ?? 'black'};
  text-decoration: none;
  :hover {
    color: ${props => props.color ?? 'black'};
    text-decoration: none;
  }
`;

export { Link };
