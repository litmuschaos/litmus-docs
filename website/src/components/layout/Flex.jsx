import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: ${props => props.wrap ?? "no-wrap"};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const ColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Center = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`;

export { Row, Column, ColumnCenter, Center };
