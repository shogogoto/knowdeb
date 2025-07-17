import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type InputFormControlProps = {
  label: string;
  field: FieldMetadata<string | null>;
  placeholder: string;
  type?: "text";
};

export function InputFormControl({
  label,
  field,
  placeholder,
  type = "text",
}: InputFormControlProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={field.id}>{label}</Label>
      <Input {...getInputProps(field, { type })} placeholder={placeholder} />
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
}: TextareaFormControlProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={field.id}>{label}</Label>
      <Textarea
        {...getInputProps(field, { type: "text" })}
        rows={rows}
        placeholder={placeholder}
      />
      {field.errors && (
        <span className="text-destructive text-sm mt-1">{field.errors}</span>
      )}
      {maxLength && (
        <div className="text-right text-sm text-gray-500">
          {field.value?.length || 0} / {maxLength}
        </div>
      )}
    </div>
  );
}
