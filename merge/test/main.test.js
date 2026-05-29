#!/usr/bin/env bun
import merge from "../src/lib.js"
import { test, expect } from "bun:test"

test("merge properties", () => {
	const obj1 = { a: 1, b: { c: 2 } }
	const obj2 = { b: { d: 3 }, e: 4 }
	const expected = { a: 1, b: { c: 2, d: 3 }, e: 4 }
	expect(merge(obj1, obj2)).toEqual(expected)
})

test("merge arrays", () => {
	const obj1 = { a: [1, 2], b: { c: [3] } }
	const obj2 = { a: [3, 4], b: { c: [4, 5] } }
	const expected = { a: [1, 2, 3, 4], b: { c: [3, 4, 5] } }
	expect(merge(obj1, obj2)).toEqual(expected)
})

test("replace non-object with object", () => {
	const obj1 = { a: 1 }
	const obj2 = { a: { b: 2 } }
	const expected = { a: { b: 2 } }
	expect(merge(obj1, obj2)).toEqual(expected)
})

test("merge with multiple sources", () => {
	const obj1 = { a: 1 }
	const obj2 = { b: 2 }
	const obj3 = { c: 3 }
	const expected = { a: 1, b: 2, c: 3 }
	expect(merge({}, obj1, obj2, obj3)).toEqual(expected)
})

test("deep merge", () => {
	const obj1 = { a: { b: { c: 1 } } }
	const obj2 = { a: { b: { d: 2 } } }
	const expected = { a: { b: { c: 1, d: 2 } } }
	expect(merge(obj1, obj2)).toEqual(expected)
})

test("handle null and undefined", () => {
	const obj1 = { a: 1 }
	const obj2 = { b: null }
	const obj3 = { c: undefined }
	const expected = { a: 1, b: null, c: undefined }
	expect(merge({}, obj1, obj2, obj3)).toEqual(expected)
})
