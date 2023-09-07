import { styled } from 'styled-components';

import { useSelector } from '../../stores/hooks';

import SearchSuggestionItem from './SearchSuggestionItem';

export default function SearchSuggestionList() {
  const { isError, searchSuggestionList } = useSelector((state) => state.search);

  if (isError) {
    return (
      <Container>
        <p>잠시 후 다시 시도해주세요.</p>
      </Container>
    );
  }

  if (searchSuggestionList.length === 0) {
    return (
      <Container>
        <p>검색어 없음</p>
      </Container>
    );
  }

  return (
    <Container>
      <p>추천 검색어</p>
      <ul>
        {searchSuggestionList.map((item, index) => (
          <SearchSuggestionItem
            key={item.sickCd}
            sickName={item.sickNm}
            index={index}
          />
        ))}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 1.2rem;
  padding-block: 1.4rem;
  box-shadow: 0 0 .6rem rgba(0, 0, 0, 0.15);
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.6rem;

  p {
    padding: 1.2rem 1.4rem;
    ${({ theme }) => theme.texts.regular.small}
    color: ${({ theme }) => theme.colors.gray500};
  }
`;
