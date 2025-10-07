import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { hash } from 'argon2';

describe('AccountService', () => {
  let service: AccountService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserInput = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should create a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        ...createUserInput,
        password: 'hashed_password',
      });

      const result = await service.create(createUserInput);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userName: createUserInput.userName,
          email: createUserInput.email,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
        }),
      });
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if username already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: '1',
        userName: 'testuser',
      });

      await expect(service.create(createUserInput)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null) // username check
        .mockResolvedValueOnce({ id: '1', email: 'test@example.com' }); // email check

      await expect(service.create(createUserInput)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return user by id', async () => {
      const userId = '1';
      const mockUser = {
        id: userId,
        userName: 'testuser',
        email: 'test@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.me(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should return user by id with selected fields', async () => {
      const userId = '1';
      const mockUser = {
        id: userId,
        userName: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          userName: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('searchUsers', () => {
    it('should search users by query', async () => {
      const query = 'test';
      const limit = 10;
      const offset = 0;
      const mockUsers = [
        {
          id: '1',
          userName: 'testuser',
          firstName: 'Test',
          lastName: 'User',
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.searchUsers(query, limit, offset);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userName: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockUsers);
    });
  });
});
