import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AdminModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminModal({ open, onOpenChange, title, description, children, className }: AdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[92vh] overflow-y-auto rounded-2xl border-white/35 bg-card/95 p-0 shadow-[0_28px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:max-w-xl",
          className,
        )}
      >
        <div className="border-b border-border/70 bg-gradient-to-br from-primary-soft/70 via-card to-card px-6 py-5">
          <DialogHeader className="pr-8">
            <DialogTitle className="font-display text-xl font-semibold tracking-tight">{title}</DialogTitle>
            {description && <DialogDescription className="leading-relaxed">{description}</DialogDescription>}
          </DialogHeader>
        </div>
        <div className="px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}