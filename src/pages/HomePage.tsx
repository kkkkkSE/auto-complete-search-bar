import { styled } from 'styled-components';

import SearchContainer from '../components/search/SearchContainer';

export default function HomePage() {
  return (
    <Container>
      <h2>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </h2>
      <SearchContainer />
    </Container>
  );
}

const Container = styled.div`
  h2 {
    ${({ theme }) => theme.texts.bold.h2}
    padding-bottom: 3rem;
    line-height: 1.5;
  }
`;
