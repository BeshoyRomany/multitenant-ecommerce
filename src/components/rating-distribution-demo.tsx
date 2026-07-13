"use client";
import React, { useEffect, useState } from "react";

/* ===========================================================
   1) TYPES
   These interfaces describe the shape of the data as it would
   come out of a database (e.g. MongoDB collections named
   "products" and "reviews", or the equivalent SQL tables).
=========================================================== */

// A single product document, e.g. from a `products` collection/table.
interface Product {
  _id: string; // primary key
  name: string;
}

// A single customer review document, e.g. from a `reviews` collection/table.
// In a real schema this is usually linked to products via `productId`
// (foreign key) and to customers via `customerId` (foreign key).
interface Review {
  _id: string;
  productId: string; // which product this review belongs to
  customerId: string; // which customer wrote it
  customerName: string;
  rating: number; // raw star rating given by the customer, 1-5
  comment: string;
  createdAt: string;
}

/* ===========================================================
   2) DUMMY "DATABASE"
   Stand-ins for real DB collections/tables. In production these
   arrays wouldn't exist in the frontend at all — this data would
   live in MongoDB/Postgres/MySQL etc., and the frontend would only
   ever see it through an API call.
=========================================================== */

const productsCollection: Product[] = [
  { _id: "prod_001", name: "Wireless Headphones" },
];

// Notice all three reviews share the same productId ("prod_001").
// That's expected: productId identifies WHICH PRODUCT is being
// reviewed, while customerId identifies WHO wrote each review.
// Multiple customers can (and usually do) review the same product.
const reviewsCollection: Review[] = [
  {
    _id: "rev_001",
    productId: "prod_001",
    customerId: "cust_101",
    customerName: "Amina K.",
    rating: 4,
    comment: "Great sound quality, battery lasts long.",
    createdAt: "2026-06-01",
  },
  {
    _id: "rev_002",
    productId: "prod_001",
    customerId: "cust_102",
    customerName: "Youssef M.",
    rating: 4,
    comment: "Comfortable fit, good value for money.",
    createdAt: "2026-06-05",
  },
  {
    _id: "rev_003",
    productId: "prod_001",
    customerId: "cust_103",
    customerName: "Sara H.",
    rating: 1,
    comment: "Stopped working after two weeks.",
    createdAt: "2026-06-10",
  },
];

/* ===========================================================
   3) SIMULATED DATABASE CALLS
   These mimic what a real API request would look like from the
   frontend's point of view: you call a function, you wait, you get
   data back. The `setTimeout` simulates network/DB latency.

   To go from "dummy" to "real", replace the *insides* of these two
   functions with actual fetch() calls to your backend, e.g.:
     GET /api/products/:id
     GET /api/products/:id/reviews
   The rest of the component doesn't need to change at all, since it
   only depends on the function signatures (productId in, data out).
=========================================================== */

function findProductById(productId: string): Promise<Product | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productsCollection.find((p) => p._id === productId));
    }, 300);
  });
}

function findReviewsByProductId(productId: string): Promise<Review[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matched = reviewsCollection.filter(
        (r) => r.productId === productId,
      );
      // Demo-only fallback: if the given productId has no reviews yet,
      // show the sample reviews anyway instead of rendering an empty
      // 0%-across-the-board state. Remove this fallback once you're
      // wired to a real database with real product/review data.
      resolve(matched.length > 0 ? matched : reviewsCollection);
    }, 300);
  });
}

/* ===========================================================
   4) DATA TRANSFORMATION HELPERS
   This is the core logic of the widget: turning a flat list of raw
   reviews (each with a single 1-5 rating) into the 5-star breakdown
   the UI actually renders (count + percentage per star level).
=========================================================== */

interface RatingRow {
  stars?: number; // 5, 4, 3, 2, or 1
  count?: number; // how many reviews gave this star rating
  percent?: number; // count as a % of all reviews, rounded
}

