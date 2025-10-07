import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import {hash} from 'argon2'
import {type User } from 'generated/prisma';
import { FindByNameInput } from './inputs/find-by-name.input';

@Injectable()
export class AccountService {
    public constructor(
        private readonly prismaService: PrismaService,
    ){}


    public async me(id: string){
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        return user
    }

    public async create(input: CreateUserInput){
        const {userName, email, password, firstName, lastName} = input

        const isUsernameExist = await this.prismaService.user.findUnique({
            where: {
                userName: userName
            }
        })

        if(isUsernameExist){
            throw new ConflictException("Username already exist")
        }

        const isEmailExist = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })

        if(isEmailExist){
            throw new ConflictException(
                "Email already exist"
            )
        }

        const user = await this.prismaService.user.create({
            data: {
                userName: userName,
                email,
                password: await hash(password),
                firstName: firstName,
                lastName: lastName,
            }
        })

        return user
    }
    
    public async getUserById(id: string){
        return await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }

    public async findUserByName(name: FindByNameInput){
        const {firstName, lastName} = name

        const user = await this.prismaService.user.findMany({
            where: {
                firstName: firstName,
                lastName: lastName
            }
        })

        return user
    }

    public async findUserByID(id: string){
        return await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }

    public async updateProfile(id: string, data: { bio?: string; avatar?: string }){
        return await this.prismaService.user.update({
            where: { id },
            data: {
                bio: data.bio,
                avatar: data.avatar
            }
        })
    }

    public async searchUsers(query: string, limit: number = 10, offset: number = 0) {
        return await this.prismaService.user.findMany({
            where: {
                OR: [
                    { userName: { contains: query, mode: 'insensitive' } },
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } },
                    { bio: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                userName: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                createdAt: true
            }
        })
    }

    public async getAllUsers() {
        return await this.prismaService.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                userName: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                createdAt: true
            }
        })
    }

    public async findById(id: string) {
        return await this.prismaService.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }
}