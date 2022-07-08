import {
  createPluginFactory,
  isUrl as isUrlProtocol,
  onKeyDownLink,
  LinkPlugin,
  withLink,
} from '@udecode/plate';

export const ELEMENT_LINK = 'a';

/**
 * Enables support for hyperlinks.
 */
export const createLinkPlugin = createPluginFactory<LinkPlugin>({
  key: ELEMENT_LINK,
  isElement: true,
  isInline: true,
  props: ({ element }) => ({ nodeProps: { url: element?.url } }),
  handlers: {
    onKeyDown: onKeyDownLink,
  },
  withOverrides: withLink,
  options: {
    isUrl: isUrlProtocol,
    rangeBeforeOptions: {
      matchString: ' ',
      skipInvalid: true,
      afterMatch: true,
    },
    hotkey: 'mod+k',
  },
  then: (editor, { type }) => ({
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'A',
        },
      ],
      getNode: (el) => ({
        type,
        url: el.getAttribute('href'),
      }),
    },
  }),
});
