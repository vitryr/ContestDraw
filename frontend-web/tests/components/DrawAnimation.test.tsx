import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DrawAnimation } from '@/components/DrawAnimation';

describe('DrawAnimation', () => {
  it('should render animation container', () => {
    const mockParticipants = [
      { id: '1', username: 'user1' },
      { id: '2', username: 'user2' },
      { id: '3', username: 'user3' },
    ];

    render(
      <DrawAnimation
        participants={mockParticipants}
        winnerCount={1}
        onComplete={vi.fn()}
      />
    );

    expect(screen.getByTestId('draw-animation')).toBeInTheDocument();
  });

  it('should display participant names during animation', async () => {
    const mockParticipants = [
      { id: '1', username: 'user1' },
      { id: '2', username: 'user2' },
      { id: '3', username: 'user3' },
    ];

    render(
      <DrawAnimation
        participants={mockParticipants}
        winnerCount={1}
        onComplete={vi.fn()}
      />
    );

    await waitFor(() => {
      const participantElements = screen.getAllByTestId(/participant-/);
      expect(participantElements.length).toBeGreaterThan(0);
    });
  });

  it('should call onComplete after animation finishes', async () => {
    const onComplete = vi.fn();
    const mockParticipants = [
      { id: '1', username: 'winner' },
      { id: '2', username: 'user2' },
    ];

    render(
      <DrawAnimation
        participants={mockParticipants}
        winnerCount={1}
        onComplete={onComplete}
        duration={100}
      />
    );

    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  it('should display correct number of winners', async () => {
    const onComplete = vi.fn();
    const mockParticipants = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      username: `user${i}`,
    }));

    render(
      <DrawAnimation
        participants={mockParticipants}
        winnerCount={3}
        onComplete={onComplete}
        duration={100}
      />
    );

    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled();
        const winners = onComplete.mock.calls[0][0];
        expect(winners).toHaveLength(3);
      },
      { timeout: 200 }
    );
  });

  it('should show confetti effect on completion', async () => {
    const mockParticipants = [{ id: '1', username: 'winner' }];

    render(
      <DrawAnimation
        participants={mockParticipants}
        winnerCount={1}
        onComplete={vi.fn()}
        duration={50}
      />
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('confetti-effect')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
