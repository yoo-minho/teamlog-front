import { DaysCount } from "@/types/common";

const MMM = {
  EN: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  KO: ["일", "월", "화", "수", "목", "금", "토"],
};
const day = [0, 1, 2, 3, 4, 5, 6];
const add = (total: number, val: { count: number }) => total + val.count;
const active = (arr: DaysCount<number>[]) => arr?.filter((v) => v.count > 0);
const targetCount = (arr: DaysCount<number>[], day: number) =>
  arr.filter((v) => v.day === day).length;
const getManyPostDay = (activeJandis: DaysCount<number>[]): number =>
  day
    .map((d) => ({ day: d, count: targetCount(activeJandis, d) }))
    .sort((x, y) => y.count - x.count)[0].day;

export const useDayCount = (dayArr: DaysCount<number>[]) => {
  const activeJandis = active(dayArr);
  if (!activeJandis || activeJandis.length === 0) {
    return { totalJandiCnt: 0, manyPostMMM: "-" };
  }
  return {
    totalJandiCnt: activeJandis?.reduce(add, 0) || 0,
    manyPostMMM: MMM.KO[getManyPostDay(activeJandis)],
  };
};
