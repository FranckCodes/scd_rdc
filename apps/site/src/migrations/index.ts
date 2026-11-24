import * as migration_20261123_112717_initial from './20261123_112717_initial';
import * as migration_20261124_101445_projets from './20261124_101445_projets';

export const migrations = [
  {
    up: migration_20261123_112717_initial.up,
    down: migration_20261123_112717_initial.down,
    name: '20261123_112717_initial',
  },
  {
    up: migration_20261124_101445_projets.up,
    down: migration_20261124_101445_projets.down,
    name: '20261124_101445_projets'
  },
];
