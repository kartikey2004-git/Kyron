import { requireAuthenticated } from "@/modules/auth/utils/auth-utils";
import React from "react";

const DashboardPage = async () => {
  await requireAuthenticated();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">
              Welcome to your Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start reviewing code with AI-powered insights and suggestions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">Code Reviews</h3>
              <p className="text-sm text-muted-foreground">
                View and manage your code review history
              </p>
            </div>
            
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">GitHub Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connect your repositories for seamless reviews
              </p>
            </div>
            
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track your code review metrics and improvements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

