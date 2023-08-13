import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Days } from "../types/common";
import "dayjs/locale/ko";
dayjs.locale("ko");

dayjs.extend(relativeTime);

export const getFormatString = (dateStr?: Date, format?: string) =>
  dateStr ? dayjs(dateStr).format(format) : null;
export const getDateString = (dateStr?: Date) =>
  dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm (ddd)") : "";
export const getAgoString = (dateStr: Date) => dayjs(dateStr).fromNow();
export const getAgoString2 = (dateStr: Date) => dayjs(dateStr).fromNow();

export const isTodayByString = (dateString: string) =>
  dateString === dayjs(new Date()).format("YYYY-MM-DD");
export const isTodayByDate = (v = new Date()) =>
  dayjs(v).format("YYYYMMDD") === dayjs(new Date()).format("YYYYMMDD");
export const getDateStringByMs = (ms: number) =>
  dayjs(new Date(ms)).format("YYYY-MM-DD");
export const getAgoStringByMs = (ms: number) => dayjs(new Date(ms)).fromNow();
export const getlocaleStr = (ms: number) => new Date(ms).toLocaleString();
export const isSameDate = (date1: Date = new Date(), date2: Date) =>
  dayjs(date1).isSame(date2);

export const isWithinAWeek = (targetDate?: Date) => {
  if (!targetDate) return false;
  const today = dayjs();
  const expired_at = dayjs(targetDate);
  const result = expired_at.diff(today, "day", true);
  return Math.floor(result) > -7;
};

export const enumerateDaysFromNMonths = (n: number): Days[] => {
  const endDate = dayjs().endOf("week");
  const startDate = dayjs().subtract(n, "month").startOf("week");
  const dates = [];
  let now = startDate;
  while (now.isBefore(endDate) || now.isSame(endDate)) {
    const copyNow = now;
    const day = copyNow.day();
    const month = copyNow.format("MMM");
    const monthAgo1Week = copyNow.add(-7, "days").format("MMM");
    dates.push({
      date: now.format("YYYY-MM-DD"),
      day: day,
      month: day === 0 && month !== monthAgo1Week ? month : "",
    });
    now = now.add(1, "days");
  }
  return dates;
};
