import type { House } from "./_components/house-card";

export interface HousingFilters {
  minRent: string;
  maxRent: string;
  startDate: string;
  semester: string;
  location: string;
  distance: string;
}

function parsePriceNumber(rent?: string): number | null {
  if (!rent) return null;
  const numStr = rent.replace(/[^0-9.]/g, "");
  if (!numStr) return null;
  const n = Number(numStr);
  return Number.isFinite(n) ? n : null;
}

function parseRentRange(rent?: string): { min: number | null; max: number | null } {
  if (!rent) return { min: null, max: null };

  const parts = rent.split('-').map((s) => s.trim());

  if (parts.length === 2) {
    const minVal = parsePriceNumber(parts[0]);
    const maxVal = parsePriceNumber(parts[1]);
    return { min: minVal, max: maxVal };
  } else {
    const val = parsePriceNumber(rent);
    return { min: val, max: val };
  }
}

function getSemesterFromDate(dateString?: string) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return null;
  const month = parsed.getMonth() + 1;
  if (month >= 1 && month <= 4) return "Spring";
  if (month >= 5 && month <= 8) return "Summer";
  return "Fall";
}

export function filterHouses(listings: House[], filters: HousingFilters) {
  return listings.filter((house) => {
    const { min: rentMin, max: rentMax } = parseRentRange(house.monthly_rent);

    if (filters.minRent !== "") {
      const minRent = Number(filters.minRent);
      if (!Number.isNaN(minRent) && rentMin !== null && rentMin < minRent) return false;
    }

    if (filters.maxRent !== "") {
      const maxRent = Number(filters.maxRent);
      if (!Number.isNaN(maxRent) && rentMax !== null && rentMax > maxRent) return false;
    }

    if (filters.startDate && house.move_in_date) {
      const filterDate = new Date(filters.startDate);
      const moveIn = new Date(house.move_in_date);
      if (!Number.isNaN(filterDate.getTime()) && !Number.isNaN(moveIn.getTime()) && moveIn < filterDate) {
        return false;
      }
    }

    if (filters.semester) {
      const houseSemester = getSemesterFromDate(house.move_in_date);
      if (houseSemester && filters.semester !== "Any" && houseSemester !== filters.semester) {
        return false;
      }
    }

    if (filters.location) {
      const text = `${house.address ?? ""} ${house.city ?? ""}`.toLowerCase();
      if (!text.includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    if (filters.distance && !Number.isNaN(Number(filters.distance))) {
    }

    return true;
  });
}
