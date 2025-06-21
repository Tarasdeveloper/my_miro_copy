import React from "react";

export function BoardsListLayout({
  header,
  filters,
  list,
}: {
  header: React.ReactNode;
  filters: React.ReactNode;
  list: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      {header}
      {filters}
      {list}
    </div>
  );
}

export function BoardsListLayoutHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
export function BoardsListLayoutFilters({
  sort,
  filters,
  actions,
}: {
  sort?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      {filters && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Filter by</div>
          {filters}
        </div>
      )}
      {sort && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Sort by</div>
          {sort}
        </div>
      )}
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}
