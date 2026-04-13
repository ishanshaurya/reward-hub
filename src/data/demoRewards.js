// src/data/demoRewards.js
// RewardHub — Realistic demo data for "Try Demo" mode
// Field names match the Supabase rewards schema exactly

const now = new Date();
const daysAgo = (n) => new Date(now - n * 86400000).toISOString();
const daysFromNow = (n) => new Date(now.getTime() + n * 86400000).toISOString().split("T")[0];

export const DEMO_REWARDS = [
  {
    id: "demo-001",
    app_name: "Paytm",
    reward_type: "cashback",
    amount: 150,
    email_date: daysAgo(1),
    expiry_date: daysFromNow(20),
    subject_line: "Congratulations! ₹150 cashback credited to your Paytm wallet",
    snippet: "Your cashback of ₹150 has been credited to your Paytm wallet.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-002",
    app_name: "Paytm",
    reward_type: "cashback",
    amount: 75,
    email_date: daysAgo(3),
    expiry_date: daysFromNow(15),
    subject_line: "You earned ₹75 cashback on your last transaction",
    snippet: "₹75 cashback from your scratch card has been credited.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-003",
    app_name: "Paytm",
    reward_type: "coupon",
    amount: 50,
    coupon_code: "PAYTM50",
    email_date: daysAgo(5),
    expiry_date: daysFromNow(3),
    subject_line: "Exclusive Coupon: PAYTM50 — Get ₹50 off on your next purchase",
    snippet: "Use code PAYTM50 for ₹50 off on recharges above ₹199.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-004",
    app_name: "PhonePe",
    reward_type: "cashback",
    amount: 200,
    email_date: daysAgo(2),
    expiry_date: daysFromNow(25),
    subject_line: "PhonePe Rewards: ₹200 cashback awarded!",
    snippet: "You received ₹200 cashback on your recent UPI transaction.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-005",
    app_name: "PhonePe",
    reward_type: "points",
    amount: 500,
    email_date: daysAgo(6),
    expiry_date: daysFromNow(60),
    subject_line: "You earned 500 SuperCoins! Redeem them now.",
    snippet: "500 reward points credited. Redeem for exciting offers.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-006",
    app_name: "Google Pay",
    reward_type: "cashback",
    amount: 100,
    email_date: daysAgo(4),
    expiry_date: daysFromNow(5),
    subject_line: "Google Pay: ₹100 cashback has been added to your account",
    snippet: "Scratch card reward! ₹100 cashback added to Google Pay balance.",
    is_expired: false,
    is_claimed: true,
  },
  {
    id: "demo-007",
    app_name: "Google Pay",
    reward_type: "refund",
    amount: 45,
    email_date: daysAgo(7),
    expiry_date: null,
    subject_line: "Refund of ₹45 processed successfully",
    snippet: "Your refund of ₹45 has been processed to your Google Pay balance.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-008",
    app_name: "Amazon Pay",
    reward_type: "cashback",
    amount: 250,
    email_date: daysAgo(3),
    expiry_date: daysFromNow(30),
    subject_line: "Amazon Pay: ₹250 cashback credited to your account",
    snippet: "₹250 cashback from your recent Amazon order has been credited.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-009",
    app_name: "Amazon Pay",
    reward_type: "coupon",
    amount: 100,
    coupon_code: "AMAZON100",
    email_date: daysAgo(8),
    expiry_date: daysFromNow(2),
    subject_line: "Exclusive: Use code AMAZON100 for ₹100 off",
    snippet: "Valid on orders above ₹499. Expires soon!",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-010",
    app_name: "Swiggy",
    reward_type: "coupon",
    amount: 75,
    coupon_code: "SWIGGY75",
    email_date: daysAgo(2),
    expiry_date: daysFromNow(1),
    subject_line: "Swiggy Exclusive: SWIGGY75 — ₹75 off on your order",
    snippet: "Flat ₹75 off on orders above ₹199. Use now!",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-011",
    app_name: "Zomato",
    reward_type: "cashback",
    amount: 120,
    email_date: daysAgo(1),
    expiry_date: daysFromNow(18),
    subject_line: "Zomato: ₹120 cashback on your last order",
    snippet: "₹120 Zomato Credits added from your recent order.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-012",
    app_name: "Zomato",
    reward_type: "coupon",
    amount: 50,
    coupon_code: "ZOMATO50",
    email_date: daysAgo(5),
    expiry_date: daysFromNow(4),
    subject_line: "Zomato Deal: ZOMATO50 — ₹50 discount",
    snippet: "Use ZOMATO50 for ₹50 off on your next order above ₹249.",
    is_expired: false,
    is_claimed: false,
  },
  {
    id: "demo-013",
    app_name: "Paytm",
    reward_type: "coupon",
    amount: 75,
    coupon_code: "EXPIRED",
    email_date: daysAgo(20),
    expiry_date: daysFromNow(-3),
    subject_line: "Expired Coupon: EXPIRED — Was ₹75 off",
    snippet: "This coupon has expired.",
    is_expired: true,
    is_claimed: false,
  },
  {
    id: "demo-014",
    app_name: "Amazon Pay",
    reward_type: "refund",
    amount: 299,
    email_date: daysAgo(9),
    expiry_date: null,
    subject_line: "Refund of ₹299 initiated",
    snippet: "Your refund of ₹299 has been processed to Amazon Pay balance.",
    is_expired: false,
    is_claimed: true,
  },
  {
    id: "demo-015",
    app_name: "PhonePe",
    reward_type: "refund",
    amount: 149,
    email_date: daysAgo(4),
    expiry_date: null,
    subject_line: "Refund of ₹149 processed",
    snippet: "Your refund of ₹149 has been processed to your PhonePe wallet.",
    is_expired: false,
    is_claimed: true,
  },
];

/**
 * Build stats from demo data — matches the shape produced by useRewards hook.
 */
export function buildDemoStats(rewards) {
  const r = rewards || DEMO_REWARDS;

  const totalEarned = r
    .filter(x => ['cashback', 'refund'].includes(x.reward_type) && x.amount)
    .reduce((sum, x) => sum + parseFloat(x.amount), 0);

  const pendingClaimed = r
    .filter(x => !x.is_claimed && !x.is_expired && x.amount)
    .reduce((sum, x) => sum + parseFloat(x.amount), 0);

  const expiringSoon = r.filter(x => {
    if (!x.expiry_date || x.is_expired) return false;
    const expiry = new Date(x.expiry_date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 7);
    return expiry <= cutoff && expiry >= new Date();
  });

  const byApp = r.reduce((acc, x) => {
    if (!x.amount) return acc;
    acc[x.app_name] = (acc[x.app_name] || 0) + parseFloat(x.amount);
    return acc;
  }, {});

  const byType = r.reduce((acc, x) => {
    acc[x.reward_type] = (acc[x.reward_type] || 0) + 1;
    return acc;
  }, {});

  return { totalEarned, pendingClaimed, expiringSoon, byApp, byType, totalRewards: r.length };
}

/**
 * Simulate loading demo data with a short delay.
 */
export function loadDemoData(delayMs = 800) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...DEMO_REWARDS].sort((a, b) => new Date(b.email_date) - new Date(a.email_date));
      resolve({
        rewards: sorted,
        allRewards: sorted,
        stats: buildDemoStats(sorted),
        filterOptions: {
          apps: [...new Set(sorted.map(r => r.app_name))].sort(),
          types: [...new Set(sorted.map(r => r.reward_type))].sort(),
        },
      });
    }, delayMs);
  });
}
