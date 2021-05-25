import { Link as GatsbyLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled(GatsbyLink)`
  display: block;
  color: black;
  text-decoration: none;
  :hover {
    color: black;
  }
`;

export { Link };
