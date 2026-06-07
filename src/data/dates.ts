const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const minDepartureMonth = (() => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return currentMonth < "2026-01" ? "2026-01" : currentMonth;
})();

const maxDepartureMonth = "2027-12";

export const departureMonthOptions = (() => {
  const start =
    minDepartureMonth > maxDepartureMonth
      ? maxDepartureMonth
      : minDepartureMonth;
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = maxDepartureMonth.split("-").map(Number);
  const options: Array<{ value: string; label: string }> = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const value = `${year}-${String(month).padStart(2, "0")}`;
    options.push({ value, label: `${monthNames[month - 1]} ${year}` });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return options;
})();