'use client';

import React, { useState } from 'react';

const TableActionsContext = React.createContext<{
  selectedItem: any | null;
  setSelectedItem: (item: any | null) => void;
  sort?: { field: string; direction: 'asc' | 'desc' };
  setSort: (
    sort: { field: string; direction: 'asc' | 'desc' } | undefined,
  ) => void;
  pagination?: { pageIndex: number; pageSize: number };
  setPagination: (
    pagination: { pageIndex: number; pageSize: number } | undefined,
  ) => void;
}>({
  selectedItem: null,
  setSelectedItem: () => {},
  sort: undefined,
  setSort: () => {},
  pagination: undefined,
  setPagination: () => {},
});

const TableActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [sort, setSort] = useState<
    { field: string; direction: 'asc' | 'desc' } | undefined
  >(undefined);
  const [pagination, setPagination] = useState<
    { pageIndex: number; pageSize: number } | undefined
  >(undefined);

  return (
    <TableActionsContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        sort,
        setSort,
        pagination,
        setPagination,
      }}
    >
      {children}
    </TableActionsContext.Provider>
  );
};
export { TableActionsContext, TableActionsProvider };