// Takes the raw reviews for a product and buckets them by star rating.
function buildDistribution(reviews: Review[]): RatingRow[] {
  const total = reviews.length;
  // total = 3  (rev_001, rev_002, rev_003)

  // Start every bucket at zero.
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  // counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  // Walk through every review once and increment its bucket.
  reviews.forEach((r) => {
    if (typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5) {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    }
  });
  // Trace through the 3 sample reviews:
  // r = rev_001, rating: 4  -> counts[4]++  -> counts = { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 }
  // r = rev_002, rating: 4  -> counts[4]++  -> counts = { 5: 0, 4: 2, 3: 0, 2: 0, 1: 0 }
  // r = rev_003, rating: 1  -> counts[1]++  -> counts = { 5: 0, 4: 2, 3: 0, 2: 0, 1: 1 }
  // final counts = { 5: 0, 4: 2, 3: 0, 2: 0, 1: 1 }

  // Turn the counts into the rows the UI renders, star 5 down to star 1,
  // converting each raw count into a rounded percentage of the total.
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: counts[stars],
    percent: total === 0 ? 0 : Math.round((counts[stars]! / total) * 100),
  }));
  // Building each row (total = 3):
  // stars: 5 -> count: 0 -> percent: Math.round(0 / 3 * 100)  = 0%
  // stars: 4 -> count: 2 -> percent: Math.round(2 / 3 * 100)  = 67%
  // stars: 3 -> count: 0 -> percent: Math.round(0 / 3 * 100)  = 0%
  // stars: 2 -> count: 0 -> percent: Math.round(0 / 3 * 100)  = 0%
  // stars: 1 -> count: 1 -> percent: Math.round(1 / 3 * 100)  = 33%
  //
  // returned array:
  // [
  //   { stars: 5, count: 0, percent: 0 },
  //   { stars: 4, count: 2, percent: 67 },
  //   { stars: 3, count: 0, percent: 0 },
  //   { stars: 2, count: 0, percent: 0 },
  //   { stars: 1, count: 1, percent: 33 },
  // ]
}

// Computes the overall average rating shown next to the ★ icon,
// e.g. average([4, 4, 1]) -> (4 + 4 + 1) / 3 = 3 -> rounded to 1 decimal = 3.0
function average(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/* ===========================================================
   5) COMPONENT
   Fetches product + reviews for the given productId, then renders
   the ratings card: title, average/star count header, and one
   progress bar per star level (5 down to 1).
=========================================================== */

interface RatingDistributionProps {
  productId: string; // which product's ratings to display
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({
  productId,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product + its reviews whenever productId changes.
  useEffect(() => {
    let active = true; // guards against setting state after unmount
    setLoading(true);

    Promise.all([
      findProductById(productId),
      findReviewsByProductId(productId),
    ]).then(([productData, reviewData]) => {
      if (!active) return;
      setProduct(productData ?? null);
      setReviews(reviewData);
      setLoading(false);
    });

    return () => {
      active = false; // cleanup if the component unmounts mid-fetch
    };
  }, [productId]);

  // Simple loading state while the "DB calls" resolve.
  if (loading) {
    return (
      <div style={styles.card}>
        <span style={{ fontSize: 14, color: "#6b7280" }}>Loading ratings…</span>
      </div>
    );
  }

  // Derive the display data from the raw reviews we fetched.
  const distribution = buildDistribution(reviews);
  const avg = average(reviews);
  const total = reviews.length;

  return (
    <div style={styles.card}>
      {/* Header: title on the left, average + total count on the right */}
      <div style={styles.header}>
        <h2 style={styles.title}>Ratings</h2>
        <div style={styles.summary}>
          <span>★</span>
          <span>({avg})</span>
          <span>
            {total} {total === 1 ? "rating" : "ratings"}
          </span>
        </div>
      </div>

      {/* One row per star level, 5 down to 1 */}
      <div style={styles.rows}>
        {distribution.map((row) => (
          <div key={row.stars} style={styles.row}>
            <span style={styles.label}>
              {row.stars} {row.stars === 1 ? "star" : "stars"}
            </span>

            {/* Progress bar track + filled portion sized by percent */}
            <div style={styles.track}>
              <div
                style={{
                  ...styles.fill,
                  width: `${row.percent}%`,
                }}
              />
            </div>

            <span style={styles.percent}>{row.percent}%</span>
          </div>
        ))}
      </div>

      {product && (
        <p style={styles.footnote}>Showing ratings for {product.name}</p>
      )}
    </div>
  );
};

/* ===========================================================
   6) STYLES
   Plain inline styles (React.CSSProperties objects) instead of
   Tailwind classes, so the bars render correctly even in projects
   that don't have Tailwind configured.
=========================================================== */

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: 420,
    margin: "0 auto",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    backgroundColor: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    color: "#1f2937",
  },
  rows: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  label: {
    width: 56,
    fontSize: 14,
    color: "#374151",
    whiteSpace: "nowrap",
  },
  track: {
    // The empty "pill" background of the progress bar.
    flex: 1,
    height: 24,
    borderRadius: 9999,
    border: "1px solid #d1d5db",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  fill: {
    // The colored portion inside the track; its width is set inline
    // per-row based on that row's percent (see JSX above).
    height: "100%",
    backgroundColor: "#ec4899",
    borderRadius: 9999,
    transition: "width 0.5s ease",
  },
  percent: {
    width: 40,
    textAlign: "right",
    fontSize: 14,
    color: "#374151",
  },
  footnote: {
    marginTop: 16,
    fontSize: 12,
    color: "#9ca3af",
  },
};

export default RatingDistribution;

/* ===========================================================
   USAGE
   <RatingDistribution productId="prod_001" />
=========================================================== */
