import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const config = app.get(ConfigService);
  const isProduction = process.env.NODE_ENV === 'production';

  const configSwagger = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API для блоговой платформы с системой постов, комментариев и пользователей')
    .setVersion('1.0.0')
    .setContact(
      'Blog Team',
      'https://github.com/your-username/blog-project',
      'contact@blog.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Authentication', 'Аутентификация и авторизация пользователей')
    .addTag('Users', 'Управление пользователями')
    .addTag('Posts', 'Управление постами')
    .addTag('Comments', 'Система комментариев')
    .addTag('Likes', 'Система лайков')
    .addServer('http://localhost:4000', 'Development server')
    .addServer('https://api.blog.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addCookieAuth('session', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Session cookie for authentication'
    })
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  
  // Настройка Swagger UI
  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Blog API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 4px; }
    `,
  };

  SwaggerModule.setup('api/docs', app, document, swaggerOptions);

  // Генерация JSON схемы для экспорта
  if (!isProduction) {
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`Swagger specification saved to: ${outputPath}`);
  }
}
