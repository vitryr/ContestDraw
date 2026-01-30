# Social Platform Integration Guide

Learn how to connect and run contests on each social media platform supported by Cleack.

## Instagram

### Connection Requirements
- Personal or Business account
- Public profile (or public post)
- Instagram API permissions

### Supported Contest Types
✅ **Comment-to-Enter Contests**
- Users comment on your post to enter
- Can require following, liking, and tagging friends
- Best for: Product giveaways, brand awareness

✅ **Tag-a-Friend Contests**
- Users must tag friends in comments
- Increases reach and engagement
- Best for: Growing your audience

✅ **Photo/Video Contests**
- Users post with a specific hashtag
- We fetch entries via hashtag search
- Best for: User-generated content campaigns

### Instagram-Specific Filters

#### Must Follow Account
Ensures only your followers can win. Note: We verify follower status at the time of the draw, not when they commented.

#### Must Tag Friends
- Specify minimum number of friends to tag (e.g., "Tag 2 friends")
- We detect @mentions in comments
- Invalid/deleted accounts are excluded

#### Exclude Business Accounts
Filters out brand accounts to ensure winners are real people.

#### Minimum Followers
Helps prevent fake/bot accounts (we recommend 100+ followers).

### Instagram Connection Steps

1. **Go to Settings → Social Connections**
2. **Click "Connect Instagram"**
3. **Instagram Login**: Log in to your Instagram account
4. **Grant Permissions**:
   - `instagram_basic` - View profile information
   - `instagram_manage_comments` - Read comments on posts
   - `instagram_manage_insights` - View post insights
5. **Confirmation**: You'll see "Connected" next to Instagram

### Instagram Best Practices

**✅ DO:**
- Post clear contest rules in the caption
- Use Instagram's "Branded Content" tools if required
- Tag Cleack in your story when announcing winners
- Respond to participants' comments

**❌ DON'T:**
- Ask users to like multiple posts (against Instagram rules)
- Require users to share posts to Stories (limited verification)
- Tag irrelevant accounts to gain exposure

### Instagram API Limitations
- Comment fetching may be delayed by 5-10 minutes for new comments
- Maximum 500 comments per request (we handle pagination automatically)
- Rate limits: 200 calls per hour per user

### Troubleshooting Instagram

**"Cannot fetch comments"**
- Ensure the post is public (not from a private account)
- Check that you're the post owner
- Verify the post hasn't been deleted

**"Missing followers data"**
- Follower verification requires Instagram Business account
- Or connect Facebook Business Manager

---

## Facebook

### Connection Requirements
- Facebook Page (not personal profile)
- Page admin access
- Facebook App permissions

### Supported Contest Types
✅ **Page Post Comments**
- Users comment on your page post
- Can verify likes, shares, and page follows

✅ **Group Contests**
- Run contests in Facebook Groups
- Requires group admin permissions

### Facebook-Specific Filters

#### Must Like Page
Ensures participants follow your Facebook Page.

#### Must Share Post
Verify if users shared your post (public shares only).

#### Must React to Post
Ensure users liked/reacted to the contest post.

### Facebook Connection Steps

1. **Go to Settings → Social Connections**
2. **Click "Connect Facebook"**
3. **Facebook Login**: Log in as page administrator
4. **Select Page**: Choose which page to connect
5. **Grant Permissions**:
   - `pages_read_engagement` - Read comments and reactions
   - `pages_read_user_content` - Access user comments
   - `pages_manage_metadata` - View page information

### Facebook Best Practices

**✅ DO:**
- Comply with Facebook's Page Guidelines
- Use Facebook's "Promotion Guidelines" for contests
- Clearly state that the contest is not sponsored by Facebook
- Respond to comments to boost engagement

**❌ DON'T:**
- Run contests on personal profiles (against Facebook TOS)
- Ask users to share on personal timelines (limited tracking)
- Require tagging Facebook itself

### Facebook API Limitations
- Comment fetching limited to public comments
- Private group comments require explicit permissions
- Rate limit: 200 calls per hour

---

## Twitter (X)

### Connection Requirements
- Twitter/X account
- API v2 access
- OAuth 2.0 authentication

### Supported Contest Types
✅ **Reply-to-Tweet Contests**
- Users reply to your tweet to enter
- Can verify retweets and follows

✅ **Hashtag Contests**
- Users tweet with a specific hashtag
- We collect entries via hashtag search

✅ **Quote Tweet Contests**
- Users quote tweet your contest tweet
- Good for viral content

### Twitter-Specific Filters

#### Must Follow Account
Verifies users follow your Twitter account.

#### Must Retweet
Ensures users retweeted the contest tweet.

#### Must Like Tweet
Verifies users liked the contest tweet.

