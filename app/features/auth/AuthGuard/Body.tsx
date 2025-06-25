export default function AuthGuardBody() {
  return (
    <div
      className="min-h-screen flex items-center justify-center
                      bg-gray-100 text-gray-800 p-4
                      dark:bg-gray-900 dark:text-gray-200"
    >
      {" "}
      {/* ダークモード対応 */}
      <div
        className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full
                        dark:bg-gray-800 dark:text-gray-100
                        sm:p-6 md:p-10"
      >
        {" "}
        {/* ダークモードとレスポンシブ対応 */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          {" "}
          {/* レスポンシブ対応 */}
          Loading User...
        </h1>
        <p className="text-md sm:text-lg">
          {" "}
          {/* レスポンシブ対応 */}
          しばらくお待ちください。
        </p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
        </div>
      </div>
    </div>
  );
}
