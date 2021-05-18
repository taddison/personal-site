import { existsSync, mkdirSync, writeFileSync } from "fs"
import { exit } from "process"
import { createInterface } from "readline"

const BASE_PATH = "./content/blog"

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
  inputString = inputString
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[^\w-]/g, "")
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
title = title.trim()
slug = slugify(title)

const inputDate = await question(`Post date [yyyy-MM-dd] (${date}) > `)
if (inputDate.length > 0 && inputDate.length !== 10) {
  throw "Post date must be yyyy-MM-dd"
} else if (inputDate.length) {
  const parsedDate = new Date(inputDate)
  if (isNaN(parsedDate)) {
    throw "Invalid date provided"
  }
  date = parsedDate.toISOString().slice(0, 10)
}

const inputFormat = await question(`Post format [md|mdx] (${format}) > `)
if (inputFormat) {
  if (inputFormat !== "md" && inputFormat !== "mdx") {
    throw "Invalid input format"
  }
  format = inputFormat
}

const year = date.slice(0, 4)
const month = date.slice(5, 7)
const path = `${BASE_PATH}/${year}/${month}/${slug}`

console.log({ title, slug, date, format, path })
const confirm = await question("Create post (yes) > ")
if (confirm.length && confirm !== "yes") {
  exit(0)
}

if (!existsSync(path)) {
  mkdirSync(path, { recursive: true })
}

writeFileSync(
  `${path}/index.${format}`,
  `---
date: "${date}T00:00:00.0Z"
title: ${title}
#shareimage: "./shareimage.png"
tags: []
# cSpell:words
# cSpell:ignore
---`,
  (err) => {
    if (err) {
      return console.log(err)
    }
    console.log(`${title} was created!`)
  }
)

rl.close()
