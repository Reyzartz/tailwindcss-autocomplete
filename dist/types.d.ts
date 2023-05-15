import { Color } from 'culori';
import { Config } from 'tailwindcss';
import { KeywordColor, State } from 'tailwindcss-language-service';
export interface JitState extends State {
    config: Config;
}
export type TTailwindVersion = '3.0.0';
export type TSuggestionListItem = [
    string,
    {
        color: Color | KeywordColor | null;
        modifiers?: string[] | undefined;
    }
];
export type TailwindConfig = Omit<Config, 'content'>;
export interface ITailwindTool {
    config: TailwindConfig;
    version: TTailwindVersion;
}
