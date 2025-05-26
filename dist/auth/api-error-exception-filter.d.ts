import type { ArgumentsHost } from '@nestjs/common';
import type { ExceptionFilter } from '@nestjs/common';
import { APIError } from 'better-auth';
export declare class APIErrorExceptionFilter implements ExceptionFilter {
    catch(exception: APIError, host: ArgumentsHost): void;
}
