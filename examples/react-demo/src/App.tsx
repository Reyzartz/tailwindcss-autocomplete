import { Fragment, useCallback, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import TailwindCssAutocomplete, {
  SuggestionItem,
} from "tailwindcss-autocomplete";

const tailwindCssAutocomplete = new TailwindCssAutocomplete({});

function App() {
  const [selected, setSelected] = useState<SuggestionItem>();
  const [query, setQuery] = useState("");

  const [classNames, setClassName] = useState<SuggestionItem[]>([]);

  const onChangeHandler = useCallback(async (value: string) => {
    setQuery(value);
    const result = await tailwindCssAutocomplete.getSuggestionList(value);

    console.log(result);

    setClassName(result.slice(0, 50));
  }, []);

  console.log(selected);

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-orange-50">
      <h1 className="text-4xl mb-10 font-semibold text-orange-800">
        Tailwind Css <span className="text-orange-400">Auto</span>Complete
      </h1>
      <Combobox<SuggestionItem> value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="flex relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            {selected && selected.variants.length > 0 && (
              <div className=" py-2 pl-4 pr-2 text-lg inline-block text-orange-800">
                {selected.variants.join(":")}:
              </div>
            )}

            <Combobox.Input<SuggestionItem>
              className="w-full border-none py-2 pl-4 pr-10 text-lg text-orange-800 leading-5 focus:ring-0 outline-none focus:bg-orange-100 placeholder:text-orange-300"
              displayValue={({ name }) => name}
              placeholder="Enter class name"
              onChange={(event) => onChangeHandler(event.target.value)}
            />

            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center p-2 font-semibold bg-orange-400 text-gray-50">
              Add
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-orange-50 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {classNames.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                classNames.map((className) => (
                  <Combobox.Option
                    key={className.name}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 text-orange-900 flex items-center gap-2 ${
                        active ? "bg-orange-100" : "bg-white"
                      }`
                    }
                    value={className}
                  >
                    {({ active }) => (
                      <>
                        {className.color === null ? (
                          <span className="font-semibold text-orange-400">
                            {className.isVariant ? `{}` : "☲"}
                          </span>
                        ) : (
                          <span
                            className="w-3 h-3 block border border-gray-900"
                            style={{ background: className.color }}
                          />
                        )}

                        <span
                          className={`block truncate ${
                            active ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {className.name}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default App;
