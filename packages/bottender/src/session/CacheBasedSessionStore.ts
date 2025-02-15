import CacheStore from '../cache/CacheStore';

import Session from './Session';
import SessionStore from './SessionStore';

const MINUTES_IN_ONE_YEAR = 365 * 24 * 60;

export default class CacheBasedSessionStore implements SessionStore {
  _cache: CacheStore;

  // The number of minutes to store the data in the session.
  _expiresIn: number;

  constructor(cache: CacheStore, expiresIn: number) {
    this._cache = cache;
    this._expiresIn = expiresIn || MINUTES_IN_ONE_YEAR;
  }

  async init(): Promise<CacheBasedSessionStore> {
    return this;
  }

  async read(key: string): Promise<Session | null> {
    return this._cache.get(key) as Promise<Session | null>;
  }

  async all(): Promise<Session[]> {
    return this._cache.all() as Promise<Session[]>;
  }

  async write(key: string, sess: Session): Promise<void> {
    return this._cache.put(key, sess, this._expiresIn);
  }

  async destroy(key: string): Promise<void> {
    return this._cache.forget(key);
  }
}
