import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';

// Global exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception instanceof HttpException 
      ? exception.getResponse() 
      : 'Internal server error';
    
    // Log error
    console.error(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${status}:`, {
      message: typeof message === 'string' ? message : JSON.stringify(message),
      stack: exception.stack,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    });
    
    // Send error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : 'An error occurred'
    });
  }
}

// GraphQL exception filter
@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: GqlArgumentsHost) {
    const ctx = host.getContext();
    const request = ctx.req as Request;
    
    // Log GraphQL error
    console.error(`[GraphQL Error] ${new Date().toISOString()}:`, {
      message: exception.message,
      stack: exception.stack,
      operation: request.body?.operationName,
      variables: request.body?.variables,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    });
    
    // Transform error for GraphQL
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      
      return new HttpException(
        typeof message === 'string' ? message : 'GraphQL error',
        status
      );
    }
    
    // Handle unknown errors
    return new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Validation exception filter
@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception.getStatus();
    const message = exception.getResponse();
    
    // Handle validation errors specifically
    if (status === HttpStatus.BAD_REQUEST && typeof message === 'object') {
      const validationErrors = this.formatValidationErrors(message);
      
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }
    
    // Pass through other HTTP exceptions
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : 'An error occurred'
    });
  }
  
  private formatValidationErrors(errors: any): any[] {
    if (Array.isArray(errors)) {
      return errors.map(error => ({
        field: error.property,
        message: error.constraints ? Object.values(error.constraints)[0] : error.message,
        value: error.value
      }));
    }
    
    return [{
      field: 'unknown',
      message: 'Validation error',
      value: null
    }];
  }
}

// Database exception filter
@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Check if it's a database-related error
    if (this.isDatabaseError(exception)) {
      console.error(`[Database Error] ${new Date().toISOString()}:`, {
        message: exception.message,
        code: exception.code,
        stack: exception.stack,
        query: request.url,
        userAgent: request.headers['user-agent'],
        ip: request.ip
      });
      
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Database error occurred'
      });
      return;
    }
    
    // Re-throw if not a database error
    throw exception;
  }
  
  private isDatabaseError(exception: any): boolean {
    return exception.code && (
      exception.code.startsWith('P') || // Prisma error codes
      exception.code === 'ECONNREFUSED' ||
      exception.code === 'ETIMEDOUT' ||
      exception.name === 'PrismaClientKnownRequestError' ||
      exception.name === 'PrismaClientUnknownRequestError' ||
      exception.name === 'PrismaClientRustPanicError' ||
      exception.name === 'PrismaClientInitializationError'
    );
  }
}

// Rate limit exception filter
@Catch()
export class RateLimitExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Check if it's a rate limit error
    if (exception.message && exception.message.includes('Rate limit')) {
      console.warn(`[Rate Limit] ${new Date().toISOString()}:`, {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        url: request.url,
        method: request.method
      });
      
      response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Too many requests, please try again later',
        retryAfter: 60 // seconds
      });
      return;
    }
    
    // Re-throw if not a rate limit error
    throw exception;
  }
}

// Authentication exception filter
@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Check if it's an authentication error
    if (this.isAuthError(exception)) {
      console.warn(`[Auth Error] ${new Date().toISOString()}:`, {
        message: exception.message,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        url: request.url,
        sessionId: request.sessionID
      });
      
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Authentication required'
      });
      return;
    }
    
    // Re-throw if not an auth error
    throw exception;
  }
  
  private isAuthError(exception: any): boolean {
    return exception.status === HttpStatus.UNAUTHORIZED ||
           exception.message?.includes('Unauthorized') ||
           exception.message?.includes('Authentication') ||
           exception.message?.includes('Session');
  }
}

// CORS exception filter
@Catch()
export class CorsExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Check if it's a CORS error
    if (this.isCorsError(exception)) {
      console.warn(`[CORS Error] ${new Date().toISOString()}:`, {
        message: exception.message,
        origin: request.headers.origin,
        referer: request.headers.referer,
        userAgent: request.headers['user-agent'],
        ip: request.ip
      });
      
      response.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'CORS policy violation'
      });
      return;
    }
    
    // Re-throw if not a CORS error
    throw exception;
  }
  
  private isCorsError(exception: any): boolean {
    return exception.message?.includes('CORS') ||
           exception.message?.includes('Origin') ||
           exception.message?.includes('Cross-Origin');
  }
}
