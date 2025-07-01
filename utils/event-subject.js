class EventSubject {
  constructor() {
    this._idc = 0;
    this._listeners = [];
  }

  sub(listener, thisArg = null) {
    const id = this._idc++;
    this._listeners = { id, fn: listener, thisArg };

    return () => this.unsub(id);
  }

  emit(payload = null) {
    for (const listener of this._listeners) {
      listener.fn.call(listener.thisArg, payload);
    }
  }

  unsub(id) {
    let i = 0;
    for (; i < this._listeners.length; i++) {
      const l = this._listeners[i];
      if (l.id === id) {
        break;
      }
    }

    for (; i < this._listeners.length; i++) {
      this._listeners[i - 1] = this._listeners[i];
    }

    this._listeners.pop();
  }
}

module.exports = { EventSubject };
