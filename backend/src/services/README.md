# Social Platform Integration Services

Complete production-ready services for integrating with Instagram, Facebook, Twitter, and TikTok APIs.

## Features

- ✅ **Full OAuth 2.0 support** for all platforms
- ✅ **Retry logic** with exponential backoff
- ✅ **Rate limit handling** with automatic backoff
- ✅ **Response caching** for improved performance
- ✅ **Pagination support** for large datasets (10k+ comments)
- ✅ **Comprehensive error handling**
- ✅ **TypeScript types** for all responses
- ✅ **JSDoc documentation**

## Services

### Instagram Service (`instagram.service.ts`)
- OAuth authentication with long-lived tokens
- Fetch comments with nested replies
- Fetch likes count
- Verify following status
- Fetch story mentions (business accounts)
- Parse Instagram URLs

### Facebook Service (`facebook.service.ts`)
- OAuth authentication with long-lived tokens
- Fetch comments with pagination
- Fetch reactions by type (like, love, wow, etc.)
- Verify page likes
- Page access token management
- Parse Facebook URLs

### Twitter Service (`twitter.service.ts`)
- OAuth 2.0 PKCE authentication
- Fetch tweet replies with conversation tracking
- Fetch retweets
- Verify following status
- User and tweet lookup
- Parse Twitter/X URLs

### TikTok Service (`tiktok.service.ts`)
- API-based comment fetching (when available)
- Playwright fallback for scraping
- Video information retrieval
- Short URL resolution
- Parse TikTok URLs
- Note: Official API requires approved developer account

## Setup

### 1. Install Dependencies

```bash
npm install axios
npm install playwright  # For TikTok scraping fallback
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API credentials:

```bash
cp backend/src/services/.env.example backend/.env
```

### 3. Platform-Specific Setup

#### Instagram
1. Create a Facebook App at https://developers.facebook.com/
2. Add Instagram Basic Display product
3. Configure OAuth redirect URI
4. Get Client ID and Client Secret

#### Facebook
1. Create a Facebook App at https://developers.facebook.com/
2. Add Facebook Login product
3. Request permissions: `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`
4. Configure OAuth redirect URI

#### Twitter
1. Create a Twitter App at https://developer.twitter.com/
2. Enable OAuth 2.0
3. Set up PKCE authentication
4. Configure callback URL
5. Get Bearer Token for app-level access

#### TikTok
1. Apply for TikTok developer account at https://developers.tiktok.com/
2. Wait for approval (can take weeks)
3. Create an app and get Client Key/Secret
4. Request scopes: `user.info.basic`, `video.list`, `video.comment`

## Usage Examples

### Instagram

```typescript
import { InstagramService } from './services/instagram.service';

const instagram = new InstagramService();

// Connect account
const account = await instagram.connectAccount(userId, authCode);

// Fetch comments
const comments = await instagram.fetchComments(
  'https://www.instagram.com/p/ABC123/',
  accessToken,
  1000 // max comments
);

// Verify following
const isFollowing = await instagram.verifyFollowing(
  'username',
  'target_account',
  accessToken
);
```

### Facebook

```typescript
import { FacebookService } from './services/facebook.service';

const facebook = new FacebookService();

// Fetch comments
const comments = await facebook.fetchComments(
  'https://www.facebook.com/page/posts/123456',
  pageAccessToken
);

// Fetch reactions
const reactions = await facebook.fetchReactions(postUrl, accessToken);
console.log(reactions.like, reactions.love, reactions.wow);
```

### Twitter

```typescript
import { TwitterService } from './services/twitter.service';

const twitter = new TwitterService();

// Fetch replies
const replies = await twitter.fetchReplies(
  '1234567890',
  bearerToken,
  500 // max replies
);

// Fetch retweets
const retweets = await twitter.fetchRetweets(tweetId, bearerToken);
```

### TikTok

```typescript
import { TikTokService } from './services/tiktok.service';

const tiktok = new TikTokService();

// Fetch comments (with Playwright fallback)
const comments = await tiktok.fetchComments(
  'https://www.tiktok.com/@user/video/1234567890',
  100
);
```

## Error Handling

All services throw standardized `APIError` objects:

```typescript
try {
  const comments = await instagram.fetchComments(url, token);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    console.log(`Rate limited. Reset at: ${error.rateLimit.resetAt}`);
  } else if (error.retryable) {
    // Retry logic already handled, this means max retries exceeded
    console.error('Max retries exceeded');
  } else {
    console.error('Non-retryable error:', error.message);
  }
}
```

## Rate Limiting

Each service implements intelligent rate limiting:

- **Instagram**: Graph API limits (~200 calls/hour per user)
- **Facebook**: App-level limits (varies by tier)
- **Twitter**: Per-endpoint limits (check Twitter docs)
- **TikTok**: Very strict limits (2-second delays between requests)

All services:
- Automatically retry on rate limit errors
- Parse rate limit headers
- Calculate wait times
- Implement exponential backoff

## Caching

Built-in caching reduces API calls:

- Comments: 5 minutes
- User info: 1 hour
- Following status: 10 minutes
- Page tokens: 1 hour

Adjust TTL in `Cache.set()` calls as needed.

## Pagination

Handle large datasets efficiently:

```typescript
// Fetch up to 10,000 comments
const result = await instagram.fetchComments(url, token, 10000);

console.log(`Fetched ${result.data.length} comments`);
console.log(`Has more: ${result.pagination.hasMore}`);
console.log(`Total: ${result.pagination.total}`);
```

## Production Considerations

1. **Store tokens securely** in encrypted database
2. **Refresh tokens** before expiration
3. **Monitor API usage** to avoid rate limits
4. **Handle token revocation** gracefully
5. **Implement webhook listeners** for real-time updates
6. **Use queue system** for bulk operations
7. **Log all API errors** for debugging
8. **Set up alerts** for rate limit issues

## Testing

```typescript
// Mock responses for testing
jest.mock('./services/instagram.service');

const mockComments = {
  data: [/* mock comment data */],
  pagination: { hasMore: false, total: 10 },
};

instagram.fetchComments.mockResolvedValue(mockComments);
```

## Troubleshooting

### Instagram
- **401 Unauthorized**: Token expired, refresh it
- **190 Error**: Invalid token, re-authenticate user
- **OAuthException**: Permissions missing, request user approval

### Facebook
- **100 Error**: Invalid parameter, check post URL format
- **200 Error**: Permission denied, need page access token
- **190 Error**: Token expired

### Twitter
- **429 Too Many Requests**: Rate limited, check reset time
- **401 Unauthorized**: Invalid bearer token
- **403 Forbidden**: Missing permissions

### TikTok
- **API Unavailable**: Fall back to Playwright scraping
- **Short URL**: Resolve to full URL first
- **No Comments**: Video may have comments disabled

## Support

For API-specific issues:
- Instagram: https://developers.facebook.com/support/
- Facebook: https://developers.facebook.com/support/
- Twitter: https://twittercommunity.com/
- TikTok: https://developers.tiktok.com/support/

## License

MIT
