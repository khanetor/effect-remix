import { describe, it, expectTypeOf } from "vitest"
import { Effect, ManagedRuntime, Layer } from "effect"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { actionEffect, loaderEffect } from "../src/Server"


describe("loaderEffect", () => {
    const layers = Layer.mergeAll(
        Layer.empty
    )
    const runtime = ManagedRuntime.make(layers)

    it("should return correct Promise type.", () => {
        const loader = loaderEffect(runtime, () =>
            Effect.gen(function*() {
                return 1
            })
        )

        expectTypeOf(loader).toBeFunction()
        expectTypeOf(loader).parameter(0).toMatchTypeOf<LoaderFunctionArgs>()
        expectTypeOf(loader).returns.toMatchTypeOf<Promise<number>>()
    })
})

describe("actionEffect", () => {
    const layers = Layer.mergeAll(
        Layer.empty
    )
    const runtime = ManagedRuntime.make(layers)

    it("should return correct Promise type.", () => {
        const action = actionEffect(runtime, () =>
            Effect.gen(function*() {
                return "1"
            })
        )

        expectTypeOf(action).toBeFunction()
        expectTypeOf(action).parameter(0).toMatchTypeOf<ActionFunctionArgs>()
        expectTypeOf(action).returns.toMatchTypeOf<Promise<string>>()
    })
})
