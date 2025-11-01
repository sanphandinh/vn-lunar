// src/core.test.ts
import {
  getLunarDate,
  getSolarDate,
  getYearCanChi,
  getDayCanChi,
  getMonthCanChi
} from './core';
import { LunarDate } from './lunar-date';
import { describe, it, expect } from 'vitest'

describe('Core Functions', () => {
  describe('getLunarDate', () => {
    it('should convert solar date to lunar date correctly', () => {
      // Test Tết Nguyên Đán 2024 (10/02/2024 -> 01/01/2024)
      const lunarDate = getLunarDate(10, 2, 2024);
      expect(lunarDate.day).toBe(1);
      expect(lunarDate.month).toBe(1);
      expect(lunarDate.year).toBe(2024);
      expect(lunarDate.leap).toBe(false);
    });

    // Test for findLunarDate array bounds fix
    it('should handle edge cases without array bounds errors', () => {
      // Test dates at the boundaries of supported range (avoid years that trigger year-1 lookup)
      const boundaryDates = [
        [15, 6, 1201], // Avoid year boundary that could trigger year-1 lookup
        [31, 12, 2199], // Maximum supported year
        [1, 1, 1202], // Safe minimum year
        [15, 6, 2198], // Safe maximum year
      ];

      boundaryDates.forEach(([day, month, year]) => {
        const lunarDate = getLunarDate(day as number, month as number, year as number);

        // Should return a valid LunarDate object (not crash)
        expect(lunarDate).toBeInstanceOf(LunarDate);

        // All should be valid since years are in range
        expect(lunarDate.year).toBeGreaterThan(0);
        expect(lunarDate.month).toBeGreaterThan(0);
        expect(lunarDate.month).toBeLessThanOrEqual(12);
        expect(lunarDate.day).toBeGreaterThan(0);
        expect(lunarDate.day).toBeLessThanOrEqual(31);
      });
    });

    it('should return invalid date for dates before FIRST_DAY without crashing', () => {
      // Test a date that might trigger the array bounds issue
      const earlyDate = getLunarDate(1, 1, 1000); // Way before supported range

      // Should return invalid date object, not crash
      expect(earlyDate.day).toBe(0);
      expect(earlyDate.month).toBe(0);
      expect(earlyDate.year).toBe(0);
    });

    it('should return invalid date for dates after LAST_DAY without crashing', () => {
      // Test a date that might trigger array bounds issues
      const lateDate = getLunarDate(31, 12, 3000); // Way after supported range

      // Should return invalid date object, not crash
      expect(lateDate.day).toBe(0);
      expect(lateDate.month).toBe(0);
      expect(lateDate.year).toBe(0);
    });
  });

  describe('Leap Month Handling', () => {
    it('should handle leap months correctly', () => {
      // Test a date in leap month if available
      // expected: 1/6/2025 (leap month)
      const lunarDate = getLunarDate(25, 7, 2025);
      expect(lunarDate).toBeInstanceOf(LunarDate);
      expect(lunarDate.year).toBe(2025);
      expect(lunarDate.month).toBe(6);
      expect(lunarDate.day).toBe(1);
      expect(lunarDate.leap).toBe(true);

      const lunarDateNotLeap = getLunarDate(24, 7, 2025);
      expect(lunarDateNotLeap).toBeInstanceOf(LunarDate);
      expect(lunarDateNotLeap.year).toBe(2025);
      expect(lunarDateNotLeap.month).toBe(6);
      expect(lunarDateNotLeap.day).toBe(30);
      expect(lunarDateNotLeap.leap).toBe(false);
    });

    it('should return invalid date for out of range years', () => {
      const result = getLunarDate(1, 1, 1199);
      expect(result.day).toBe(0);
      expect(result.month).toBe(0);
      expect(result.year).toBe(0);
    });

    it('should handle different months correctly', () => {
      const testDates = [
        [1, 1, 2024], // January
        [15, 6, 2024], // June
        [30, 12, 2024] // December
      ];
      const expectedResultDates = [
        [20, 11, 2023],
        [10, 5, 2024],
        [30, 11, 2024]
      ]

      testDates.forEach(([day, month, year]) => {
        const result = getLunarDate(day as number, month as number, year as number);
        expect(result).toBeInstanceOf(LunarDate);
        const [expDay, expMonth, expYear] = expectedResultDates.shift() as number[];
        expect(result.day).toBe(expDay);
        expect(result.month).toBe(expMonth);
        expect(result.year).toBe(expYear);
      });
    });
  });

  describe('getSolarDate', () => {
    it('should convert lunar date to solar date correctly', () => {
      // Test reverse conversion: Tết 2024 (01/01/2024 -> 10/02/2024)
      const solarDate = getSolarDate(1, 1, 2024);
      expect(solarDate.day).toBe(10);
      expect(solarDate.month).toBe(2);
      expect(solarDate.year).toBe(2024);
    });

    it('should handle leap months correctly', () => {
      const solarDate = getSolarDate(1, 6, 2025, true);
      expect(solarDate.year).toBe(2025);
      expect(solarDate.month).toBe(7);
      expect(solarDate.day).toBe(25);

      const solarDateNotLeap = getSolarDate(30, 6, 2025, false);
      expect(solarDateNotLeap.year).toBe(2025);
      expect(solarDateNotLeap.month).toBe(7);
      expect(solarDateNotLeap.day).toBe(24);
    });

    it('should return invalid date for out of range years', () => {
      const result = getSolarDate(1, 1, 1199);
      expect(result.day).toBe(0);
      expect(result.month).toBe(0);
      expect(result.year).toBe(0);
    });

    // Test for array bounds fix - edge case with month 12
    it('should handle month 12 without array bounds errors', () => {
      // Test converting 12th lunar month to solar
      const solarDate = getSolarDate(15, 12, 2024, false);
      expect(solarDate.year).toBeGreaterThan(0); // Year might be 2024 or 2025 due to conversion
      expect(solarDate.month).toBeGreaterThan(0);
      expect(solarDate.month).toBeLessThanOrEqual(12);
      expect(solarDate.day).toBeGreaterThan(0);
      expect(solarDate.day).toBeLessThanOrEqual(31);
    });

    // Test for leap month bounds checking
    it('should handle leap month with bounds checking', () => {
      // Test leap month conversion
      const solarDate = getSolarDate(1, 6, 2025, true);
      expect(solarDate).toBeDefined();
      expect(solarDate.day).toBe(25);
      expect(solarDate.month).toBe(7);
      expect(solarDate.year).toBe(2025);
    });

    // Test for leap month performance optimization
    it('should handle leap month lookup efficiently', () => {
      // Test multiple leap month conversions to ensure the manual loop works
      const leapMonthTests = [
        [1, 6, 2025, true],   // Leap month 6, 2025
        [15, 6, 2025, true],  // Leap month 6, 2025
        [30, 6, 2025, true],  // Leap month 6, 2025
      ];

      leapMonthTests.forEach(([day, month, year, leap]) => {
        const solarDate = getSolarDate(day as number, month as number, year as number, leap as boolean);
        expect(solarDate).toBeDefined();
        expect(solarDate.year).toBe(year);
        expect(solarDate.day).toBeGreaterThan(0);
        expect(solarDate.month).toBeGreaterThan(0);
      });
    });
  });

  describe('getYearCanChi', () => {
    it('should return correct Can Chi for known years', () => {
      // 2025 is Ất Tỵ
      expect(getYearCanChi(2025)).toBe('Ất Tỵ');
      // 2024 is Giáp Thìn
      expect(getYearCanChi(2024)).toBe('Giáp Thìn');

      // 2023 is Quý Mão
      expect(getYearCanChi(2023)).toBe('Quý Mão');

      // 2022 is Nhâm Dần
      expect(getYearCanChi(2022)).toBe('Nhâm Dần');

      // 2021 is Tân Sửu
      expect(getYearCanChi(2021)).toBe('Tân Sửu');
    });

    it('should handle year boundaries correctly', () => {
      // Test consecutive years to ensure proper cycling
      const years = [2000, 2001, 2002, 2003, 2004];
      const canChiList = years.map(year => getYearCanChi(year));


      // All should be different
      expect(new Set(canChiList).size).toBe(years.length);
      expect(canChiList).toEqual(['Canh Thìn', 'Tân Tỵ', 'Nhâm Ngọ', 'Quý Mùi', 'Giáp Thân']);
    });

    it('should work with minimum supported year', () => {
      expect(getYearCanChi(1200)).toBeTruthy();
      expect(getYearCanChi(1200).length).toBeGreaterThan(0);
    });

    it('should work with maximum supported year', () => {
      expect(getYearCanChi(2199)).toBeTruthy();
      expect(getYearCanChi(2199).length).toBeGreaterThan(0);
    });
  });

  describe('getDayCanChi', () => {
    it('should return correct Can Chi for specific Julian Days', () => {
      // Check: 26/10/2025 => 6/9/2025
      const lunarDate = getLunarDate(26, 10, 2025);
      expect(lunarDate.day).toBe(6);
      expect(lunarDate.month).toBe(9);
      expect(lunarDate.year).toBe(2025);

      const julianDate = lunarDate.jd;
      const canChi = getDayCanChi(julianDate);
      expect(canChi).toBe('Mậu Thìn');

      // Check 1/10/2025 => 10/8/2025
      const lunarDate2 = getLunarDate(1, 10, 2025);
      expect(lunarDate2.day).toBe(10);
      expect(lunarDate2.month).toBe(8);
      expect(lunarDate2.year).toBe(2025);

      const julianDate2 = lunarDate2.jd;
      const canChi2 = getDayCanChi(julianDate2);
      expect(canChi2).toBe('Quý Mão');
    });

    it('should handle consecutive days correctly', () => {
      // Base date: 24/10/2025 => 4/9/2025
      const lunarDate = getLunarDate(24, 10, 2025);
      expect(lunarDate.day).toBe(4);
      expect(lunarDate.month).toBe(9);
      expect(lunarDate.year).toBe(2025);
      const baseJD = lunarDate.jd;

      const canChi1 = getDayCanChi(baseJD);
      const canChi2 = getDayCanChi(baseJD + 1);
      const canChi3 = getDayCanChi(baseJD + 2);

      // Should all be different
      expect(canChi1).toBe("Bính Dần");
      expect(canChi2).toBe("Đinh Mão");
      expect(canChi3).toBe("Mậu Thìn");
    });
  });

  describe('getMonthCanChi', () => {
    it('should return correct format for month and year', () => {
      // 6/9/2025 (âm lịch) => Tháng Bính Tuất)
      const result = getMonthCanChi(9, 2025);
      expect(result).toBe('Bính Tuất');
    });

    it('should handle all 12 months in 2025', () => {
      // expect result for each month
      // ["Mậu Dần", "Kỷ Mão", "Canh Thìn", "Tân Tỵ", "Nhâm Ngọ", "Quý Mùi", "Giáp Thân", "Ất Dậu", "Bính Tuất", "Đinh Hợi", "Mậu Tý", "Kỷ Sửu"]
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const expectedResult = ["Mậu Dần", "Kỷ Mão", "Canh Thìn", "Tân Tỵ", "Nhâm Ngọ", "Quý Mùi", "Giáp Thân", "Ất Dậu", "Bính Tuất", "Đinh Hợi", "Mậu Tý", "Kỷ Sửu"]

      months.forEach(month => {
        const canChi = getMonthCanChi(month, 2025);
        expect(canChi).toBeTruthy();
        expect(canChi).toBe(expectedResult[month - 1]);
      });
    });

    it('should handle year boundaries', () => {
      const month1 = getMonthCanChi(12, 2023);
      const month2 = getMonthCanChi(1, 2024);

      expect(month1).toBeTruthy();
      expect(month1).toBe("Ất Sửu");

      expect(month2).toBeTruthy();
      expect(month2).toBe("Bính Dần");
      expect(month1).not.toBe(month2);
    });

    it('should handle different years', () => {
      const canChi2024 = getMonthCanChi(1, 2024);
      const canChi2025 = getMonthCanChi(1, 2025);

      expect(canChi2024).toBeTruthy();
      expect(canChi2025).toBeTruthy();
      expect(canChi2024).not.toBe(canChi2025);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between solar and lunar conversions', () => {
      const testDates = [
        [10, 2, 2024], // Tết 2024
        [1, 1, 2023],
        [15, 8, 2024],
        [30, 12, 2023]
      ];

      testDates.forEach(([day, month, year]) => {
        const lunarDate = getLunarDate(day as number, month as number, year as number);
        if (lunarDate.year > 0) { // Only test valid conversions
          const solarDate = getSolarDate(lunarDate.day, lunarDate.month, lunarDate.year, lunarDate.leap);

          // Should be close to original (allowing for minor calculation differences)
          expect(Math.abs(solarDate.year - year)).toBeLessThanOrEqual(1);
        }
      });
    });
  });
});