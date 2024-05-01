import "./style.css";
import { setupCounter } from "./counter.ts";
import grassSRC from "./textures/grass.png";
import sandSRC from "./textures/sand.png";
import waterSRC from "./textures/water.png";

/**
 * @param {number} max - Any Int number
 * @returns {number} An Int number between 0 and max param
 */
function getRandom(max: number): number {
	return Math.floor(Math.random() * max);
}

//Element that can be next to another element
//Element that repeat its name inside the array is to allow to be close to itself
//At the moment are element that can be next to because it could be more scalable
let rules = new Map<string, string[][]>();
rules.set("water", [
	["water", "st-wb", "c-wtl-s", "c-wtr-s"],
	["water", "sr-wl", "c-wrb-s", "c-wtr-s"],
	["water", "wt-sb-", "c-wbl-s", "c-wrb-s"],
	["water", "wr-sl", "c-wbl-s", "c-wtl-s"],
]);
rules.set("grass", [
	["grass", "sand"],
	["grass", "sand"],
	["grass", "sand"],
	["grass", "sand"],
]);
rules.set("sand", [
	["sand", "wt-sb", "c-stl-w", "c-str-w"],
	["sand", "wr-sl", "c-slb-w", "c-str-w"],
	["sand", "st-wb", "c-sbl-w", "c-slb-w"],
	["sand", "wr-sl", "c-sbl-w", "c-stl-w"],
]);
rules.set("st-wb", [
	["sand"],
	["st-wb", "c-wtl-s", "c-sbl-w"],
	["water", "wt-sb"],
	["st-wb", "c-wtr-s", "c-slb-w"],
]);
rules.set("wt-sb", [
	["water", "st-wb"],
	["wt-sb", "c-stl-w", "c-wbl-s"],
	["sand"],
	["wt-sb", "c-str-w", "c-wrb-s"],
]);
rules.set("sr-wl", [
	["sr-wl", "c-sbl-w", "c-wrb-s"],
	["sand"],
	["sr-wl", "c-stl-w", "c-wtr-s"],
	["water", "wr-sl"],
]);
rules.set("wr-sl", [
	["wr-sl", "c-slb-w", "c-wbl-s"],
	["water", "sr-wl"],
	["wr-sl", "c-str-w", "c-wtl-s"],
	["sand"],
]);
rules.set("c-sbl-w", [
	["sand"],
	["sand"],
	["c-stl-w", "c-wtr-s", "sr-wl"],
	["c-slb-w", "c-wtr-s", "st-wb"],
]);
rules.set("c-slb-w", [
	["sand"],
	["c-sbl-w", "c-wtl-s", "st-wb"],
	["c-str-w", "c-wtl-s", "wr-sl"],
	["sand"],
]);
rules.set("c-stl-w", [
	["sr-wl", "c-sbl-w", "c-wrb-s"],
	["sand"],
	["sand"],
	["wt-sb", "c-str-w", "c-wrb-s"],
]);
rules.set("c-str-w", [
	["wr-sl", "c-slb-w", "c-wbl-s"],
	["wt-sb", "c-stl-w", "c-wbl-s"],
	["sand"],
	["sand"],
]);
rules.set("c-wbl-s", [
	["water", "st-wb", "c-wtl-s", "c-wtr-s"],
	["water", "sr-wl", "c-wrb-s", "c-wtr-s"],
	["wr-sl", "c-str-w", "c-wtl-s"],
	["wt-sb", "c-str-w", "c-wrb-s"],
]);
rules.set("c-wrb-s", [
	["water", "st-wb", "c-wtl-s", "c-wtr-s"],
	["wt-sb", "c-stl-w", "c-wbl-s"],
	["sr-wl", "c-stl-w", "c-wtr-s"],
	["water", "wr-sl", "c-wbl-s", "c-wtl-s"],
]);
rules.set("c-wtl-s", [
	["wr-sl", "c-slb-w", "c-wbl-s"],
	["water", "sr-wl", "c-wrb-s", "c-wtr-s"],
	["water", "wt-sb-", "c-wbl-s", "c-wrb-s"],
	["st-wb", "c-wtr-s", "c-slb-w"],
]);
rules.set("c-wtr-s", [
	["sr-wl", "c-sbl-w", "c-wrb-s"],
	["st-wb", "c-wtl-s", "c-sbl-w"],
	["water", "wt-sb-", "c-wbl-s", "c-wrb-s"],
	["water", "wr-sl", "c-wbl-s", "c-wtl-s"],
]);

