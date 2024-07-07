import { describe, it } from "vitest"
import { Effect, ManagedRuntime, Layer } from "effect"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { actionEffect, loaderEffect } from "../src/Server"


describe("loaderEffect", () => {
    const layers = Layer.mergeAll(
        Layer.empty
    )
    const runtime = ManagedRuntime.make(layers)

    const loader = loaderEffect(runtime, () =>
        Effect.gen(function*() {
            return 1
        })
    )

    it("should execute effect correctly.", async ({expect}) => {
        const args: LoaderFunctionArgs = {
            request: new Request("http://localhost"),
            params: {},
            context: {},
        }

        const value = await loader(args)
        expect(value).toStrictEqual(1)
    })
})

describe("actionEffect", () => {
    const layers = Layer.mergeAll(
        Layer.empty
    )
    const runtime = ManagedRuntime.make(layers)

    const action = actionEffect(runtime, () =>
        Effect.gen(function*() {
            return "1"
        })
    )

    it("should execute effect correctly.", async ({expect}) => {
        const args: ActionFunctionArgs = {
            request: new Request("http://localhost"),
            params: {},
            context: {},
        }

        const value = await action(args)
        expect(value).toStrictEqual("1")
    })
})
