export type Role = "podcaster" | "advertiser" | "admin";

export function dashboardPathForRole(role: string) {
  return role === "podcaster" ? "/podcaster/dashboard" : "/advertiser/dashboard";
}
