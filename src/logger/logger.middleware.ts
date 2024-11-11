import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentDate = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[${currentDate}] ${method} ${url}`);

    next();
  }
}
