export const CHANGE_NOTICE_MS = 24 * 60 * 60 * 1000;
export function canChangeLesson(status: string, startTime: string | Date, now: number) {
  return ["PENDING", "CONFIRMED"].includes(status) && new Date(startTime).getTime() - now >= CHANGE_NOTICE_MS;
}
export function changeDeadline(startTime: string | Date) { return new Date(new Date(startTime).getTime() - CHANGE_NOTICE_MS).toISOString(); }
