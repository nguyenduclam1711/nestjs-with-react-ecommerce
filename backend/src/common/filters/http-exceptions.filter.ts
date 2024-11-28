import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { get, set } from 'lodash';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.getError(exception),
      message: this.getMessage(exception),
    });
  }

  private getMessage(exception: any) {
    if (exception instanceof ZodError) {
      return 'Validation error';
    }
    if (exception instanceof HttpException) {
      return exception.message;
    }
    if (
      [
        Prisma.PrismaClientValidationError,
        Prisma.PrismaClientUnknownRequestError,
        Prisma.PrismaClientRustPanicError,
        Prisma.PrismaClientInitializationError,
        Prisma.PrismaClientKnownRequestError,
      ].some((currClass) => exception instanceof currClass)
    ) {
      return 'Database error';
    }
    return exception.message;
  }

  private getError(exception: any) {
    if (exception instanceof ZodError) {
      return this.getZodError(exception);
    }
    if (exception instanceof HttpException) {
      return this.getHttpExceptionError(exception);
    }
    if (
      [
        Prisma.PrismaClientValidationError,
        Prisma.PrismaClientUnknownRequestError,
        Prisma.PrismaClientRustPanicError,
        Prisma.PrismaClientInitializationError,
      ].some((currClass) => exception instanceof currClass)
    ) {
      return this.getUnknownPrismaError(exception);
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.getKnownPrismaError(exception);
    }
    return;
  }

  private getHttpExceptionError(exception: HttpException) {
    return exception.message;
  }

  private getZodError(exception: ZodError) {
    const fields: Record<string, string[] | string[]> = {};

    for (const issue of exception.issues) {
      const { path, message } = issue;
      const currValue: undefined | string[] = get(fields, path);

      if (!currValue) {
        set(fields, path, [message]);
      } else {
        currValue.push(message);
      }
    }
    return {
      fields,
    };
  }

  private getUnknownPrismaError(
    exception:
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientRustPanicError
      | Prisma.PrismaClientInitializationError,
  ) {
    return {
      message: exception.message,
    };
  }

  private getKnownPrismaError(exception: Prisma.PrismaClientKnownRequestError) {
    let message: string = '';
    // NOTE: will continue to add other cases
    switch (exception.code) {
      case 'P2002': {
        const allTargets = (
          exception.meta as {
            modelName: string;
            target: string[];
          }
        ).target.join(', ');
        message = `${allTargets} ${allTargets.length > 1 ? 'has' : 'have'} already existed in the database`;
        break;
      }
      default: {
        message = 'Database error';
      }
    }
    return {
      message,
    };
  }
}
