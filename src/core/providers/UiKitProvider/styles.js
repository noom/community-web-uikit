import styled from 'styled-components';

export const UIStyles = styled.div`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.base.main};
  width: 100%;
  height: 100%;
  overflow: hidden;
  input,
  div {
    box-sizing: border-box;
  }

  blockquote {
    border-left: 0.3em solid lightgrey;
    padding-left: 1em;
    margin-left: 0.5em;
  }

  .slate-ToolbarButton-active {
    color: white;
    background-color: var(--chakra-colors-primary-500);
    border-radius: 15%;
  }

  ul,
  ol {
    padding-inline-start: 1.5em;
  }

  p {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  li > p {
    margin: 0;
  }

  /* // CSS resets to avoid inheriting from other other libraries e.g. antd.
  & * {
    font-size: ${({ theme }) => theme.typography.body.fontSize};
    line-height: 1.5;
  } */

  & pre {
    ${({ theme }) => theme.typography.body}
  }
`;
