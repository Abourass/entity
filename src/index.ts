/**
 * A class to manage entities and their symbols, preserving type information.
 *
 * @template EntityType - The type of the entity.
 */
export default class Entity<EntityType = any, Identifiers extends string = string> {
  private entityMap: Map<symbol, EntityType> = new Map();
  private entitySymbols: Map<Identifiers, symbol> = new Map();

  /**
   * Creates a new Entity instance.
   *
   * @param {Record<Identifiers, EntityType>} entities - An object containing entities to add to the entity map.
   */
  public constructor(entities?: Record<Identifiers, EntityType>) {
    if (entities) {
      Object
        .entries(entities)
        .forEach(([identifier, entity]) => {
          this.add(identifier as Identifiers, entity as EntityType);
        });
    }
  }

  /**
   * Adds a new entity to the entity map.
   *
   * @param {Identifiers} identifier - The string identifier for the entity.
   * @param {EntityType} entity - The entity to add.
   * @returns {this} The Entity instance.
   */
  public add(identifier: Identifiers, entity: EntityType): this {
    const symbol = Symbol(identifier);
    this.entityMap.set(symbol, entity);
    this.entitySymbols.set(identifier, symbol);
    return this;
  }

  /**
   * Retrieves an entity by its identifier.
   *
   * @param {Identifiers} identifier - The identifier of the entity to retrieve.
   * @returns {EntityType | undefined} The entity associated with the identifier, or undefined if not found.
   */
  public get(identifier: Identifiers): EntityType | undefined {
    const symbol = this.entitySymbols.get(identifier);
    return symbol ? this.entityMap.get(symbol) : undefined;
  }

  /**
   * Removes an entity by its identifier.
   *
   * @param {Identifiers} identifier - The identifier of the entity to remove.
   * @returns {boolean} True if the entity was successfully removed, false otherwise.
   */
  public remove(identifier: Identifiers): boolean {
    const symbol = this.entitySymbols.get(identifier);
    if (symbol) {
      this.entityMap.delete(symbol);
      this.entitySymbols.delete(identifier);
      return true;
    }
    return false;
  }

  /**
   * Clears all entities from the entity map.
   */
  public clear(): void {
    this.entityMap.clear();
    this.entitySymbols.clear();
  }

  /**
   * Gets all entities in the entity map.
   *
   * @returns {Record<Identifiers, EntityType>} A record of all entities in the entity map.
   */
  public getAllEntities(): Record<Identifiers, EntityType> {
    const entities = {} as Record<Identifiers, EntityType>;
    this.entitySymbols.forEach((symbol, identifier) => {
      entities[identifier] = this.entityMap.get(symbol) as EntityType;
    });
    return entities
  }

  /**
   * Gets all identifiers in the entity map.
   *
   * @returns {Identifiers[]} An array of all identifiers in the entity map.
   */
  public getAllIdentifiers(): Identifiers[] {
    return Array.from(this.entitySymbols.keys());
  }

  /**
   * Gets all symbols in the entity map.
   *
   * @returns {symbol[]} An array of all symbols in the entity map.
   */
  public getAllSymbols(): symbol[] {
    return Array.from(this.entityMap.keys());
  }

  /**
   * Gets the size of the entity map.
   *
   * @returns {number} The number of entities in the entity map.
   */
  public get size(): number { return this.entityMap.size; }
  public get length(): number { return this.size; }

  /**
   * Checks if the entity map is empty.
   *
   * @returns {boolean} True if the entity map is empty, false otherwise.
   */
  public get isEmpty(): boolean {
    return this.entityMap.size === 0;
  }

  /**
   * Checks if an entity exists in the entity map.
   *
   * @param {Identifiers} identifier - The identifier of the entity to check.
   * @returns {boolean} True if the entity exists, false otherwise.
   */
  public has(identifier: Identifiers): boolean {
    return this.entitySymbols.has(identifier);
  }

  /**
   * forEach implementation for the entity map.
   * 
   * @param {Function} callback - The function to call for each entity.
   * @param {any} thisArg - The value to use as `this` when executing the callback.
   * @returns {void}
   */
  public forEach(callback: (identifier: Identifiers, entity: EntityType, entityMap: Map<symbol, EntityType>) => void, thisArg?: any): void {
    this.entitySymbols.forEach((symbol, identifier) => {
      callback.call(thisArg, identifier, this.entityMap.get(symbol) as EntityType, this.entityMap);
    });
  }

  /**
   * map implementation for the entity map.
   * 
   * @param {Function} callback - The function to call for each entity.
   * @param {any} thisArg - The value to use as `this` when executing the callback.
   * @returns {any[]}
   */
  public map<T>(callback: (entity: EntityType, identifier: Identifiers, entityMap: Map<symbol, EntityType>) => T, thisArg?: any): T[] {
    const result: T[] = [];
    this.entitySymbols.forEach((symbol, identifier) => {
      result.push(callback.call(thisArg, this.entityMap.get(symbol) as EntityType, identifier, this.entityMap));
    });
    return result;
  }

  /**
   * filter implementation for the entity map.
   * 
   * @param {Function} callback - The function to call for each entity.
   * @param {any} thisArg - The value to use as `this` when executing the callback.
   * @returns {EntityType[]}
   */
  public filter(callback: (entity: EntityType, identifier: Identifiers, entityMap: Map<symbol, EntityType>) => boolean, thisArg?: any): EntityType[] {
    const result: EntityType[] = [];
    this.entitySymbols.forEach((symbol, identifier) => {
      if (callback.call(thisArg, this.entityMap.get(symbol) as EntityType, identifier, this.entityMap)) {
        result.push(this.entityMap.get(symbol) as EntityType);
      }
    });
    return result;
  }

  /**
   * find implementation for the entity map.
   * 
   * @param {Function} callback - The function to call for each entity.
   * @param {any} thisArg - The value to use as `this` when executing the callback.
   * @returns {EntityType | undefined}
   */
  public find(callback: (entity: EntityType, identifier: Identifiers, entityMap: Map<symbol, EntityType>) => boolean, thisArg?: any): EntityType | undefined {
    let result: EntityType | undefined;
    this.entitySymbols.forEach((symbol, identifier) => {
      if (callback.call(thisArg, this.entityMap.get(symbol) as EntityType, identifier, this.entityMap)) {
        result = this.entityMap.get(symbol) as EntityType;
      }
    });
    return result;
  }

  /**
   * reduce implementation for the entity map.
   * 
   * @param {Function} callback - The function to call for each entity.
   * @param {any} initialValue - The initial value.
   * @returns {any}
   */
  public reduce<T>(callback: (accumulator: T, entity: EntityType, identifier: Identifiers, entityMap: Map<symbol, EntityType>) => T, initialValue: T): T {
    let accumulator = initialValue;
    this.entitySymbols.forEach((symbol, identifier) => {
      accumulator = callback(accumulator, this.entityMap.get(symbol) as EntityType, identifier, this.entityMap);
    });
    return accumulator;
  }

  /**
   * Iterates as:
   * @example
   * [entity, service, symbol, entityMap]
   */
  [Symbol.iterator]() {
    const symbols = this.entitySymbols.values();
    const entities = this.entityMap.values();
    return {
      next: () => {
        const symbol = symbols.next();
        const entity = entities.next();
        return {
          done: symbol.done || entity.done,
          value: [entity.value, symbol.value, symbol.value, this.entityMap],
        };
      },
    };
  }
}
