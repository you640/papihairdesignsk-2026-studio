
export interface OpeningStatus {
  isOpen: boolean;
  text: string;
}

// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const openingHours: { [day: number]: { open: number, close: number } | null } = {
  1: { open: 8, close: 17 }, // Monday
  2: { open: 8, close: 17 }, // Tuesday
  3: { open: 8, close: 17 }, // Wednesday
  4: { open: 8, close: 17 }, // Thursday
  5: { open: 8, close: 17 }, // Friday
  6: null, // Saturday
  0: null, // Sunday
};

export const getOpeningStatus = (dictionary: any): OpeningStatus => {
  if (!dictionary) return { isOpen: false, text: '' };
  
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const todaysHours = openingHours[day];

  if (!todaysHours) {
    return { isOpen: false, text: dictionary.currently_closed };
  }

  const currentTimeInHours = hours + minutes / 60;

  if (currentTimeInHours >= todaysHours.open && currentTimeInHours < todaysHours.close) {
    return { isOpen: true, text: dictionary.currently_open };
  }

  return { isOpen: false, text: dictionary.currently_closed };
};
