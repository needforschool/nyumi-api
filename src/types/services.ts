export type Service = {
  id: number;
  name: string;
  type: string;
  description: string;
  details: string;
  thumbnailUrl: string;
  startingPrice?: number;
  offers?: ServiceOffer[];
  countryVariable?: boolean;
  available: boolean;
  price: number;
  commission: number;
  requiredFields: ServiceRequiredField[];
};

export type ServiceOffer = {
  id: number;
  name: string;
  price: number;
  commission?: number;
};

type ServiceRequiredField = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "checkbox";
  options?: {
    values?: {
      name: string;
      label: string;
    }[];
    defaultValue?: string;
  };
};
