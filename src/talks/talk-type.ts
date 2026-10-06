export type Talk = {
  conference: string;
  name: string;
  date: string;
  location: string;
  region: 'USA' | 'Europe' | 'Asia' | 'Virtual';
  video?: string;
  slides?: string;
  repo?: string;
  flag?: string;
};
