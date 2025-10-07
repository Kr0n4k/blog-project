// Global test setup
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup test database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

// Global test timeout
jest.setTimeout(30000);
