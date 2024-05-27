import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: (error?: Error) => void) {
    res.setHeader('Fcgi-Srtime', `${new Date().getTime()}`);
    res.setHeader('Request-Id', req.get('Request-Id') || req.get('request-id') || '');
    next();
  }
}
