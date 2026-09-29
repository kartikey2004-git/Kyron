"use client";

import React from "react";
import RepoList from "@/modules/settings/components/repo-list";

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Configuration
        </p>
        <h1 className="mt-1 text-[22px] font-medium tracking-[-0.04em] text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Manage connected repositories and account preferences.
        </p>
      </div>

      <RepoList />
    </div>
  );
};

export default SettingsPage;
