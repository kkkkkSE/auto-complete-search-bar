import { styled } from 'styled-components';

import { useDispatch, useSelector } from '../../stores/hooks';
import { resetFocusIndex, setFocusIndex } from '../../stores/SuggestionListSlice';

import SearchIcon from '../../../static/images/search-icon.svg';

interface SearchSuggestionItemProps {
  sickName: string;
  index: number;
}

export default function SearchSuggestionItem({
  sickName, index,
}: SearchSuggestionItemProps) {
  const dispatch = useDispatch();

  const { focusIndex } = useSelector((state) => state.suggestionList);

  const changeFocusIndex = () => {
    dispatch(setFocusIndex(index));
  };

  const initalizeFocusIndex = () => {
    dispatch(resetFocusIndex());
  };

  return (
    <Container
      $isFocus={index === focusIndex}
      onMouseOver={changeFocusIndex}
      onMouseOut={initalizeFocusIndex}
    >
      <img src={SearchIcon} alt={`${sickName} 검색`} />
      {sickName}
    </Container>
  );
}

const Container = styled.li<{$isFocus: boolean}>`
  display: flex;
  align-items: start;
  padding: .8rem 1.4rem;
  line-height: 1.3;
  cursor: pointer;

  img {
    width: 2.4rem;
    padding-right: .6rem;
    filter: invert(0.5);
  }

  ${({ $isFocus, theme }) => $isFocus && `
    background-color: ${theme.colors.gray100};
  `}
`;
