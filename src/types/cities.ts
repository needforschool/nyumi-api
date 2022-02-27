import { Country } from "./countries";

export type City = {
  id: string;
  country: Country;
  slug: string;
  name: string;
};
