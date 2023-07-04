export class FarmModel {
  id: string;

  workers?: string[];

  dealer: string | null;

  owner: string;

  name: string;

  city: string;

  longitude: number;

  latitude: number;

  timezone: string;
}
