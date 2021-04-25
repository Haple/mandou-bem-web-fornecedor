import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #DFE6ED;
    color: #fff;
    -webkit-font-smoothing: antialiased
  }

  body, input, button, select, option {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }

  h1, h2, h3, h4, h5, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`;
