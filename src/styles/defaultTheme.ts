const defaultTheme = {
  texts: {
    bold: {
      h1: `
        font-size: 2.8rem;
        font-weight: bold;
      `,
      h2: `
        font-size: 2.4rem;
        font-weight: bold;
      `,
      h3: `
        font-size: 2.0rem;
        font-weight: bold;
      `,
      h4: `
        font-size: 1.8rem;
        font-weight: bold;
      `,
      h5: `
        font-size: 1.6rem;
        font-weight: bold;
      `,
      h6: `
        font-size: 1.2rem;
        font-weight: bold;
      `,
    },
    regular: {
      large: `
        font-size: 1.8rem;
        font-weight: normal;
      `,
      medium: `
        font-size: 1.6rem;
        font-weight: normal;
      `,
      small: `
        font-size: 1.4rem;
        font-weight: normal;
      `,
      hint: `
        font-size: 1.2rem;
        font-weight: normal;
      `,
    },
  },
  colors: {
    white: '#FFFFFF',
    black: '#282828',
    main: '#D8EBFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray500: '#9E9E9E',
    gray700: '#616161',
  },
  alignCenter: {
    vertical: `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `,
    horizontal: `
      display: flex;
      align-items: center;
      justify-content: center;
    `,
  },
};

export default defaultTheme;
