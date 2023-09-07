import { styled } from 'styled-components';

import SearchIcon from '../../../static/images/search-icon.svg';

interface SearchIconProps {
  width?: string;
  height?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SearchButton({
  width = '4rem', height = '4rem', onClick = undefined,
} : SearchIconProps) {
  return (
    <Container type="button" onClick={onClick} width={width} height={height}>
      <img src={SearchIcon} alt="검색" />
    </Container>
  );
}

const Container = styled.button<SearchIconProps>`
  ${({ theme }) => theme.alignCenter.horizontal}
  position: absolute;
  right: .6rem;
  top: 50%;
  transform: translateY(-50%);

  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  img {
    width: 80%;
    filter: invert(1);
  }
`;
