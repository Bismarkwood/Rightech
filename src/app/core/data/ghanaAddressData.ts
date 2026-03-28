import { GhanaRegion, GhanaArea } from '../types/address';

export const GHANA_REGIONS: GhanaRegion[] = [
  {
    name: 'Greater Accra',
    cities: ['Accra', 'Tema', 'Madina', 'Adenta', 'Ashiaman', 'Teshie', 'Nungua', 'Achimota']
  },
  {
    name: 'Ashanti',
    cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Konongo', 'Mampong']
  },
  {
    name: 'Central',
    cities: ['Cape Coast', 'Winneba', 'Kasoa', 'Elmina']
  },
  {
    name: 'Western',
    cities: ['Sekondi-Takoradi', 'Tarkwa', 'Axim']
  },
  {
    name: 'Eastern',
    cities: ['Koforidua', 'Nkawkaw', 'Nsawam']
  },
  {
    name: 'Northern',
    cities: ['Tamale']
  },
  {
    name: 'Volta',
    cities: ['Ho', 'Hohoe', 'Keta']
  }
];

export const KNOWN_AREAS: GhanaArea[] = [
  // Accra Areas
  { name: 'Adenta Housing', city: 'Adenta', region: 'Greater Accra' },
  { name: 'Adenta SSNIT', city: 'Adenta', region: 'Greater Accra' },
  { name: 'Atomic Junction', city: 'Accra', region: 'Greater Accra' },
  { name: 'Cantonments', city: 'Accra', region: 'Greater Accra' },
  { name: 'East Legon', city: 'Accra', region: 'Greater Accra' },
  { name: 'Spintex Road', city: 'Accra', region: 'Greater Accra' },
  { name: 'Madina Market', city: 'Madina', region: 'Greater Accra' },
  { name: 'Lapaz', city: 'Accra', region: 'Greater Accra' },
  { name: 'Achimota', city: 'Achimota', region: 'Greater Accra' },
  { name: 'Lakeside Estate', city: 'Accra', region: 'Greater Accra' },
  { name: 'Oyarifa', city: 'Accra', region: 'Greater Accra' },
  { name: 'Adjiringanor', city: 'Accra', region: 'Greater Accra' },
  
  // Tema Communities
  { name: 'Tema Community 1', city: 'Tema', region: 'Greater Accra' },
  { name: 'Tema Community 2', city: 'Tema', region: 'Greater Accra' },
  { name: 'Tema Community 3', city: 'Tema', region: 'Greater Accra' },
  { name: 'Tema Community 25', city: 'Tema', region: 'Greater Accra' },
  
  // Kumasi Areas
  { name: 'Ahodwo', city: 'Kumasi', region: 'Ashanti' },
  { name: 'Adum', city: 'Kumasi', region: 'Ashanti' },
  { name: 'Bantama', city: 'Kumasi', region: 'Ashanti' },
  { name: 'Asokwa', city: 'Kumasi', region: 'Ashanti' }
];
