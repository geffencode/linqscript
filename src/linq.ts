/**
 * A custom implementation of LINQ methods that extend the built-in Array object.
 * @typeparam T The type of the elements in the LINQArray.
 */
class LINQArray<T> extends Array<T> {
    
    /**
     * Logs the current array to the console and returns it.
     * @returns This instance of the LINQArray.
     */
    _log(): LINQArray<T> {
        console.log(this);
        return this;
    }
    /**
     * Adds an item to the end of the array.
     * @param item The item to add to the array.
     */
    Add(item: T): void {
        this.push(item);
    }

    /**
     * Adds multiple items to the end of the array.
     * @param arr The array of items to add to the array.
     */
    AddRange(arr: T[]): void {
        this.push(...arr);
    }

    /**
     * Groups the elements in the array by the specified key selector.
     * @typeparam K The type of the key to group by.
     * @param predicate The function used to select the grouping key.
     * @returns An object whose keys are the selected grouping keys and values are arrays of elements that correspond to each key.
     */
    GroupBy<K extends string | number | symbol>(predicate: (item: T) => K): Record<K, T[]> {
        return this.reduce((groups: Record<K, T[]>, item: T) => {
            const key = predicate(item);
            if (key in groups)
              groups[key].push(item);
            else
              groups[key] = [item];
            return groups;
        }, {} as Record<K, T[]>);
    }

    /**
     * Projects each element of the array to a new form using the specified selector function.
     * @typeparam K The type of the projected element.
     * @param predicate The function used to project each element of the array.
     * @returns A new LINQArray containing the projected elements.
     */
    Select<K>(predicate: (item: T) => K): LINQArray<K>{
        return this.map(predicate) as LINQArray<K>;
    }

    /**
     * Filters the elements of the array based on a predicate function.
     * @param predicate The function used to test each element of the array.
     * @returns A new LINQArray containing the elements that pass the test.
     */
    Where(predicate: (item: T) => boolean): LINQArray<T> {
        return this.filter(predicate) as LINQArray<T>;
    }

    /**
     * Returns the first element of the array that satisfies a specified condition, or undefined if no such element is found.
     * @param predicate The function used to test each element of the array.
     * @returns The first element that satisfies the condition, or undefined if no such element is found.
     */
    First(predicate?: (item: T) => boolean): T {
        const item = this.FirstOrDefault(predicate);
        if (item === undefined) throw new InvalidOperationException('No element satisfies the condition in predicate.');
        return item;
    }

    /**
     * Returns the first element of the array that satisfies a specified condition, or undefined if no such element is found.
     * @param predicate The function used to test each element of the array.
     * @returns The first element that satisfies the condition, or undefined if no such element is found.
     */
    FirstOrDefault(predicate?: (item: T) => boolean): T | undefined {
        return predicate ? this.find(predicate) : this.length ? this[0] : undefined;
    }

    /**
     * Projects each element of the array to a sequence and flattens the resulting sequences into one LINQArray.
     * @typeparam K The type of the elements in the resulting sequence.
     * @param predicate The function used to project each element of the array to a sequence.
     * @returns A new LINQArray containing the flattened sequence of elements.
     */
    SelectMany<K>(predicate: (item: T) => K[]): LINQArray<K> {
        return this.flatMap(predicate) as LINQArray<K>;
    }
    
    /**
     * Returns a new LINQArray containing only the distinct elements of the original array.
     * @returns A new LINQArray containing only the distinct elements of the original array.
     */
    Distinct(): LINQArray<T> {
        return AsLinq([...new Set(this)]);
    }

    /**
     * Returns a new LINQArray containing only the distinct elements of the original array, determined by the specified key selector function.
     * @typeparam K The type of the key to use for distinctness.
     * @param predicate The function used to select the key for distinctness.
     * @returns A new LINQArray containing only the distinct elements of the original array.
     */
    DistinctBy<K>(predicate: (item: T) => K): LINQArray<T> {
        return AsLinq([...new Map(this.map(i => [predicate(i), i])).values()]);
    }

    /**
     * Sorts the elements of the array in ascending order according to the specified key selector function.
     * @typeparam K The type of the key used for sorting.
     * @param predicate The function used to select the key for sorting.
     * @returns A new LINQArray containing the sorted elements.
     */
    OrderBy<K>(predicate: (item: T) => K): LINQArray<T> {
        return this.sort((a, b) => predicate(a) > predicate(b) ? 1 : -1 );
    }

    /**
     * Sorts the elements of the array in descending order based on the specified predicate.
     * @typeparam K The type of the key returned by the predicate.
     * @param predicate A function that returns the key used to sort the elements.
     * @returns A new LINQArray instance with the sorted elements.
     */
    OrderByDescending<K>(predicate: (item: T) => K): LINQArray<T> {
        return this.sort((a, b) => predicate(a) > predicate(b) ? -1 : 1 );
    }

    /**
     * Determines whether any element of the array satisfies the specified predicate.
     * @param predicate A function that determines whether an element meets a condition.
     * @returns True if any element satisfies the predicate; otherwise, false.
     */
    Any(predicate?: (item: T) => boolean): boolean {
        return predicate ? this.some(predicate) : this.length > 0;
    }

    /**
     * Returns a new array that contains the specified number of elements from the start of the array.
     * @param i The number of elements to take.
     * @returns A new LINQArray instance that contains the specified number of elements.
     */
    Take(i: number): LINQArray<T> {
        return this.slice(0, i) as LINQArray<T>;
    }

    /**
     * Bypasses a specified number of elements in the array and returns the remaining elements.
     * @param i The number of elements to skip.
     * @returns A new LINQArray instance that contains the remaining elements.
     */
    Skip(i: number): LINQArray<T> {
        return this.slice(i, this.length) as LINQArray<T>;
    }

    /**
     * Retrieves the length of the LINQArray
     * @returns The number of elements of the collection.
     */
    Count(): number {
        return this.length;
    }

    /**
     * Copies the elements of the LINQArray to a new Array.
     * @returns A new array that contains the same elements as the LINQ array.
     */
    ToArray(): T[] {
        return [...this];
    }

}

class InvalidOperationException extends Error {

}

const AsLinq = <T>(arr: T[]): LINQArray<T> => {
    return new LINQArray<T>(...arr);
}

export {AsLinq, LINQArray}