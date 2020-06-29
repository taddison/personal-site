---
title: Password protect a Next.js site hosted on Vercel
tags: [React, Nextjs, Vercel]
date: "2020-06-30T00:00:00.0Z"
---

[npm - universal cookie]: https://www.npmjs.com/package/universal-cookie
[tailwind starter with typescript]: https://github.com/aedificatorum/next-starters/tree/main/tailwind-js
[tailwind starter]: https://github.com/aedificatorum/next-starters/tree/main/tailwind
[example repo]: https://github.com/taddison/next-password-protect-sample
[example site - public]: https://next-password-protect-sample.vercel.app/
[example site - protected]: https://next-password-protect-sample.vercel.app/protected

### Notes

# create the app from a sample

- typescript or js

# js

npx create-next-app next-password-protect-sample --example https://github.com/aedificatorum/next-starters/tree/main/tailwind-js

# ts

npx create-next-app next-password-protect-sample --example https://github.com/aedificatorum/next-starters/tree/main/tailwind

## Run it

cd next-password-protect-sample
yarn dev # browse to http://localhost:3000

## Goals?

- Home page is public
- We will create a protected page which is protected
- We will also have a login/logout page

## Create the protected page

- Add protected.js
- Add a prop that will be used to protect the page

```js
import Head from "next/head"

export default function Protected({ hasReadPermission }) {
  if (!hasReadPermission) {
    return <div>Access denied.</div>
  }

  return (
    <div>
      <Head>
        <title>Protected Page</title>
      </Head>

      <main>I am supposed to be protected.</main>
    </div>
  )
}
```

## Inject this prop in the \_app.js file

To start we have a 50/50 chance of getting access - try refreshing the protected page.

```js
// At the bottom of _app.js
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)

  if (Math.random() > 0.5) {
    appProps.pageProps.hasReadPermission = true
  }

  return { ...appProps }
}

export default MyApp
```

## Protect the page based on a cookie value

- Create a consts file

````js
// consts.js
export default {
  SiteReadCookie: 'src'
}

- Install the `universal-cookie` package (lets us work with cookies on the frontend or backend)
- https://www.npmjs.com/package/universal-cookie
```bash
yarn add universal-cookie
````

```js
// At the top of _app.js
import Cookies from "universal-cookie"
import consts from "consts"

// In the getInitialProps function, instead of our 'random' proteciton
const cookies = new Cookies(appContext.ctx.req.headers.cookie)
const password = cookies.get(consts.SiteReadCookie) ?? ""

if (password === "letmein") {
  appProps.pageProps.hasReadPermission = true
}
```

# Create a login component that sets the cookie

```js
import { useState } from "react"
import Cookies from "universal-cookie"
import consts from "consts"

const Login = ({ redirectPath }) => {
  const [password, setPassword] = useState("")

  return (
    <div className="w-1/3 max-w-sm mx-auto">
      <form>
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            type="text"
            className="form-input mt-1 block w-full bg-gray-50"
            placeholder="Your site password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
        <button
          type="submit"
          className="mt-3 bg-green-400 text-white p-2 font-bold rounded hover:bg-green-600"
          onClick={(e) => {
            e.preventDefault()
            const cookies = new Cookies()
            cookies.set(consts.SiteReadCookie, password, {
              path: "/",
            })
            window.location.href = redirectPath ?? "/"
          }}
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
```

# Add the login component to our protected page if the user isn't logged in

- Which really means no/wrong password

```js
// At the top of protected.js
import { useRouter } from "next/router"
import Login from "components/Login"

// Inside our function component
const router = useRouter()

if (!hasReadPermission) {
  return <Login redirectPath={router.asPath} />
}
```

## Have some way to logout

- Mainly useful for testing
- Create a `login.js` page
- This will let people login OR logout

```js
import Head from "next/head"
import Cookies from "universal-cookie"
import Login from "Components/Login"
import consts from "consts"

export default function LoginPage({ hasReadPermission }) {
  if (hasReadPermission) {
    return (
      <>
        <Head>
          <title>Logout</title>
        </Head>
        <div className="w-1/3 max-w-sm mx-auto">
          <button
            className="mt-3 bg-green-400 text-white p-2 font-bold rounded hover:bg-green-600"
            onClick={(e) => {
              e.preventDefault()
              const cookies = new Cookies()
              cookies.remove(consts.SiteReadCookie, { path: "/" })
              window.location.href = "/login"
            }}
          >
            Logout
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Login redirectPath="/" />
    </>
  )
}
```

# Things to keep in mind

- Need to enable protection on a per-page basis (otherwise you've got a public page)
- API routes need special handling as they don't run the logic in \_app.js
- Nothing in the public folder is protected
