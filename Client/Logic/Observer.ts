import {Utils} from "Logic/Util";


export namespace Observer {
    export interface IObservable {

        registerObserver(observer: IObserver): void;
        removeObserver(observer:IObserver) : void;
        notifyObservers<T>(msg: T) : void;
    }
    export interface IObserver {
        receiveNotification <T> (msg : T): void;
    }
}

export namespace GameObserver {
    export type Message = [Utils.GameAction,Utils.Point,Utils.Point];
    export class GameObservable implements Observer.IObservable{
        private m_observers: Observer.IObserver [];
        constructor() {
            this.m_observers = []
        }

        notifyObservers<Message>(msg: Message): void {
                this.m_observers.map((observer:Observer.IObserver) => { observer.receiveNotification(msg) });
        }

        registerObserver(observer: Observer.IObserver): void {
            this.m_observers.push(observer);
        }

        removeObserver(observer: Observer.IObserver): void {
            this.m_observers = this.m_observers.filter((arrayObserver:Observer.IObserver)=> { return observer==arrayObserver; });
        }
    }
    export class GameObserver implements Observer.IObserver{
        receiveNotification<Message>(msg: Message): void {

        }
    }
}