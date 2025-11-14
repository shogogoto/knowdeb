import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";

type Props = {
  exts?: string[];
  setExts: Dispatch<SetStateAction<string[]>>;
};

export default function AcceptExtensions({ exts = [], setExts }: Props) {
  const [customExt, setCustomExt] = useState("");

  function handleCheckboxChange(ext: string, checked: boolean) {
    if (checked) {
      setExts((prev) => [...prev, ext]);
    } else {
      setExts((prev) => prev.filter((e) => e !== ext));
    }
  }

  function handleAddCustomExt() {
    if (customExt && !exts.includes(customExt) && customExt.startsWith(".")) {
      setExts((prev) => [...prev, customExt]);
      setCustomExt("");
    } else {
      alert("'.' から始まる拡張子を入力してくたさい");
    }
  }

  function handleRemoveExt(ext: string) {
    setExts((prev) => prev.filter((e) => e !== ext));
  }

  return (
    <div className="space-y-6 rounded-md border p-4">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-800">
          Custom Extension
        </h3>
        <div className="flex w-full max-w-xs items-center space-x-2">
          <Input
            type="text"
            placeholder=".example"
            value={customExt}
            onChange={(e) => {
              setCustomExt(e.target.value);
            }}
            className="h-9"
          />
          <Button type="button" onClick={handleAddCustomExt} size="sm">
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-800">
          Accepted Extensions
        </h3>
        <div className="flex min-h-[2.5rem] flex-wrap gap-2 rounded-md border bg-gray-50 p-2">
          {exts.length > 0 ? (
            exts.map((ext) => (
              <div
                key={ext}
                className="flex items-center gap-x-1.5 rounded-md bg-gray-200 px-2 py-1 text-sm font-medium text-gray-800"
              >
                <span>{ext}</span>
                <button
                  type="button"
                  aria-label={`Remove ${ext}`}
                  onClick={() => {
                    handleRemoveExt(ext);
                  }}
                  className="rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          ) : (
            <p className="self-center px-2 text-sm text-muted-foreground">
              No extensions selected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
