"use client";
import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";
export function Button({ className, ...props }: BaseButton.Props) {
  return <BaseButton className={clsx("button", className)} {...props} />;
}
