export function getTimeToSchedule(text) {
  const matches = text.match(/^\d{2}\:\d{2}/);

  if (!matches) {
    return null;
  }

  const timeParts = matches[0].split(':');
  const hours = timeParts[0];
  const minutes = timeParts[1];

  if (hours < 0 || hours > 23) {
    return null;
  }

  if (minutes < 0 || minutes > 59) {
    return null;
  }

  return matches[0];
}
