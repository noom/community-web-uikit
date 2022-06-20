import React, { useState, useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate-markup';
import styled from 'styled-components';
import customizableComponent from '~/core/hocs/customization';
import Button from '~/core/components/Button';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import { processChunks } from '~/core/components/ChunkHighlighter';
import { findChunks } from '~/helpers/utils';

export const PostContent = styled.div`
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const ReadMoreButton = styled(Button).attrs({ variant: 'secondary' })`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 4px;
  display: inline-block;
`;

function formatMentions(text, mentionees, tag = 'mention') {
  const chunks = processChunks(text, findChunks(mentionees));
  let highlightIndex = 0;
  let formattedText = '';

  chunks.forEach((chunk) => {
    const chunkText = text.substring(chunk.start, chunk.end);

    if (chunk.highlight) {
      formattedText += `<${tag} highlightIndex="${highlightIndex}">${chunkText}</${tag}>`;
      highlightIndex += 1;
    } else {
      formattedText += chunkText;
    }
  });

  return formattedText;
}

const TextContent = ({ text, postMaxLines, mentionees }) => {
  const textWithMentions = useMemo(
    () => formatMentions(text, mentionees, 'mention'),
    [text, mentionees],
  );

  const textContent = textWithMentions && (
    <PostContent>
      <Markdown
        options={{
          overrides: {
            mention: {
              component: MentionHighlightTag,
              props: {
                mentionees,
              },
            },
          },
        }}
      >
        {textWithMentions}
      </Markdown>
    </PostContent>
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const onExpand = () => setIsExpanded(true);

  if (textContent && isExpanded) return textContent;

  return (
    <Truncate.Atom
      lines={postMaxLines}
      ellipsis={
        <ReadMoreButton onClick={onExpand}>
          <FormattedMessage id="post.readMore" />
        </ReadMoreButton>
      }
    >
      {textContent}
    </Truncate.Atom>
  );
};

TextContent.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  postMaxLines: PropTypes.number,
  mentionees: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number,
      length: PropTypes.number,
    }),
  ),
};

TextContent.defaultProps = {
  text: '',
  postMaxLines: 8,
  mentionees: undefined,
};

export default customizableComponent('UITextContent', TextContent);
