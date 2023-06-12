import { search, sortKind } from "fast-fuzzy";
import { Rgb } from "culori";
import {
  AugmentedDiagnostic,
  doComplete,
  doHover,
  doValidate,
  getColor,
  resolveCompletionItem,
  State,
  Variant,
} from "tailwindcss-language-service";
import { CompletionItem, MarkupContent } from "vscode-languageserver-types";

import { ITailwindTool, TailwindConfig, TTailwindVersion } from "./types.js";
import {
  getTextDocument,
  rgbaToHexA,
  splitClassWithSeparator,
  stateFromConfig,
} from "./utils.js";

class TailwindTool implements ITailwindTool {
  config;
  version;
  private state: State;

  constructor(config: TailwindConfig, version: TTailwindVersion = "3.0.0") {
    this.config = config;
    this.version = version;
    this.state = stateFromConfig(config);
  }

  get variants(): Variant[] {
    return this.state.variants ?? [];
  }

  async getSuggestionList(className: string): Promise<CompletionItem[]> {
    const textDocument = getTextDocument(`<span class='${className}'></span>`);

    let [classCandidate] = splitClassWithSeparator(
      className,
      this.state.separator
    ).reverse();

    if (classCandidate.startsWith("!")) {
      classCandidate = classCandidate.slice(1);
    }

    const position = {
      character: 13 + className.length,
      line: 0,
    };

    const results = await doComplete(this.state, textDocument, position);

    return className.length === 0
      ? results.items
      : search(classCandidate, results.items, {
          keySelector: (ele) => ele.label,
          threshold: 0.6,
          sortBy: sortKind.bestMatch,
        });
  }

  async getClassCssText(className: string): Promise<string | null> {
    const textDocument = getTextDocument(`<span class='${className}'></span>`);

    const position = {
      character: 13,
      line: 0,
    };

    const res = await doHover(this.state, textDocument, position);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!res) {
      return null;
    }

    return (res.contents as MarkupContent).value;
  }

  async getResolveCompletionItem(
    item: CompletionItem
  ): Promise<CompletionItem> {
    const res = await resolveCompletionItem(this.state, item);

    return res;
  }

  // TODO:Doesn't work
  async validate(className: string): Promise<AugmentedDiagnostic[]> {
    const textDocument = getTextDocument(`<span class='${className}'></span>`);

    const res = await doValidate(this.state, textDocument);

    return res;
  }

  getColor(className: string): string | null {
    const result = getColor(this.state, className) as Rgb | string | null;

    if (result == null) {
      return null;
    }

    if (typeof result === "string") {
      return result;
    }

    return rgbaToHexA([
      result.r * 255,
      result.g * 255,
      result.b * 255,
      result.alpha,
    ]);
  }
}

export default TailwindTool;
