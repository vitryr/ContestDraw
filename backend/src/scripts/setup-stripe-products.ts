import dotenv from "dotenv";
import path from "path";
import Stripe from "stripe";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Setup Stripe products and prices for ContestDraw
 * This script creates all necessary products and their price points
 * Usage: npx ts-node src/scripts/setup-stripe-products.ts
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

interface ProductConfig {
  name: string;
  description: string;
  prices: Array<{
    nickname: string;
    amount: number; // in cents
    currency: string;
    interval?: "month" | "year" | "day";
    intervalCount?: number;
  }>;
}

const products: ProductConfig[] = [
  {
    name: "48H Pass",
    description:
      "Access to Contest Draw platform for 48 hours - Perfect for running quick contests and giveaways",
    prices: [
      {
        nickname: "48h-pass",
        amount: 999, // $9.99
        currency: "eur",
        interval: "day",
        intervalCount: 2,
      },
    ],
  },
  {
    name: "Monthly Pro Subscription",
    description:
      "Full access to Contest Draw with unlimited draws, advanced features, and priority support",
    prices: [
      {
        nickname: "monthly-pro",
        amount: 2999, // $29.99
        currency: "eur",
        interval: "month",
      },
    ],
  },
  {
    name: "Annual Pro Subscription",
    description:
      "Full year access to Contest Draw with 2 months free - Best value for power users",
    prices: [
      {
        nickname: "annual-pro",
        amount: 29999, // $299.99 (2 months free)
        currency: "eur",
        interval: "year",
      },
    ],
  },
  {
    name: "Enterprise Plan",
    description:
      "Custom solution for large organizations with dedicated support, white-label options, and API access",
    prices: [
      {
        nickname: "enterprise-monthly",
        amount: 99999, // $999.99
        currency: "eur",
        interval: "month",
      },
    ],
  },
];

async function setupStripeProducts() {
  console.log("\n🚀 Setting up Stripe products for ContestDraw...\n");
  console.log(
    `🔑 Using Stripe account: ${process.env.STRIPE_SECRET_KEY?.substring(0, 20)}...\n`,
  );

  const createdProducts: Record<
    string,
    { productId: string; priceIds: string[] }
  > = {};

  for (const productConfig of products) {
    try {
      console.log(`📦 Creating product: ${productConfig.name}`);

      // Create product
      const product = await stripe.products.create({
        name: productConfig.name,
        description: productConfig.description,
        metadata: {
          app: "contestdraw",
          created_by: "setup-script",
        },
      });

      console.log(`✅ Product created: ${product.id}`);

      const priceIds: string[] = [];

      // Create prices for this product
      for (const priceConfig of productConfig.prices) {
        console.log(`  💰 Creating price: ${priceConfig.nickname}`);

        const priceData: Stripe.PriceCreateParams = {
          product: product.id,
          unit_amount: priceConfig.amount,
          currency: priceConfig.currency,
          nickname: priceConfig.nickname,
          metadata: {
            app: "contestdraw",
          },
        };

        // Add recurring configuration if interval is specified
        if (priceConfig.interval) {
          priceData.recurring = {
            interval: priceConfig.interval,
            interval_count: priceConfig.intervalCount || 1,
          };
        }

        const price = await stripe.prices.create(priceData);

        console.log(
          `  ✅ Price created: ${price.id} (${priceConfig.nickname})`,
        );
        priceIds.push(price.id);
      }

      createdProducts[productConfig.name] = {
        productId: product.id,
        priceIds,
      };

      console.log("");
    } catch (error: any) {
      console.error(
        `❌ Failed to create product ${productConfig.name}:`,
        error.message,
      );
    }
  }

  // Print summary and environment variables
  console.log("\n✨ Product setup complete!\n");
  console.log("📋 Summary of created products:\n");

  Object.entries(createdProducts).forEach(([name, data]) => {
    console.log(`${name}:`);
    console.log(`  Product ID: ${data.productId}`);
    data.priceIds.forEach((priceId, index) => {
      console.log(`  Price ${index + 1}: ${priceId}`);
    });
    console.log("");
  });

  console.log("\n📝 Add these to your .env file:\n");
  console.log("# Stripe Product and Price IDs");
  if (createdProducts["48H Pass"]) {
    console.log(`STRIPE_PRODUCT_48H=${createdProducts["48H Pass"].productId}`);
    console.log(
      `STRIPE_PRICE_PASS_48H=${createdProducts["48H Pass"].priceIds[0]}`,
    );
  }
  if (createdProducts["Monthly Pro Subscription"]) {
    console.log(
      `STRIPE_PRODUCT_MONTHLY=${createdProducts["Monthly Pro Subscription"].productId}`,
    );
    console.log(
      `STRIPE_PRICE_MONTHLY=${createdProducts["Monthly Pro Subscription"].priceIds[0]}`,
    );
  }
  if (createdProducts["Annual Pro Subscription"]) {
    console.log(
      `STRIPE_PRODUCT_ANNUAL=${createdProducts["Annual Pro Subscription"].productId}`,
    );
    console.log(
      `STRIPE_PRICE_ANNUAL=${createdProducts["Annual Pro Subscription"].priceIds[0]}`,
    );
  }
  if (createdProducts["Enterprise Plan"]) {
    console.log(
      `STRIPE_PRODUCT_ENTERPRISE=${createdProducts["Enterprise Plan"].productId}`,
    );
    console.log(
      `STRIPE_PRICE_ENTERPRISE=${createdProducts["Enterprise Plan"].priceIds[0]}`,
    );
  }
  console.log("");
}

// Run the setup
setupStripeProducts()
  .then(() => {
    console.log("✅ Setup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
