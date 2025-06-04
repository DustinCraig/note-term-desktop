import styled from "styled-components";
import { ReactNode } from "react";

export type StackProps = {
  children: ReactNode;
  direction?: "row" | "column";
  spacing?: number;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  wrap?: boolean;
  className?: string;
};

const StackContainer = styled.div<{
  $direction: "row" | "column";
  $spacing: number;
  $alignItems: string;
  $justifyContent: string;
  $wrap: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: ${({ $spacing }) => `${$spacing * 8}px`};
  align-items: ${({ $alignItems }) => $alignItems};
  justify-content: ${({ $justifyContent }) => $justifyContent};
  flex-wrap: ${({ $wrap }) => ($wrap ? "wrap" : "nowrap")};
`;

export default ({
  children,
  direction = "column",
  spacing = 1,
  alignItems = "stretch",
  justifyContent = "flex-start",
  wrap = false,
  className,
}: StackProps) => {
  return (
    <StackContainer
      $direction={direction}
      $spacing={spacing}
      $alignItems={alignItems}
      $justifyContent={justifyContent}
      $wrap={wrap}
      className={className}
    >
      {children}
    </StackContainer>
  );
};
