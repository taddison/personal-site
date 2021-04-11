import { createInterface } from "readline"

let title, slug
let date = new Date().toISOString().slice(0, 10)
let format = `md`

const question = (prompt) => {
  return new Promise((res) => {
    rl.question(prompt, (answer) => {
      res(answer)
    })
  })
}

const slugify = (inputString) => {
  // spaces to hyphen, remove non-alphanumeric
  inputString = inputString.replace(/\s/g, "-").replace(/[^\w-]/g, "")
  return inputString
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

title = await question("Post title > ")
if (!title.length || !title.trim().length) {
  throw "Title must be provided"
}
slug = slugify(title)

const inputDate = await question(`Post date [yyyy-MM-dd] (${date}) > `)
if (inputDate.length > 0 && inputDate.length !== 10) {
  throw "Post date must be yyyy-MM-dd"
} else if (inputDate.length) {
  const parsedDate = new Date(inputDate)
  if (isNaN(parsedDate)) {
    throw "Invalid date provided"
  }
  date = inputDate
}

const inputFormat = await question(`Post format [md|mdx] (${format}) > `)
if (inputFormat) {
  if (inputFormat !== "md" && inputFormat !== "mdx") {
    throw "Invalid input format"
  }
  format = inputFormat
}

console.log({ title, slug, date, format })
// TODO: Confirm prompt
// TODO: Create the post scaffold
console.log(`new post NOT created`)

rl.close()