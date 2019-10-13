import * as React from "react";
import './numbersgrid.scss'
import {Table, Modal, Button, Menu, Message} from "semantic-ui-react"
import {Game, GameLose, GameWin} from "Logic/Game";
import {GameObserver} from "Logic/Observer";
import {Utils} from "Logic/Util";
import Direction = Utils.Direction;
import validate = WebAssembly.validate;


const GAME_GRID = "GAME_GRID";
const GAME_SCORE = "GAME_SCORE";
const END_TEXT = "END_TEXT";
const END_STATUS = "END_STATUS";
const BOARD_SIZE : number = 4;

interface IPMenu {

}



class NumbersGrid extends React.Component<IPMenu, {}> {
    m_game: Game;
    constructor(props,context) {
        super(props,context);
        this.m_game = new Game(new GameObserver.GameObservable());
        console.log(this.m_game.toString());
        window.addEventListener("keypress",(e) => this.handleKeyEvent(e));
        this.state = {GAME_GRID: this.m_game.getGrid(), END_TEXT: "" , END_STATUS: false, GAME_SCORE: 0};
    }
    reset(event) {
        this.m_game = new Game(new GameObserver.GameObservable());
        this.setState({GAME_GRID: this.m_game.getGrid(), END_TEXT: "" , END_STATUS: false, GAME_SCORE: 0});
    }
    handleKeyEvent(event) {
        if(this.state[END_STATUS]) {
            return;
        }
        try {
            this.m_game.validate();
            switch (event.key) {
                case "w":
                    this.m_game.update(Direction.UP);
                    break;
                case "s":
                    this.m_game.update(Direction.DOWN);
                    break;
                case "a":
                    this.m_game.update(Direction.LEFT);
                    break;
                case "d":
                    this.m_game.update(Direction.RIGHT);
                    break;
                default:
                    return
            }
            this.setState({GAME_GRID : this.m_game.getGrid(), GAME_SCORE:this.m_game.score()});
        }
        catch (event) {
            if(event instanceof GameWin) {
                this.setState({END_STATUS:true,END_TEXT:"You Won!"})
            }
            else if(event instanceof GameLose) {
                this.setState({END_STATUS:true,END_TEXT:"You Lost!"})
            }

        }
        console.log(this.m_game.toString())
    }
    render() {
        const grid = this.m_game.getGrid();
        return (
            <div>
                <Menu>
                    <Menu.Item>
                        <Button onClick={(e) => this.reset(e)}>Reset</Button>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            Score: {this.state[GAME_SCORE]}.
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Message>
                    <Message.Content>
                        <b>The Game 2048.</b><br/>
                       Move the cells using [W | A | S | D] and reach 2048!
                    </Message.Content>
                </Message>
                <Table fixed celled className={""}>
                    <Table.Body>
                    <Table.Row className="row" >
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][0][0]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][0][1]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][0][2]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][0][3]}</Table.Cell>
                    </Table.Row>
                    <Table.Row className="row" >
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][1][0]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][1][1]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][1][2]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][1][3]}</Table.Cell>
                    </Table.Row>
                    <Table.Row className="row" >
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][2][0]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][2][1]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][2][2]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][2][3]}</Table.Cell>
                    </Table.Row>
                    <Table.Row className="row" >
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][3][0]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][3][1]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][3][2]}</Table.Cell>
                        <Table.Cell textAlign="center" className="cell">{this.state[GAME_GRID][3][3]}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <Modal open={this.state[END_STATUS]}>
                    <Modal.Header>Game Over.</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            {this.state[END_TEXT]}.<br/>
                            Score: {this.state[GAME_SCORE]}.
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={(e) => this.reset(e)}>Reset</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default NumbersGrid;