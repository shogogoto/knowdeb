import { Outlet } from "react-router";
import { Header } from "~/components/Header";

export default function MainLayout() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-10">
        <Header />
      </div>
      <main className="flex flex-col items-center pt-16 pb-4 min-h-screen bg-white dark:bg-gray-950">
        <Outlet />
      </main>
    </>
  );
}
