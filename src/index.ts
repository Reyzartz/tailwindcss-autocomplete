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
import { MarkupContent } from "vscode-languageserver-types";

import { SuggestionItem, TailwindConfig, TTailwindVersion } from "./types";
import {
  getTextDocument,
  rgbaToHexA,
  splitClassWithSeparator,
  stateFromConfig,
} from "./utils.js";

class TailwindAutocomplete {
  tailwindConfig: TailwindConfig;
  version;
  private state: State;

  constructor(config: TailwindConfig, version: TTailwindVersion = "3.0.0") {
    this.tailwindConfig = config;
    this.version = version;
    this.state = stateFromConfig(config);
  }

  get config() {
    return this.tailwindConfig;
  }

  set config(config: TailwindConfig) {
    this.tailwindConfig = config;
    this.state = stateFromConfig(config);
  }

  get variants(): Variant[] {
    return this.state.variants ?? [];
  }

  async getSuggestionList(className: string): Promise<SuggestionItem[]> {
    const textDocument = getTextDocument(`<span class='${className}'></span>`);

    let [classCandidate, ...variants] = splitClassWithSeparator(
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

    const results = (
      await doComplete(this.state, textDocument, position)
    ).items.map((item) => {
      return {
        name: item.label as string,
        color:
          typeof item.documentation === "string" ? item.documentation : null,
        isVariant: item.data._type === "variant",
        variants: item.data?.variants ?? variants.reverse(),
        important: item.data?.important ?? false,
      };
    });

    return className.length === 0
      ? results
      : search(classCandidate, results, {
          keySelector: (ele) => ele.name,
          threshold: 0.6,
          sortBy: sortKind.bestMatch,
        });
  }

  async getCssText(className: string): Promise<string | null> {
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

  getVariantsFromClassName(className: string): string[] {
    const [_, ...variants] = splitClassWithSeparator(
      className,
      this.state.separator
    ).reverse();

    return variants.reverse();
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

export default TailwindAutocomplete;
export type { SuggestionItem, TailwindConfig, TTailwindVersion };
