import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Show from '../../components/common/Show';

describe('Show component should show and hide correctly', () => {
  describe('Show prop', () => {
    it('Should show component if condition is true', () => {
      const text = 'show';
      render(<Show if={true} show={<div>{text}</div>} />);
      expect(screen.queryByText(text)).toBeInTheDocument();
    });

    it('Should not show component if condition is false', () => {
      const text = 'show';
      render(<Show if={false} show={<div>{text}</div>} />);
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });

    it('Should show else component if condition is false', () => {
      const text = 'else';
      render(<Show if={false} show={<div>show</div>} else={<div>{text}</div>} />);
      expect(screen.queryByText(text)).toBeInTheDocument();
    });
  });

  describe('Children', () => {
    it('Should show children if condition is true', () => {
      const text = 'children';
      render(<Show if={true}>{text}</Show>);
      expect(screen.queryByText(text)).toBeInTheDocument();
    });

    it('Should not show children if condition is false', () => {
      const text = 'children';
      render(<Show if={false}>{text}</Show>);
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });

    it('Should show else component if condition is false', () => {
      const text = 'else';
      render(
        <Show if={false} else={<div>{text}</div>}>
          children
        </Show>,
      );
      expect(screen.queryByText(text)).toBeInTheDocument();
    });
  });
});
