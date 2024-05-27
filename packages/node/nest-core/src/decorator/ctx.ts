import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isFunction } from '@rosmarinus/common-utils';

import { type Logger, type LoggerFactory, initLoggerFactory } from '../logger';

export interface Ctx {
  logger: Logger;
}

export interface ContextParams {
  requestId?: string;
  loggerFactory: LoggerFactory;
}

function buildContext(params: ContextParams): Ctx {
  return {
    logger: params.loggerFactory.getChildLogger(params.requestId || ''),
  };
}

function createContextDecorate(defaultLoggerFactory: LoggerFactory | (() => LoggerFactory)) {
  return createParamDecorator((loggerFactory: LoggerFactory, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const rid = request.headers['Request-Id'] || request.headers['request-id'] || '';
    const loggerF = loggerFactory || (isFunction(defaultLoggerFactory) ? defaultLoggerFactory() : defaultLoggerFactory);

    return buildContext({ requestId: rid, loggerFactory: loggerF });
  });
}

/** 上下文装饰器 */
export const DefaultContext = createContextDecorate(() =>
  initLoggerFactory({
    isProduction: false,
  }),
);

/** 装饰器闭包 */
export function buildContextFactory(loggerFactory: LoggerFactory) {
  return createContextDecorate(loggerFactory);
}
