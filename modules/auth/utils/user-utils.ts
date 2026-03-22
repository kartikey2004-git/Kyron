// Get user initials for avatar fallback : If we don't get the avatar image ,  Generate initials for avatar fallback (e.g., "John Doe" → "JD")

export const getUserInitials = (name: string | null, email: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U"; // default
};

// Format member since date
export const formatMemberSince = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

// Predefined avatar sizes to keep design consistent
export const avatarSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};
