import { City } from "./cities";
import { Service, ServiceOffer } from "./services";
import { User } from "./users";

export type Trip = {
  id: string;
  user: User;
  city: City;
  state: string;
  previousState: string;
  services: TripService[];
  totalPrice: number;
  date: TripDate;
};

type TripDate = {
  creation: string;
  start: string;
  end: string;
};

export type TripService = {
  id: string;
  trip: string;
  state: string;
  previousState: string;
  fields?: string;
  selectedOffer?: ServiceOffer;
  totalPrice: number;
  service: Service;
};
