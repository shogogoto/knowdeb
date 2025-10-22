import {
  type ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

type TraceMemoryContextType = {
  register: (id: string) => void;
  getNumber: (id: string) => number | undefined;
  count: number;
};

export const TraceMemoryContext = createContext<
  TraceMemoryContextType | undefined
>(undefined);

export function TraceMemoryProvider({ children }: { children: ReactNode }) {
  const [memory, setMemory] = useState<Map<string, number>>(new Map());

  const register = useCallback((id: string) => {
    setMemory((prev) => {
      if (prev.has(id)) {
        return prev;
      }
      const newMemory = new Map(prev);
      newMemory.set(id, prev.size + 1);
      return newMemory;
    });
  }, []);

  const getNumber = useCallback(
    (id: string) => {
      return memory.get(id);
    },
    [memory],
  );

  const value = useMemo(
    () => ({ register, getNumber, count: memory.size }),
    [register, getNumber, memory.size],
  );

  return (
    <TraceMemoryContext.Provider value={value}>
      {children}
    </TraceMemoryContext.Provider>
  );
}
