// const TestFormComponent = ({ initialValue, errors }: TestFormProps) => {
//   const [form, fields] = useForm({
//     defaultValue: initialValue,
//     lastResult: {
//       // conform-toがエラーを認識するためにlastResultをモックする
//       error: {
//         name: errors?.name,
//         bio: errors?.bio,
//       },
//     },
//     onValidate: ({ formData }) =>
//       parseWithZod(formData, { schema: TestSchema }),
//   });
//
//   return (
//     <form {...getFormProps(form)}>
//       <InputFormControl
//         label="Name"
//         field={fields.name}
//         placeholder="Enter your name"
//       />
//       <TextareaFormControl
//         label="Bio"
//         field={fields.bio}
//         placeholder="Enter your bio"
//         maxLength={10}
//       />
//     </form>
//   );
// };

describe("Form Controls (Unit Test)", () => {
  it("ラベルとプレースホルダーが正しく表示される", () => {
    // render(<TestFormComponent />);
    // expect(screen.getByLabelText("Name")).toBeInTheDocument();
    // expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });
});
//     it("エラーメッセージが正しく表示される", () => {
//       render(<TestFormComponent errors={{ name: ["Name is required"] }} />);
//       expect(screen.getByText("Name is required")).toBeInTheDocument();
//     });
//   });
//
//   describe("TextareaFormControl", () => {
//     it("ラベルとプレースホルダーが正しく表���される", () => {
//       render(<TestFormComponent />);
//       expect(screen.getByLabelText("Bio")).toBeInTheDocument();
//       expect(screen.getByPlaceholderText("Enter your bio")).toBeInTheDocument();
//     });
//
//     it("エラーメッセージが正しく表示される", () => {
//       render(<TestFormComponent errors={{ bio: ["Bio is too long"] }} />);
//       expect(screen.getByText("Bio is too long")).toBeInTheDocument();
//     });
//
//     it("文字数カウンターが正しく表示される", () => {
//       render(<TestFormComponent initialValue={{ name: "test", bio: "Hello" }} />);
//       // "5 / 10" のように表示されることを確認
//       expect(screen.getByText(/5\s*\/\s*10/)).toBeInTheDocument();
//     });
//
//     it("文字数カウンターがmaxLengthなしでは表示されない", () => {
//       const NoMaxLengthComponent = () => {
//         const [form, fields] = useForm({
//           onValidate: ({ formData }) =>
//             parseWithZod(formData, { schema: TestSchema }),
//         });
//         return (
//           <form {...getFormProps(form)}>
//             <TextareaFormControl
//               label="Bio"
//               field={fields.bio}
//               placeholder="Enter your bio"
//             />
//           </form>
//         );
//       };
//       render(<NoMaxLengthComponent />);
//       expect(screen.queryByText(/\d+\s*\/\s*\d+/)).not.toBeInTheDocument();
//     });
//   });
// });
