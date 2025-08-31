export interface columType<T> {
    type: string;
    getValue: (item: T) => string;
    onClick?: (item: T) => void;
}