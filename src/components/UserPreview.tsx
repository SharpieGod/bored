"use client";
import Image from "next/image";
import { type FC } from "react";
import { LoaderCircle, UserMinus, UserPlus } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Throbber from "./Throbber";
import React from "react";
import DarkoButton from "./Darko/DarkoButton";
import { User } from "@prisma/client";

interface UserPreviewProps {
  id: string;
  isMe: boolean;
}

const UserPreview: FC<UserPreviewProps> = ({ id, isMe }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user, isLoading } = api.user.getUser.useQuery({ id });
  const { mutate: toggleFollow, isPending: followPending } =
    api.user.toggleFollow.useMutation({
      onMutate: async ({ follow, id }) => {
        await utils.user.getUser.cancel();
        const oldUser = utils.user.getUser.getData({ id });

        if (!oldUser) {
          return;
        }

        utils.user.getUser.setData(
          { id },
          { ...oldUser, followers: follow ? [{ id: "fake" } as User] : [] },
        );

        return oldUser;
      },
    });

  if (!isLoading && !user) {
    router.push("/");
  }

  return isLoading ? (
    <div className="mt-6">
      <Throbber />
    </div>
  ) : (
    <div className="mx-auto mt-8 flex w-2/5 flex-col">
      <div className="flex items-center justify-between">
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
        {!isMe && (
          <DarkoButton
            variant="primary"
            onClick={() =>
              toggleFollow({ id, follow: !user?.followers.length })
            }
            className="flex w-40 items-center justify-center gap-2"
          >
            {followPending ? (
              <Throbber size={26} />
            ) : (user?.followers.length ?? 0) <= 0 ? (
              <>
                <span>Follow</span>
                <UserPlus size={22} />
              </>
            ) : (
              <>
                <span>Following</span>
                <UserMinus size={22} />
              </>
            )}
          </DarkoButton>
        )}
      </div>
    </div>
  );
};

export default UserPreview;
