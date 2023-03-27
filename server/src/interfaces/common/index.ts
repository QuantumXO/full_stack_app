export type ClassType = { new(...args: any[]): any; };

export type ValueOf<T> = T[keyof T];