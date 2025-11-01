// src/lunar-calendar.ts
import { LunarDate } from './lunar-date';
import { getLunarDate, getSolarDate, getYearCanChi, getDayCanChi, getMonthCanChi } from './core';
import { TUAN } from './constants';
import { jdn } from './utils';
import type { SolarDateInfo } from './types';

export class LunarCalendar {
  private _lunarDate: LunarDate;
  private _solarDate: SolarDateInfo;

  constructor(day: number, month: number, year: number, isLunar: boolean = false) {
    // Basic input validation
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      throw new Error('Day, month, and year must be integers');
    }

    if (day < 1 || day > 31) {
      throw new Error('Day must be between 1 and 31');
    }

    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }

    if (year < 1200 || year > 2199) {
      throw new Error('Year must be between 1200 and 2199');
    }

    // Validate day/month combinations for solar dates
    if (!isLunar) {
      const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let maxDays = maxDaysInMonth[month - 1];

      // Handle leap years for February
      if (month === 2) {
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        maxDays = isLeapYear ? 29 : 28;
      }

      if (day > maxDays) {
        throw new Error(`Invalid date: ${day}/${month}/${year}. Month ${month} has only ${maxDays} days.`);
      }
    }

    if (isLunar) {
      this._lunarDate = new LunarDate(day, month, year, false, 0);
      this._solarDate = getSolarDate(day, month, year);
    } else {
      this._solarDate = { day, month, year, jd: jdn(day, month, year) };
      this._lunarDate = getLunarDate(day, month, year);
    }
  }

  static fromSolar(day: number, month: number, year: number): LunarCalendar {
    return new LunarCalendar(day, month, year, false);
  }

  static fromLunar(day: number, month: number, year: number, leap: boolean = false): LunarCalendar {
    const calendar = new LunarCalendar(day, month, year, true);
    if (leap) {
      calendar._lunarDate.leap = true;
    }
    return calendar;
  }

  static today(): LunarCalendar {
    const now = new Date();
    return LunarCalendar.fromSolar(now.getDate(), now.getMonth() + 1, now.getFullYear());
  }

  get lunarDate(): LunarDate {
    return this._lunarDate;
  }

  get solarDate(): SolarDateInfo {
    return this._solarDate;
  }

  get yearCanChi(): string {
    return getYearCanChi(this._lunarDate.year);
  }

  get dayCanChi(): string {
    return getDayCanChi(this._solarDate.jd);
  }

  get monthCanChi(): string {
    return getMonthCanChi(this._lunarDate.month, this._lunarDate.year);
  }

  get dayOfWeek(): string {
    const dayIndex = (this._solarDate.jd + 1) % 7;
    return TUAN[dayIndex];
  }

  formatLunar(): string {
    return this._lunarDate.toString();
  }

  formatSolar(): string {
    return `${this._solarDate.day}/${this._solarDate.month}/${this._solarDate.year}`;
  }

  toString(): string {
    return `Solar: ${this.formatSolar()}, Lunar: ${this.formatLunar()}`;
  }
}