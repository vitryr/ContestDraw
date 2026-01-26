# 🗄️ Schéma Base de Données

## Vue d'Ensemble

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│    Draw     │────▶│ Participant │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│Subscription │     │   Winner    │     │StoryMention │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Credit    │     │SocialAccount│     │  Blacklist  │
│Transaction  │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 📋 Tables Principales

### User
```sql
model User {
  id                String               @id @default(uuid())
  email             String               @unique
  password          String
  firstName         String?
  lastName          String?
  emailVerified     Boolean              @default(false)
  role              String               @default("user")
  language          String               @default("en")
  timezone          String               @default("UTC")
  credits           Int                  @default(3)
  trial_used        Boolean              @default(false)
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  
  -- Relations
  draws             Draw[]
  socialAccounts    SocialAccount[]
  subscription      Subscription?
  creditTransactions CreditTransaction[]
  blacklists        Blacklist[]
}
```

### Draw
```sql
model Draw {
  id              String        @id @default(uuid())
  userId          String
  title           String
  description     String?
  numberOfWinners Int
  allowDuplicates Boolean       @default(false)
  status          DrawStatus    @default(DRAFT)
  algorithm       String?
  seed            String?
  certificateHash String?
  completedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  -- Relations
  user            User          @relation(...)
  participants    Participant[]
  winners         Winner[]
}

enum DrawStatus {
  DRAFT
  READY
  PROCESSING
  COMPLETED
  FAILED
}
```

### Participant
```sql
model Participant {
  id         String   @id @default(uuid())
  drawId     String
  name       String
  identifier String   -- username or unique ID
  source     String   @default("MANUAL")
  metadata   Json?    -- platform-specific data
  createdAt  DateTime @default(now())
  
  -- Relations
  draw       Draw     @relation(...)
  Winner     Winner[]
}
```

### Winner
```sql
model Winner {
  id            String      @id @default(uuid())
  drawId        String
  participantId String
  position      Int         -- 1st, 2nd, 3rd...
  createdAt     DateTime    @default(now())
  
  -- Relations
  draw          Draw        @relation(...)
  participant   Participant @relation(...)
}
```

### Subscription
```sql
model Subscription {
  id                   String             @id @default(uuid())
  userId               String             @unique
  planId               String
  planType             String             @default("monthly")
  status               SubscriptionStatus @default(ACTIVE)
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  monthlyCredits       Int
  cancelAtPeriodEnd    Boolean            @default(false)
  is48HPass            Boolean            @default(false)
  stripeSubscriptionId String?            @unique
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  
  -- Relations
  user                 User               @relation(...)
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  EXPIRED
}
```

### CreditTransaction
```sql
model CreditTransaction {
  id          String                @id @default(uuid())
  userId      String
  type        CreditTransactionType
  credits     Int
  amount      Decimal?              @db.Decimal(10, 2)
  currency    String?               @default("USD")
  description String?
  metadata    Json?
  createdAt   DateTime              @default(now())
  
  -- Relations
  user        User                  @relation(...)
}

enum CreditTransactionType {
  PURCHASE
  SUBSCRIPTION
  BONUS
  REFUND
  DRAW_USAGE
}
```

### SocialAccount
```sql
model SocialAccount {
  id                  String    @id @default(uuid())
  userId              String
  platform            String    -- instagram, facebook, twitter, tiktok, youtube
  platformUserId      String
  platformUsername    String
  accessToken         String
  refreshToken        String?
  tokenExpiresAt      DateTime?
  connectedAt         DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  -- Relations
  user                User      @relation(...)
}
```

### Blacklist
```sql
model Blacklist {
  id         String   @id @default(uuid())
  userId     String
  platform   String
  username   String
  reason     String?
  createdAt  DateTime @default(now())
  
  -- Relations
  user       User     @relation(...)
}
```

---

## 🔍 Index

```sql
-- Performance indexes
@@index([email])                    -- User lookup
@@index([userId, status])           -- Draw listing
@@index([drawId])                   -- Participant queries
@@index([userId, createdAt])        -- Transaction history
@@index([userId, platform])         -- Social account lookup
```

---

## 🔄 Migrations

Les migrations sont gérées via Prisma:

```bash
# Créer une migration
npx prisma migrate dev --name <nom_migration>

# Appliquer en production
npx prisma migrate deploy

# Reset DB (dev only)
npx prisma migrate reset
```

---

## 📊 Statistiques Estimées

| Table | Rows/User | Total (10k users) |
|-------|-----------|-------------------|
| User | 1 | 10,000 |
| Draw | ~20 | 200,000 |
| Participant | ~500/draw | 100M |
| Winner | ~3/draw | 600,000 |
| CreditTransaction | ~50 | 500,000 |
