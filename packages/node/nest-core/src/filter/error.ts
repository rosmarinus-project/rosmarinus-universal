import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { Logger } from '../logger';

export type ErrorCodeType = number;

export interface ErrorMsg {
  msg: string;
  code: ErrorCodeType;
}

export class LogicError<T extends ErrorCodeType> extends Error implements ErrorMsg {
  public constructor(
    public readonly msg: string,
    public readonly code: T,
  ) {
    super();
  }
}

export function handleError(ctx: HttpArgumentsHost, err: ErrorMsg) {
  ctx.getResponse().status(200);
  ctx.getResponse().json({
    code: err.code,
    errMsg: err.msg,
  });
}

@Catch()
export class AllExceptionsFilter<T extends ErrorCodeType> implements ExceptionFilter {
  private readonly logger?: Logger;

  public constructor(
    private readonly defaultErrorCode: T,
    logger?: Logger,
  ) {
    this.logger = logger;
  }

  public catch(exception: ErrorMsg, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const errBody = (() => {
      try {
        return JSON.stringify(request.body);
      } catch (e) {
        return request.body;
      }
    })();
    const errHeader = (() => {
      try {
        return JSON.stringify(request.headers);
      } catch (e) {
        return request.headers;
      }
    })();

    this.logger?.error(`error: \n${exception}\nmsg:${exception.msg}\nheader:${errHeader}\nreq:\n${errBody}`);

    if (exception instanceof LogicError) {
      handleError(ctx, exception);
    } else {
      handleError(ctx, {
        msg: String(exception),
        code: this.defaultErrorCode,
      });
    }
  }
}
