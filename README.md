# LINQscript

A basic implementation of LINQ methods for Typescript.

## Installation

```bash
$ npm install @geffencode/linqscript
```

## Usage/Examples

```js
import { AsLinq, LINQArray} from "@geffencode/linqscript";

interface Person {
    id: number;
    name: string;
    age: number;
    city: string;
    hobbies: string[]
}

const persons: Person[] = myService.getPersons();

// By declaring a new LINQArray
const linqArray = new LINQArray<Person>(...persons);
const names = linqArray.Select(p => p.name); // ['John Doe', 'Jane Doe', 'Jane Smith', ...]

// Copying an existing array as LINQArray
const ids = AsLinq(persons).Select(p => p.id); // [1, 2, 3, ...]

// Getting the hobbies of people older than 30 for a city
const hobbies = linqArray.Where(p => p.age > 30 && p.city == 'Mogadishu')
                                  .SelectMany(p => p.hobbies)
                                  .Distinct(); // Remove duplicates

// Id, name and age of all people that play competitive chess boxing in Thimphu
// ordered by age descending, returning a regular array.
const chessboxers = linqArray.Where(p => p.city === 'Thimphu')
                            .Select(({id, name, age}) => ({id, name, age}))
                            .OrderByDescending(p => p.age)
                            .ToArray();

// Get all persons grouped by city
const byCity = linqArray.GroupBy(p => p.city);

```

## API Reference

|Method|Argument|Return|Description|
|:----|:----|:----|:----|
|Add|item: T|None|Adds an item to the end of the array.|
|AddRange|arr: T[]|None|Adds multiple items to the end of the array.|
|GroupBy|predicate: (item: T) => K|Record<K, T[]>|Groups the elements in the array by the specified key selector.|
|Select|predicate: (item: T) => K|LINQArray<K>|Projects each element of the array to a new form using the specified selector function.|
|Where|predicate: (item: T) => boolean|LINQArray<T>|Filters the elements of the array based on a predicate function.|
|First|predicate?: (item: T) => boolean|T or undefined|Returns the first element of the array that satisfies a specified condition, or undefined if no such element is found.|
|FirstOrDefault|predicate?: (item: T) => boolean|T or undefined|Returns the first element of the array that satisfies a specified condition, or undefined if no such element is found.|
|SelectMany|predicate: (item: T) => K[]|LINQArray<K>|Projects each element of the array to a sequence and flattens the resulting sequences into one LINQArray.|
|Distinct|None|LINQArray<T>|Returns a new LINQArray containing only the distinct elements of the original array.|
|DistinctBy|predicate: (item: T) => K|LINQArray<T>|Returns a new LINQArray containing only the distinct elements of the original array, determined by the specified key selector function.|
|OrderBy|predicate: (item: T) => K|LINQArray<T>|Sorts the elements of the array in ascending order according to the specified key selector function.|
|OrderByDescending|predicate: (item: T) => K|LINQArray<T>|Sorts the elements of the array in descending order based on the specified predicate.|
|Any|predicate?: (item: T) => boolean|boolean|Determines whether any element of the array satisfies the specified predicate.|
|Take|i: number|LINQArray<T>|Returns a new array that contains the specified number of elements from the start of the array.|
|Skip|i: number|LINQArray<T>|Bypasses a specified number of elements in the array and returns the remaining elements.|
|Count|None|number|Returns the count of elements in the LINQArray.|
|ToArray|None|T[]|Copies the elements of the LINQArray to a new Array.|
|_log|None|LINQArray<T>|Logs the current array to the console and returns it.|
