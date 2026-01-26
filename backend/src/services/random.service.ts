import crypto from "crypto";
import { DrawParticipant } from "../types";

/**
 * Cryptographically secure random number generator
 * @param min Minimum value (inclusive)
 * @param max Maximum value (exclusive)
 * @returns Random integer between min and max
 */
const secureRandomInt = (min: number, max: number): number => {
  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValue = Math.pow(256, bytesNeeded);
  const cutoff = maxValue - (maxValue % range);

  let randomValue: number;
  do {
    const buffer = crypto.randomBytes(bytesNeeded);
    randomValue = buffer.readUIntBE(0, bytesNeeded);
  } while (randomValue >= cutoff);

  return min + (randomValue % range);
};

/**
 * Fisher-Yates shuffle algorithm with cryptographic randomness
 * @param array Array to shuffle
 * @returns Shuffled array
 */
const cryptoShuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/**
 * Select random winners from participants using cryptographically secure randomness
 *
 * @param participants Array of participants
 * @param numberOfWinners Number of winners to select
 * @param allowDuplicates Whether to allow duplicate winners
 * @param seed Optional seed for reproducibility (for testing)
 * @returns Array of selected winners
 *
 * @example
 * const participants = [
 *   { id: '1', name: 'Alice', identifier: '@alice', source: 'INSTAGRAM' },
 *   { id: '2', name: 'Bob', identifier: '@bob', source: 'INSTAGRAM' }
 * ];
 * const winners = selectWinners(participants, 1, false);
 */
export const selectWinners = (
  participants: DrawParticipant[],
  numberOfWinners: number,
  allowDuplicates: boolean = false,
  seed?: string,
): DrawParticipant[] => {
  if (participants.length === 0) {
    throw new Error("No participants provided");
  }

  if (numberOfWinners < 1) {
    throw new Error("Number of winners must be at least 1");
  }

  if (!allowDuplicates && numberOfWinners > participants.length) {
    throw new Error(
      "Number of winners cannot exceed number of participants when duplicates are not allowed",
    );
  }

  // If seed is provided, use it for deterministic selection (for testing/verification)
  if (seed) {
    return selectWinnersWithSeed(
      participants,
      numberOfWinners,
      allowDuplicates,
      seed,
    );
  }

  // Cryptographically secure random selection
  if (allowDuplicates) {
    // Allow same participant to win multiple times
    const winners: DrawParticipant[] = [];
    for (let i = 0; i < numberOfWinners; i++) {
      const randomIndex = secureRandomInt(0, participants.length);
      winners.push(participants[randomIndex]);
    }
    return winners;
  } else {
    // Unique winners only - use Fisher-Yates shuffle
    const shuffled = cryptoShuffle(participants);
    return shuffled.slice(0, numberOfWinners);
  }
};

/**
 * Deterministic winner selection using a seed (for verification)
 * Uses seeded PRNG for reproducible results
 *
 * @param participants Array of participants
 * @param numberOfWinners Number of winners to select
 * @param allowDuplicates Whether to allow duplicate winners
 * @param seed Seed string for reproducibility
 * @returns Array of selected winners
 */
const selectWinnersWithSeed = (
  participants: DrawParticipant[],
  numberOfWinners: number,
  allowDuplicates: boolean,
  seed: string,
): DrawParticipant[] => {
  // Create a seeded PRNG using hash of seed
  let hash = crypto.createHash("sha256").update(seed).digest();

  const seededRandom = (): number => {
    hash = crypto.createHash("sha256").update(hash).digest();
    return hash.readUInt32BE(0) / 0xffffffff;
  };

  if (allowDuplicates) {
    const winners: DrawParticipant[] = [];
    for (let i = 0; i < numberOfWinners; i++) {
      const randomIndex = Math.floor(seededRandom() * participants.length);
      winners.push(participants[randomIndex]);
    }
    return winners;
  } else {
    // Seeded Fisher-Yates shuffle
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, numberOfWinners);
  }
};

/**
 * Generate a cryptographically secure random seed
 * @returns Random seed string
 */
export const generateRandomSeed = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Verify a draw result using the same seed
 * @param participants Original participants
 * @param numberOfWinners Number of winners
 * @param allowDuplicates Whether duplicates were allowed
 * @param seed Seed used in original draw
 * @param winners Winners to verify
 * @returns True if verification passes
 */
export const verifyDrawResult = (
  participants: DrawParticipant[],
  numberOfWinners: number,
  allowDuplicates: boolean,
  seed: string,
  winners: DrawParticipant[],
): boolean => {
  try {
    const recomputedWinners = selectWinnersWithSeed(
      participants,
      numberOfWinners,
      allowDuplicates,
      seed,
    );

    // Compare winners
    if (recomputedWinners.length !== winners.length) {
      return false;
    }

    for (let i = 0; i < winners.length; i++) {
      if (recomputedWinners[i].id !== winners[i].id) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};
