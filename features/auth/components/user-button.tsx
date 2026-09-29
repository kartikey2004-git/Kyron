"use client"; // makes sure this component runs on the client-side (needed for hooks like useState)

/*
 
Account menu shown in the app shell header in avatar, profile edit entry point, and sign-out.
 
  - Fetches the current user via useUserProfile hook rather than trusting the session payload directly, since profile name can change without a new session being issued.
  
  - account menu can be used anywhere where the app shell renders the logged-in user (dashboard layout, settings, etc.)

*/

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  CreditCard,
  User as UserIcon,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/auth-client";
import {
  avatarSizes,
  formatMemberSince,
  getUserInitials,
} from "../utils/user-utils";
import { ProfileEditDialog, useUserProfile } from "@/features/settings";

// Props accepted by this component
interface UserButtonProps {
  onLogout?: () => void | Promise<void>; //callback for logout

  // open settings, profile, billing handler
  onProfile?: () => void;
  onBilling?: () => void;

  // whether to show a small badge on avatar
  showBadge?: boolean;
  badgeText?: string; // text inside badge
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"; // badge variant
  size?: "sm" | "md" | "lg"; // avatar size
  showEmail?: boolean; // whether to show user email in dropdown
  showMemberSince?: boolean; // whether to show "member since" info
}

export default function UserButton({
  // onLogout,
  onProfile,
  onBilling,
  showBadge = false,
  badgeText = "Pro",
  badgeVariant = "default",
  size = "md",
  showEmail = true,
  showMemberSince = true,
}: UserButtonProps) {
  // loading state for logout button
  const [isLoading, setIsLoading] = useState(false);

  // This hook allows you to programmatically change routes inside Client Component.

  const router = useRouter();

  // Get user profile from database
  const {
    data: user,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useUserProfile();

  // Actual sign out logic using your auth client , grab signOut function which comes from authClient , onSuccess: A callback function that will be called when a response is successful which is basically redirecting the user to the login page.

  const onSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // after sign out, redirect user to login page
        },
      },
    });
  };

  // custom logout handler for signout to handle errors and loading state

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onSignOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /*
  
    - Loading, request failures, and a missing user are different states and should be handled separately.

    - Treating them all as `null` caused the account menu to disappear whenever the profile request hadn't completed or failed.

  */

  if (isProfileLoading) {
    return <Skeleton className={`${avatarSizes[size]} rounded-full`} />;
  }

  if (error) {
    return (
      <Button
        variant="ghost"
        className={`relative ${avatarSizes[size]} rounded-full p-0 text-destructive hover:bg-destructive/10`}
        onClick={() => refetch()}
        aria-label="Failed to load account — retry"
        title="Failed to load account — click to retry"
      >
        <AlertTriangle className="h-4 w-4" />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant="ghost"
          className={`relative ${avatarSizes[size]} rounded-full p-0 hover:bg-accent`}
          disabled={isLoading}
        >
          <Avatar className={avatarSizes[size]}>
            <AvatarImage
              src={user.image || ""}
              alt={user.name || "User avatar"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getUserInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          {showBadge && (
            <Badge
              variant={badgeVariant}
              className="absolute -bottom-1 -right-1 h-5 px-1 text-xs"
            >
              {badgeText}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-68" align="end" side="right" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User avatar"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-lg">
                  {getUserInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-foreground font-medium leading-none">
                  {user.name || "User"}
                </p>
                {showEmail && user.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                )}
                {showBadge && (
                  <Badge variant={badgeVariant} className="w-fit">
                    {badgeText}
                  </Badge>
                )}
              </div>
            </div>
            {showMemberSince && (
              <p className="text-xs text-muted-foreground">
                Member since {formatMemberSince(new Date(user.createdAt))}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ProfileEditDialog
          profile={user}
          isLoading={isProfileLoading}
          error={error}
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>
        </ProfileEditDialog>

        {onProfile && (
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        )}

        {onBilling && (
          <DropdownMenuItem onClick={onBilling} className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