interface CellType {
	entropyValues: string[];
	value: string;
	isCollapsed: boolean;
	coordinate: Coordinate;
}

type Coordinate = [number, number];
//The initial state of a cell with all the possible entropyValues, so this state has the entropy lv higher
class Cell {
	entropyValues: string[];
	value: string;
	isCollapsed: boolean;
	coordinate: Coordinate;
	constructor(coordinate: Coordinate) {
		this.entropyValues = ["water", "grass", "sand"];
		this.value = "";
		this.isCollapsed = false;
		this.coordinate = coordinate;
	}
}

type UnclearCell = CellType | undefined;
const isCellType = (cell: UnclearCell): cell is CellType => {
	return cell instanceof Cell;
};

//Declare the high and wight of the Matrix as well as the matrix itself
let columns = 20;
let rows = 20;
let matrix = new Map<string, CellType>();
let entropyCellList: CellType[] = [];
let counter = 0;
// Function that choose a value of the entropy values of a Cell
//An then propagate to the next to cell
/** @param {number[]} coordinate - The coordinate of the obj in the matrix that its going to collapse*/
function collapse(coordinate: number[]): void {
	function propagate(
		currentCoordinate: string,
		propagateCoordinate: string
	): void {
		const currentCell = matrix.get(currentCoordinate);
		const propagateCell = matrix.get(propagateCoordinate);
		if (!isCellType(currentCell)) return;
		if (!isCellType(propagateCell)) return;

		const ruleArray = rules.get(currentCell.value);
		if (ruleArray === undefined) return;
		propagateCell.entropyValues = propagateCell.entropyValues
			.map((item) => item)
			.filter((element) => ruleArray.includes(element));
		entropyCellList.push(propagateCell);
	}
	let cell = matrix.get(coordinate.toString());

	if (!isCellType(cell)) return;

	let entropyIndex = getRandom(cell.entropyValues.length);
	cell.entropyValues = [cell.entropyValues[entropyIndex]];
	cell.isCollapsed = true;
	cell.value = cell.entropyValues[0];

	//Get the up, down, left and right keys to the cells value object
	let upKey = [coordinate[0] - 1, coordinate[1]].toString();
	let DownKey = [coordinate[0] + 1, coordinate[1]].toString();
	let LeftKey = [coordinate[0], coordinate[1] - 1].toString();
	let RightKey = [coordinate[0], coordinate[1] + 1].toString();

	propagate(coordinate.toString(), upKey);
	propagate(coordinate.toString(), DownKey);
	propagate(coordinate.toString(), LeftKey);
	propagate(coordinate.toString(), RightKey);

	entropyCellList.sort((a, b) => {
		if (a.entropyValues.length < b.entropyValues.length) {
			return 1;
		} else {
			return -1;
		}
	});
	if (entropyCellList.length > 0 && counter < columns * rows) {
		let newCurrentCell = entropyCellList.shift();
		if (isCellType(newCurrentCell)) {
			counter += 1;
			collapse(newCurrentCell.coordinate);
		}
	} else {
		console.log(matrix);
		renderTerrane();
	}
}

function renderTerrane() {
	window.onload = () => {
		const container = document.getElementById("terrane-container");
		console.log(container);
		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				const textureIMG = document.createElement("img");
				const currentCell = matrix.get([x, y].toString());
				if (isCellType(currentCell))
					switch (currentCell.entropyValues[0]) {
						case "water":
							textureIMG.src = waterSRC;
							break;
						case "grass":
							textureIMG.src = grassSRC;
							break;
						case "sand":
							textureIMG.src = sandSRC;
							break;
						default:
							break;
					}
				container?.appendChild(textureIMG);
				container?.setAttribute(
					"style",
					"display: grid;grid-template-columns: repeat(" +
						columns +
						", auto);justify-content: center;"
				);
			}
		}
	};
}

//Initialized the matrix with all its values as CellType
for (let indexColumn = 0; indexColumn < columns; indexColumn++) {
	for (let indexRow = 0; indexRow < rows; indexRow++) {
		const cell = new Cell([indexColumn, indexRow]);
		matrix.set([indexColumn, indexRow].toString(), cell);
	}
}

let cellToCollapseCoordinate = [getRandom(columns), getRandom(rows)];

collapse(cellToCollapseCoordinate);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div id="terrane-container"></div>
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
