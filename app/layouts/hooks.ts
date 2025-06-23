import { useSidebar } from "~/components/ui/sidebar";

export default function useToggleSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };
  return { isMobile, toggleSidebar, handleMenuClick };
}
