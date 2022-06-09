import { HttpStatus } from '@nestjs/common';
import { ApiResponseMetadata } from '@nestjs/swagger';

export const ErrorResponses = {
  internalError: (options?): ApiResponseMetadata => ({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    ...options,
  }),
  unauthorized: (examples, options?): ApiResponseMetadata => ({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    ...options,
    content: {
      'application/json': { examples },
    },
  }),
  badRequest: (examples, options?): ApiResponseMetadata => ({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    ...options,
    content: {
      'application/json': { examples },
    },
  }),
  notFound: (examples, options?): ApiResponseMetadata => ({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    ...options,
    content: {
      'application/json': { examples },
    },
  }),
  forbidden: (examples, options?): ApiResponseMetadata => ({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    ...options,
    content: {
      'application/json': { examples },
    },
  }),
};
