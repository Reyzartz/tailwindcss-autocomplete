import { Config } from "tailwindcss";
import { State } from "tailwindcss-language-service";

export interface JitState extends State {
  config: Config;
}

export type TTailwindVersion = "3.0.0";

export interface SuggestionItem {
  name: string;
  color: string | null;
  isVariant: boolean;
  variants: string[];
  important: boolean;
}

export type TailwindConfig = Omit<Config, "content">;
