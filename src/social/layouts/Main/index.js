import React from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

const Container = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas: 'side main' 'none main';
  grid-template-columns: min-content auto;
  grid-template-rows: 100%;
  grid-gap: 0 20px;
  width: 100%;
  height: 100%;
  padding: 0 20px 0 0;
  background: ${({ theme }) => theme.palette.background.main};
`;

const Main = styled.div`
  grid-area: main;
  overflow: auto;
  width: 100%;
  min-width: 20rem;
  max-width: 90.75rem;
  margin: 0 auto;
`;

const Side = styled.div`
  grid-area: side;
  overflow: auto;
`;

const Layout = ({ aside, children }) => {
  return (
    <Container>
      <Main>{children}</Main>
      <Side>{aside}</Side>
    </Container>
  );
};

export default customizableComponent('Layout', Layout);
