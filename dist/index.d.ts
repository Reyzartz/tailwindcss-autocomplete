import { AugmentedDiagnostic, Variant } from "tailwindcss-language-service";
import { ITailwindTool, SuggestionItem, TailwindConfig, TTailwindVersion } from "./types";
declare class TailwindTool implements ITailwindTool {
    tailwindConfig: TailwindConfig;
    version: any;
    private state;
    constructor(config: TailwindConfig, version?: TTailwindVersion);
    get config(): TailwindConfig;
    set config(config: TailwindConfig);
    get variants(): Variant[];
    getSuggestionList(className: string): Promise<SuggestionItem[]>;
    getClassCssText(className: string): Promise<string | null>;
    validate(className: string): Promise<AugmentedDiagnostic[]>;
    getColor(className: string): string | null;
}
export default TailwindTool;
export type { ITailwindTool, SuggestionItem, TailwindConfig, TTailwindVersion };
