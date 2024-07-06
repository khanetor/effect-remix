# effect-remix
Adapters for using Effect in Remix framework

## About

## Usage

### Define your environment

```typescript
// runtime.ts

import { ManagedRuntime, Layer } from "effect"

const layers = Layer.merge(
    Layer.empty, // or replace this with your dependency layers
    ...
)

export const runtime = ManagedRuntime.make(layers)
```

### Use loader

```typescript
// routes/some-route.tsx

import { Effect } from "effect"
import { loaderEffect } from "@khanetor/effect-remix"
import { json } from "@remix-run/node"
import { runtime } from "~/runtime"

export const loader = loaderEffect(runtime, ({ request }) =>
  Effect.gen(function* () {
    const repo = yield* Repos
    const data = yield* repo.getData()
    ...
    return json({data})
  }).pipe( // Optionally handle errors
    Effect.catchTag(...)
  )
)

export default function Component() {
    const { data } = useLoaderData<typeof loader>()

    return <>...</>
}
```

### Use action

This is similar to loader.

```typescript
// routes/some-route.tsx

import { Effect } from "effect"
import { actionEffect } from "@khanetor/effect-remix"
import { json, redirect } from "@remix-run/node"
import { runtime } from "~/runtime"

export const action = loaderEffect(runtime, ({ request }) =>
  Effect.gen(function* () {
    const repo = yield* Repos
    const data = yield* repo.getData()
    ...
    return redirect("/")
  }).pipe( // Optionally handle errors
    Effect.catchTag(..., e => Effect.succeed(json({ error: ... })))
  )
)

export default function Component() {
    const { error } = useActionData<typeof action>()

    return <>...</>
}
```

### Use session

It is recommended to use this in a dependency layer

#### 1. First you will need to define your session as a layer

```typescript
// my-session.ts

import { Context, Layer } from "effect"
import { Schema as S } from "@effect/schema"
import { createCookieSessionStorageEffect, EffectStorage } from "@khanetor/effect-remix"

// Step 1: declare your cookie structure
class MyCookie extends S.Class<MyCookie>("MyCookie")({
    ...
}) { }

// Step 2: declare your layer
export class MySession extends Context.Tag("MySession")<MySession, EffectStorage<MyCookie>>() {
  static live = Layer.effect(MySession, Effect.gen(function* () {
    const session = yield* createCookieSessionStorageEffect<MyCookie>({
        cookie: { ... }
    })
    return MySession.of(session)
  }))
}
```

#### 2. Then you will need to add this layer to the runtime

```typescript
// runtime.ts

...
import { MySession } from "~/my-session.ts"

const layers = Layer.merge(
    ...,
    MySession.live
)

// then make your runtime with these layers
```

#### 3. Finally you can use this in your **action**/**loader**

```typescript
// routes/some-route.tsx

...
import { MySession } from "~/my-session.ts"
...

export const loader = loaderEffect(runtime, ({request}) =>
  Effect.gen(function* () {
    const mySession = yield* MySession
    const cookie = yield* mySession.getSession(request.header.get("Cookie"))
    ...
  })
)
```
