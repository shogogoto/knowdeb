import { Link } from "react-router";
import { useHistory } from "~/features/history/hooks";
import { useIsMobile } from "~/shared/hooks/use-mobile";

export function FooterHistory() {
  const isMobile = useIsMobile();
  const { histories } = useHistory();

  if (!isMobile || histories.length === 0) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-full max-w-screen-2xl">
        <p className="flex-shrink-0 mr-2 text-sm font-bold">履歴:</p>
        <div className="flex-1 w-0 overflow-x-auto whitespace-nowrap no-scrollbar">
          {histories.slice(0, 10).map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className="inline-block px-3 py-1.5 mx-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              {item.title}
            </Link>
          ))}
          {histories.length > 10 && <span className="ml-2">...</span>}
        </div>
      </div>
    </footer>
  );
}
