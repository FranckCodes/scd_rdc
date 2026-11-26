import * as migration_20261123_112717_initial from './20261123_112717_initial';
import * as migration_20261124_101445_projets from './20261124_101445_projets';
import * as migration_20261124_131715_evenement_trophees from './20261124_131715_evenement_trophees';
import * as migration_20261125_110439_organisateurs from './20261125_110439_organisateurs';
import * as migration_20261125_112041_odd_projets from './20261125_112041_odd_projets';
import * as migration_20261125_125113_gouvernance from './20261125_125113_gouvernance';
import * as migration_20261126_080754_etape2_offres from './20261126_080754_etape2_offres';
import * as migration_20261126_083534_etape3_cooperation from './20261126_083534_etape3_cooperation';

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
    name: '20261125_112041_odd_projets',
  },
  {
    up: migration_20261125_125113_gouvernance.up,
    down: migration_20261125_125113_gouvernance.down,
    name: '20261125_125113_gouvernance',
  },
  {
    up: migration_20261126_080754_etape2_offres.up,
    down: migration_20261126_080754_etape2_offres.down,
    name: '20261126_080754_etape2_offres',
  },
  {
    up: migration_20261126_083534_etape3_cooperation.up,
    down: migration_20261126_083534_etape3_cooperation.down,
    name: '20261126_083534_etape3_cooperation'
  },
];
