const opacityCheck = (opacity) => {
  return opacity && opacity >= 0 && opacity <= 1;
};

export default {
  screens: {
    // max-widths in pixels
    xs: 450,
    sm: 640,
    md: 768,
    mmd: 890,
    lg: 1024,
    xl: 1280,
    xxl: 1350,
    xxxl: 1600,
    xxxxl: 1800,
  },
  fontSize: {
    heading: { lg: "2rem", md: "1.5rem" },
    subHeading: { lg: "1.3rem", md: "1.1rem" },
    paragraph: { lg: "0.9rem", md: "0.7rem" },
    subText: { lg: "1.1rem", md: "0.9rem" },
    button: "1rem",
    small: { lg: "0.7rem", md: "0.6rem" },
  },
  colors: {
    backgroundLight: "#F9FAFC",
    backgroundDark: "#F4F5F7",
    spaceGrey: "#F1F2F6",
    lightGray: "#EBEBEB",
    darkGray: "#6F6F6F",
    textPrimary: "#042A2B",
    textSecondary: "#5B44BA",

    grayText: (opacity) =>
      opacityCheck(opacity)
        ? `rgba(102, 102, 102, ${opacity})`
        : `rgba(102, 102, 102, 1)`,
    red: (opacity) =>
      opacityCheck(opacity)
        ? `rgba(202, 44, 44, ${opacity})`
        : `rgba(202, 44, 44, 1)`,
    purple: (opacity) =>
      opacityCheck(opacity)
        ? `rgba(133, 140, 221, ${opacity})`
        : `rgba(133, 140, 221, 1)`,
    darkGreen: (opacity) =>
      opacityCheck(opacity)
        ? `rgba(16, 155, 103, ${opacity})`
        : `rgba(16, 155, 103, 1)`,
    lightGreen: (opacity) =>
      opacityCheck(opacity)
        ? `rgba(37, 193, 135, ${opacity})`
        : `rgba(37, 193, 135, 1)`,
    yellow: (opacity) =>
      opacityCheck(opacity)
        ? `rgba(240, 183, 64, ${opacity})`
        : `rgba(240, 183, 64, 1)`,
  },
  opacity: {
    0: 0,
    25: 0.25,
    50: 0.5,
    75: 0.75,
    100: 1,
  },
  zIndex: {
    content: "10",
    nav: "50",
  },
  gradient: {
    purple:
      "linear-gradient(135.47deg, #858CDD 1.77%, rgba(133, 140, 221, 0) 64.41%), #5B44BA;",
    green: "linear-gradient(82.87deg, #109C68 25.92%, #25C087 78.64%);",
    lightGreenGradient:
      "linear-gradient(270deg, #25C187 0%, rgba(37, 193, 135, 0) 100%)",
    fadedLine: (deg) => `linear-gradient(
            ${deg}deg,
            rgba(235, 235, 235, 0) 0%,
            #ebebeb 10%,
            #ebebeb 85%,
            rgba(235, 235, 235, 0) 100%
          );`,
  },
};
