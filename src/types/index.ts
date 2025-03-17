export interface Coupon {
    _id: string;
    code: string;
    isActive: boolean;
    isUsed: boolean;
    claimedBy?: {
        ip: string;
        sessionId: string;
        claimedAt: Date;
    };
    expiryDate: Date;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Admin {
    id: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ApiResponse<T> {
    message: string;
    data?: T;
    error?: string;
} 