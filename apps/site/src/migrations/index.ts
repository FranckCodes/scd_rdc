import * as migration_20261123_112717_initial from './20261123_112717_initial';
import * as migration_20261124_101445_projets from './20261124_101445_projets';
import * as migration_20261124_131715_evenement_trophees from './20261124_131715_evenement_trophees';
import * as migration_20261125_110439_organisateurs from './20261125_110439_organisateurs';
import * as migration_20261125_112041_odd_projets from './20261125_112041_odd_projets';

export const migrations = [
  {
    up: migration_20261123_112717_initial.up,
    down: migration_20261123_112717_initial.down,
    name: '20261123_112717_initial',
  },
  {
    up: migration_20261124_101445_projets.up,
    down: migration_20261124_101445_projets.down,
    name: '20261124_101445_projets',
  },
  {
    up: migration_20261124_131715_evenement_trophees.up,
    down: migration_20261124_131715_evenement_trophees.down,
    name: '20261124_131715_evenement_trophees',
  },
  {
    up: migration_20261125_110439_organisateurs.up,
    down: migration_20261125_110439_organisateurs.down,
    name: '20261125_110439_organisateurs',
  },
  {
    up: migration_20261125_112041_odd_projets.up,
    down: migration_20261125_112041_odd_projets.down,
    name: '20261125_112041_odd_projets'
  },
];
