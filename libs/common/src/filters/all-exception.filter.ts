import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  private catchAnyException(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      typeof exception === 'string'
        ? exception
        : typeof exception?.message === 'string'
        ? exception?.message
        : 'Internal server error. Check server logs';

    const responseJson = {
      path: request.url,
      timestamp: new Date().toISOString(),
      error: {
        message:
          typeof exception?.message === 'string' ? exception?.message : message,
        ...(typeof exception === 'object' ? exception : {}),
      },
    };

    this.logger.error(JSON.stringify(responseJson, null, 2));

    delete responseJson.error['message'];

    response.status(status).json({
      path: responseJson.path,
      timestamp: responseJson.timestamp,
      error: {
        status,
        message,
        response: {
          ...(typeof responseJson.error === 'object' ? responseJson.error : {}),
        },
      },
    });
  }

  private catchHttpException(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status = exception.getStatus();
    const message = exception.message;
    const errorResponse = exception.getResponse() || null;

    typeof errorResponse === 'string'
      ? ''
      : delete errorResponse['statusCode'] &&
        typeof errorResponse['message'] === 'string'
      ? delete errorResponse['message']
      : '';

    const responseJson = {
      path: request.url,
      timestamp: new Date().toISOString(),
      error: {
        status,
        message,
        response: typeof errorResponse === 'string' ? '' : errorResponse,
      },
    };

    this.logger.error(
      JSON.stringify({ ...responseJson, error: exception }, null, 2),
    );

    response.status(status).json(responseJson);
  }

  private catchRpcException(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();

    if (typeof error?.status === 'number' && error?.message) {
      this.catchHttpException(
        new HttpException(error?.response, error.status),
        host,
      );
    } else {
      this.catchAnyException(error, host);
    }
  }

  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof RpcException) {
      this.catchRpcException(exception, host);
    } else if (exception instanceof HttpException) {
      this.catchHttpException(exception, host);
    } else if (typeof exception?.status === 'number' && exception?.message) {
      this.catchHttpException(
        new HttpException(exception.message, exception.status),
        host,
      );
    } else {
      this.catchAnyException(exception, host);
    }
  }
}
