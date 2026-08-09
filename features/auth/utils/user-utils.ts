// Avatar fallback when there's no profile image: initials from the name, or the first two chars of the email if there's no name on file yet.

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

// Format member since date (convert it like 2026-08-02 to August 2026)

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
