import { AugmentedDiagnostic, Variant } from "tailwindcss-language-service";
import { CompletionItem } from "vscode-languageserver-types";
import { ITailwindTool, TailwindConfig, TTailwindVersion } from "./types.js";
declare class TailwindTool implements ITailwindTool {
    config: TailwindConfig;
    version: "3.0.0";
    private state;
    constructor(config: TailwindConfig, version?: TTailwindVersion);
    get variants(): Variant[];
    getSuggestionList(className: string): Promise<CompletionItem[]>;
    getClassCssText(className: string): Promise<string | null>;
    getResolveCompletionItem(item: CompletionItem): Promise<CompletionItem>;
    validate(className: string): Promise<AugmentedDiagnostic[]>;
    getColor(className: string): string | null;
}
export default TailwindTool;
