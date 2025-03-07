declare module 'react-native-bcrypt' {
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hash(data: string, salt: string): Promise<string>;
  export function getSalt(rounds: number): string;
} 