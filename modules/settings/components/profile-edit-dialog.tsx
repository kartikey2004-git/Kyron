"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (open && profile) {
      setFormData({
        name: profile.name ?? "",
        email: profile.email ?? "",
      });
    }
  }, [open, profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasChanges = useMemo(() => {
    if (!profile) return false;

    return (
      formData.name !== (profile.name ?? "") ||
      formData.email !== (profile.email ?? "")
    );
  }, [formData, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate(
      {
        name: formData.name || undefined,
        email: formData.email || undefined,
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
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                          const newValue = formData.name + " ";
                          handleInputChange("name", newValue);
                        }
                      }}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your.email@example.com"
                    />
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
