"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit } from "lucide-react";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { FormSkeleton } from "./skeleton-loader";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "../hooks/use-user-profile";

// Modal dialog for updating the user's display name. The profile is edited in place rather than on a separate page, allowing users to quickly make changes without interrupting their current workflow.

interface ProfileEditDialogProps {
  children?: React.ReactNode;
  profile: UserProfile | null;
  isLoading?: boolean;
  error?: Error | null;
}

const ProfileEditDialog = ({
  children,
  profile,
  isLoading,
  error,
}: ProfileEditDialogProps) => {
  const [open, setOpen] = useState(false);

  /*
    
    - Every time the dialog opens, start with the latest profile values from the server. 
    
    - Once the form is shown, it manages its own state, so users can edit freely without their input being reset if the profile data changes or is refetched while the dialog is still open.
  
  */

  const getInitialFormData = () => ({
    name: profile?.name ?? "",
  });

  const [formData, setFormData] = useState(getInitialFormData);

  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateProfile();

  // Reset the form when the dialog opens, not when it closes. The dialog is already leaving view on close, so resetting then serves no purpose. more importantly, resetting only on dialog open prevents a background profile refetch from overwriting edits while the user is still making changes.

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setFormData(getInitialFormData());
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasChanges = useMemo(() => {
    if (!profile) return false;

    return formData.name !== (profile.name ?? "");
  }, [formData, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate(
      {
        // Send a cleared name as `undefined` instead of an empty string so the update treats it as "no change" rather than triggering the "name cannot be empty" validation. Clearing the field and saving therefore leaves the existing name unchanged.

        name: formData.name || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          queryClient.invalidateQueries({ queryKey: ["user-profile"] });
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and account details.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading && <FormSkeleton />}

          {error && (
            <div className="text-sm text-destructive">
              Failed to load profile information. Please try again.
            </div>
          )}

          {!isLoading && !error && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email ?? ""}
                      disabled
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground">
                      Synced from your GitHub account and not editable here.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={!hasChanges || updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
