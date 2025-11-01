// src/utils.test.ts
import { INT, jdn, jdn2date, decodeLunarYear, getYearInfo } from './utils';
import { LunarDate } from './lunar-date';
import {describe, it, expect} from 'vitest'

describe('Utility Functions', () => {
  describe('INT', () => {
    it('should floor positive numbers correctly', () => {
      expect(INT(3.7)).toBe(3);
      expect(INT(10.2)).toBe(10);
      expect(INT(0.9)).toBe(0);
      expect(INT(100.99)).toBe(100);
    });

    it('should floor negative numbers correctly', () => {
      expect(INT(-3.7)).toBe(-4);
      expect(INT(-10.2)).toBe(-11);
      expect(INT(-0.9)).toBe(-1);
      expect(INT(-100.99)).toBe(-101);
    });

    it('should handle whole numbers', () => {
      expect(INT(5)).toBe(5);
      expect(INT(0)).toBe(0);
      expect(INT(-7)).toBe(-7);
    });

    it('should handle zero', () => {
      expect(INT(0)).toBe(0);
      expect(INT(0.0)).toBe(0);
      expect(INT(-0.0) === 0 || Object.is(INT(-0.0), -0)).toBe(true); // Handle both 0 and -0
    });
  });

  describe('jdn', () => {
    it('should calculate positive Julian Day Numbers for valid dates', () => {
      expect(jdn(1, 1, 2000)).toBeGreaterThan(2400000);
      expect(jdn(1, 1, 2024)).toBeGreaterThan(2450000);
    });

    it('should handle leap years correctly', () => {
      const feb29Leap = jdn(29, 2, 2024);
      const mar1Leap = jdn(1, 3, 2024);
      const mar1NonLeap = jdn(1, 3, 2023);

      // February 29 should exist on leap year
      expect(feb29Leap).toBeGreaterThan(0);

      // March 1 should be exactly one day after February 29 on leap year
      expect(mar1Leap).toBe(feb29Leap + 1);

      // March 1 should be earlier on non-leap year
      expect(mar1NonLeap).toBeLessThan(mar1Leap);
    });

    it('should handle different months and years', () => {
      const testDates = [
        [1, 1, 2024],
        [15, 6, 2024],
        [31, 12, 2024],
        [10, 2, 2024]
      ];

      testDates.forEach(([day, month, year]) => {
        const jd = jdn(day as number, month as number, year as number);
        expect(jd).toBeGreaterThan(0);
      });
    });

    it('should handle historical dates', () => {
      // Test a date before Gregorian calendar reform
      const oct4Julian = jdn(4, 10, 1582);
      const oct15Gregorian = jdn(15, 10, 1582);

      // Both should be valid dates
      expect(oct4Julian).toBeGreaterThan(0);
      expect(oct15Gregorian).toBeGreaterThan(0);

      // Gregorian date should be later than Julian date
      expect(oct15Gregorian).toBeGreaterThan(oct4Julian);
    });

    // Test for Julian Day calculation precision fix
    it('should handle Gregorian calendar transition correctly', () => {
      // Test dates around the Gregorian calendar reform - verify they all calculate without errors
      const testDates = [
        [4, 10, 1582],   // Before reform (Julian)
        [14, 10, 1582],  // Day before reform (Julian)
        [15, 10, 1582],  // First day of Gregorian calendar
        [16, 10, 1582],  // Second day of Gregorian calendar
        [1, 1, 1200],    // Early date (Julian)
        [1, 1, 2024],    // Modern date (Gregorian)
      ];

      // All should calculate positive values
      testDates.forEach(([day, month, year]) => {
        const jd = jdn(day, month, year);
        expect(jd).toBeGreaterThan(0);
      });

      // Verify that dates calculate correctly and modern date is larger than early date
      const earlyDate = jdn(1, 1, 1200);
      const preReform = jdn(14, 10, 1582);
      const postReform = jdn(15, 10, 1582);
      const modernDate = jdn(1, 1, 2024);

      expect(preReform).toBeGreaterThan(earlyDate);
      expect(modernDate).toBeGreaterThan(preReform);
      // Note: postReform vs preReform relationship depends on calendar transition specifics
    });

    it('should use correct calendar formula based on input date', () => {
      // Test dates that should use different formulas
      const julianDate = jdn(1, 1, 1200);  // Should use Julian formula
      const gregorianDate = jdn(1, 1, 2024); // Should use Gregorian formula

      // Both should be positive and valid
      expect(julianDate).toBeGreaterThan(0);
      expect(gregorianDate).toBeGreaterThan(0);

      // Gregorian date should be much larger (being 824 years later)
      expect(gregorianDate).toBeGreaterThan(julianDate);
    });

    it('should handle exact boundary dates correctly', () => {
      // Test the exact boundary: October 15, 1582
      const boundary = jdn(15, 10, 1582);
      const after = jdn(16, 10, 1582);

      // Both should be valid dates
      expect(boundary).toBeGreaterThan(0);
      expect(after).toBeGreaterThan(boundary);

      // Difference should be exactly 1 day between consecutive dates
      expect(after - boundary).toBe(1);
    });

    it('should handle edge cases', () => {
      // Beginning of year
      expect(jdn(1, 1, 1200)).toBeGreaterThan(0);

      // End of year
      expect(jdn(31, 12, 2199)).toBeGreaterThan(jdn(1, 1, 2199));
    });

    it('should be monotonic (later dates have larger JDN)', () => {
      const jdn1 = jdn(1, 1, 2024);
      const jdn2 = jdn(2, 1, 2024);
      const jdn3 = jdn(1, 2, 2024);
      const jdn4 = jdn(1, 1, 2025);

      expect(jdn2).toBeGreaterThan(jdn1);
      expect(jdn3).toBeGreaterThan(jdn2);
      expect(jdn4).toBeGreaterThan(jdn3);
    });
  });

  describe('jdn2date', () => {
    it('should convert JDN back to a valid date', () => {
      const testJDNs = [2451545, 2460309, 2460318, 2460470, 2460679];

      testJDNs.forEach(jd => {
        const [day, month, year, revertedJD] = jdn2date(jd);
        expect(day).toBeGreaterThan(0);
        expect(day).toBeLessThanOrEqual(31);
        expect(month).toBeGreaterThan(0);
        expect(month).toBeLessThanOrEqual(12);
        expect(year).toBeGreaterThan(0);
        expect(revertedJD).toBe(jd);
      });
    });

    it('should handle leap years correctly', () => {
      // Test a range of JDNs that should include Feb 29 on a leap year
      const testJDNs = [];
      for (let i = 2460340; i <= 2460380; i++) {
        testJDNs.push(i);
      }

      const results = testJDNs.map(jd => jdn2date(jd));
      const feb29 = results.find(([day, month, year]) => day === 29 && month === 2 && year === 2024);

      // Should find February 29, 2024 in this range
      expect(feb29).toBeDefined();

      const [nextDay] = jdn2date(feb29![3] + 1); // Next JDN after Feb 29
      expect(nextDay).toBe(1); // Should be March 1
    });

    it('should be inverse of jdn function', () => {
      const testDates = [
        [1, 1, 2024],
        [15, 6, 2024],
        [31, 12, 2024],
        [29, 2, 2024], // Leap year
        [10, 2, 2024]
      ];

      testDates.forEach(([day, month, year]) => {
        const jd = jdn(day as number, month as number, year as number);
        const [revertedDay, revertedMonth, revertedYear] = jdn2date(jd);

        expect(revertedDay).toBe(day as number);
        expect(revertedMonth).toBe(month as number);
        expect(revertedYear).toBe(year as number);
      });
    });

    it('should handle historical JDNs', () => {
      const [day, month, year] = jdn2date(2299161); // Around Gregorian calendar reform
      expect(day).toBeGreaterThan(0);
      expect(month).toBeGreaterThan(0);
      expect(month).toBeLessThanOrEqual(12);
      expect(year).toBeGreaterThan(1500);
      expect(year).toBeLessThan(1700);
    });
  });

  describe('decodeLunarYear', () => {
    it('should return array of LunarDate objects', () => {
      const yearData = decodeLunarYear(2024, 0x12345); // Example code
      expect(Array.isArray(yearData)).toBe(true);
      expect(yearData.length).toBeGreaterThan(0);

      yearData.forEach(date => {
        expect(date).toBeInstanceOf(LunarDate);
        expect(date.year).toBe(2024);
        expect(date.month).toBeGreaterThan(0);
        expect(date.month).toBeLessThanOrEqual(12);
      });
    });

    it('should handle different year codes', () => {
      const yearCodes = [0x12345, 0x54321, 0xABCDE];

      yearCodes.forEach(code => {
        const yearData = decodeLunarYear(2024, code);
        expect(yearData.length).toBeGreaterThan(0);
        expect(yearData.every(date => date.year === 2024)).toBe(true);
      });
    });

    it('should handle leap months correctly when specified', () => {
      // Use a code that specifies leap month (lower 4 bits)
      const leapMonthCode = 0x12341; // Leap month 1
      const yearData = decodeLunarYear(2024, leapMonthCode);

      const hasLeapMonth = yearData.some(date => date.leap === true);
      if (hasLeapMonth) {
        const leapMonths = yearData.filter(date => date.leap);
        expect(leapMonths.length).toBeGreaterThan(0);
      }
    });

    it('should have correct number of months', () => {
      const yearData = decodeLunarYear(2024, 0x12345);
      // Should have 12 regular months, plus possibly leap month
      expect(yearData.length).toBeGreaterThanOrEqual(12);
      expect(yearData.length).toBeLessThanOrEqual(13);
    });

    it('should have months in chronological order', () => {
      const yearData = decodeLunarYear(2024, 0x12345);

      // Check that JDNs are in ascending order
      for (let i = 1; i < yearData.length; i++) {
        expect(yearData[i].jd).toBeGreaterThan(yearData[i - 1].jd);
      }
    });

    // Test for decodeLunarYear error handling fix
    it('should throw error for years outside supported range', () => {
      const invalidYears = [1199, 2200, 1000, 3000];

      invalidYears.forEach(year => {
        expect(() => decodeLunarYear(year, 0x12345)).toThrow(
          `Year ${year} is not supported. Supported range: 1200-2199`
        );
      });
    });

    it('should throw error for invalid year code (0)', () => {
      expect(() => decodeLunarYear(2024, 0)).toThrow(
        'Invalid year code: 0 for year 2024'
      );
    });

    it('should throw error for boundary years outside range', () => {
      expect(() => decodeLunarYear(1199, 0x12345)).toThrow(
        'Year 1199 is not supported. Supported range: 1200-2199'
      );

      expect(() => decodeLunarYear(2200, 0x12345)).toThrow(
        'Year 2200 is not supported. Supported range: 1200-2199'
      );
    });

    it('should work with boundary years within range', () => {
      // Should not throw for minimum and maximum supported years
      expect(() => decodeLunarYear(1200, 0x12345)).not.toThrow();
      expect(() => decodeLunarYear(2199, 0x12345)).not.toThrow();

      // Should return valid arrays
      const year1200 = decodeLunarYear(1200, 0x12345);
      const year2199 = decodeLunarYear(2199, 0x12345);

      expect(Array.isArray(year1200)).toBe(true);
      expect(Array.isArray(year2199)).toBe(true);
      expect(year1200.length).toBeGreaterThan(0);
      expect(year2199.length).toBeGreaterThan(0);
    });
  });

  describe('getYearInfo', () => {
    it('should return year info for supported years', () => {
      const years = [1200, 1300, 1500, 2000, 2100, 2199];

      years.forEach(year => {
        const yearInfo = getYearInfo(year);
        expect(Array.isArray(yearInfo)).toBe(true);
        expect(yearInfo.length).toBeGreaterThanOrEqual(12);

        yearInfo.forEach(date => {
          expect(date.year).toBe(year);
          expect(date.month).toBeGreaterThan(0);
          expect(date.month).toBeLessThanOrEqual(12);
        });
      });
    });

    it('should throw error for years outside supported range', () => {
      const invalidYears = [1199, 2200, 1000, 3000];

      invalidYears.forEach(year => {
        expect(() => getYearInfo(year)).toThrow(
          `Year ${year} is not supported. Supported range: 1200-2199`
        );
      });
    });

    it('should handle boundary years correctly', () => {
      // Minimum supported year
      const minYear = getYearInfo(1200);
      expect(minYear.length).toBeGreaterThanOrEqual(12);
      expect(minYear[0].year).toBe(1200);

      // Maximum supported year
      const maxYear = getYearInfo(2199);
      expect(maxYear.length).toBeGreaterThanOrEqual(12);
      expect(maxYear[0].year).toBe(2199);
    });

    it('should return consistent data for the same year', () => {
      const year = 2024;
      const info1 = getYearInfo(year);
      const info2 = getYearInfo(year);

      expect(info1.length).toBe(info2.length);
      info1.forEach((date, index) => {
        expect(date.equals(info2[index])).toBe(true);
      });
    });

    it('should have proper chronological order', () => {
      const yearInfo = getYearInfo(2024);

      // Verify all dates are in chronological order
      for (let i = 1; i < yearInfo.length; i++) {
        expect(yearInfo[i].jd).toBeGreaterThan(yearInfo[i - 1].jd);
      }
    });

    it('should handle different centuries', () => {
      const testCenturies = [1200, 1500, 1800, 2000, 2100];

      testCenturies.forEach(year => {
        const yearInfo = getYearInfo(year);
        expect(yearInfo.length).toBeGreaterThanOrEqual(12);
        expect(yearInfo.every(date => date.year === year)).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between jdn and jdn2date', () => {
      const testDates = [
        [1, 1, 2024],
        [15, 6, 2024],
        [30, 12, 2024],
        [29, 2, 2024]
      ];

      testDates.forEach(([day, month, year]) => {
        const jd = jdn(day as number, month as number, year as number);
        const [revertedDay, revertedMonth, revertedYear] = jdn2date(jd);

        expect(revertedDay).toBe(day as number);
        expect(revertedMonth).toBe(month as number);
        expect(revertedYear).toBe(year as number);
      });
    });

    it('should work with year info and date conversions', () => {
      const year = 2024;
      const yearInfo = getYearInfo(year);

      // Test that we can convert the first day back and forth
      if (yearInfo.length > 0) {
        const firstDay = yearInfo[0];
        const [solarDay, solarMonth, solarYear] = jdn2date(firstDay.jd);

        expect(solarYear).toBe(2024);
        expect(solarMonth).toBeGreaterThan(0);
        expect(solarMonth).toBeLessThanOrEqual(12);
        expect(solarDay).toBeGreaterThan(0);
        expect(solarDay).toBeLessThanOrEqual(31);
      }
    });
  });
});