import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    margin: 20px 0;
    color: #788896;
  }
  h3 {
    margin-top: 1em;
    color: #788896;
    text-align: center;
  }
`;

export const GiftCardRequest = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  border: 2px solid #c5ced6;
  width: 100%;
  max-width: 900px;
  margin: 5px;
  padding: 1em;
  > div {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    @media (max-width: 500px) {
      flex-direction: column;
    }
    justify-content: space-between;
  }
  img {
    margin: 10px;
    width: 100%;
    max-width: 300px;
    align-self: center;
  }
`;

export const GiftCardRequestData = styled.div`
  width: 100%;
  font-size: 16px;
  color: #293845;
  label {
    font-weight: bold;
  }
`;

export const ValidateGiftCardModal = styled.div`
  div:nth-of-type(1n) {
    margin: 0;
    text-align: left;
    width: 100%;
    span {
      label {
        font-weight: bold;
      }
    }
  }
  div:nth-of-type(2n) {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;

export const GetGiftCardModal = styled.div`
  div:nth-of-type(2n) {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;

export const GetGiftCardWithQRCodeModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 {
    margin-bottom: 10px;
  }
  div:nth-of-type(2n) {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;
