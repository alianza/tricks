import 'jest';
import { testUser } from '@/lib/testUtils';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(() => ({ data: testUser, status: 'authenticated' })),
}));

jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
  getServerSession: jest.fn(() => new Promise((resolve) => resolve(testUser))),
}));

window.getComputedStyle = jest.fn().mockReturnValue({ transitionDuration: '1s' }); // Mocking getComputedStyle for testing
