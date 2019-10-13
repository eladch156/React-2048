import {Game} from './Game'
import {Utils} from './Util'
import {Observer,GameObserver} from './Observer'

type Message = GameObserver.Message;

class DummyObserver implements Observer.IObserver {
    receiveNotification<Message>(msg: Message): void {
        console.log(msg);
    }
}
let observable = new GameObserver.GameObservable();
observable.registerObserver(new DummyObserver());
let testGame = new Game(observable);
console.log(testGame.toString());
testGame.update(Utils.Direction.UP);
console.log(testGame.toString());
testGame.update(Utils.Direction.LEFT);
console.log(testGame.toString());
testGame.update(Utils.Direction.DOWN);
console.log(testGame.toString());
testGame.update(Utils.Direction.DOWN);
console.log(testGame.toString());
testGame.update(Utils.Direction.RIGHT);
console.log(testGame.toString());
console.log("Score: " + testGame.m_score);