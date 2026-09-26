import React from "react";
import { Search, FolderOpen, BookOpen } from "lucide-react";

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No results found",
  description = "Try adjusting your filters, search term, or check back later.",
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-icon-wrap">
        <Icon size={30} />
      </div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-outline-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
