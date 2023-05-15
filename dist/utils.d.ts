import { TextDocument } from 'vscode-languageserver-textdocument';
import { JitState, TailwindConfig, TTailwindVersion } from './types.js';
export declare function stateFromConfig(tailwindConfig: TailwindConfig, version?: TTailwindVersion): JitState;
export declare const getTextDocument: (textData: string, uri?: string, languageId?: string) => TextDocument;
export declare const splitClassWithSeparator: (input: string, separator?: string) => string[];
export declare function rgbaToHexA([red, green, blue, alpha]: [
    number,
    number,
    number,
    number?
]): string;
