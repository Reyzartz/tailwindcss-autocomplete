import postcss from 'postcss';
import postcssSelectorParser from 'postcss-selector-parser';
import expandApplyAtRules from 'tailwindcss/src/lib/expandApplyAtRules.js';
import { generateRules } from 'tailwindcss/src/lib/generateRules.js';
import { createContext } from 'tailwindcss/src/lib/setupContextUtils.js';
import resolveConfig from 'tailwindcss/src/public/resolve-config.js';
import { splitAtTopLevelOnly } from 'tailwindcss/src/util/splitAtTopLevelOnly.js';
import { EditorState, getColor } from 'tailwindcss-language-service';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { JitState, TailwindConfig, TTailwindVersion } from './types.js';

const DEFAULT_URI = '';
const DEFAULT_LANGUAGE_ID = 'html';

export function stateFromConfig(
  tailwindConfig: TailwindConfig,
  version: TTailwindVersion = '3.0.0',
): JitState {
  // eslint-disable-next-line no-console
  // console.count('stateFromConfig');

  const config = resolveConfig(tailwindConfig);
  const jitContext = createContext(config);

  const state: JitState = {
    version,
    config,
    enabled: true,
    modules: {
      postcss: {
        // @ts-expect-error https://github.com/postcss/postcss/pull/1815
        module: postcss,
        version: '',
      },
      postcssSelectorParser: { module: postcssSelectorParser },
      jit: {
        createContext: { module: createContext },
        expandApplyAtRules: { module: expandApplyAtRules },
        generateRules: { module: generateRules },
      },
    },
    classNames: {
      classNames: {},
      context: {},
    },
    jit: true,
    jitContext,
    separator: config.separator,
    screens: config.theme?.screens ? Object.keys(config.theme.screens) : [],
    variants: jitContext.getVariants(),
    editor: {
      userLanguages: {},
      capabilities: {
        configuration: true,
        diagnosticRelatedInformation: true,
        itemDefaults: [],
      },
      // eslint-disable-next-line require-await
      async getConfiguration() {
        return {
          editor: { tabSize: 2 },
          // Default values are based on
          // https://github.com/tailwindlabs/tailwindcss-intellisense/blob/v0.9.1/packages/tailwindcss-language-server/src/server.ts#L259-L287
          tailwindCSS: {
            emmetCompletions: false,
            classAttributes: ['class', 'className', 'ngClass'],
            codeActions: true,
            hovers: true,
            suggestions: true,
            validate: true,
            colorDecorators: true,
            rootFontSize: 16,
            lint: {
              cssConflict: 'warning',
              invalidApply: 'error',
              invalidScreen: 'error',
              invalidVariant: 'error',
              invalidConfigPath: 'error',
              invalidTailwindDirective: 'error',
              recommendedVariantOrder: 'warning',
            },
            showPixelEquivalents: true,
            includeLanguages: {},
            files: {
              // Upstream defines these values, but we don’t need them.
              exclude: [],
            },
            experimental: {
              classRegex: [],
              // Upstream types are wrong
              configFile: {},
            },
          },
        };
      },
      // This option takes some properties that we don’t have nor need.
    } as Partial<EditorState> as EditorState,
  };

  state.classList = jitContext
    .getClassList()
    .filter((className) => className !== '*')
    .map((className) => [className, { color: getColor(state, className) }]);

  return state;
}

export const getTextDocument = (
  textData: string,
  uri: string = DEFAULT_URI,
  languageId = DEFAULT_LANGUAGE_ID,
): TextDocument => TextDocument.create(uri, languageId, 1, textData);

export const splitClassWithSeparator = (input: string, separator = ':'): string[] => {
  if (input === '*') {
    return ['*'];
  }

  return splitAtTopLevelOnly(input, separator);
};

export function rgbaToHexA([red, green, blue, alpha = 1]: [
  number,
  number,
  number,
  number?,
]): string {
  let r = red.toString(16);
  let g = green.toString(16);
  let b = blue.toString(16);
  let a = Math.round(alpha * 255).toString(16);

  if (r.length === 1) {
    r = `0${r}`;
  }
  if (g.length === 1) {
    g = `0${g}`;
  }
  if (b.length === 1) {
    b = `0${b}`;
  }
  if (a.length === 1) {
    a = `0${a}`;
  }

  return `#${r}${g}${b}${a}`;
}
