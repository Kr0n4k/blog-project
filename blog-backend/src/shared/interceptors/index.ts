import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

// Logging interceptor
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const startTime = Date.now();
    
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    
    console.log(`[${new Date().toISOString()}] ${className}.${handlerName} - Started`);
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${className}.${handlerName} - Completed in ${duration}ms`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        console.error(`[${new Date().toISOString()}] ${className}.${handlerName} - Failed in ${duration}ms:`, error.message);
        return throwError(() => error);
      })
    );
  }
}

// Performance monitoring interceptor
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly slowQueryThreshold: number;

  constructor(slowQueryThreshold: number = 1000) {
    this.slowQueryThreshold = slowQueryThreshold;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        
        if (duration > this.slowQueryThreshold) {
          console.warn(`[PERFORMANCE] ${className}.${handlerName} took ${duration}ms (threshold: ${this.slowQueryThreshold}ms)`);
        }
      })
    );
  }
}

// Cache interceptor
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; expires: number }>();
  private readonly defaultTtl: number;

  constructor(defaultTtl: number = 300000) { // 5 minutes
    this.defaultTtl = defaultTtl;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const args = ctx.getArgs();
    
    // Create cache key based on method name and arguments
    const cacheKey = `${context.getHandler().name}:${JSON.stringify(args)}`;
    const now = Date.now();
    
    // Check if cached data exists and is not expired
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > now) {
      console.log(`[CACHE] Hit for ${cacheKey}`);
      return new Observable(subscriber => {
        subscriber.next(cached.data);
        subscriber.complete();
      });
    }
    
    return next.handle().pipe(
      tap(data => {
        // Cache the result
        this.cache.set(cacheKey, {
          data,
          expires: now + this.defaultTtl
        });
        console.log(`[CACHE] Stored for ${cacheKey}`);
      })
    );
  }
}

// Transform response interceptor
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(data => {
        // Add metadata to response
        if (data && typeof data === 'object') {
          data._metadata = {
            timestamp: new Date().toISOString(),
            version: '1.0.0'
          };
        }
      })
    );
  }
}

// Error handling interceptor
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        
        // Log error details
        console.error(`[ERROR] ${context.getClass().name}.${context.getHandler().name}:`, {
          message: error.message,
          stack: error.stack,
          url: request.url,
          method: request.method,
          userAgent: request.headers['user-agent'],
          ip: request.ip
        });
        
        // Transform error for client
        const transformedError = {
          message: error.message || 'Internal server error',
          statusCode: error.status || 500,
          timestamp: new Date().toISOString(),
          path: request.url
        };
        
        return throwError(() => transformedError);
      })
    );
  }
}

// Request ID interceptor
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    // Generate unique request ID
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    request.headers['x-request-id'] = requestId;
    
    return next.handle().pipe(
      tap(() => {
        console.log(`[REQUEST] ${requestId} - Completed`);
      })
    );
  }
}

// Security headers interceptor
@Injectable()
export class SecurityHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const response = ctx.getContext().res;
    
    // Set security headers
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    return next.handle();
  }
}

// Rate limiting interceptor
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    const clientId = request.ip || 'unknown';
    const now = Date.now();
    
    const clientData = this.requests.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      this.requests.set(clientId, { count: 1, resetTime: now + this.windowMs });
    } else {
      clientData.count++;
      
      if (clientData.count > this.maxRequests) {
        return throwError(() => new Error('Rate limit exceeded'));
      }
    }
    
    return next.handle();
  }
}
