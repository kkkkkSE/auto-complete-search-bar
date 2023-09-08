import { Outlet } from 'react-router-dom';

import { styled } from 'styled-components';

export default function Layout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.sub};

  h2 {
    text-align: center;
  }
`;
