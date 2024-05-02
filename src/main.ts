import "./style.css";
import { setupCounter } from "./counter.ts";
import grass_SRC from "./textures/grass.png";
import sand_SRC from "./textures/sand.png";
import water_SRC from "./textures/water.png";
import c_sbl_w_SRC from "./textures/c-sbl-w.png";
import c_slb_w_SRC from "./textures/c-slb-w.png";
import c_stl_w_SRC from "./textures/c-stl-w.png";
import c_str_w_SRC from "./textures/c-str-w.png";
import c_wbl_s_SRC from "./textures/c-wbl-s.png";
import c_wrb_s_SRC from "./textures/c-wrb-s.png";
import c_wtl_s_SRC from "./textures/c-wtl-s.png";
import c_wtr_s_SRC from "./textures/c-wtr-s.png";
import sr_wl_SRC from "./textures/sr-wl.png";
import st_wb_SRC from "./textures/st-wb.png";
import wr_sl_SRC from "./textures/wr-sl.png";
import wt_sb_SRC from "./textures/wt-sb.png";

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
	["water", "wt-sb", "c-wbl-s", "c-wrb-s"],
	["water", "wr-sl", "c-wbl-s", "c-wtl-s"],
]);
rules.set("grass", [
	["sand", "grass", "wt-sb", "c-stl-w", "c-str-w"],
	["sand", "grass", "wr-sl", "c-slb-w", "c-str-w"],
	["sand", "grass", "st-wb", "c-sbl-w", "c-slb-w"],
	["sand", "grass", "sr-wl", "c-sbl-w", "c-stl-w"],
]);
rules.set("sand", [
	["sand", "grass", "wt-sb", "c-stl-w", "c-str-w"],
	["sand", "grass", "wr-sl", "c-slb-w", "c-str-w"],
	["sand", "grass", "st-wb", "c-sbl-w", "c-slb-w"],
	["sand", "grass", "sr-wl", "c-sbl-w", "c-stl-w"],
]);
rules.set("st-wb", [
	["sand", "wt-sb", "c-stl-w", "c-str-w"],
	["st-wb", "c-wtl-s", "c-sbl-w"],
	["water", "wt-sb", "c-wbl-s", "c-wrb-s"],
	["st-wb", "c-wtr-s", "c-slb-w"],
]);
rules.set("wt-sb", [
	["water", "st-wb", "c-wtr-s", "c-wtl-s"],
	["wt-sb", "c-stl-w", "c-wbl-s"],
	["sand", "st-wb", "c-sbl-w", "c-slb-w"],
	["wt-sb", "c-str-w", "c-wrb-s"],
]);
rules.set("sr-wl", [
	["sr-wl", "c-sbl-w", "c-wrb-s"],
	["sand", "c-slb-w", "c-str-w", "wr-sl"],
	["sr-wl", "c-stl-w", "c-wtr-s"],
	["water", "wr-sl", "c-wbl-s", "c-wtl-s"],
]);
rules.set("wr-sl", [
	["wr-sl", "c-slb-w", "c-wbl-s"],
	["water", "sr-wl", "c-wrb-s", "c-wtr-s"],
	["wr-sl", "c-str-w", "c-wtl-s"],
	["sand", "c-sbl-w", "c-stl-w", "sr-wl"],
]);
rules.set("c-sbl-w", [
	["sand", "wt-sb", "c-stl-w", "c-str-w"],
	["sand", "c-slb-w", "c-str-w", "wr-sl"],
	["c-stl-w", "c-wtr-s", "sr-wl"],
	["c-slb-w", "c-wtr-s", "st-wb"],
]);
rules.set("c-slb-w", [
	["sand", "wt-sb", "c-stl-w", "c-str-w"],
	["c-sbl-w", "c-wtl-s", "st-wb"],
	["c-str-w", "c-wtl-s", "wr-sl"],
	["sand", "c-sbl-w", "c-stl-w", "sr-wl"],
]);
rules.set("c-stl-w", [
	["sr-wl", "c-sbl-w", "c-wrb-s"],
	["sand", "c-slb-w", "c-str-w", "wr-sl"],
	["sand", "st-wb", "c-sbl-w", "c-slb-w"],
	["wt-sb", "c-str-w", "c-wrb-s"],
]);
rules.set("c-str-w", [
	["wr-sl", "c-slb-w", "c-wbl-s"],
	["wt-sb", "c-stl-w", "c-wbl-s"],
	["sand", "st-wb", "c-sbl-w", "c-slb-w"],
	["sand", "c-sbl-w", "c-stl-w", "sr-wl"],
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
		this.entropyValues = [
			"water",
			"grass",
			"sand",
			"c-sbl-w",
			"c-slb-w",
			"c-stl-w",
			"c-str-w",
			"c-wbl-s",
			"c-wrb-s",
			"c-wtl-s",
			"c-wtr-s",
			"sr-wl",
			"st-wb",
			"wr-sl",
			"wt-sb",
		];
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
let columns = 51;
let rows = 51;
let matrix = new Map<string, CellType>();
let entropyCellList: CellType[] = [];
let counter = 0;
// Function that choose a value of the entropy values of a Cell
//An then propagate to the next to cell
/** @param {number[]} coordinate - The coordinate of the obj in the matrix that its going to collapse*/
function collapse(coordinate: number[]): void {
	function propagate(
		currentCoordinate: string,
		propagateCoordinate: string,
		ruleArray: string[]
	): void {
		const currentCell = matrix.get(currentCoordinate);
		const propagateCell = matrix.get(propagateCoordinate);
		if (!isCellType(currentCell)) return;
		if (!isCellType(propagateCell)) return;

		//const ruleArray = rules.get(currentCell.value);
		if (ruleArray === undefined) return;
		propagateCell.entropyValues = propagateCell.entropyValues
			.map((item) => item)
			.filter((element) => ruleArray.includes(element));
		if (propagateCell.isCollapsed) return;
		if (
			entropyCellList.some(
				(item) => item.coordinate === propagateCell.coordinate
			)
		)
			return;
		entropyCellList.push(propagateCell);
	}
	let cell = matrix.get(coordinate.toString());

	if (!isCellType(cell)) return;
	console.log("*");
	let entropyIndex = getRandom(cell.entropyValues.length - 1);
	cell.isCollapsed = true;
	cell.value = cell.entropyValues[entropyIndex];
	cell.entropyValues = [cell.value];

	//Get the up, down, left and right keys to the cells value object
	let upKey = [coordinate[0] - 1, coordinate[1]].toString();
	let RightKey = [coordinate[0], coordinate[1] + 1].toString();
	let DownKey = [coordinate[0] + 1, coordinate[1]].toString();
	let LeftKey = [coordinate[0], coordinate[1] - 1].toString();

	let currentRules = rules.get(cell.value);

	if (currentRules === undefined) return;
	propagate(coordinate.toString(), upKey, currentRules[0]);
	propagate(coordinate.toString(), RightKey, currentRules[1]);
	propagate(coordinate.toString(), DownKey, currentRules[2]);
	propagate(coordinate.toString(), LeftKey, currentRules[3]);

	entropyCellList.sort((a, b) => {
		if (a.entropyValues.length > b.entropyValues.length) {
			return 1;
		} else {
			return -1;
		}
	});
	let newCurrentCell = entropyCellList.shift();
	if (entropyCellList.length > 0 && counter < columns * rows + 10) {
		if (isCellType(newCurrentCell)) {
			counter += 1;
			collapse(newCurrentCell.coordinate);
		}
	} else {
		console.log(entropyCellList);
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
				if (!isCellType(currentCell)) return;
				if (currentCell.entropyValues.length === 0)
					currentCell.entropyValues.push(currentCell.value);
				currentCell.value = currentCell.entropyValues[0];
				switch (currentCell.value) {
					case "water":
						textureIMG.src = water_SRC;
						break;
					case "grass":
						textureIMG.src = grass_SRC;
						break;
					case "sand":
						textureIMG.src = sand_SRC;
						break;
					case "c-slb-w":
						textureIMG.src = c_slb_w_SRC;
						break;
					case "c-stl-w":
						textureIMG.src = c_stl_w_SRC;
						break;
					case "c-str-w":
						textureIMG.src = c_str_w_SRC;
						break;
					case "c-sbl-w":
						textureIMG.src = c_sbl_w_SRC;
						break;
					case "c-wbl-s":
						textureIMG.src = c_wbl_s_SRC;
						break;
					case "c-wrb-s":
						textureIMG.src = c_wrb_s_SRC;
						break;
					case "c-wtl-s":
						textureIMG.src = c_wtl_s_SRC;
						break;
					case "c-wtr-s":
						textureIMG.src = c_wtr_s_SRC;
						break;
					case "sr-wl":
						textureIMG.src = sr_wl_SRC;
						break;
					case "st-wb":
						textureIMG.src = st_wb_SRC;
						break;
					case "wr-sl":
						textureIMG.src = wr_sl_SRC;
						break;
					case "wt-sb":
						textureIMG.src = wt_sb_SRC;
						break;
					default:
						break;
				}
				if (currentCell?.coordinate !== undefined)
					textureIMG.id = currentCell?.coordinate.toString();
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
console.log(cellToCollapseCoordinate);
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
