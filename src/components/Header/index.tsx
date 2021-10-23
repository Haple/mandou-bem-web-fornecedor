import React, { useState } from 'react';

import { FiMenu } from 'react-icons/fi';
import { Container, StyledLink, MenuButton } from './styles';

const Header: React.FC = () => {
  const [toggled, setToggled] = useState(false);

  return (
    <Container toggled={toggled}>
      <header>
        <div className="firstRow">
          <div>
            <h2>
              Mandou <b>Bem</b>
            </h2>
          </div>

          <MenuButton>
            <button type="button" onClick={() => setToggled(!toggled)}>
              <FiMenu />
            </button>
          </MenuButton>
        </div>

        <nav>
          <StyledLink to="/gift-card-summary">
            Monitor de Vales-Presente
          </StyledLink>
          <StyledLink to="/profile">Meu Perfil</StyledLink>
          <StyledLink to="/admin-panel">Painel administrativo</StyledLink>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
