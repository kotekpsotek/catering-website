import { describe, it, expect, beforeAll } from 'vitest';
import { foodOrder, getPricePerOrder, type OrderedMeal } from '../src/states/strores';

// describe('sum test', () => {
// 	it('adds 1 + 2 to equal 3', () => {
// 		expect(1 + 2).toBe(3);
// 	});
// });

beforeAll(() => {
	// Push values to orders storage
	const ordersList: OrderedMeal[] = [
		{
			name: "yeyysysys",
			price: 22
		},
		{
			name: "xxxx",
			price: 33
		}
	];
	foodOrder.set(ordersList);
});

describe("order testing", () => {
	it("Price for whole order summing", () => {
		const checking = getPricePerOrder();
		
		// Check whether number is returned from order
		expect(checking).toBeTypeOf("number");
	
		// Get price to stdout
		console.log(checking);
	})
})
