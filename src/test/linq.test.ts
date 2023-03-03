import {AsLinq, LINQArray} from '../linq';

interface Fruit {
    id: number,
    icon: string,
    color: string,
    vendors?: string[]
}

const fruits = [
    {id: 1, icon: "🍋", color: "yellow"},
    {id: 2, icon: "🍎", color: "red"},
    {id: 3, icon: "🍌", color: "yellow"},
    {id: 4, icon: "🍑", color: "orange"},
    {id: 5, icon: "🍊", color: "orange"},
]

let arr: Fruit[];
let dummyLinqArr: LINQArray<Fruit>;
let filledLinqArr: LINQArray<Fruit>;

beforeEach(() => {
    arr = [];
    dummyLinqArr = new LINQArray<Fruit>();
    filledLinqArr = new LINQArray<Fruit>(...fruits)
})

describe("LINQArray testing", () => {

    it("properly defines a LINQArray", () => {
        expect(dummyLinqArr).toBeDefined();
        expect(dummyLinqArr).toBeInstanceOf(LINQArray);
    })

    it("properly retrieves the count of the LINQArray", () => {
        expect(dummyLinqArr.Count()).toBe(0);
        expect(filledLinqArr.Count()).toBe(5);
    })

    it("properly converts to array", () => {
        const got = dummyLinqArr.ToArray();
        expect(got).toBeInstanceOf(Array);
    })

    it("AsLinq() properly copies an array to LINQArray", () => {
        arr = [...fruits];
        let created = AsLinq(arr);

        expect(created).toBeDefined();
        expect(created).toBeInstanceOf(LINQArray);
        expect(created).toEqual(arr);
    })

    it("Add() properly add an item", () => {
        const item = [...fruits][0];
        dummyLinqArr.Add(item);

        expect(dummyLinqArr).toContain(item);
    })

    it("AddRange() properly adds a range of items", () => {
        const items = [...fruits];
        dummyLinqArr.AddRange(items);

        expect(dummyLinqArr).toEqual(
            expect.arrayContaining(items)
        );
    })

    it("Select() properly selects the desired value", () => {
        const got = filledLinqArr.Select(fruit => fruit.icon);
        const want = AsLinq(['🍋', '🍎', '🍌', '🍑', '🍊' ]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

    it("Where() properly filters based on value", () => {
        const got = filledLinqArr.Where(fruit => fruit.color === 'yellow');
        const want = AsLinq([{id: 1, icon: "🍋", color: "yellow"}, {id: 3, icon: "🍌", color: "yellow"}]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

    it("GroupBy() properly groups based on value", () => {
        const got = filledLinqArr.GroupBy(fruit => fruit.color);
        const want: Record<string, Fruit[]> = {
            "yellow": [
                {id: 1, icon: "🍋", color: "yellow"},
                {id: 3, icon: "🍌", color: "yellow"},
            ],
            "orange": [
                {id: 4, icon: "🍑", color: "orange"},
                {id: 5, icon: "🍊", color: "orange"},
            ],
            "red": [
                {id: 2, icon: "🍎", color: "red"}
            ]
        };

        expect(got).toEqual(want);
    })

    it("SelectMany() properly reduces the desired values", () => {
        const selectManyLinqArr = new LINQArray<Fruit[]>([...fruits], [...fruits])
        const got = selectManyLinqArr.SelectMany(fruit => fruit);
        const want = AsLinq<Fruit>([...fruits, ...fruits]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

})

describe("First() methods", () => {
    it("First() properly finds the desired item", () => {
        const got = filledLinqArr.First(fruit => fruit.id === 1);
        const want = {id: 1, icon: "🍋", color: "yellow"}; 

        expect(got).toEqual(want);
    })

    it("First() properly throws exception if not found", () => {
        const erroringCall = () => {
            filledLinqArr.First(fruit => fruit.id === 9001);
        }
        expect(erroringCall).toThrowError('No element satisfies the condition in predicate.')

    })

    it("FirstOrDefault() properly finds the desired item", () => {
        const got = filledLinqArr.FirstOrDefault(fruit => fruit.id === 1);
        const want = {id: 1, icon: "🍋", color: "yellow"}; 

        expect(got).toEqual(want);
    })

    it("FirstOrDefault() properly returns undefined if not found", () => {
        const got = filledLinqArr.FirstOrDefault(fruit => fruit.id === 9001);
        const want = undefined; 

        expect(got).toEqual(want);
    })
})

describe("Distinct() methods", () => {
    it("Distinct() properly removes duplicates", () => {
        const duplicateFruits = new LINQArray<Fruit>(...fruits, ...fruits)
        const got = duplicateFruits.Distinct();
        const want = AsLinq<Fruit>([...fruits]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

    it("DistinctBy() properly removes duplicates based on predicate", () => {
        const duplicateFruits = new LINQArray<Fruit>(...fruits, ...fruits)
        const got = duplicateFruits.DistinctBy(fruit => fruit.color);
        const want = AsLinq<Fruit>([
            {id: 3, icon: "🍌", color: "yellow"},
            {id: 2, icon: '🍎', color: 'red'},
            {id: 5, icon: "🍊", color: "orange"},
        ]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })
})

describe("OrderBy() methods", () => {
    it("OrderBy() properly orders by value ascending", () => {
        const unorderedFruits = [...fruits];
        [unorderedFruits[0], unorderedFruits[3]] = [unorderedFruits[3], unorderedFruits[0]];
        const got = AsLinq<Fruit>(unorderedFruits).OrderBy(fruit => fruit.id);
        const want = AsLinq<Fruit>([...fruits]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

    it("OrderByDescending() properly orders by value descending", () => {
        const got = filledLinqArr.OrderByDescending(fruit => fruit.id);
        const want = AsLinq<Fruit>([
            {id: 5, icon: "🍊", color: "orange"},
            {id: 4, icon: "🍑", color: "orange"},
            {id: 3, icon: "🍌", color: "yellow"},
            {id: 2, icon: "🍎", color: "red"},
            {id: 1, icon: "🍋", color: "yellow"},
        ]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })
})

describe("Any()", () => {
    it("properly finds if there are any items", () => {
        const got = filledLinqArr.Any();
        const want = true;

        expect(got).toEqual(want);
    })

    it("properly finds there are no items", () => {
        const got = dummyLinqArr.Any();
        const want = false;

        expect(got).toEqual(want);
    })

    it("properly finds if there are any by predicate", () => {
        const got = filledLinqArr.Any(fruit => fruit.color === 'yellow');
        const want = true;

        expect(got).toEqual(want);
    })

    it("properly finds there aren't any items by predicate", () => {
        const got = filledLinqArr.Any(fruit => fruit.color === 'purple');
        const want = false;

        expect(got).toEqual(want);
    })

    it("properly finds there aren't any items by predicate on empty list", () => {
        const got = dummyLinqArr.Any(fruit => fruit.color === 'purple');
        const want = false;

        expect(got).toEqual(want);
    })
})

describe("Take()", () => {
    it("properly takes the desired amount", () => {
        const got = filledLinqArr.Take(2);
        const want = 2;

        expect(got.Count()).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

    it("properly takes the desired amount even if it exceeds count", () => {
        const got = filledLinqArr.Take(9001);
        const want = 5;

        expect(got.Count()).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })
})

describe("Skip()", () => {
    it("Skip() properly skips the desired amount", () => {
        const got = filledLinqArr.Skip(2);
        const want = AsLinq([
            {id: 3, icon: "🍌", color: "yellow"},
            {id: 4, icon: "🍑", color: "orange"},
            {id: 5, icon: "🍊", color: "orange"},
        ]);

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })

    it("Skip() properly skips the desired amount even if it exceeds count", () => {
        const got = filledLinqArr.Skip(9001);
        const want = AsLinq([])

        expect(got).toEqual(want);
        expect(got).toBeInstanceOf(LINQArray);
    })
})