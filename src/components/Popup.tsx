import type { ReactNode } from "react";
import styled from "styled-components";

export type PopupProps = {
  children: ReactNode;
  onClose?: () => void;
  isOpen: boolean;
};

const PopupContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen = false }) => ($isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContent = styled.div`
  position: relative;
  background-color: black;
  padding: 3rem;
  width: 90vw;
  max-width: 500px;
  border: 2px solid #fff;
  border-radius: 4px;
`;

export default ({ children, onClose, isOpen }: PopupProps) => {
  return (
    <PopupContainer $isOpen={isOpen}>
      <PopupContent>{isOpen ? children : null}</PopupContent>
    </PopupContainer>
  );
};
