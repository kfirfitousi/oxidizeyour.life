"use client";

import Link from "next/link";
import { useState } from "react";
import { Cog } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/utils/api";
import { cn } from "@/utils/classnames";

type SearchBoxProps = {
  small?: boolean;
};

export function SearchBox({ small }: SearchBoxProps) {
  const rewritesList = api.rewrites.getList.useQuery();
  const [input, setInput] = useState("");

  return (
    <Command
      className={cn(
        "relative mx-auto overflow-visible text-slate-500",
        small ? "max-w-lg" : "max-w-xl"
      )}
    >
      <CommandInput
        value={input}
        placeholder="Search..."
        className={cn(small ? "h-8" : "h-auto")}
        onValueChange={(value) => setInput(value)}
      />
      {input.length > 0 && (
        <CommandList
          className={cn(
            "absolute w-full rounded-b-lg bg-white px-1",
            small ? "top-6" : "top-9"
          )}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {rewritesList.data?.map((rewrite) => (
              <Link href={`/${rewrite.name}`} key={rewrite.name}>
                <CommandItem className="grid cursor-pointer grid-cols-[min-content_1fr_max-content]">
                  <div className="flex gap-1 place-self-start text-slate-700">
                    <Cog className="h-5 w-5" />
                    <span className="font-semibold">{rewrite.name}</span>
                  </div>
                  <span className="wrap-ellipsis overflow-hidden pl-2 font-light text-slate-600">
                    {rewrite.description}
                  </span>
                  <span className="ml-auto place-self-start font-light text-slate-600">
                    rewrite of{" "}
                    <span className="font-semibold text-slate-700">
                      {rewrite.of.map((s) => s.name).join(", ")}
                    </span>
                  </span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
