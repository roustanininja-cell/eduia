import { Conversation } from "./types";

export function groupConversationsByDate(conversations: Conversation[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: "Hier", items: [] },
    { label: "Cette semaine", items: [] },
    { label: "Plus ancien", items: [] }
  ];

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  for (const c of sorted) {
    const updated = new Date(c.updatedAt);
    if (updated >= startOfToday) groups[0].items.push(c);
    else if (updated >= startOfYesterday) groups[1].items.push(c);
    else if (updated >= startOfWeek) groups[2].items.push(c);
    else groups[3].items.push(c);
  }

  return groups.filter((g) => g.items.length > 0);
}
