// list=true 拉取远程订阅时的 User-Agent（对应后端 ?ua=；留空则后端自动轮换）
export const SUBSCRIPTION_FETCH_UA_OPTIONS = [
  { label: "自动轮换（ClashMeta → Clash/1.0 → mihomo → clash.meta）", value: "" },
  { label: "ClashMeta", value: "ClashMeta" },
  { label: "Clash/1.0", value: "Clash/1.0" },
  { label: "mihomo", value: "mihomo" },
  { label: "clash.meta", value: "clash.meta" },
];
