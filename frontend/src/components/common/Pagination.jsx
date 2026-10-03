import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

/** 1 … 4 5 6 … 12  (always 7 slots so the bar never jumps in width) */
export const getPageItems = (total, current, siblings = 1) => {
  const slots = siblings * 2 + 5;
  if (total <= slots) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftGap = left > 2;
  const showRightGap = right < total - 1;

  if (!showLeftGap && showRightGap) return [...range(1, 3 + 2 * siblings), "gap-r", total];
  if (showLeftGap && !showRightGap) return [1, "gap-l", ...range(total - (2 + 2 * siblings), total)];
  return [1, "gap-l", ...range(left, right), "gap-r", total];
};

export const Pagination = ({ totalItems, page, pageSize, onPageChange, itemLabel = "courses" }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const items = getPageItems(totalPages, page);
  const go = (p) => p >= 1 && p <= totalPages && p !== page && onPageChange(p);

  return (
    <nav className="pg" aria-label="Pagination">
      <div className="pg-bar">
        <button
          type="button"
          className="pg-btn pg-nav"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
          <span>Prev</span>
        </button>

        {items.map((item) =>
          typeof item === "string" ? (
            <span key={item} className="pg-gap" aria-hidden="true">
              •••
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pg-btn${item === page ? " is-active" : ""}`}
              onClick={() => go(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
            >
              {item === page && (
                <motion.i
                  layoutId="pg-active-pill"
                  className="pg-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span>{item}</span>
            </button>
          )
        )}

        <button
          type="button"
          className="pg-btn pg-nav is-next"
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="pg-info">
        <div>
          Showing <strong>{from}–{to}</strong> of <strong>{totalItems}</strong> {itemLabel}
        </div>
        <div className="pg-track" aria-hidden="true">
          <i style={{ width: `${(page / totalPages) * 100}%` }} />
        </div>
      </div>
    </nav>
  );
};

export default Pagination;