import styled from "styled-components";

// Default Button Styles
const Button = styled.button`
  height: 3rem;
  min-width: 10rem;
  width: ${(props) => (props.theme.screens.sm ? "100%" : "18rem")};
  border: none;
  background: ${(props) =>
    props.gradientColor === "purple"
      ? props.theme.gradient.purple
      : props.gradientColor === "green"
      ? props.theme.gradient.green
      : props.backgroundColor};
  color: white;
  border-radius: 0.25rem;
  font-size: ${(props) => props.theme.fontSize.button};
  cursor: pointer;
  :disabled {
    background: lightgray;
  }
`;

// White On Green Button Styles
const WhiteOnGreenButton = styled.button`
  height: 2rem;
  min-width: 13rem;
  border: none;
  border-radius: 0.2rem;
  background: white;
  color: ${(props) => props.theme.colors.darkGreen(1)};
  font-size: ${(props) => props.theme.fontSize.small.lg};
  font-weight: bold;
  box-shadow: 0px 5px 13px rgba(0, 0, 0, 0.08);
  :disabled {
    background: white;
  }
`;

// Outline Button Styles
const OutlinedButton = styled.button`
  min-width: 2rem;
  padding: 0.5rem 2rem;
  background: transparent;
  width: ${(props) => (props.theme.screens.sm ? "100%" : "max-content")};
  color: ${(props) => props.backgroundColor};
  border: 0.05rem solid ${(props) => props.backgroundColor};
  border-radius: 0.5rem;
  font-size: ${(props) => props.theme.fontSize.button};
  cursor: pointer;
  :disabled {
    background: lightgray;
  }
`;

export { Button, OutlinedButton, WhiteOnGreenButton };
