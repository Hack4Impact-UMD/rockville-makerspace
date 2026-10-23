export function blankToNull(cell: string): string | null {
  const trimmed = cell.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed;
}

// TODO: eastern time might matter for expiry
// dates are treated as UTC
export function parseMyTurnDate(date: string): number | null {
  if (blankToNull(date) === null) {
    return null;
  }

  const splitDate = date.trim().split("/");
  if (splitDate.length !== 3) {
    return null;
  }

  const dateNums: number[] = [];
  for (const num of splitDate) {
    if (Number.isInteger(Number(num)) && Number(num) > 0) {
      dateNums.push(Number(num));
    } else {
      return null;
    }
  }

  const [month, day, year] = dateNums;
  if (year === undefined || month === undefined || day === undefined) {
    return null;
  }

  const formatted = Date.UTC(year, month - 1, day);

  const dateFromFormatted = new Date(formatted);
  if (
    dateFromFormatted.getUTCFullYear() !== year ||
    dateFromFormatted.getUTCMonth() !== month - 1 ||
    dateFromFormatted.getUTCDate() !== day
  ) {
    return null;
  }

  return formatted;
}
