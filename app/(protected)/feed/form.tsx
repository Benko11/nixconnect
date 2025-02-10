"use client";

import { makePost, State } from "@/actions/make-post";
import { useActionState, useEffect, useState } from "react";

export default function Form() {
  const initialState = { post: "", message: "" };
  const [state, formAction, pending] = useActionState<State, FormData>(
    //@ts-expect-error this is ridiculous
    makePost,
    initialState
  );

  const [placeholder, setPlaceholder] = useState<string>("Share something fun");
  useEffect(() => {
    function renderPlaceholder() {
      const words = [
        "interesting",
        "inspiring",
        "amazing",
        "gay",
        "captivating",
        "wholesome",
        "honest",
        "unique",
        "marvellous",
        "cute",
      ];

      const randomIndex = Math.floor(Math.random() * words.length);
      return `Share something ${words[randomIndex]}...`;
    }

    setPlaceholder(renderPlaceholder());
  }, []);

  return (
    <form className="pb-8 w-full md:w-[60%]" action={formAction}>
      {state?.message && (
        <div className="text-default-error">{state.message}</div>
      )}
      <textarea
        name="post"
        id="post"
        className="resize-none aspect-[9/2] bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
        placeholder={placeholder || "Share something fun..."}
      ></textarea>
      <button
        className="bg-default-primary text-default-dark py-2 w-full -mt-2 disabled:opacity-70"
        disabled={pending}
      >
        Post
      </button>
    </form>
  );
}
