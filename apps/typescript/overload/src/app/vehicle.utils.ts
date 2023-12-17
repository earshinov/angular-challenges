type Fuel = 'diesel' | 'petrol' | 'electric';

interface Bicycle {
  type: 'bicycle';
}

interface Car {
  fuel: Fuel;
  type: 'car';
}

interface Moto {
  fuel: Fuel;
  type: 'moto';
}

interface Bus {
  capacity: number;
  isPublicTransport: boolean;
  type: 'bus';
}

interface Boat {
  capacity: number;
  type: 'boat';
}

type VehicleType = 'bus' | 'car' | 'moto' | 'bicycle' | 'boat';

type Vehicles<K extends VehicleType> =
  // prettier-ignore
  K extends 'bus' ? Bus :
  K extends 'car' ? Car :
  K extends 'moto' ? Moto :
  K extends 'bicycle' ? Bicycle :
  K extends 'boat' ? Boat :
  never;

type Vehicle = Vehicles<VehicleType>;

export function createVehicle<K extends VehicleType & string>(
  type: K,
  fuel?: Fuel,
  capacity?: number,
  isPublicTransport?: boolean,
): Vehicles<K>;
export function createVehicle<K extends VehicleType & string>(
  type: K,
  fuel?: Fuel,
  capacity?: number,
  isPublicTransport?: boolean,
): Vehicle {
  switch (type) {
    case 'bicycle':
      return { type } satisfies Bicycle;
    case 'car':
      if (!fuel) throw new Error(`fuel property is missing for type ${type}`);
      return { fuel, type } satisfies Car;
    case 'moto':
      if (!fuel) throw new Error(`fuel property is missing for type ${type}`);
      return { fuel, type } satisfies Moto;
    case 'boat':
      if (!capacity)
        throw new Error(`capacity property is missing for type boat`);
      return { capacity, type } satisfies Boat;
    case 'bus':
      if (!capacity)
        throw new Error(`capacity property is missing for type bus`);
      if (!isPublicTransport)
        throw new Error(`isPublicTransport property is missing for type bus`);
      return { capacity, isPublicTransport, type } satisfies Bus;
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _typecheck: never = type;
      throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}
