import { createInterface } from "readline"

let title
let date = new Date().toISOString().slice(0, 10)
let format = `md`

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = function (q) {
  return new Promise((res) => {
    rl.question(q, (answer) => {
      res(answer)
    })
  })
}

title = await question("Post title > ")
const inputDate = await question(`Post date (${date}) > `)
if (inputDate) {
  date = inputDate
}
const inputFormat = await question(`Post format [md|mdx] (${format}) > `)
if (inputFormat) {
  format = inputFormat
}

console.log({ title, date, format })
console.log(`new post NOT created`)

rl.close()
