import { AugmentedDiagnostic, Variant } from "tailwindcss-language-service";
import { ITailwindTool, SuggestionItem, TailwindConfig, TTailwindVersion } from "./types";
declare class TailwindTool implements ITailwindTool {
    config: TailwindConfig;
    version: "3.0.0";
    private state;
    constructor(config: TailwindConfig, version?: TTailwindVersion);
    get variants(): Variant[];
    getSuggestionList(className: string): Promise<SuggestionItem[]>;
    getClassCssText(className: string): Promise<string | null>;
    validate(className: string): Promise<AugmentedDiagnostic[]>;
    getColor(className: string): string | null;
}
export default TailwindTool;
export type { ITailwindTool, SuggestionItem, TailwindConfig, TTailwindVersion };
