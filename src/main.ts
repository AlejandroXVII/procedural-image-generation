import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

// Function that choose a value of the entropy values of a Cell
/**
 * @param {string[]} entropyValues - A string of values
 * @returns {string} The value that has been chosen
 */
function collapse(entropyValues: string[]): string {
	return entropyValues[Math.floor(Math.random() * entropyValues.length)];
}

//Element that can be next to another element
//Element that repeat its name inside the array is to allow to be close to itself
//At the moment are element that can be next to because it could be more scalable
let rules = new Map<string, string[]>();
rules.set("water", ["water", "sand"]);
rules.set("sand", ["sand", "grass", "water"]);
rules.set("grass", ["grass", "sand"]);

interface CellType {
	entropyValues: string[];
	value: string;
	isCollapsed: boolean;
}

//The initial state of a cell with all the possible entropyValues, so this state has the entropy lv higher
const cell: CellType = {
	entropyValues: ["water", "grass", "sand"],
	value: "",
	isCollapsed: false,
};

//Declare the high and wight of the Matrix as well as the matrix itself
let columns: number = 3;
let rows: number = 3;
let matrix = new Map<string, CellType>();

//Initialized the matrix with all its values as CellType
for (let indexColumn = 0; indexColumn < columns; indexColumn++) {
	for (let indexRow = 0; indexRow < rows; indexRow++) {
		matrix.set([indexColumn, indexRow].toString(), cell);
	}
}
console.log(matrix);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
