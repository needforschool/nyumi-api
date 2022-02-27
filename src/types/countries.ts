import { Region } from "./regions";

export type Country = {
  id: string;
  slug: string;
  name: string;
  iso2: string;
  iso3: string;
  long: number;
  lat: number;
  region: Region;
  services: CountryService[];
  description: string;
  thumbnailUrl: string;
  createdAt: string;
};

export type CountryService = {
  serviceId: number;
  serviceName: string;
  price: number;
};
