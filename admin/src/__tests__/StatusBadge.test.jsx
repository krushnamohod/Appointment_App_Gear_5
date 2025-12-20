import { StatusBadge } from '@/components/StatusBadge';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('StatusBadge', () => {
    it('shows Published when isPublished is true', () => {
        render(<StatusBadge isPublished={true} />);
        expect(screen.getByText('Published')).toBeInTheDocument();
    });

    it('shows Unpublished when isPublished is false', () => {
        render(<StatusBadge isPublished={false} />);
        expect(screen.getByText('Unpublished')).toBeInTheDocument();
    });

    it('has correct aria-label for published state', () => {
        render(<StatusBadge isPublished={true} />);
        expect(screen.getByLabelText('Published')).toBeInTheDocument();
    });

    it('has correct aria-label for unpublished state', () => {
        render(<StatusBadge isPublished={false} />);
        expect(screen.getByLabelText('Unpublished')).toBeInTheDocument();
    });
});
