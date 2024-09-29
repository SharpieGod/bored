"use client";
import Image from "next/image";
import { type FC } from "react";
import { LoaderCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Throbber from "./Throbber";

interface UserPreviewProps {
  id: string;
  isMe: boolean;
}

const UserPreview: FC<UserPreviewProps> = ({ id }) => {
  const router = useRouter();
  const { data: user, isLoading } = api.user.getUser.useQuery({ id });

  if (!isLoading && !user) {
    router.push("/");
  }

  return isLoading ? (
    <div className="mt-6">
      <Throbber />
    </div>
  ) : (
    <div className="mx-auto mt-8 flex w-3/5 flex-col">
      <div className="flex items-center gap-4">
        <Image
          className="size-16 rounded-full"
          src={user?.image ?? ""}
          alt={user?.name ?? ""}
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold italic">@{user?.name ?? ""}</h1>
      </div>
    </div>
  );
};

export default UserPreview;
