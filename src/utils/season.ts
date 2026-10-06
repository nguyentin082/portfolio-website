export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// Meteorological seasons (Northern Hemisphere)
export const detectSeason = (date: Date = new Date()): Season => {
    const month = date.getMonth(); // 0 = Jan
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};

export const applySeason = (season: Season) => {
    document.documentElement.dataset.season = season;
};
