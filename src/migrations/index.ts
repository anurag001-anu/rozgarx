import * as migration_20260816_173259 from './20260816_173259';
import * as migration_20261001_201406_add_job_blocks from './20261001_201406_add_job_blocks';

export const migrations = [
  {
    up: migration_20260816_173259.up,
    down: migration_20260816_173259.down,
    name: '20260816_173259',
  },
  {
    up: migration_20261001_201406_add_job_blocks.up,
    down: migration_20261001_201406_add_job_blocks.down,
    name: '20261001_201406_add_job_blocks'
  },
];
