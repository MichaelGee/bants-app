const SECOND = 1e3;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export const STALE = {
  SECONDS: {
    FIFTEEN: 15 * SECOND,
    THIRTY: 30 * SECOND,
  },
  MINUTES: {
    ONE: MINUTE,
    THREE: 3 * MINUTE,
    FIVE: 5 * MINUTE,
    TEN: 10 * MINUTE,
    FIFTEEN: 15 * MINUTE,
    TWENTY: 20 * MINUTE,
    THIRTY: 30 * MINUTE,
  },
  HOURS: {
    ONE: HOUR,
    THREE: 3 * HOUR,
    SIX: 6 * HOUR,
    TWELVE: 12 * HOUR,
    TWENTY_FOUR: 24 * HOUR,
  },
  INFINITY: Infinity,
};
