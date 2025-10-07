import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Session } from 'express-session';

// Session-based authentication guard
@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request & { session: Session };
    
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('Session not found or expired');
    }
    
    return true;
  }
}

// Role-based authorization guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request & { session: Session };
    
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    // For now, we'll assume all authenticated users have basic role
    // In a real app, you'd check user roles from database
    const userRole = 'user'; // This should come from user data
    
    if (!this.allowedRoles.includes(userRole)) {
      throw new UnauthorizedException('Insufficient permissions');
    }
    
    return true;
  }
}

// Resource ownership guard
@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  constructor(private readonly resourceIdParam: string = 'id') {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request & { session: Session };
    const args = ctx.getArgs();
    
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    const resourceId = args[this.resourceIdParam];
    const userId = request.session.userId;
    
    // This is a simplified check - in reality, you'd verify ownership in the service
    // For now, we'll just ensure the user is authenticated
    return true;
  }
}

// Admin guard
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request & { session: Session };
    
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('Authentication required');
    }
    
    // In a real app, you'd check if user has admin role
    const isAdmin = request.session.user?.role === 'admin';
    
    if (!isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }
    
    return true;
  }
}

// Rate limiting guard
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    
    const clientId = request.ip || 'unknown';
    const now = Date.now();
    
    const clientData = this.requests.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      this.requests.set(clientId, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (clientData.count >= this.maxRequests) {
      throw new UnauthorizedException('Rate limit exceeded');
    }
    
    clientData.count++;
    return true;
  }
}

// CSRF protection guard
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    
    // Skip CSRF for GET requests
    if (request.method === 'GET') {
      return true;
    }
    
    // In a real app, you'd verify CSRF token
    // For now, we'll just return true
    return true;
  }
}

// API key guard
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly validApiKeys: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    
    const apiKey = request.headers['x-api-key'] as string;
    
    if (!apiKey || !this.validApiKeys.includes(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    return true;
  }
}

// IP whitelist guard
@Injectable()
export class IpWhitelistGuard implements CanActivate {
  constructor(private readonly allowedIps: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    
    const clientIp = request.ip || request.connection.remoteAddress;
    
    if (!clientIp || !this.allowedIps.includes(clientIp)) {
      throw new UnauthorizedException('IP not allowed');
    }
    
    return true;
  }
}
