"use client";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/shop/FilterDropdown";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

function Stars({ value, className = "" }) {
  const filled = Math.round(value);
  return (
    <span
      className={`tracking-tight ${className}`}
      aria-label={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= filled ? "text-amber-500" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({ reviews = [], rating = 0 }) {
  const [sort, setSort] = useState("newest");
  const [starFilter, setStarFilter] = useState(0);

  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const average =
    rating > 0
      ? rating
      : total
        ? reviews.reduce((s, r) => s + r.rating, 0) / total
        : 0;

  const visible = useMemo(() => {
    const list = starFilter
      ? reviews.filter((r) => Math.round(r.rating) === starFilter)
      : [...reviews];
    const time = (r) => (r.createdAt ? new Date(r.createdAt).getTime() : 0);
    if (sort === "highest")
      list.sort((a, b) => b.rating - a.rating || time(b) - time(a));
    else if (sort === "lowest")
      list.sort((a, b) => a.rating - b.rating || time(b) - time(a));
    else if (list.some((r) => r.createdAt))
      list.sort((a, b) => time(b) - time(a));
    return list;
  }, [reviews, sort, starFilter]);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reviews</h2>

      {total === 0 ? (
        <p className="text-sm text-gray-400 mb-6">
          No reviews yet. Be the first to leave one.
        </p>
      ) : (
        <>
          {/* Summary + breakdown */}
          <div className="border border-gray-200 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-center">
            <div className="shrink-0">
              <p className="text-4xl font-medium text-gray-900 leading-none">
                {average.toFixed(1)}
              </p>
              <Stars value={average} className="text-base block mt-2" />
              <p className="text-xs text-gray-400 mt-1">
                {total} review{total !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              {counts.map(({ star, count }) => {
                const pct = total ? (count / total) * 100 : 0;
                const active = starFilter === star;
                return (
                  <button
                    key={star}
                    type="button"
                    disabled={count === 0}
                    onClick={() => setStarFilter(active ? 0 : star)}
                    aria-pressed={active}
                    className={`group flex items-center gap-3 text-xs rounded-lg px-1.5 py-0.5 -mx-1.5 transition-colors duration-150 disabled:cursor-default ${
                      active
                        ? "bg-gray-100"
                        : count > 0
                          ? "hover:bg-gray-50"
                          : ""
                    }`}
                  >
                    <span className="w-6 text-gray-600 tabular-nums text-left">
                      {star}★
                    </span>
                    <span className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-6 text-right text-gray-400 tabular-nums">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort + active filter */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-xs text-gray-400">
              {starFilter ? (
                <>
                  Showing {visible.length} review
                  {visible.length !== 1 ? "s" : ""} with {starFilter}★ ·{" "}
                  <button
                    type="button"
                    onClick={() => setStarFilter(0)}
                    className="text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear
                  </button>
                </>
              ) : (
                `${total} review${total !== 1 ? "s" : ""}`
              )}
            </p>
            <FilterDropdown
              value={sort}
              options={SORTS}
              onChange={setSort}
              placeholder="Sort"
            />
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {visible.map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-2xl p-4"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {review.user?.name}
                  </span>
                  <span className="text-amber-500 text-sm">
                    ★ {review.rating}
                  </span>
                </div>
                {review.createdAt && (
                  <p className="text-xs text-gray-400 mb-1.5">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                )}
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
