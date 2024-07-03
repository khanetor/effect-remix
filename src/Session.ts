import { Effect, Data } from "effect"
import { createCookieSessionStorage } from "@remix-run/node"
import type { SessionData, SessionStorage } from "@remix-run/node"

export function createCookieSessionStorageEffect<A = SessionData, F = A>(...args: Parameters<typeof createCookieSessionStorage>) {
    return Effect.sync(() => createCookieSessionStorage<A, F>(...args)).pipe(
        Effect.andThen(storage => new EffectStorage(storage))
    )
}

export class EffectStorageError extends Data.TaggedError("EffectStorageError")<{
    message: string
}> { }


class EffectStorage<A = SessionData, F = A> {
    private storage: Effect.Effect<SessionStorage<A, F>, never, never>

    constructor(storage: SessionStorage<A, F>) {
        this.storage = Effect.succeed(storage)
    }

    public getSession(...args: Parameters<SessionStorage<A, F>["getSession"]>) {
        return this.storage.pipe(
            Effect.andThen(s => s.getSession(...args))
        ).pipe(
            Effect.catchTag("UnknownException", e => new EffectStorageError({ message: e.message }))
        )
    }

    public commitSession(...args: Parameters<SessionStorage<A, F>["commitSession"]>) {
        return this.storage.pipe(
            Effect.andThen(s => s.commitSession(...args))
        ).pipe(
            Effect.catchTag("UnknownException", e => new EffectStorageError({ message: e.message }))
        )
    }

    public destroySession(...args: Parameters<SessionStorage<A, F>["destroySession"]>) {
        return this.storage.pipe(
            Effect.andThen(s => s.destroySession(...args))
        ).pipe(
            Effect.catchTag("UnknownException", e => new EffectStorageError({ message: e.message }))
        )
    }
}