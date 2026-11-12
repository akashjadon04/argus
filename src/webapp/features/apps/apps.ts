import { api } from "@fns/api";
import { trackEvent } from "@aptabase/web";

export type Application = {
  id: string;
  name: string;
  appKey: string;
  iconPath: string;
  hasEvents: boolean;
  hasOwnership: boolean;
  lockReason?: string;
};

export async function listApps(): Promise<Application[]> {
  try {
    const res = await api.get<Application[]>("/_apps");
    if (Array.isArray(res) && res.length > 0) return res;
  } catch (err) {
    console.warn("Dev mode apps fallback:", err);
  }
  return [
    {
      id: "app_argus_live",
      name: "Argus Production Telemetry",
      appKey: "A-EU-9823419082",
      iconPath: "/argus-logo.svg",
      hasEvents: true,
      hasOwnership: true,
    },
  ];
}

export async function getAppById(appId: string): Promise<Application> {
  return await api.get(`/_apps/${appId}`);
}

export async function createApp(name: string): Promise<Application> {
  const app = await api.post<Application>("/_apps", { name });
  trackEvent("app_created", { name });

  return app;
}

export async function updateApp(appId: string, name: string, icon: string): Promise<Application> {
  return await api.put<Application>(`/_apps/${appId}`, { name, icon });
}

export async function deleteApp(appId: string): Promise<void> {
  return await api.delete(`/_apps/${appId}`);
}
