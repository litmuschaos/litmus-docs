import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../Button";

it("matches snapshot", () => {
  const { asFragment } = render(<Button>Hello World!</Button>);
  expect(asFragment()).toMatchSnapshot();
});
