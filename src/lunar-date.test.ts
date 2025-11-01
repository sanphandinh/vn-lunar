// src/lunar-date.test.ts
import { LunarDate } from './lunar-date';
import {describe, it, expect} from 'vitest'

describe('LunarDate Class', () => {
  describe('Constructor', () => {
    it('should create a LunarDate instance with all properties', () => {
      const lunarDate = new LunarDate(15, 8, 2024, false, 2460532);

      expect(lunarDate.day).toBe(15);
      expect(lunarDate.month).toBe(8);
      expect(lunarDate.year).toBe(2024);
      expect(lunarDate.leap).toBe(false);
      expect(lunarDate.jd).toBe(2460532);
    });

    it('should handle leap month correctly', () => {
      const lunarDate = new LunarDate(1, 4, 2024, true, 2460415);

      expect(lunarDate.day).toBe(1);
      expect(lunarDate.month).toBe(4);
      expect(lunarDate.year).toBe(2024);
      expect(lunarDate.leap).toBe(true);
    });

    it('should handle zero values', () => {
      const lunarDate = new LunarDate(0, 0, 0, false, 0);

      expect(lunarDate.day).toBe(0);
      expect(lunarDate.month).toBe(0);
      expect(lunarDate.year).toBe(0);
      expect(lunarDate.leap).toBe(false);
      expect(lunarDate.jd).toBe(0);
    });
  });

  describe('toString()', () => {
    it('should format regular month correctly', () => {
      const lunarDate = new LunarDate(15, 8, 2024, false, 2460532);
      expect(lunarDate.toString()).toBe('15/8/2024');
    });

    it('should format leap month correctly', () => {
      const lunarDate = new LunarDate(1, 4, 2024, true, 2460415);
      expect(lunarDate.toString()).toBe('1/4/2024 (nhuận)');
    });

    it('should handle single digit day and month', () => {
      const lunarDate = new LunarDate(1, 1, 2024, false, 2460301);
      expect(lunarDate.toString()).toBe('1/1/2024');
    });

    it('should handle double digit day and month', () => {
      const lunarDate = new LunarDate(30, 12, 2023, false, 2460299);
      expect(lunarDate.toString()).toBe('30/12/2023');
    });
  });

  describe('isValid()', () => {
    it('should return true for valid dates', () => {
      const validDates = [
        new LunarDate(1, 1, 2024, false, 2460301),
        new LunarDate(15, 8, 2024, false, 2460532),
        new LunarDate(30, 12, 2023, false, 2460299),
        new LunarDate(29, 2, 2024, false, 2460360) // Leap year
      ];

      validDates.forEach(date => {
        expect(date.isValid()).toBe(true);
      });
    });

    it('should return false for invalid dates', () => {
      const invalidDates = [
        new LunarDate(0, 1, 2024, false, 2460301),
        new LunarDate(1, 0, 2024, false, 2460301),
        new LunarDate(1, 1, 0, false, 2460301),
        new LunarDate(0, 0, 0, false, 0)
      ];

      invalidDates.forEach(date => {
        expect(date.isValid()).toBe(false);
      });
    });

    it('should handle leap month validity correctly', () => {
      const leapMonthDate = new LunarDate(15, 4, 2024, true, 2460430);
      expect(leapMonthDate.isValid()).toBe(true);

      const invalidLeapDate = new LunarDate(0, 4, 2024, true, 2460415);
      expect(invalidLeapDate.isValid()).toBe(false);
    });
  });

  describe('equals()', () => {
    it('should return true for identical dates', () => {
      const date1 = new LunarDate(15, 8, 2024, false, 2460532);
      const date2 = new LunarDate(15, 8, 2024, false, 2460532);

      expect(date1.equals(date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new LunarDate(15, 8, 2024, false, 2460532);
      const date2 = new LunarDate(16, 8, 2024, false, 2460533);

      expect(date1.equals(date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new LunarDate(15, 8, 2024, false, 2460532);
      const date2 = new LunarDate(15, 9, 2024, false, 2460562);

      expect(date1.equals(date2)).toBe(false);
    });

    it('should return false for different years', () => {
      const date1 = new LunarDate(15, 8, 2024, false, 2460532);
      const date2 = new LunarDate(15, 8, 2023, false, 2460167);

      expect(date1.equals(date2)).toBe(false);
    });

    it('should return false for different leap status', () => {
      const date1 = new LunarDate(15, 4, 2024, false, 2460430);
      const date2 = new LunarDate(15, 4, 2024, true, 2460430);

      expect(date1.equals(date2)).toBe(false);
    });

    it('should return false for completely different dates', () => {
      const date1 = new LunarDate(1, 1, 2024, false, 2460301);
      const date2 = new LunarDate(30, 12, 2023, false, 2460299);

      expect(date1.equals(date2)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum values', () => {
      const maxDate = new LunarDate(30, 12, 2199, true, 2524619);
      expect(maxDate.day).toBe(30);
      expect(maxDate.month).toBe(12);
      expect(maxDate.year).toBe(2199);
      expect(maxDate.leap).toBe(true);
    });

    it('should handle minimum values', () => {
      const minDate = new LunarDate(1, 1, 1200, false, 2160000);
      expect(minDate.day).toBe(1);
      expect(minDate.month).toBe(1);
      expect(minDate.year).toBe(1200);
      expect(minDate.leap).toBe(false);
    });

    it('should handle negative Julian Day', () => {
      const date = new LunarDate(1, 1, 2024, false, -1000);
      expect(date.jd).toBe(-1000);
      expect(date.isValid()).toBe(true); // day/month/year are still valid
    });
  });

  describe('Property Access', () => {
    it('should allow direct property access', () => {
      const lunarDate = new LunarDate(15, 8, 2024, false, 2460532);

      expect(lunarDate.day).toBe(15);
      expect(lunarDate.month).toBe(8);
      expect(lunarDate.year).toBe(2024);
      expect(lunarDate.leap).toBe(false);
      expect(lunarDate.jd).toBe(2460532);
    });

    it('should allow property modification (if needed)', () => {
      const lunarDate = new LunarDate(15, 8, 2024, false, 2460532);

      lunarDate.day = 16;
      expect(lunarDate.day).toBe(16);

      lunarDate.month = 9;
      expect(lunarDate.month).toBe(9);

      lunarDate.year = 2025;
      expect(lunarDate.year).toBe(2025);

      lunarDate.leap = true;
      expect(lunarDate.leap).toBe(true);
    });
  });
});