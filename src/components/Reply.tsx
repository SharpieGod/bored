import { Reply as R, User } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { useRef, useState, type FC } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import Link from "next/link";
import Image from "next/image";

type ReplyWithChildren = R & { user: User; children: ReplyWithChildren[] };
interface ReplyProps {
  reply: ReplyWithChildren;
}

const Reply: FC<ReplyProps> = ({ reply }) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [comment, setComment] = useState("");
  const utils = api.useUtils();

  const { mutate: createReply } = api.reply.createReply.useMutation({
    onSuccess: async () => {
      await utils.post.getPost.refetch();
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="flex flex-col gap-4 rounded-xl bg-primary-800 bg-opacity-20 p-4"
    >
      <div className="flex flex-col gap-1">
        <Link
          href={`/account/${reply.user.id}`}
          className="flex items-center gap-2"
        >
          <Image
            src={reply.user.image ?? ""}
            alt={reply.user.name ?? ""}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="font-bold opacity-80">{reply.user.name}</div>
        </Link>
        <span>{reply.text}</span>
      </div>
      <div className="">
        <button
          onClick={() => {
            setReplyOpen(!replyOpen);
            inputRef.current?.focus();
          }}
        >
          <MessageCircle />
        </button>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: replyOpen ? "auto" : 0 }}
          className="overflow-hidden"
          transition={{ duration: 0.3 }}
        >
          <form
            className="flex flex-col gap-2 rounded-xl p-4"
            onSubmit={(e) => {
              e.preventDefault();
              setReplyOpen(false);
              setComment("");
              createReply({
                text: comment,
                postId: reply.postId,
                parentId: reply.id,
              });
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={comment}
              placeholder="Reply"
              className="w-full bg-transparent text-text-50 placeholder:text-text-50/80 focus:outline-none"
              onChange={(e) => setComment(e.target.value)}
            />
            <hr />
          </form>
        </motion.div>
        {reply.children.length > 0 && (
          <div className="flex flex-col gap-4 p-4">
            {reply.children.map((child) => (
              <Reply key={child.id} reply={child} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reply;
