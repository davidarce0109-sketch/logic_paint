export default class Timer {
  constructor({ durationMs, startedAt = null, pausedAt = null, pausedTotalMs = 0, stoppedAt = null }) {
    this.durationMs = durationMs;
    this.startedAt = startedAt;
    this.pausedAt = pausedAt;
    this.pausedTotalMs = pausedTotalMs;
    this.stoppedAt = stoppedAt;
  }

  start(now) {
    if (this.startedAt === null) this.startedAt = now;
  }

  pause(now) {
    if (this.startedAt !== null && this.pausedAt === null && this.stoppedAt === null) this.pausedAt = now;
  }

  resume(now) {
    if (this.pausedAt === null) return;
    this.pausedTotalMs += now - this.pausedAt;
    this.pausedAt = null;
  }

  stop(now) {
    if (this.stoppedAt === null) this.stoppedAt = now;
  }

  elapsedMs(now) {
    if (this.startedAt === null) return 0;
    const end = this.stoppedAt ?? this.pausedAt ?? now;
    return Math.min(this.durationMs, Math.max(0, end - this.startedAt - this.pausedTotalMs));
  }

  remainingMs(now) {
    return this.durationMs - this.elapsedMs(now);
  }

  isExpired(now) {
    return this.startedAt !== null && this.remainingMs(now) <= 0;
  }

  toSnapshot() {
    const { durationMs, startedAt, pausedAt, pausedTotalMs, stoppedAt } = this;
    return { durationMs, startedAt, pausedAt, pausedTotalMs, stoppedAt };
  }
}
