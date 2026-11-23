import * as migration_20261123_112717_initial from './20261123_112717_initial';

export const migrations = [
  {
    up: migration_20261123_112717_initial.up,
    down: migration_20261123_112717_initial.down,
    name: '20261123_112717_initial'
  },
];
