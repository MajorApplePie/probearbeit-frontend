export interface AddressResponse {
  addresses: AddressEntry[];
}

export interface AddressEntry {
  address: string;
  final_balance: number;
}
