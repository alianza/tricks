import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

describe('Page', () => {
  it('renders a heading', async () => {
    render(await Page());

    const heading = screen.getByText('Track Your Skateboarding Tricks Progress');

    expect(heading).toBeInTheDocument();
  });
});
