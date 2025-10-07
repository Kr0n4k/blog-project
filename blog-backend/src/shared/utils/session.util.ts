import type { User } from "generated/prisma";
import type { Request } from "express";
import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export function saveSession(req: Request, user: User){
    return new Promise((resolve, reject) => {
        // Сохраняем данные в сессию
        req.session.createdAt = new Date();
        req.session.userId = user.id;

        console.log('Session data after setting:', {
            userId: req.session.userId,
            sessionID: req.sessionID
        });

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return reject(new InternalServerErrorException(
                    'Ошибка при сохранении сессии. Попробуйте позже'
                ));
            }

            console.log('Session saved successfully. Final session:', req.session);
            console.log('Session ID after save:', req.sessionID);

            resolve(true)
        });
    });
}

export function destroySession(req: Request, configService: ConfigService){
    return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destroy error:', err);
                    console.error('Error details:', {
                        message: err.message,
                        stack: err.stack
                    });
                    return reject(new InternalServerErrorException(
                        'Ошибка при удалении сессии. Попробуйте позже'
                    ));
                }

                console.log('Session destroyed successfully');

                // Проверяем существование response перед очисткой cookie
                if (!req.res) {
                    console.warn('Response object is not available for clearing cookies');
                    return resolve(true);
                }

                const sessionName = configService.getOrThrow<string>('SESSION_NAME');
                console.log('Clearing cookie:', sessionName);

                try {
                    req.res.clearCookie(sessionName, {
                        path: '/',
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax'
                    });
                    console.log('Cookie cleared successfully');
                } catch (cookieError) {
                    console.error('Cookie clear error:', cookieError);
                    // Не reject'им здесь, так как сессия уже уничтожена
                    console.warn('Cookie clearing failed, but session was destroyed');
                }

                console.log('Logout completed successfully');
                resolve(true);
            });
    });
}