export type Phone = { p1: string; p2: string; p3: string };

export type Address = {
  shippingName: string;
  receiver: string;
  postcode: string;
  roadAddr: string;
  detailAddr: string;
  isDefault: boolean;
  request: string;
  phone: Phone;
};

export type AddressHandlers = {
  onChangeShippingName: (v: string) => void;
  onChangeReceiver: (v: string) => void;
  onChangePostcode: (v: string) => void;
  onChangeRoadAddr: (v: string) => void;
  onChangeDetailAddr: (v: string) => void;
  onChangeIsDefault: (v: boolean) => void;
  onChangeRequest: (v: string) => void;
  onChangePhone: (updater: (prev: Phone) => Phone) => void;
  onOpenPostcode: () => void;
};
