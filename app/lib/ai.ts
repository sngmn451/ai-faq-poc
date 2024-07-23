import natural from "natural"
const tokenizer = new natural.WordTokenizer()

export function preprocessQuery(query: string): string {
  const lowerCaseQuery = query.toLowerCase()
  const tokens = tokenizer.tokenize(lowerCaseQuery)
  return tokens.join(" ")
}
