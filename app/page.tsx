import Image from "next/image";
import { Button } from "@/components/ui/button";
import { requireAuthenticated } from "@/modules/auth/utils/auth-utils";
import Logout from "@/modules/auth/components/logout";
import UserButton from "@/modules/auth/components/user-button";

export default async function Home() {
  const session = await requireAuthenticated();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logout className="cursor-pointer">
        <Button>Logout</Button>
      </Logout>
      <UserButton user={session?.user!} />
    </div>
  );
}