#### Hashtag Requirements
Specify required hashtags in replies (e.g., #giveaway #contest).

### Twitter Connection Steps

1. **Go to Settings → Social Connections**
2. **Click "Connect Twitter"**
3. **Twitter Authorization**: Log in to Twitter
4. **Grant Permissions**:
   - Read tweets and profile information
   - Read follower lists
   - Access tweet replies

### Twitter Best Practices

**✅ DO:**
- Use Twitter's built-in analytics to track engagement
- Pin the contest tweet to your profile
- Use trending hashtags (but don't spam)
- Announce winners via tweet thread

**❌ DON'T:**
- Ask users to follow multiple accounts (looks spammy)
- Require DMs (difficult to verify)
- Use misleading hashtags

### Twitter API Limitations
- Tweet search limited to past 7 days (for free tier)
- Rate limit: 180 requests per 15 minutes
- Retweet verification requires API v2

---

## TikTok

### Connection Requirements
- TikTok Creator or Business account
- Minimum 1,000 followers (TikTok API requirement)
- Public account

### Supported Contest Types
✅ **Comment-to-Enter**
- Users comment on your TikTok video
- Can verify follows and likes

✅ **Hashtag Challenges**
- Users post videos with your challenge hashtag
- We collect via hashtag search

✅ **Duet/Stitch Contests**
- Users duet or stitch your video
- Good for viral challenges

### TikTok-Specific Filters

#### Must Follow Account
Verifies TikTok followers.

#### Must Like Video
Ensures users liked the contest video.

#### Video Requirements
For hashtag challenges, verify video length, hashtag usage, etc.

### TikTok Connection Steps

1. **Go to Settings → Social Connections**
2. **Click "Connect TikTok"**
3. **TikTok Login**: Log in to your creator account
4. **Grant Permissions**:
   - View profile information
   - Read video comments
   - Access follower data

### TikTok Best Practices

**✅ DO:**
- Create engaging challenge videos
- Use trending sounds for visibility
- Pin the contest rules comment
- Feature winners in a follow-up video

**❌ DON'T:**
- Require follows on other platforms (against TikTok rules)
- Ask for likes on multiple videos
- Spam hashtags

### TikTok API Limitations
- Comment fetching limited to 1,000 per video
- Follower verification requires creator account
- Rate limit: 100 requests per minute

---

## YouTube

### Connection Requirements
- YouTube channel
- Google account access
- YouTube Data API enabled

### Supported Contest Types
✅ **Video Comment Contests**
- Users comment on your YouTube video
- Can verify subscribers and likes

✅ **Community Post Contests**
- Run contests via YouTube Community posts
- Good for engaging subscribers

### YouTube-Specific Filters

#### Must Subscribe
Verifies users are subscribed to your channel.

#### Must Like Video
Ensures users liked the contest video.

#### Comment Length
Set minimum comment length to avoid spam (e.g., "Nice!" comments).

### YouTube Connection Steps

1. **Go to Settings → Social Connections**
2. **Click "Connect YouTube"**
3. **Google Sign-In**: Log in to your Google account
4. **Select Channel**: Choose which YouTube channel
5. **Grant Permissions**:
   - View YouTube channel information
   - Read comments on videos
   - View subscriber counts

### YouTube Best Practices

**✅ DO:**
- Pin the contest rules as top comment
- Disable comment approval to avoid delays
- Mention the draw date in the video
- Create a "Winner Announcement" video

**❌ DON'T:**
- Ask for "sub 4 sub" (against YouTube policy)
- Require external actions (e.g., Instagram follows)
- Edit contest rules after posting

### YouTube API Limitations
- Comment fetching: 100 comments per request
- Subscriber verification limited to public subscribers
- Rate limit: 10,000 units per day

---

## Multi-Platform Contests

### Running the Same Contest Across Platforms

You can run parallel contests on multiple platforms:

1. **Create separate draws** for each platform
2. **Use consistent rules** across all platforms
3. **Track results** in your Cleack dashboard
4. **Announce winners** simultaneously

### Cross-Platform Requirements

Example: "Follow us on Instagram AND comment on YouTube"

**Option 1: Single-Platform Draw with Manual Verification**
- Run draw on one platform
- Manually verify winners followed requirements on other platforms
- Run redraw if winner doesn't qualify

**Option 2: Multiple Draws**
- Create separate draws per platform
- Combine winners manually
- More complex but fully automated

---

## Platform Comparison

| Feature | Instagram | Facebook | Twitter | TikTok | YouTube |
|---------|-----------|----------|---------|---------|---------|
| Comment fetching | ✅ | ✅ | ✅ | ✅ | ✅ |
| Follower verification | ✅ | ✅ | ✅ | ✅ | ✅ |
| Like verification | ✅ | ✅ | ✅ | ✅ | ✅ |
| Share verification | ❌ | ✅ | ✅ | ❌ | ❌ |
| Hashtag search | ✅ | ❌ | ✅ | ✅ | ✅ |
| Tag friend detection | ✅ | ✅ | ✅ | ❌ | ❌ |
| Business account filter | ✅ | ✅ | ❌ | ✅ | ❌ |
| Account age verification | ✅ | ✅ | ✅ | ❌ | ✅ |

---

## Frequently Asked Questions

**Q: Can I connect multiple accounts from the same platform?**
A: Not yet. You can only connect one account per platform per Cleack account. Enterprise users can contact us for multi-account support.

**Q: Do I need a business account?**
A: For Instagram and TikTok, yes (for follower verification). Facebook requires a Page. Twitter and YouTube work with regular accounts.

**Q: What happens if my token expires?**
A: We'll send you an email notification. Simply reconnect the platform in Settings → Social Connections.

**Q: Can I disconnect and reconnect without losing data?**
A: Yes, your past draws remain intact. However, you won't be able to run new draws until reconnected.

**Q: Are there any costs from social platforms?**
A: No, connecting platforms is free. Cleack only charges credits for executing draws.

---

**Next Steps:**
- [Advanced Filtering Guide](./filters-guide.md)
- [Creating Your First Draw](./creating-draws.md)
- [API Integration for Developers](../technical/api-integration.md)
