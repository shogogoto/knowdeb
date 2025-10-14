import { Outlet } from "react-router";
import { HistoryAside } from "./HistoryAside";

export default function SideViewLayout() {
  // const isMobile = useIsMobile();
  // if (isMobile) {
  //   return (
  //     <>
  //       <main>
  //         <Outlet />
  //       </main>
  //       <div className="fixed bottom-20 right-4 z-20">
  //         <Drawer direction="right">
  //           <DrawerTrigger asChild>
  //             <Button size="icon" variant="secondary" className="rounded-full">
  //               <PanelRightOpen />
  //             </Button>
  //           </DrawerTrigger>
  //           <DrawerContent className="w-full max-w-sm p-0" />
  //         </Drawer>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <div className="grid sm:grid-cols-[1fr_320px]">
      <main>
        <Outlet />
      </main>
      <HistoryAside />
    </div>
  );
}
