import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

declare global {
	interface Request {
		user?: JwtPayload;
	}
}
