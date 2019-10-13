export namespace Utils {
        export function getRandomInt(max) { //Get number between 0 to max-1
            return Math.floor(Math.random() * Math.floor(max));
        }
        export type Point = [number,number];
        export enum Direction {
            UP,
            DOWN,
            LEFT,
            RIGHT
        }
        export enum GameAction {
            MOVE,
            MERGE,
            SPAWN,
            WIN,
            LOSE
        }
        export function transpose(matrix: number[][]) : number[][]{
            let dupMatrix = JSON.parse(JSON.stringify(matrix));
           return dupMatrix[0].map((col, index) => dupMatrix.map(row => row[index]));
        }
        export function invert(matrix: number[][]) : number[][]{
           let dupMatrix = JSON.parse(JSON.stringify(matrix));
           return dupMatrix.map((row:any[])=>{ return row.reverse(); });
        }
        export function swapCellsMatrix(matrix: any[][], pos1 : Point, pos2: Point) {
            let temp = matrix[pos1[0]][pos1[1]];
            matrix[pos1[0]][pos1[1]] = matrix[pos2[0]][pos2[1]];
            matrix[pos2[0]][pos2[1]] = temp;
        }
}



