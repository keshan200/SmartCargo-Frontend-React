import type { Hub } from "../types/Hubs";
import type { UserRoleType } from "../types/User";


export const MOCK_HUBS: Hub[] = [
  {
    _id: "69d7cdf69705111aa65ebc69",
    hub_name: "Colombo Central Hub",
    city: "Colombo 01",
    address: "No. 1, Main Street, Colombo 01",
    contact_no: "0112345601",
    latitude: 6.9271,
    longitude: 79.8612,
  },
  {
    _id: "69d7cdf69705111aa65ebc70",
    hub_name: "Kandy Distribution Hub",
    city: "Kandy",
    address: "No. 2, Peradeniya Road, Kandy",
    contact_no: "0812345602",
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    _id: "69d7cdf69705111aa65ebc71",
    hub_name: "Galle Southern Hub",
    city: "Galle",
    address: "No. 3, Matara Road, Galle",
    contact_no: "0912345603",
    latitude: 6.0535,
    longitude: 80.2210,
  },
  {
    _id: "69d7cdf69705111aa65ebc72",
    hub_name: "Negombo North Hub",
    city: "Negombo",
    address: "No. 4, Colombo Road, Negombo",
    contact_no: "0312345604",
    latitude: 7.2081,
    longitude: 79.8358,
  },
  {
    _id: "69d7cdf69705111aa65ebc73",
    hub_name: "Jaffna Hub",
    city: "Jaffna",
    address: "No. 5, Hospital Road, Jaffna",
    contact_no: "0212345605",
    latitude: 9.6615,
    longitude: 80.0255,
  },
];

export const EMPLOYEE_ROLES: UserRoleType[] = ["DISPATCHER", "DRIVER"];