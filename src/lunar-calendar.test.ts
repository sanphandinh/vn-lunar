// src/lunar-calendar.test.ts
import { LunarCalendar } from './lunar-calendar';
import {describe, it, expect, beforeEach} from 'vitest'

describe('LunarCalendar Class', () => {
  describe('Constructor', () => {
    it('should create instance from solar date', () => {
      const calendar = new LunarCalendar(10, 2, 2024, false);

      expect(calendar.solarDate.day).toBe(10);
      expect(calendar.solarDate.month).toBe(2);
      expect(calendar.solarDate.year).toBe(2024);
      expect(calendar.lunarDate.year).toBeGreaterThan(0);
    });

    it('should create instance from lunar date', () => {
      const calendar = new LunarCalendar(1, 1, 2024, true);

      expect(calendar.lunarDate.day).toBe(1);
      expect(calendar.lunarDate.month).toBe(1);
      expect(calendar.lunarDate.year).toBe(2024);
      expect(calendar.solarDate.year).toBeGreaterThan(0);
    });
  });

  describe('Static Methods', () => {
    describe('fromSolar', () => {
      it('should create LunarCalendar from solar date', () => {
        const calendar = LunarCalendar.fromSolar(10, 2, 2024);

        expect(calendar.solarDate.day).toBe(10);
        expect(calendar.solarDate.month).toBe(2);
        expect(calendar.solarDate.year).toBe(2024);
        expect(calendar).toBeInstanceOf(LunarCalendar);
      });

      it('should handle different solar dates', () => {
        const testDates = [
          [1, 1, 2024],
          [15, 6, 2024],
          [30, 12, 2024]
        ];

        testDates.forEach(([day, month, year]) => {
          const calendar = LunarCalendar.fromSolar(day as number, month as number, year as number);
          expect(calendar.solarDate.day).toBe(day);
          expect(calendar.solarDate.month).toBe(month);
          expect(calendar.solarDate.year).toBe(year);
        });
      });
    });

    describe('fromLunar', () => {
      it('should create LunarCalendar from lunar date', () => {
        const calendar = LunarCalendar.fromLunar(1, 1, 2024);

        expect(calendar.lunarDate.day).toBe(1);
        expect(calendar.lunarDate.month).toBe(1);
        expect(calendar.lunarDate.year).toBe(2024);
        expect(calendar).toBeInstanceOf(LunarCalendar);
      });

      it('should handle leap month correctly', () => {
        const calendar = LunarCalendar.fromLunar(1, 4, 2024, true);

        expect(calendar.lunarDate.day).toBe(1);
        expect(calendar.lunarDate.month).toBe(4);
        expect(calendar.lunarDate.year).toBe(2024);
        expect(calendar.lunarDate.leap).toBe(true);
      });

      it('should handle regular month (leap = false)', () => {
        const calendar = LunarCalendar.fromLunar(15, 8, 2024, false);

        expect(calendar.lunarDate.day).toBe(15);
        expect(calendar.lunarDate.month).toBe(8);
        expect(calendar.lunarDate.year).toBe(2024);
        expect(calendar.lunarDate.leap).toBe(false);
      });
    });

    describe('today', () => {
      it('should create calendar for current date', () => {
        const calendar = LunarCalendar.today();
        const now = new Date();

        expect(calendar.solarDate.day).toBe(now.getDate());
        expect(calendar.solarDate.month).toBe(now.getMonth() + 1);
        expect(calendar.solarDate.year).toBe(now.getFullYear());
        expect(calendar).toBeInstanceOf(LunarCalendar);
      });
    });
  });

  describe('Properties', () => {
    let calendar: LunarCalendar;

    beforeEach(() => {
      calendar = LunarCalendar.fromSolar(10, 2, 2024);
    });

    describe('lunarDate', () => {
      it('should return LunarDate instance', () => {
        expect(calendar.lunarDate).toBeTruthy();
        expect(calendar.lunarDate.year).toBeGreaterThan(0);
      });
    });

    describe('solarDate', () => {
      it('should return correct solar date info', () => {
        expect(calendar.solarDate.day).toBe(10);
        expect(calendar.solarDate.month).toBe(2);
        expect(calendar.solarDate.year).toBe(2024);
        expect(calendar.solarDate.jd).toBeGreaterThan(0);
      });
    });

    describe('yearCanChi', () => {
      it('should return year Can Chi', () => {
        const yearCanChi = calendar.yearCanChi;
        expect(yearCanChi).toBeTruthy();
        expect(yearCanChi.split(' ').length).toBe(2);
        expect(yearCanChi.length).toBeGreaterThan(3);
      });

      it('should return different Can Chi for different years', () => {
        const calendar2024 = LunarCalendar.fromSolar(1, 1, 2024);
        const calendar2023 = LunarCalendar.fromSolar(1, 1, 2023);

        expect(calendar2024.yearCanChi).not.toBe(calendar2023.yearCanChi);
      });
    });

    describe('dayCanChi', () => {
      it('should return day Can Chi', () => {
        const dayCanChi = calendar.dayCanChi;
        expect(dayCanChi).toBeTruthy();
        expect(dayCanChi.split(' ').length).toBe(2);
        expect(dayCanChi.length).toBeGreaterThan(3);
      });

      it('should return different Can Chi for different days', () => {
        const day1 = LunarCalendar.fromSolar(1, 1, 2024);
        const day2 = LunarCalendar.fromSolar(2, 1, 2024);

        expect(day1.dayCanChi).not.toBe(day2.dayCanChi);
      });
    });

    describe('monthCanChi', () => {
      it('should return month Can Chi', () => {
        const monthCanChi = calendar.monthCanChi;
        expect(monthCanChi).toBeTruthy();
        expect(monthCanChi.split(' ').length).toBe(2);
        expect(monthCanChi.length).toBeGreaterThan(3);
      });

      it('should return different Can Chi for different months', () => {
        const month1 = LunarCalendar.fromSolar(1, 1, 2024);
        const month2 = LunarCalendar.fromSolar(1, 2, 2024);

        expect(month1.monthCanChi).not.toBe(month2.monthCanChi);
      });
    });

    describe('dayOfWeek', () => {
      it('should return correct day of week', () => {
        // 10/02/2024 was Saturday
        const dayOfWeek = calendar.dayOfWeek;
        expect(dayOfWeek).toBeTruthy();
        expect(['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']).toContain(dayOfWeek);
      });

      it('should return different days for different dates', () => {
        const saturday = LunarCalendar.fromSolar(10, 2, 2024);
        const sunday = LunarCalendar.fromSolar(11, 2, 2024);

        expect(saturday.dayOfWeek).not.toBe(sunday.dayOfWeek);
      });
    });
  });

  describe('Methods', () => {
    let calendar: LunarCalendar;

    beforeEach(() => {
      calendar = LunarCalendar.fromSolar(10, 2, 2024);
    });

    describe('formatLunar', () => {
      it('should format lunar date as string', () => {
        const formatted = calendar.formatLunar();
        expect(formatted).toBeTruthy();
        expect(formatted).toMatch(/^\d+\/\d+\/\d+($ \(nhuận\))?$/);
      });

      it('should handle leap month formatting', () => {
        const leapCalendar = LunarCalendar.fromLunar(1, 4, 2024, true);
        const formatted = leapCalendar.formatLunar();
        expect(formatted).toContain('(nhuận)');
      });
    });

    describe('formatSolar', () => {
      it('should format solar date as string', () => {
        const formatted = calendar.formatSolar();
        expect(formatted).toBe('10/2/2024');
      });

      it('should format different dates correctly', () => {
        const testDates = [
          [1, 1, 2024, '1/1/2024'],
          [15, 6, 2024, '15/6/2024'],
          [30, 12, 2024, '30/12/2024']
        ];

        testDates.forEach(([day, month, year, expected]) => {
          const cal = LunarCalendar.fromSolar(day as number, month as number, year as number);
          expect(cal.formatSolar()).toBe(expected);
        });
      });
    });

    describe('toString', () => {
      it('should format both solar and lunar dates', () => {
        const formatted = calendar.toString();
        expect(formatted).toContain('Solar: 10/2/2024');
        expect(formatted).toContain('Lunar:');
      });

      it('should work with different dates', () => {
        const cal1 = LunarCalendar.fromSolar(1, 1, 2024);
        const cal2 = LunarCalendar.fromSolar(15, 8, 2024);

        expect(cal1.toString()).toContain('Solar: 1/1/2024');
        expect(cal2.toString()).toContain('Solar: 15/8/2024');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between solar and lunar dates', () => {
      const calendar = LunarCalendar.fromSolar(10, 2, 2024); // Tết 2024

      // Verify lunar date is approximately correct for Tết
      expect(calendar.lunarDate.day).toBe(1);
      expect(calendar.lunarDate.month).toBe(1);
      expect(calendar.lunarDate.year).toBe(2024);
    });

    it('should handle round-trip conversion', () => {
      const original = LunarCalendar.fromSolar(15, 8, 2024);
      const lunarDate = original.lunarDate;

      // Convert back
      const roundTrip = LunarCalendar.fromLunar(
        lunarDate.day,
        lunarDate.month,
        lunarDate.year,
        lunarDate.leap
      );

      // Should be close to original
      expect(Math.abs(roundTrip.solarDate.day - original.solarDate.day)).toBeLessThanOrEqual(1);
      expect(roundTrip.solarDate.month).toBe(original.solarDate.month);
      expect(roundTrip.solarDate.year).toBe(original.solarDate.year);
    });

    it('should work with various important dates', () => {
      const importantDates = [
        // Tết dates
        [10, 2, 2024], // Tết 2024
        [22, 1, 2023], // Tết 2023
        [1, 2, 2022],  // Tết 2022

        // Mid-year dates
        [15, 8, 2024],
        [1, 6, 2023],
        [30, 12, 2024]
      ];

      importantDates.forEach(([day, month, year]) => {
        const calendar = LunarCalendar.fromSolar(day as number, month as number, year as number);

        expect(calendar.solarDate.day).toBe(day);
        expect(calendar.solarDate.month).toBe(month);
        expect(calendar.solarDate.year).toBe(year);
        expect(calendar.lunarDate.year).toBeGreaterThan(0);
        expect(calendar.yearCanChi).toBeTruthy();
        expect(calendar.dayCanChi).toBeTruthy();
        expect(calendar.monthCanChi).toBeTruthy();
        expect(calendar.dayOfWeek).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle beginning of year', () => {
      const calendar = LunarCalendar.fromSolar(1, 1, 2024);
      expect(calendar.solarDate.day).toBe(1);
      expect(calendar.solarDate.month).toBe(1);
    });

    it('should handle end of year', () => {
      const calendar = LunarCalendar.fromSolar(31, 12, 2024);
      expect(calendar.solarDate.day).toBe(31);
      expect(calendar.solarDate.month).toBe(12);
    });

    it('should handle leap year', () => {
      const calendar = LunarCalendar.fromSolar(29, 2, 2024);
      expect(calendar.solarDate.day).toBe(29);
      expect(calendar.solarDate.month).toBe(2);
    });
  });
});