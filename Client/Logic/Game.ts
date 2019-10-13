/***
 * The 2048 game logic class
 */

import {Utils} from './Util';
import {GameObserver, Observer} from './Observer';


type Point =  Utils.Point;
type Direction = Utils.Direction;
type GameAction = Utils.GameAction;
const INITIAL_SPOTS_TO_SET = 2;

export class GameWin extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this,GameWin.prototype);
    }
}

export class GameLose extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this,GameLose.prototype);
    }
}

export class Game {
    m_gridMatrix: number [][];
    m_score: number;
    m_observable: GameObserver.GameObservable;
    constructor(observable: GameObserver.GameObservable) {
        this.m_gridMatrix = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
        this.m_score = 0;
        this.m_observable = observable;
        for(let numStartSpots=0;numStartSpots<INITIAL_SPOTS_TO_SET;numStartSpots++) {
            this.initEmptyRandom();
        }
    }
    public score():number {
        return this.m_score;
    }
    private initEmptyRandom(): void {
        let emptySpots : Point[]=[];
        for(let xPos = 0; xPos < 4; xPos ++) {
            for(let yPos = 0; yPos < 4; yPos ++) {
                if(this.m_gridMatrix[xPos][yPos]==0) {
                    emptySpots.push([xPos,yPos]);
                }
            }
        }
        let randomEmptySpot = emptySpots[Utils.getRandomInt(emptySpots.length)];
        this.m_gridMatrix[randomEmptySpot[0]][randomEmptySpot[1]] = 2;
        this.m_observable.notifyObservers([Utils.GameAction.SPAWN,[randomEmptySpot[0],randomEmptySpot[1]],[-1,-1]]);
    }
    public validate() : void {
        let notStuckCell: boolean = false;
        for(let xPos = 0; xPos < 4; xPos ++) {
            for(let yPos = 0; yPos < 4; yPos ++) {
                if(this.m_gridMatrix[xPos][yPos]==2048) {
                    throw new GameWin();
                }
            }
        }
        let isLeft = Game.validateLeft(this.m_gridMatrix);
        let isRight = Game.validateLeft(Utils.invert(this.m_gridMatrix));
        let isUp = Game.validateLeft(Utils.transpose(this.m_gridMatrix));
        let isDown = Game.validateLeft(Utils.invert(Utils.transpose(this.m_gridMatrix)));
        if(!(isLeft || isRight || isDown || isUp)) {
            throw new GameLose();
        }
    }
   private static validateLeft(matrix:number[][]): boolean {
        for(let xPos = 0; xPos < 4; xPos ++) {
            for (let yPos = 0; yPos < 4; yPos++) {
                if(yPos == 0) continue;
                if(matrix[xPos][yPos-1] === 0 || matrix[xPos][yPos-1] === matrix[xPos][yPos]) {
                    return true;
                }
            }
        }
        return false;
    }
    private updateDown() : void {
        let yIndex = 0;
        while (yIndex < 4) {
            let xIndex=3;
            while (xIndex > 0) {
                if(this.m_gridMatrix[xIndex - 1][yIndex] == 0)  {
                    xIndex --;
                    continue;
                }
                if(this.m_gridMatrix[xIndex][yIndex] == 0) {
                    this.m_observable.notifyObservers([Utils.GameAction.MOVE,[xIndex - 1,yIndex],[xIndex,yIndex]]);
                    Utils.swapCellsMatrix(this.m_gridMatrix,[xIndex - 1,yIndex],[xIndex,yIndex]);
                    xIndex = 3;
                }
                else if(this.m_gridMatrix[xIndex][yIndex] == this.m_gridMatrix[xIndex - 1][yIndex]) {
                    this.m_observable.notifyObservers([Utils.GameAction.MERGE,[xIndex - 1,yIndex],[xIndex,yIndex]]);
                    this.m_gridMatrix[xIndex - 1][yIndex] = 0;
                    this.m_gridMatrix[xIndex][yIndex] *= 2;
                    this.m_score += this.m_gridMatrix[xIndex][yIndex];
                    xIndex = 3;
                }
                else {
                    xIndex -- ;
                }
            }
            yIndex ++;
        }
    }
    private updateUp() : void{
        let yIndex = 0;
        while (yIndex < 4) {
            let xIndex = 0;
            while (xIndex < 3) {
                if(this.m_gridMatrix[xIndex + 1][yIndex] == 0)  {
                    xIndex ++;
                    continue;
                }
                if(this.m_gridMatrix[xIndex][yIndex] == 0) {
                    this.m_observable.notifyObservers([Utils.GameAction.MOVE,[xIndex + 1,yIndex],[xIndex,yIndex]]);
                    Utils.swapCellsMatrix(this.m_gridMatrix,[xIndex + 1,yIndex],[xIndex,yIndex]);
                    xIndex = 0;
                }
                else if(this.m_gridMatrix[xIndex + 1][yIndex] == this.m_gridMatrix[xIndex][yIndex]) {
                    this.m_observable.notifyObservers([Utils.GameAction.MERGE,[xIndex + 1,yIndex],[xIndex,yIndex]]);
                    this.m_gridMatrix[xIndex + 1][yIndex] = 0;
                    this.m_gridMatrix[xIndex][yIndex] *= 2;
                    this.m_score += this.m_gridMatrix[xIndex][yIndex];
                    xIndex = 0;
                }
                else {
                    xIndex ++ ;
                }
            }
            yIndex ++;
        }
    }
    private updateRight() : void{
        let xIndex = 0;
        while (xIndex < 4) {
            let yIndex = 3;
            while (yIndex > 0) {
                if(this.m_gridMatrix[xIndex][yIndex-1] == 0)  {
                    yIndex --;
                    continue;
                }
                if(this.m_gridMatrix[xIndex][yIndex] == 0) {
                    this.m_observable.notifyObservers([Utils.GameAction.MOVE,[xIndex,yIndex-1],[xIndex,yIndex]]);
                    Utils.swapCellsMatrix(this.m_gridMatrix,[xIndex,yIndex-1],[xIndex,yIndex]);
                    yIndex = 3;
                }
                else if(this.m_gridMatrix[xIndex][yIndex - 1] == this.m_gridMatrix[xIndex][yIndex]) {
                    this.m_observable.notifyObservers([Utils.GameAction.MERGE,[xIndex,yIndex-1],[xIndex,yIndex]]);
                    this.m_gridMatrix[xIndex][yIndex-1] = 0;
                    this.m_gridMatrix[xIndex][yIndex] *= 2;
                    this.m_score += this.m_gridMatrix[xIndex][yIndex];
                    yIndex = 3;
                }
                else {
                    yIndex -- ;
                }
            }
            xIndex ++;
        }
    }
    private updateLeft() : void{
        let xIndex = 0;
        while (xIndex < 4) {
            let yIndex = 0;
            while (yIndex < 3) {
                if(this.m_gridMatrix[xIndex][yIndex + 1] == 0)  {
                    yIndex ++;
                    continue;
                }
                if(this.m_gridMatrix[xIndex][yIndex] == 0) {
                    this.m_observable.notifyObservers([Utils.GameAction.MOVE,[xIndex,yIndex + 1 ],[xIndex,yIndex]]);
                    Utils.swapCellsMatrix(this.m_gridMatrix,[xIndex,yIndex + 1],[xIndex,yIndex]);
                    yIndex = 0;
                }
                else if(this.m_gridMatrix[xIndex][yIndex + 1] == this.m_gridMatrix[xIndex][yIndex]) {
                    this.m_observable.notifyObservers([Utils.GameAction.MERGE,[xIndex,yIndex + 1],[xIndex,yIndex]]);
                    this.m_gridMatrix[xIndex][yIndex + 1] = 0;
                    this.m_gridMatrix[xIndex][yIndex] *= 2;
                    this.m_score += this.m_gridMatrix[xIndex][yIndex];
                    yIndex = 0;
                }
                else {
                    yIndex ++ ;
                }
            }
            xIndex ++;
        }
    }

    public getGrid() {
        return this.m_gridMatrix;
    }

    public update(direction: Direction): void {
        switch (direction) {
            case Utils.Direction.DOWN:
                this.updateDown();
                break;
            case Utils.Direction.LEFT:
                this.updateLeft();
                break;
            case Utils.Direction.RIGHT:
                this.updateRight();
                break;
            case Utils.Direction.UP:
                this.updateUp();
                break;
            default:
                break;
        }
        this.initEmptyRandom();

    }
    public toString() : string {
        let output = "";
        for(let xPos = 0; xPos < 4; xPos ++) {
            output += ("-".repeat(17));
            output += "\n";
            output += "|";
            for(let yPos = 0; yPos < 4; yPos ++) {
                output += (" " + this.m_gridMatrix[xPos][yPos] + " |");
            }
            output += "\n";
        }
        output += ("-".repeat(17));
        return output;
    }

}