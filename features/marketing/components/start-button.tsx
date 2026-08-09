"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/server/auth/auth-client";
import { Button } from "@/components/ui/button";

export function StartButton({
  children,
  className,
  size,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => router.push(session ? "/dashboard" : "/login")}
    >
      {children}
    </Button>
  );
}
