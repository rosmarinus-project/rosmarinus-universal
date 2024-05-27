import { initFileLoggerFactory, type FileLogger } from '@rosmarinus/node-utils';

export type Logger = FileLogger;

export interface LoggerFactory {
  defaultLogger: Logger;
  getChildLogger(requestId: string): Logger;
}

const ridSymbol = Symbol('requestId');

export function initLoggerFactory({ isProduction, logDir }: { isProduction: boolean; logDir?: string }): LoggerFactory {
  const logger = initFileLoggerFactory({
    fileMode: isProduction ? 'in-hour' : 'console',
    fileLevel: 'info',
    logFileDir: logDir,
    transformToPrefix: {
      [ridSymbol]: (val) => {
        return {
          output: `RID: ${val}`,
        };
      },
    },
  }).defaultLogger;

  return {
    defaultLogger: logger,
    getChildLogger(requestId: string) {
      return logger.child({ [ridSymbol]: requestId });
    },
  };
}
