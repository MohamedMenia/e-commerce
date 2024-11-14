export function getUserKeyById(id: string) {
  return `users:${id}`;
}

export function getProductKeyById(id: string) {
  return `products:${id}`;
}

export function getProductListKey (query: string) {
  return `products:${JSON.stringify(query)}`;
}