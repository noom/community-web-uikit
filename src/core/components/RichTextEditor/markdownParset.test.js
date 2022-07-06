import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { EMPTY_VALUE } from './constants';

const markdownText = 'This is **bold** and _italic_ and ~~strike through~~ text';

const slateState = [
  {
    children: [
      {
        text: 'This is ',
      },
      {
        bold: true,
        text: 'bold',
      },
      {
        text: ' and ',
      },
      {
        italic: true,
        text: 'italic',
      },
      {
        text: ' and ',
      },
      { strikeThrough: true, text: 'strike through' },
      {
        text: ' text',
      },
    ],
    type: 'paragraph',
  },
];

describe('markdownToSlate', () => {
  test('should transform empty string to an empty value', () => {
    expect(markdownToSlate('')).toEqual([EMPTY_VALUE]);
  });

  test('should transform markdown string to a slate state', () => {
    expect(markdownToSlate(markdownText)).toEqual(slateState);
  });
});

describe('slateToMarkdown', () => {
  test('should transform empty array to a string', () => {
    expect(slateToMarkdown([])).toEqual('');
  });

  test('should transform markdown string to a slate state', () => {
    expect(slateToMarkdown(slateState).trim()).toEqual(markdownText);
  });
});
