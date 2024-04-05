import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../../pages/_index';

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByText('Track Your Skateboarding Tricks Progress');

    expect(heading).toBeInTheDocument();
  });
});
