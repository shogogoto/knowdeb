import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../components/auth";
import { oauthGoogleJwtCallbackGoogleCallbackGet } from "../../../generated/auth/auth";
import type { BearerResponse } from "../../../generated/fastAPI.schemas";

export function meta() {
  return [
    { title: "Google Auth Callback - Knowde" },
    { name: "description", content: "Processing Google authentication" },
  ];
}

export default function GoogleCallback() {
  const location = useLocation();
  // const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }

        if (!code) {
          setError("No authorization code received");
          setIsLoading(false);
          return;
        }

        // Call the backend to exchange the code for a token
        const response = await oauthGoogleJwtCallbackGoogleCallbackGet({
          code,
          state: state || undefined,
        });

        if (response.status === 200) {
          // API returns BearerResponse type (access_token and token_type)
          const responseData = response.data as BearerResponse;
          const userEmail =
            localStorage.getItem("knowde_oauth_email") ||
            "google-user@example.com";
          const user = {
            email: userEmail,
            id: "", // We don't have the ID in this response
          };
          login(responseData.access_token, user);
        } else {
          setError("Authentication failed");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setError("An error occurred during authentication");
      } finally {
        setIsLoading(false);
      }
    };

    processCallback();
  }, [location, login]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Completing Authentication...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
