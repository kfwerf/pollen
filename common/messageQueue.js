export class MessageQueue {
  constructor(peerSocket, messageQueue = []) {
    this._peerSocket = peerSocket;
    this._messageQueue = messageQueue;
    this._listeners = {
      open: [],
      message: [],
    };

    this._peerSocket.onopen = (evt) => {
      this._tryClearingQueue();
      this._listeners.open.forEach((fn) => fn(evt));
    }
    this._peerSocket.onmessage = (evt) => {
      this._listeners.message.forEach((fn) => fn(evt));
    }

  }
  
  on(type, fn) {
    if (this._listeners[type]) {
      this._listeners[type].push(fn);
    }
  }
   
  queueMessage(msg) {
    this._messageQueue.push(msg);
    this._tryClearingQueue();
  }

  _trySend(msg) {
    if (this._peerSocket.readyState === this._peerSocket.OPEN) {
      this._peerSocket.send(msg);
      return null;
    } else {
      return msg;
    }
  }
  
  _tryClearingQueue() {
    this._messageQueue = this._messageQueue
      .map(this._trySend.bind(this))
      .filter((msg) => msg !== null);
  }
}