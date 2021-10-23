import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2,
  h3 {
    margin-top: 20px;
    color: #788896;
  }
`;

export const Content = styled.div`
  /* @media (min-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  } */
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 1020px;
`;

export const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  width: 100%;
  max-width: 1020px;
`;
