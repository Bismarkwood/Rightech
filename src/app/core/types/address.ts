export interface GhanaAddress {
  region: string;
  city: string;
  area: string;
  landmark: string;
  instructions?: string;
  contactName?: string;
  contactPhone: string;
}

export type GhanaRegion = {
  name: string;
  cities: string[];
};

export type GhanaArea = {
  name: string;
  city: string;
  region: string;
};
