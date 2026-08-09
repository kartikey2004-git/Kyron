"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";

/*

  Header section for the repository connection page.

   - Its responsibility is limited to rendering the page title and summary. Total repositories count and connected repositories count are calculated upstream and passed in as props.

*/

interface RepositoryHeaderProps {
  isLoading: boolean;
  totalRepositories: number;
  connectedCount: number;
  actions?: React.ReactNode;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  isLoading,
  totalRepositories,
  connectedCount,
  actions,
}) => {
  return (
    <PageHeader
      title="Repositories"
      description={
        isLoading
          ? "Loading your GitHub repositories…"
          : `${totalRepositories.toLocaleString()} available · ${connectedCount.toLocaleString()} connected for review.`
      }
      actions={actions}
    />
  );
};
