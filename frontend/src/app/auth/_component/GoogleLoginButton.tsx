import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FC } from "react";
import { CredentialResponse } from "@react-oauth/google";

const GoogleLoginButton: FC<{
  onSuccess: (credentialResponse: CredentialResponse) => void;
}> = ({ onSuccess }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  if (!clientId) {
    console.error("Google Client ID is missing");
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          console.error("Google login failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
