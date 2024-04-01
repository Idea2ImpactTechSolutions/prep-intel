"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import copy from 'copy-to-clipboard';
import { LuCopy, LuCopyCheck } from "react-icons/lu";

interface PageProps {
  claimUrl: string
}

export default function InviteLink({ claimUrl }: PageProps) {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard() {
    copy(claimUrl);
    setIsCopied(true);
  }

  return (
    <div className={cn(
      "hidden",
      "p-6 pl-0",
      claimUrl && "block")}>
      <h3 className="text-xl font-bold">Invite Sent</h3>

      <pre className="max-h-[650px] absolute w-[800px] overflow-x-auto rounded-lg border bg-zinc-400 text-zinc-50 py-4 pl-4">
        <div className="relative flex items-center rounded px-[0.2rem]  font-mono text-sm">

        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 absolute right-4 top-0 z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 ">

          <LuCopy className={cn(
            "block",
            isCopied && "hidden",
            "cursor-pointer")}
              onClick={copyToClipboard}  />

          <LuCopyCheck
              className={cn(
                !isCopied && "hidden",
                isCopied && "block")} />
        </button>

        <a className="underline" href={ claimUrl }>{claimUrl}</a>
        </div>
      </pre>

      </div>
  );
}
