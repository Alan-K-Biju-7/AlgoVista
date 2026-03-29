export class MinPQ {
  constructor() { this._heap = []; }

  push(item) {
    this._heap.push(item);
    this._bubbleUp(this._heap.length - 1);
  }

  pop() {
    const top = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  isEmpty()  { return this._heap.length === 0; }
  size()     { return this._heap.length; }
  toArray()  { return [...this._heap].sort((a, b) => a.dist - b.dist); }

  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this._heap[p].dist <= this._heap[i].dist) break;
      [this._heap[i], this._heap[p]] = [this._heap[p], this._heap[i]];
      i = p;
    }
  }

  _sinkDown(i) {
    const n = this._heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._heap[l].dist < this._heap[smallest].dist) smallest = l;
      if (r < n && this._heap[r].dist < this._heap[smallest].dist) smallest = r;
      if (smallest === i) break;
      [this._heap[i], this._heap[smallest]] = [this._heap[smallest], this._heap[i]];
      i = smallest;
    }
  }
}
