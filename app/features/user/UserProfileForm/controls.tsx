import { type FieldMetadata, getInputProps } from "@conform-to/react";
import TextareaAutosize from "react-textarea-autosize";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

type InputFormControlProps = {
  label: string;
  field: FieldMetadata<string | null>;
  placeholder: string;
  type?: "text";
  disabled?: boolean;
};

export function InputFormControl({
  label,
  field,
  placeholder,
  type = "text",
  disabled,
}: InputFormControlProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={field.id}>{label}</Label>
      <Input
        {...getInputProps(field, { type })}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={field.value}
      />
      {field.errors && (
        <span className="text-destructive text-sm mt-1">{field.errors}</span>
      )}
    </div>
  );
}

type TextareaFormControlProps = InputFormControlProps & {
  rows?: number;
  maxLength?: number;
};

export function TextareaFormControl({
  label,
  field,
  placeholder,
  rows,
  maxLength,
  disabled,
}: TextareaFormControlProps) {
  const { value } = field;
  const isExceeded = maxLength && value && value.length > maxLength;
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={field.id}>{label}</Label>
      <TextareaAutosize
        {...getInputProps(field, { type: "text" })}
        minRows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isExceeded && "border-destructive",
        )}
      />
      {field.errors && (
        <span className="text-destructive text-sm mt-1">{field.errors}</span>
      )}
      {maxLength && (
        <div
          className={cn(
            "text-right text-sm text-gray-500",
            isExceeded && "text-destructive",
          )}
        >
          {field.value?.length || 0} / {maxLength}
        </div>
      )}
    </div>
  );
}
