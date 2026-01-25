import { InstagramService } from '@/services/instagram.service';
import { TestFactories } from '@tests/utils/test-factories';
import { MockHelpers } from '@tests/utils/mock-helpers';

describe('InstagramService', () => {
  let instagramService: InstagramService;
  let mockIgClient: any;

  beforeEach(() => {
    mockIgClient = MockHelpers.mockInstagramAPI({
      likers: [],
      comments: [],
    });
    instagramService = new InstagramService(mockIgClient);
  });

  describe('fetchPostLikers', () => {
    it('should fetch all likers for a post', async () => {
      const mockLikers = TestFactories.createMultiple(
        () => TestFactories.createInstagramUser(),
        25
      );

      mockIgClient.media.likers.mockResolvedValue(mockLikers);

      const result = await instagramService.fetchPostLikers('post_123');

      expect(result).toHaveLength(25);
      expect(result[0]).toHaveProperty('pk');
      expect(result[0]).toHaveProperty('username');
    });

    it('should handle pagination for large liker lists', async () => {
      const firstBatch = TestFactories.createMultiple(
        () => TestFactories.createInstagramUser(),
        50
      );
      const secondBatch = TestFactories.createMultiple(
        () => TestFactories.createInstagramUser(),
        30
      );

      mockIgClient.media.likers
        .mockResolvedValueOnce(firstBatch)
        .mockResolvedValueOnce(secondBatch)
        .mockResolvedValueOnce([]);

      const result = await instagramService.fetchPostLikers('post_123');

      expect(result).toHaveLength(80);
    });

    it('should handle rate limiting gracefully', async () => {
      mockIgClient.media.likers.mockRejectedValue({
        name: 'IgResponseError',
        message: 'rate_limit_error',
      });

      await expect(
        instagramService.fetchPostLikers('post_123')
      ).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('fetchPostComments', () => {
    it('should fetch all comments for a post', async () => {
      const mockComments = TestFactories.createMultiple(
        () => ({
          user: TestFactories.createInstagramUser(),
          text: 'Great post!',
          created_at: Date.now(),
        }),
        15
      );

      mockIgClient.media.comments.mockResolvedValue(mockComments);

      const result = await instagramService.fetchPostComments('post_123');

      expect(result).toHaveLength(15);
      expect(result[0]).toHaveProperty('user');
      expect(result[0]).toHaveProperty('text');
    });

    it('should filter out bot-like comments', async () => {
      const mockComments = [
        {
          user: TestFactories.createInstagramUser({ username: 'real_user' }),
          text: 'Amazing! @friend check this out',
        },
        {
          user: TestFactories.createInstagramUser({ username: 'bot_1234567' }),
          text: 'Click link in bio',
        },
        {
          user: TestFactories.createInstagramUser({ username: 'normal_user' }),
          text: 'Love it!',
        },
      ];

      mockIgClient.media.comments.mockResolvedValue(mockComments);

      const result = await instagramService.fetchPostComments('post_123');

      expect(result).toHaveLength(2);
      expect(result.every((c) => !c.user.username.includes('bot'))).toBe(true);
    });
  });

  describe('checkUserFollows', () => {
    it('should verify if user follows account', async () => {
      mockIgClient.user.info.mockResolvedValue({
        friendship_status: { following: true },
      });

      const result = await instagramService.checkUserFollows(
        'user_123',
        'account_456'
      );

      expect(result).toBe(true);
    });

    it('should return false if user does not follow', async () => {
      mockIgClient.user.info.mockResolvedValue({
        friendship_status: { following: false },
      });

      const result = await instagramService.checkUserFollows(
        'user_123',
        'account_456'
      );

      expect(result).toBe(false);
    });
  });

  describe('extractPostId', () => {
    it('should extract post ID from Instagram URL', () => {
      const urls = [
        'https://www.instagram.com/p/ABC123/',
        'https://instagram.com/p/XYZ789',
        'http://www.instagram.com/p/TEST456/',
      ];

      const expected = ['ABC123', 'XYZ789', 'TEST456'];

      urls.forEach((url, index) => {
        const result = instagramService.extractPostId(url);
        expect(result).toBe(expected[index]);
      });
    });

    it('should throw error for invalid URL format', () => {
      const invalidUrls = [
        'https://facebook.com/post/123',
        'not-a-url',
        'https://instagram.com/user/profile',
      ];

      invalidUrls.forEach((url) => {
        expect(() => instagramService.extractPostId(url)).toThrow(
          'Invalid Instagram post URL'
        );
      });
    });
  });

  describe('validateCredentials', () => {
    it('should validate Instagram login credentials', async () => {
      mockIgClient.account.login.mockResolvedValue({ pk: '123456' });

      const result = await instagramService.validateCredentials(
        'username',
        'password'
      );

      expect(result).toBe(true);
      expect(mockIgClient.account.login).toHaveBeenCalledWith(
        'username',
        'password'
      );
    });

    it('should return false for invalid credentials', async () => {
      mockIgClient.account.login.mockRejectedValue(
        new Error('Invalid credentials')
      );

      const result = await instagramService.validateCredentials(
        'username',
        'wrong_password'
      );

      expect(result).toBe(false);
    });

    it('should handle 2FA challenge', async () => {
      mockIgClient.account.login.mockRejectedValue({
        name: 'IgCheckpointError',
        message: 'checkpoint_required',
      });

      await expect(
        instagramService.validateCredentials('username', 'password')
      ).rejects.toThrow('Two-factor authentication required');
    });
  });
});
