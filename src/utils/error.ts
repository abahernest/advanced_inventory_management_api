import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ErrorLogger extends Logger {
  handleError = (loggerMessage: string, err: Error) => {
    // eslint-disable-next-line prefer-const
    let [statusCode, errorType, message] = err.message.split(':-');

    // if error isn't custom
    if (!message) {
      statusCode = '500';
      errorType = 'Internal Server Error';
      message = err.message;
    }

    if (statusCode == '500') {
      super.error(loggerMessage);
    }

    throw new HttpException(
      {
        statusCode,
        error: errorType,
        message,
      },
      Number(statusCode),
    );
  };
}
