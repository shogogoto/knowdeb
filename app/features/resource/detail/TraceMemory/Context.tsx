import {
  type ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

type TraceMemoryContextType = {
  register: (id: string) => void;
  isRegistered: (id: string) => boolean;
  getNumber: (id: string) => number | undefined;
};

export const TraceMemoryContext = createContext<
  TraceMemoryContextType | undefined
>(undefined);

export function TraceMemoryProvider({ children }: { children: ReactNode }) {
  // Setで実装したかったが、Reactの非同期処理のため、Mapを採用
  // 各コンポーネントでのregister呼び出しは非同期になされるため、
  // setのsizeを意図通りに取得できない
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

  const isRegistered = useCallback(
    (id: string) => {
      return memory.has(id);
    },
    [memory],
  );

  const getNumber = useCallback(
    (id: string) => {
      return memory.get(id);
    },
    [memory],
  );

  const value = useMemo(
    () => ({ register, isRegistered, getNumber }),
    [register, isRegistered, getNumber],
  );

  return (
    <TraceMemoryContext.Provider value={value}>
      {children}
    </TraceMemoryContext.Provider>
  );
}
