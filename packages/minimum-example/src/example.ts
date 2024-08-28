import { serialize } from '@deepkit/type'

interface User {
    username: string
}

document.body.appendChild(document.createTextNode(
    JSON.stringify(
        serialize<User>({username: "foo", password: "bar"} as any)
    )
))
