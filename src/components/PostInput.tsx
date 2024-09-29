"use client";

import { api } from "~/trpc/react";
import DarkoButton from "./Darko/DarkoButton";
import { toast } from "sonner";
import { useState } from "react";
import Throbber from "./Throbber";

const PostInput = () => {
  const { mutate: createPost, isPending } = api.post.createPost.useMutation({
    onSuccess: async () => {
      await utils.post.recentPosts.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title === "" || text === "") {
      toast.error("Please fill in all fields");
      return;
    }

    createPost({ title, text });

    setTitle("");
    setText("");
  };

  return (
    <form className="mx-auto w-2/5 pb-16" onSubmit={handleSubmit}>
      <div className="">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 rounded-xl bg-primary-900/50 p-4 *:bg-transparent">
            <input
              disabled={isPending}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl placeholder:text-text-50/80 focus:outline-none"
              type="title"
              placeholder="Title"
            />
            <hr />
            <textarea
              disabled={isPending}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="resize-none text-base placeholder:text-text-50/80 focus:outline-none"
              rows={5}
              placeholder="Text"
              name=""
              id=""
            ></textarea>
          </div>
          <DarkoButton disabled={isPending} type="submit" variant="primary">
            {isPending ? <Throbber /> : <span>Submit</span>}
          </DarkoButton>
        </div>
      </div>
    </form>
  );
};

export default PostInput;
