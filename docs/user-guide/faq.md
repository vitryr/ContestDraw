# Frequently Asked Questions (FAQ)

Quick answers to common questions about Cleack.

## Table of Contents
- [General Questions](#general-questions)
- [Account & Billing](#account--billing)
- [Creating & Running Draws](#creating--running-draws)
- [Social Media Integration](#social-media-integration)
- [Filters & Participants](#filters--participants)
- [Results & Winners](#results--winners)
- [Technical Issues](#technical-issues)
- [Legal & Compliance](#legal--compliance)

---

## General Questions

### What is Cleack?

Cleack is a SaaS platform that automates social media contest draws. We fetch participants from your social media posts, apply filters to ensure fairness, and randomly select winners using cryptographically secure methods.

### Which social media platforms do you support?

- ✅ Instagram
- ✅ Facebook (Pages)
- ✅ Twitter (X)
- ✅ TikTok
- ✅ YouTube

More platforms coming soon (LinkedIn, Pinterest).

### Is Cleack free?

We offer a **free tier** with:
- 10 welcome credits
- 5 credits per month
- All basic features

Paid plans start at €29.99/month for higher usage and advanced features.

### Do I need technical knowledge to use Cleack?

No! Cleack is designed for non-technical users. If you can create a social media post, you can use Cleack.

### Is Cleack legal to use?

Yes! Cleack complies with all social media platform policies and GDPR regulations. However, you're responsible for ensuring your contest follows local laws and platform-specific contest rules.

---

## Account & Billing

### How do I create an account?

1. Visit [https://cleack.io/register](https://cleack.io/register)
2. Enter your email, password, and name
3. Verify your email
4. Start using Cleack!

### What are credits and how do they work?

Credits are Cleack's currency. Each draw costs credits depending on complexity (5-25 credits typically). You can purchase credits or subscribe for monthly credit allocations.

See our [Pricing Guide](./pricing.md) for details.

### Do credits expire?

- **Purchased credits:** Never expire
- **Monthly subscription credits:** Rollover for up to 12 months (Pro/Business tiers)
- **Free tier credits:** Use within the month

### How do I purchase credits?

1. Go to **Settings → Billing**
2. Select a credit package
3. Pay via Stripe, PayPal, or SEPA
4. Credits added instantly

### Can I cancel my subscription?

Yes, anytime! Go to **Settings → Billing → Cancel Subscription**. Your Pro/Business features remain active until the end of your billing period.

### What payment methods do you accept?

- Credit/Debit cards (Visa, Mastercard, Amex)
- PayPal
- SEPA Direct Debit (EU)
- Apple Pay / Google Pay
- Bank transfer (Enterprise only)

### Can I get an invoice?

Yes! Invoices are automatically sent to your email after each payment. You can also download them from **Settings → Billing → Invoices**.

### Do you offer discounts?

- **Annual plans:** Save 17%
- **Non-profits/Education:** 50% discount
- **Bulk purchases:** Up to 50% off credit packages
- **Agencies:** Custom pricing available

---

## Creating & Running Draws

### How do I create a draw?

1. Click **"New Draw"** from dashboard
2. Fill in details (title, platform, post URL, etc.)
3. Configure filters (optional)
4. Click **"Create Draw"**
5. Sync participants
6. Execute draw

See [Creating Draws Guide](./creating-draws.md) for step-by-step instructions.

### What's the difference between "draft," "active," and "completed" draws?

- **Draft:** Draw created but not synced yet. Can be edited/deleted freely.
- **Active:** Participants synced and ready to draw. Can still cancel.
- **Processing:** Draw is currently being executed.
- **Completed:** Winners selected. Cannot be edited.
- **Cancelled:** Draw cancelled before execution. Credits refunded.

### Can I schedule a draw for later?

Yes! When creating a draw, set a **Scheduled Date** and Cleack will automatically execute at that time.

### How long does it take to sync participants?

Typically **30 seconds to 2 minutes**, depending on:
- Number of comments
- Filters applied
- Platform API speed

For very large draws (>10,000 participants), it may take up to 5 minutes.

### Can I edit a draw after creating it?

- **Draft draws:** Full editing
- **Active draws:** Limited editing (can't change post URL or platform)
- **Completed draws:** Cannot be edited

### Can I run the same contest on multiple platforms?

Yes! Create separate draws for each platform. We recommend running them simultaneously and announcing winners at the same time.

### What if my contest post has multiple giveaway items?

**Option 1:** Set "Number of Winners" to the number of items (e.g., 3 winners for 3 prizes)

**Option 2:** Create separate draws for each item (if different requirements)

### How many winners can I select?

- **Free tier:** 1-10 winners
- **Pro tier:** 1-50 winners
- **Business tier:** 1-100 winners
- **Enterprise:** Unlimited

---

## Social Media Integration

### How do I connect my Instagram account?

1. Go to **Settings → Social Connections**
2. Click **"Connect Instagram"**
3. Log in and authorize permissions
4. Done!

See [Social Platforms Guide](./social-platforms.md) for detailed instructions.

### Why do you need access to my social media account?

We need permissions to:
- Read comments on your posts
- Verify if users follow you
- Check if users liked your post
- Fetch participant information

**We NEVER:**
- Post on your behalf
- Delete comments
- Access private messages
- Modify your account

### Do I need a business account?

**Instagram:** Business or Creator account recommended (for follower verification)
**Facebook:** Must use a Page (not personal profile)
**Twitter, YouTube:** Regular accounts work fine
**TikTok:** Creator account required (1,000+ followers)

### Can I connect multiple accounts?

Not yet. Currently, you can connect one account per platform per Cleack account. Enterprise users can contact us for multi-account support.

### What happens if my social media token expires?

We'll send you an email notification. Simply reconnect the platform in **Settings → Social Connections**. Your past draws remain intact.

### Can I disconnect a social media account?

Yes! Go to **Settings → Social Connections** and click "Disconnect" next to the platform. This won't affect past draws, but you won't be able to create new draws on that platform until reconnected.

---

## Filters & Participants

### What are filters and why should I use them?

Filters ensure only qualified, genuine participants are included in your draw. They help you:
- Prevent bots and fake accounts
- Ensure fair "one entry per person" rules
- Target your desired audience (e.g., followers only)
- Filter spam comments

See [Filters Guide](./filters-guide.md) for details.

### How do I know which filters to use?

Start with our **recommended filter presets**:

**Standard Contest (most common):**
- Exclude Multiple Comments
- Must Follow Account
- Must Like Post
- Minimum Followers: 50

See [Common Filter Combinations](./filters-guide.md#common-filter-combinations).

### Do filters cost extra?

Yes, filters add to the base draw cost. For example:
- Base draw: 5 credits
- With filters: 10-20 credits

See [Pricing Guide](./pricing.md) for filter costs.

### Can I edit filters after syncing participants?

No. Once participants are synced, filters are locked to ensure fairness. You can cancel the draw and create a new one with different filters (credits refunded).

### What if all my participants are disqualified by filters?

The draw will fail with an error message. You can then:
1. Adjust filters (cancel and create new draw)
2. Check if your filters are too strict
3. Contact support if you believe there's an issue

### How do I see who was disqualified?

After syncing, go to **Draw Details → Participants** and toggle "Show Disqualified." Each disqualified user shows the reason (e.g., "Does not follow account").

### Can I manually disqualify or qualify participants?

Not yet. This feature is coming soon for Pro users.

---

## Results & Winners

### How are winners selected?

Winners are selected using **cryptographically secure random number generation (CSRNG)**. The process is:
1. Assign each qualified participant a unique number
2. Generate random numbers using CSRNG
3. Map random numbers to participants
4. Display winners

Each draw includes a **random seed** for transparency and verification.

### Are the draws really random?

Yes! We use industry-standard cryptographic methods. The random seed is provided in your certificate so anyone can verify the fairness of the draw.

### Can I re-run a draw if I don't like the winners?

Technically yes, but **this violates contest ethics and fairness principles**. Once winners are announced publicly, you should honor the results. Re-running a draw without valid reason can damage your reputation and may violate consumer protection laws.

**Valid reasons to re-draw:**
- Technical error during execution
- All winners are disqualified (e.g., don't respond)
- You need to select additional winners

Re-draws cost 50% of the original draw cost.

### How do I contact winners?

Cleack provides winner information:
- Username
- Profile URL
- Comment text

You'll need to contact them via:
- Direct message on the platform
- Mention them in a comment
- Tag them in a winner announcement post

We don't provide email addresses (privacy protection).

### Can Cleack notify winners automatically?

Not yet. Automatic DM notifications are planned for future releases. Currently, you must manually contact winners.

### What if a winner doesn't respond?

Set a response deadline (e.g., 48 hours) in your contest rules. If a winner doesn't respond, you can:
1. Run a "redraw" to select a replacement winner
2. Move to the next runner-up (if applicable)

**Pro Tip:** Include response deadline in your contest rules upfront.

### Can I download the winner list?

Yes! From the draw results page, click **"Export Results"**. You'll get:
- CSV file with all winners
- PDF certificate of draw fairness
- Full participant list (Pro/Business)

### How do I prove the draw was fair?

Each completed draw includes a **Certificate of Fairness** with:
- Draw ID
- Random seed used
- Timestamp
- Total participants & winners
- Filter settings
- Cleack signature

You can share this certificate publicly or provide it to winners upon request.

---

## Technical Issues

### "Cannot fetch comments" error

**Possible causes:**
- Post is private or deleted
- You're not the post owner
- Social media connection expired

**Solutions:**
1. Verify post URL is correct
2. Ensure post is public
3. Reconnect social media account
4. Contact support if issue persists

### "Insufficient credits" error

You don't have enough credits for the draw. Purchase more credits from **Settings → Billing**.

### "Post not found" error

**Possible causes:**
- Incorrect post URL
- Post was deleted
- Post is from a private account

**Solution:** Double-check the post URL and ensure it's publicly accessible.

### Participants aren't syncing

**Possible causes:**
- Platform API delays
- Too many requests (rate limiting)
- Temporary platform outage

**Solutions:**
1. Wait a few minutes and try again
2. Check platform status pages (e.g., Instagram Status)
3. Contact support if issue persists after 1 hour

### Draw is stuck in "Processing" status

This shouldn't happen, but if it does:
1. Refresh the page
2. Wait 5 minutes
3. Contact support with Draw ID

We'll investigate and re-run the draw if necessary (free of charge).

### Website is slow or not loading

1. Check [status.cleack.io](https://status.cleack.io) for outages
2. Try clearing browser cache
3. Try a different browser
4. Contact support if issue persists

---

## Legal & Compliance

### Is Cleack GDPR compliant?

Yes! We comply with GDPR regulations:
- Data minimization (only collect necessary data)
- User consent (OAuth permissions)
- Right to deletion (delete account & data)
- Data encryption
- Privacy by design

See our [Privacy Policy](../legal/privacy-policy.md).

### Do I need to include terms & conditions in my contest?

**Yes!** You're legally required to have clear contest rules, including:
- Eligibility requirements
- Entry method
- Draw date
- Prize details
- Winner notification process
- Disclaimer that it's not sponsored by the social platform

We provide a [sample contest terms template](../legal/contest-terms-template.md).

### What data do you collect from participants?

We collect only publicly available information:
- Username
- Display name
- Profile URL
- Avatar
- Follower count (if public)
- Comment text
- Comment timestamp

We **never** collect private messages, email addresses, or other personal data.

### How long do you store participant data?

- **Active draws:** Data stored until draw completion + 30 days
- **Completed draws:** Data stored for 1 year (for audit purposes)
- **Deleted accounts:** All data permanently deleted within 30 days

Pro/Business users can request immediate data deletion.

### Can participants request data deletion?

Yes. Participants can contact support@cleack.io to request deletion. We'll remove their data within 30 days as required by GDPR.

### Do you sell user data?

**Absolutely not.** We never sell, rent, or share user data with third parties (except as required by law).

### What if my contest violates platform rules?

It's your responsibility to ensure compliance with each platform's rules:
- [Instagram Promotion Guidelines](https://www.facebook.com/page_guidelines.php#promotionsguidelines)
- [Facebook Page Guidelines](https://www.facebook.com/policies/pages_groups_events/)
- [Twitter Rules](https://help.twitter.com/en/rules-and-policies/twitter-rules)
- [TikTok Community Guidelines](https://www.tiktok.com/community-guidelines)
- [YouTube Policies](https://support.google.com/youtube/answer/1620498)

Cleack is a tool; how you use it is your responsibility.

---

## Still Have Questions?

### Contact Support

- 📧 **Email:** support@cleack.io
- 💬 **Live Chat:** Available in app (Pro/Business users)
- 📞 **Phone:** +33 1 23 45 67 89 (Business/Enterprise only)
- 🐛 **Bug Reports:** support@cleack.io

**Response Times:**
- Free tier: 48 hours
- Pro tier: 24 hours
- Business tier: 4 hours
- Enterprise tier: 1 hour (SLA)

### Documentation

- [Getting Started Guide](./getting-started.md)
- [Social Platforms Guide](./social-platforms.md)
- [Filters Guide](./filters-guide.md)
- [Pricing Guide](./pricing.md)
- [API Documentation](../technical/api-integration.md)

### Feature Requests

We love hearing your ideas! Submit feature requests via:
- In-app feedback form
- Email: support@cleack.io
- Community forum: [community.cleack.io](https://community.cleack.io)

---

**Last Updated:** January 2025
