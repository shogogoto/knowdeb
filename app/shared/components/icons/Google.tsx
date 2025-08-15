export default function GoogleIcon({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img" // 必要であれば role="img" を追加し、aria-label を使う
      aria-label="Google icon" // role="img" を使う場合はこちら
    >
      <title>Googleアイコン</title>
      <path
        d="M44 24c0-1.21-.09-2.37-.28-3.5H24v6.64h11.23c-.49 2.64-1.95 4.88-4.17 6.37v5.28h6.75C41.34 35.18 44 30.1 44 24z"
        fill="#4285F4"
      />
      <path
        d="M24 44c5.57 0 10.25-1.84 13.67-4.98l-6.67-5.18c-1.85 1.24-4.22 1.97-7 1.97-5.38 0-9.93-3.64-11.56-8.53H5.62v5.33C8.99 38.89 15.96 44 24 44z"
        fill="#34A853"
      />
      <path
        d="M12.44 27.28c-.41-1.24-.64-2.56-.64-3.92s.23-2.68.64-3.92V14.11H5.62C4.04 17.27 3.14 20.53 3.14 24s.9 6.73 2.48 9.89l6.82-5.61z"
        fill="#FBBC05"
      />
      <path
        d="M24 12.81c3.03 0 5.75 1.04 7.89 3.08l5.92-5.92C34.25 6.85 29.57 4.86 24 4.86c-8.04 0-15.01 5.11-18.38 11.39l6.82 5.33C14.07 16.45 18.62 12.81 24 12.81z"
        fill="#EA4335"
      />
    </svg>
  );
}
