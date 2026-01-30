# Advanced Filtering Guide

Master Cleack's powerful filtering system to ensure fair, high-quality contests and eliminate fake entries, spam, and bots.

## Table of Contents
- [Why Use Filters?](#why-use-filters)
- [Filter Categories](#filter-categories)
- [Filter Reference](#filter-reference)
- [Common Filter Combinations](#common-filter-combinations)
- [Best Practices](#best-practices)
- [Filter Cost](#filter-cost)

---

## Why Use Filters?

**Without Filters:**
- 🤖 Bots and fake accounts can win
- 📈 Users can enter multiple times unfairly
- 🚫 Non-followers can win (defeating marketing purpose)
- 💬 Spam comments clutter your results
- 😤 Low-quality engagement

**With Filters:**
- ✅ Genuine participants only
- ⚖️ Fair, one-entry-per-person system
- 🎯 Engaged, relevant audience
- 🏆 High-quality winners who care about your brand
- 📊 Better analytics and insights

---

## Filter Categories

### 1. Engagement Filters
Ensure participants actively engage with your content.

### 2. Account Quality Filters
Verify participants have genuine, established accounts.

### 3. Audience Targeting Filters
Focus on your target audience and followers.

### 4. Fairness Filters
Prevent gaming the system and multiple entries.

### 5. Content Filters
Control what types of comments qualify.

---

## Filter Reference

### 🔁 Exclude Multiple Comments

**What it does:** Allows only ONE entry per user, even if they commented multiple times.

**Use when:**
- You want fair "one entry per person" contests
- Preventing spam from users commenting repeatedly

**Example:**
```
❌ Without filter:
User @john_doe comments 10 times → 10 entries

✅ With filter:
User @john_doe comments 10 times → 1 entry (first or random comment selected)
```

**Configuration:**
- Default: Use first comment
- Alternative: Use random comment from user
- Alternative: Use most recent comment

**Cost:** +2 credits

**Pro Tip:** Always enable this filter unless you specifically want multiple entries (e.g., "comment for each product you want to win").

---

### 👥 Minimum Followers

**What it does:** Requires participants to have a minimum number of followers.

**Use when:**
- Filtering out bot accounts (usually have <10 followers)
- Targeting influencers (e.g., minimum 1,000 followers)
- Ensuring engaged, real accounts

**Example:**
```
Setting: Minimum 100 followers

❌ @new_account (23 followers) - Disqualified
❌ @bot_account (0 followers) - Disqualified
✅ @active_user (450 followers) - Qualified
```

**Recommended Values:**
- **Anti-bot protection:** 50+ followers
- **Engaged users:** 100-500 followers
- **Micro-influencers:** 1,000-10,000 followers
- **Influencers:** 10,000+ followers

**Cost:** +3 credits

**Warning:** Setting this too high may drastically reduce participants. Most genuine users have 100-500 followers.

---

### 💙 Must Follow Account

**What it does:** Requires participants to follow your account at the time of the draw.

**Use when:**
- Growing your follower count is a contest goal
- Ensuring winners are invested in your brand
- Rewarding your existing community

**Example:**
```
❌ @user1 commented but doesn't follow you - Disqualified
✅ @user2 commented and follows you - Qualified
```

**Important Notes:**
- We check follower status at draw time, not comment time
- Users who followed after commenting are still qualified
- Users who unfollowed after commenting are disqualified

**Cost:** +5 credits

**Pro Tip:** Combine with "Must Like Post" for maximum engagement.

---

### 🏷️ Must Tag Friends

**What it does:** Requires participants to tag (mention) a minimum number of friends in their comment.

**Use when:**
- Increasing reach virally
- Growing audience through word-of-mouth
- Encouraging social sharing

**Example:**
```
Setting: Must tag 2 friends

❌ "I want to win!" - Disqualified
❌ "Love this! @friend1" - Disqualified (only 1 tag)
✅ "Amazing! @friend1 @friend2" - Qualified
✅ "Wow! @friend1 @friend2 @friend3" - Qualified
```

**Configuration:**
- Minimum tags: 1-10 friends
- Validate tagged accounts exist (recommended)
- Allow self-tags (not recommended)

**Cost:** +4 credits

**Best Practices:**
- Don't require too many tags (2-3 is ideal)
- Mention the requirement clearly in contest rules
- Consider that excessive tagging may annoy users

---

### ❤️ Must Like Post

**What it does:** Requires participants to have liked the contest post.

**Use when:**
- Boosting post engagement
- Ensuring participants are genuinely interested
- Maximizing post visibility (algorithm boost)

**Example:**
```
❌ @user1 commented but didn't like - Disqualified
✅ @user2 commented and liked - Qualified
```

**Important Notes:**
- We check like status at draw time
- Liking after commenting is acceptable
- Unliking before the draw results in disqualification

**Cost:** +3 credits

**Pro Tip:** This is one of the most effective filters for engagement.

---

### 🚫 Exclude Business Accounts

**What it does:** Filters out business, brand, and creator accounts; only allows personal accounts.

**Use when:**
- Targeting real individuals, not brands
- Preventing competitor brands from entering
- Ensuring genuine consumer engagement

**Example:**
```
❌ @acme_official (Business account) - Disqualified
❌ @influencer_pro (Creator account) - Disqualified
✅ @john_doe (Personal account) - Qualified
```

**Limitations:**
- Only available on Instagram and TikTok (Facebook and Twitter don't distinguish account types via API)
- May exclude legitimate users with creator accounts

**Cost:** +2 credits

**When NOT to use:** If running an influencer collaboration or B2B contest.

---

### 📅 Minimum Account Age

**What it does:** Requires participant accounts to be older than a specified number of days.

**Use when:**
- Preventing newly created fake accounts
- Filtering out accounts created just to enter
- Ensuring established, genuine users

**Example:**
```
Setting: Minimum 30 days old

❌ Account created 5 days ago - Disqualified
❌ Account created yesterday - Disqualified
✅ Account created 2 years ago - Qualified
```

**Recommended Values:**
- **Basic protection:** 7 days
- **Standard protection:** 30 days
- **Strong protection:** 90 days
- **Very strong protection:** 365 days

**Cost:** +3 credits

**Warning:** Newer platforms like TikTok may have many legitimate new accounts. Adjust accordingly.

---

### 🔒 Exclude Keywords

**What it does:** Disqualifies comments containing specific words or phrases.

**Use when:**
- Filtering spam (e.g., "check my profile", "link in bio")
- Excluding inappropriate content
- Preventing bot-like generic comments

**Example:**
```
Excluded keywords: ["spam", "bot", "click here", "DM me"]

❌ "Awesome giveaway! DM me for followers" - Disqualified
❌ "I love this! Check my profile for more" - Disqualified
✅ "This is amazing! I really want to win!" - Qualified
```

**Configuration:**
- Add keywords separated by commas
- Case-insensitive matching
- Partial word matching (optional)
- Regex support for advanced users

**Pre-built Keyword Lists:**
- **Spam Protection:** "spam", "bot", "click here", "link in bio", "DM me", "check profile"
- **Inappropriate Content:** Profanity, offensive terms
- **Low-Effort Comments:** "nice", "cool", "ok", "👍" (emoji-only)

**Cost:** +2 credits (base) + 1 credit per 10 keywords

**Pro Tip:** Use the pre-built "Spam Protection" list as a starting point.

---

### 📝 Minimum Comment Length

**What it does:** Requires comments to have a minimum number of characters.

**Use when:**
- Encouraging thoughtful, engaged responses
- Filtering low-effort entries ("Nice!", "Cool")
- Promoting brand storytelling

**Example:**
```
Setting: Minimum 20 characters

❌ "Love it!" (8 characters) - Disqualified
❌ "Nice" (4 characters) - Disqualified
✅ "I absolutely love this product! It would be perfect for my home office." (74 characters) - Qualified
```

**Recommended Values:**
- **Basic filtering:** 10 characters
- **Thoughtful responses:** 20-30 characters
- **Storytelling contests:** 50+ characters

**Cost:** +2 credits

**Warning:** May reduce participation significantly. Use sparingly.

---

### 🌍 Geographic Filters

**What it does:** Limits participants to specific countries or regions.

**Use when:**
- Running location-specific contests (e.g., "US only")
- Complying with local contest laws
- Shipping restrictions apply

**Example:**
```
Setting: Allow only USA, Canada, UK

❌ User from France - Disqualified
❌ User from Australia - Disqualified
✅ User from New York, USA - Qualified
```

**Configuration:**
- Include specific countries (whitelist)
- Exclude specific countries (blacklist)
- Region-based (e.g., Europe, North America)

**Cost:** +5 credits

**Important:** Geographic data is based on user profile location, which can be manually set. Not 100% accurate.

**Legal Note:** Always check local contest laws. Some regions require permits or have specific rules.

---

### 🕒 Timestamp Filters

**What it does:** Only includes comments made within a specific time window.

**Use when:**
- Running time-limited "flash" contests
- Excluding late entries
- Specific "enter between X and Y" rules

**Example:**
```
Setting: Comments between Jan 1, 2025 10:00 AM - Jan 7, 2025 11:59 PM

❌ Comment from Dec 30, 2024 - Disqualified
❌ Comment from Jan 8, 2025 - Disqualified
✅ Comment from Jan 5, 2025 - Qualified
```

**Configuration:**
- Start date/time
- End date/time
- Timezone selection

**Cost:** +1 credit

**Pro Tip:** Always set this to match your contest rules to avoid disputes.

---

## Common Filter Combinations

### 🏆 Standard Contest (Recommended for Most)
**Goal:** Fair, engaged participants; filter out bots

```
✅ Exclude Multiple Comments
✅ Must Follow Account
✅ Must Like Post
✅ Minimum Followers: 50
✅ Exclude Keywords: [Spam Protection List]

Total Cost: ~15 credits
```

**Best for:** Product giveaways, brand awareness campaigns

---

### 🚀 Viral Growth Contest
**Goal:** Maximum reach and follower growth

```
✅ Exclude Multiple Comments
✅ Must Follow Account
✅ Must Tag Friends: 2
✅ Must Like Post
✅ Minimum Followers: 100

Total Cost: ~17 credits
```

**Best for:** Growing audience, new product launches

---

### 🛡️ Anti-Spam/Anti-Bot Contest
**Goal:** Highest quality, genuine participants only

```
✅ Exclude Multiple Comments
✅ Minimum Followers: 100
✅ Minimum Account Age: 30 days
✅ Exclude Business Accounts
✅ Exclude Keywords: [Spam Protection List]
✅ Minimum Comment Length: 20 characters

Total Cost: ~16 credits
```

**Best for:** High-value prizes, brand reputation protection

---

### 💬 Engagement/Storytelling Contest
**Goal:** Thoughtful, engaged responses

```
✅ Exclude Multiple Comments
✅ Must Follow Account
✅ Must Like Post
✅ Minimum Comment Length: 50 characters
✅ Minimum Followers: 100

Total Cost: ~15 credits
```

**Best for:** Brand storytelling, user testimonials, creative contests

---

### 🌍 Geographic-Limited Contest
**Goal:** Region-specific contest with quality participants

```
✅ Exclude Multiple Comments
✅ Must Follow Account
✅ Geographic Filter: [USA, Canada]
✅ Minimum Followers: 50
✅ Exclude Keywords: [Spam Protection List]

Total Cost: ~20 credits
```

**Best for:** Shipping-restricted giveaways, local businesses

---

### 🎯 Influencer Collaboration Contest
**Goal:** Target micro-influencers and engaged creators

```
✅ Exclude Multiple Comments
✅ Must Follow Account
✅ Minimum Followers: 1,000
✅ Must Like Post
❌ Exclude Business Accounts (disabled - we want creators!)

Total Cost: ~13 credits
```

**Best for:** Influencer campaigns, brand partnerships

---

## Best Practices

### 1. **Start with Presets**
Use our recommended filter combinations above, then customize as needed.

### 2. **Test Before Big Contests**
Run a small test draw with filters to see how many participants qualify. Adjust if too restrictive.

### 3. **Be Transparent**
Always mention filter requirements in your contest rules (e.g., "Must follow and tag 2 friends").

### 4. **Don't Over-Filter**
Too many filters = fewer participants = less engagement. Balance quality vs. quantity.

### 5. **Monitor Results**
Check the "Disqualified Participants" section after syncing to see how filters impact your entries.

### 6. **Adjust for Platform**
Different platforms have different user behavior:
- **Instagram**: Higher engagement, use engagement filters
- **Twitter**: More spam, use anti-spam filters
- **TikTok**: Younger audience, lower follower counts acceptable

### 7. **Update Exclusion Keywords**
Review and update your keyword list based on spam patterns you observe.

---

## Filter Cost

Filters add to the base cost of a draw:

| Filter | Cost |
|--------|------|
| Base Draw (no filters) | 5 credits |
| Exclude Multiple Comments | +2 credits |
| Minimum Followers | +3 credits |
| Must Follow Account | +5 credits |
| Must Tag Friends | +4 credits |
| Must Like Post | +3 credits |
| Exclude Business Accounts | +2 credits |
| Minimum Account Age | +3 credits |
| Exclude Keywords | +2 credits |
| Minimum Comment Length | +2 credits |
| Geographic Filters | +5 credits |
| Timestamp Filters | +1 credit |

**Example Calculation:**
```
Base Draw: 5 credits
+ Exclude Multiple Comments: 2 credits
+ Must Follow: 5 credits
+ Must Like Post: 3 credits
+ Minimum Followers: 3 credits
-----
Total: 18 credits
```

---

## Frequently Asked Questions

**Q: Can I edit filters after creating a draw?**
A: Yes, but only before syncing participants. After syncing, filters are locked to ensure fairness.

**Q: What happens to disqualified participants?**
A: They're shown in a separate "Disqualified" list with the reason (e.g., "Does not follow account").

**Q: Can I save filter presets?**
A: Yes! Pro users can save custom filter combinations for reuse.

**Q: Do filters affect draw speed?**
A: Slightly. More filters = more processing time. Expect 30 seconds - 2 minutes for filtered draws.

**Q: Can I manually disqualify/qualify participants?**
A: Not yet. This feature is coming soon for Pro users.

**Q: What if all participants are disqualified?**
A: The draw will fail, and you'll be prompted to adjust filters or add more participants. Credits are refunded.

---

**Next Steps:**
- [Create Your First Filtered Draw](./creating-draws.md)
- [Platform-Specific Filtering Tips](./social-platforms.md)
- [Analytics: Understanding Filter Impact](./analytics.md)
