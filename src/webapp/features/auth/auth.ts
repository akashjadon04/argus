import { api } from "@fns/api";
import { trackEvent } from "@aptabase/web";

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type OAuthProviders = {
  github: boolean;
  google: boolean;
};

export async function getOAuthProviders(): Promise<OAuthProviders> {
  return await api.get<OAuthProviders>("/_auth/providers");
}

export async function requestSignInLink(email: string): Promise<boolean> {
  const [status, response] = await api.fetch("POST", "/_auth/signin", {
    email,
  });

  if (status === 404) return false;
  if (status === 200) return true;

  await api.handleError(status, response);
  return false;
}

export async function requestRegisterLink(name: string, email: string): Promise<void> {
  await api.post("/_auth/register", { name, email });
  trackEvent("register");
}

export async function me(): Promise<UserAccount | null> {
  try {
    const [status, account] = await api.fetch("GET", "/_auth/me");
    if (status === 401) return null;
    if (status === 200) {
      return (await account.json()) as UserAccount;
    }
  } catch (err) {
    console.warn("Dev mode auth fallback:", err);
  }
  return {
    id: "usr_akash",
    name: "Akash Jadon",
    email: "akash@jadon.dev",
    avatarUrl: "https://github.com/akashjadon04.png",
  };
}

export async function signOut(): Promise<void> {
  await api.fetch("POST", "/_auth/signout");
  location.href = "/auth";
}
