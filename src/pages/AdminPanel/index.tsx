import React from 'react';

import { useHistory } from 'react-router-dom';
import Header from '~/components/Header';
import gift from '~/assets/draw-gift.svg';
import giftCard from '~/assets/draw-gift-card.svg';
import analytics from '~/assets/draw-data.svg';

import { Container, Content, Option } from './styles';
import Button from '~/components/Button';

const AdminPanel: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <Header />
      <Container>
        <Content>
          <Option>
            <img
              src={gift}
              alt="Ilustração de um rapaz sentado em uma grande caixa de presentes"
            />
            <Button
              light
              onClick={() => history.push('/admin-panel/gift-cards')}
            >
              Vales-presente
            </Button>
          </Option>
          <Option>
            <img
              src={giftCard}
              alt="Ilustração de uma mulher com um grande vale-presente"
            />
            <Button
              light
              onClick={() => history.push('/admin-panel/validate-gift-card')}
            >
              Validar vale-presente
            </Button>
          </Option>
          {/* <Option>
            <img
              src={acceptRequest}
              alt="Ilustração de uma mulher analisando solicitações"
            />
            <Button
              disabled
              light
              onClick={() => history.push('/admin-panel/reward-requests')}
            >
              Prêmios resgatados
            </Button>
          </Option> */}
          <Option>
            <img src={analytics} alt="???" />
            <Button
              light
              disabled
              onClick={() => history.push('/admin-panel/analytics')}
            >
              Relatório de resgates (em breve)
            </Button>
          </Option>
        </Content>
      </Container>
    </>
  );
};

export default AdminPanel;
