import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

// 認証関連のクエリパラメータを削除
export function useSSORedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.has("state")) {
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);
}
