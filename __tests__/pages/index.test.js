import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../../pages/_index';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: 'admin' },
  };
  return {
    ...originalModule,
    useSession: jest.fn(() => ({ data: mockSession, status: 'authenticated' })),
  };
});

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByText('Track Your Skateboarding Tricks Progress');

    expect(heading).toBeInTheDocument();
  });
});
