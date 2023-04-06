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
  const alternativesList = api.alternatives.getList.useQuery();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Command
      className={cn(
        "relative mx-auto overflow-visible text-slate-500 transition-transform duration-300 ease-in-out",
        small ? "max-w-lg" : "max-w-xl",
        small && !isFocused && "max-w-xs",
        small &&
        isFocused &&
        "max-xs:absolute max-xs:left-1/2 max-xs:top-4 max-xs:h-fit max-xs:w-[90%] max-xs:-translate-x-1/2"
      )}
    >
      <CommandInput
        value={input}
        placeholder="Browse..."
        className={cn(small ? "h-8" : "h-auto")}
        onValueChange={(value) => setInput(value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
      />
      {isFocused && (
        <CommandList
          className={cn(
            "absolute w-full rounded-b-lg bg-white px-1",
            small ? "top-6" : "top-9"
          )}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {alternativesList.data?.map((alternative) => (
              <Link href={`/${alternative.name}`} key={alternative.name}>
                <CommandItem className="grid cursor-pointer grid-cols-[min-content_1fr_max-content] max-xs:grid-cols-1 max-xs:grid-rows-[min-content_1fr_min-content]">
                  <div className="flex items-center gap-1 place-self-start text-slate-700 max-xs:pb-1">
                    <Cog className="h-5 w-5" />
                    <span className="font-semibold">{alternative.name}</span>
                  </div>
                  <span className="pl-1 font-light text-slate-600 xs:px-2">
                    {alternative.description}
                  </span>
                  <span className="ml-auto place-self-start font-semibold text-slate-700">
                    {alternative.to.map((s) => s.name).join(", ")}
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
