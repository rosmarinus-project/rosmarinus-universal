import { defaultConfigGenerator } from '@rosmarinus/common-plugins';

const external = ['@nestjs/common', '@nestjs/common/interfaces'];

export default [defaultConfigGenerator('cjs', external), defaultConfigGenerator('es', external)];
