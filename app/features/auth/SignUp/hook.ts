import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { registerRegisterAuthRegisterPostBody } from "~/generated/auth/auth.zod";

export default function useSignUp() {
  const form = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: registerRegisterAuthRegisterPostBody,
      });
    },
  });

  return form;
}
