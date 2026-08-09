"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { UserProfile } from "../hooks/use-user-profile";

/*
  
  - Profile card for the settings page which displays the user's current profile information, while profile updates are handled separately through Profile Edit Dialog.

  - Keeping viewing and editing separate makes each component focused on a single responsibility.

*/

interface ProfilePreviewProps {
  profile: UserProfile | null;
  isLoading?: boolean;
}

const ProfilePreview = ({ profile, isLoading }: ProfilePreviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 text-center">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <Avatar className="h-24 w-24 transition-transform group-hover:scale-105">
              <AvatarImage
                src={profile.image || undefined}
                alt={profile.name || "User"}
                className="object-cover"
              />
              <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/50 rounded-full cursor-pointer">
              <Camera className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">
              {profile.name || "No name set"}
            </h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>

          <div className="w-full pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">
                {new Date(profile.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreview;
