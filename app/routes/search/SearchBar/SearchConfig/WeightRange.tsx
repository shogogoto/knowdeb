import type { Dispatch, SetStateAction } from "react";
import type { OrderBy } from "../types";

type WRProps = {
  name: string;
  label: string;
  order: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
};

export default function WeightRange({
  name,
  label,
  order,
  setOrderBy,
}: WRProps) {
  const val = Number(order[name as keyof OrderBy]);
  return (
    <div>
      <label htmlFor={name} className="text-xs flex justify-between">
        {label}
        <span className="text-xs text-right">{val}</span>
      </label>
      <input
        name={name}
        type="range"
        min={-1}
        max={5}
        value={val}
        onChange={(e) =>
          setOrderBy({ ...order, [name]: Number(e.target.value) })
        }
        className="w-full"
      />
    </div>
  );
}
