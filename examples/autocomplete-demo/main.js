import TailwindcssAutocomplete from "tailwindcss-autocomplete";

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Tailwind CSS Autocomplete Demo</h1>

    <br/>
    <h3>Type a class name</h3>

    <input type="text"/>

    <ul></ul>
  </div>
`;

const tailwindcssAutocomplete = new TailwindcssAutocomplete({});
const inputElement = document.querySelector("input");
const listElement = document.querySelector("ul");

const getSuggestionList = async (value) => {
  console.time();
  const list = await tailwindcssAutocomplete.getSuggestionList(value);
  console.timeEnd();

  listElement.innerHTML = list
    .slice(0, 20)
    .reduce(
      (str, item) =>
        str +
        `<li><span style="background:${item.documentation}">_</span> ${item.label} </li>`,
      ""
    );
};

function initialize() {
  inputElement.onkeyup = (event) => {
    getSuggestionList(event.target.value);
  };
}

initialize();
