export interface Parking {
    id: string;
    name: string;
    address: string;
    totalSpaces: number;
    availableSpaces: number;
    pricePerHour: number;
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ParkingSpace {
    id: string;
    parkingId: string;
    number: string;
    isAvailable: boolean;
    type: 'standard' | 'handicap' | 'electric';
    currentReservation?: Reservation;
}

export interface Reservation {
    id: string;
    parkingSpaceId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
} 