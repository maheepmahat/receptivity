import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 44px;
  &:hover {
    cursor: pointer;
  }
`;

export const Image = styled.img`
  padding: 5px;
`;
