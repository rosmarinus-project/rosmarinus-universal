import { defaultConfigGenerator } from '@rosmarinus/common-plugins';

const external = ['@nestjs/common', '@nestjs/common/interfaces', 'knex', 'mysql2', 'ioredis'];

export default [defaultConfigGenerator('cjs', external), defaultConfigGenerator('es', external)];
