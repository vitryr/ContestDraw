import { faker } from "@faker-js/faker";

export class TestFactories {
  static createUser(overrides = {}) {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      passwordHash: faker.string.alphanumeric(60),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createDraw(overrides = {}) {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      instagramPostUrl: faker.internet.url(),
      winnerCount: faker.number.int({ min: 1, max: 10 }),
      filters: {},
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createParticipant(overrides = {}) {
    return {
      id: faker.string.uuid(),
      drawId: faker.string.uuid(),
      instagramUsername: faker.internet.userName(),
      instagramUserId: faker.string.numeric(10),
      hasLiked: faker.datatype.boolean(),
      hasCommented: faker.datatype.boolean(),
      followsAccount: faker.datatype.boolean(),
      hasStory: faker.datatype.boolean(),
      isEligible: true,
      disqualificationReason: null,
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createWinner(overrides = {}) {
    return {
      id: faker.string.uuid(),
      drawId: faker.string.uuid(),
      participantId: faker.string.uuid(),
      position: faker.number.int({ min: 1, max: 10 }),
      certificateUrl: faker.internet.url(),
      notified: false,
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createCredit(overrides = {}) {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      amount: faker.number.int({ min: 1, max: 100 }),
      type: "purchase" as const,
      stripeSessionId: faker.string.alphanumeric(32),
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createInstagramUser(overrides = {}) {
    return {
      pk: faker.string.numeric(10),
      username: faker.internet.userName(),
      full_name: faker.person.fullName(),
      profile_pic_url: faker.image.avatar(),
      is_private: faker.datatype.boolean(),
      is_verified: faker.datatype.boolean(),
      ...overrides,
    };
  }

  static createMultiple<T>(factory: () => T, count: number): T[] {
    return Array.from({ length: count }, factory);
  }
}
