import { PrismaClient } from "@prisma/client";

export class MockHelpers {
  static mockPrismaTransaction(results: any[]) {
    return jest.fn().mockImplementation((callback) => {
      return callback(...results);
    });
  }

  static mockInstagramAPI(data: any) {
    return {
      account: {
        login: jest.fn().mockResolvedValue({}),
      },
      media: {
        likers: jest.fn().mockResolvedValue(data.likers || []),
        comments: jest.fn().mockResolvedValue(data.comments || []),
      },
      user: {
        info: jest.fn().mockResolvedValue(data.userInfo || {}),
      },
    };
  }

  static mockStripeSession(sessionData: any = {}) {
    return {
      id: "cs_test_123",
      payment_status: "paid",
      amount_total: 1000,
      metadata: {},
      ...sessionData,
    };
  }

  static mockRequest(data: any = {}) {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: null,
      ...data,
    };
  }

  static mockResponse() {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    };
    return res;
  }

  static mockNext() {
    return jest.fn();
  }
}
