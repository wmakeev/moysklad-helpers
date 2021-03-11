export type Path = string | string[]

export interface EntityRef {
  meta: {
    href: string
  }
}

export interface Entity extends EntityRef {
  id: string
}

export interface EntityAttribute<T> extends Entity {
  value: T
}

export interface EntityWithAttributes<T> extends Entity {
  attributes: EntityAttribute<T>[]
}

export type EntityRefOrPath = Path | EntityRef
