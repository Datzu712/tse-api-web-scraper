type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends infer U
    ? DeepPartial<U>
    : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends (infer U)[]
    ? DeepRequired<U>[]
    : T[P] extends infer U
    ? DeepRequired<U>
    : T[P];
};
