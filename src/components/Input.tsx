import React, { useState, useEffect, useRef } from "react";
import { TEXT_COLOR } from "../Styles";
import Stack from "./Stack";
import styled from "styled-components";

const InputContainer = styled.div`
  color: ${TEXT_COLOR};
  background: transparent;
  padding: 0.5rem;
  border: 1px solid ${TEXT_COLOR};
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const Prompt = styled.span`
  color: ${TEXT_COLOR};
  margin-right: 0.5rem;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${TEXT_COLOR};
  width: 100%;
  outline: none;
  caret-color: ${TEXT_COLOR};
  font-size: 1.2em;
`;

const Cursor = styled.span<{ $isVisible: boolean }>`
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: ${TEXT_COLOR};
  margin-left: 2px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  animation: blink 1s step-end infinite;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

type InputProps = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  prompt?: string;
  autoFocus?: boolean;
};

export default ({
  onSubmit,
  placeholder = "",
  prompt = "",
  autoFocus = true,
}: InputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [autoFocus, inputRef.current]);

  useEffect(() => {
    return () => {
      setValue("");
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <InputContainer>
      <Prompt>{prompt}</Prompt>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </InputContainer>
  );
};
