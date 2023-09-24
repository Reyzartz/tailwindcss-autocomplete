import { AugmentedDiagnostic, Variant } from "tailwindcss-language-service";
import { SuggestionItem, TailwindConfig, TTailwindVersion } from "./types";
declare class TailwindAutocomplete {
    tailwindConfig: TailwindConfig;
    version: any;
    private state;
    constructor(config: TailwindConfig, version?: TTailwindVersion);
    get config(): TailwindConfig;
    set config(config: TailwindConfig);
    get variants(): Variant[];
    getSuggestionList(className: string): Promise<SuggestionItem[]>;
    getCssText(className: string): Promise<string | null>;
    getVariantsFromClassName(className: string): string[];
    validate(className: string): Promise<AugmentedDiagnostic[]>;
    getColor(className: string): string | null;
}
export default TailwindAutocomplete;
export type { SuggestionItem, TailwindConfig, TTailwindVersion };
