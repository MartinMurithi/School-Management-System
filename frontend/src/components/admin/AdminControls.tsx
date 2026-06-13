import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldControlClassName =
  "mt-1 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

type FieldShellProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function FieldShell({ label, children, className }: FieldShellProps) {
  return (
    <label className={cn("text-sm font-medium text-foreground", className)}>
      {label}
      {children}
    </label>
  );
}

type AdminTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  wrapperClassName?: string;
};

export function AdminTextField({ label, wrapperClassName, className, ...props }: AdminTextFieldProps) {
  return (
    <FieldShell label={label} className={wrapperClassName}>
      <input className={cn(fieldControlClassName, className)} {...props} />
    </FieldShell>
  );
}

type AdminSelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  wrapperClassName?: string;
  children: ReactNode;
};

export function AdminSelectField({ label, wrapperClassName, className, children, ...props }: AdminSelectFieldProps) {
  return (
    <FieldShell label={label} className={wrapperClassName}>
      <select className={cn(fieldControlClassName, className)} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}

type AdminTextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  wrapperClassName?: string;
};

export function AdminTextareaField({ label, wrapperClassName, className, ...props }: AdminTextareaFieldProps) {
  return (
    <FieldShell label={label} className={wrapperClassName}>
      <textarea
        className={cn(
          fieldControlClassName,
          "min-h-24 resize-y py-2",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
}

type AdminModalFooterProps = {
  cancelLabel?: string;
  submitLabel: string;
  onCancel: () => void;
};

export function AdminModalFooter({ cancelLabel = "Cancel", submitLabel, onCancel }: AdminModalFooterProps) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button>{submitLabel}</Button>
    </div>
  );
}

type AdminSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export function AdminSearchInput({ value, onChange, placeholder, className }: AdminSearchInputProps) {
  return (
    <div className={cn("flex h-9 max-w-md flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3", className)}>
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}

type AdminActionIconProps = {
  label: string;
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
};

export function AdminActionIcon({ label, asChild = false, children, className }: AdminActionIconProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      aria-label={label}
      title={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        className,
      )}
    >
      {children ?? <Eye className="h-4 w-4" />}
    </Comp>
  );
}
