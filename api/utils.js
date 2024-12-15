export function getRandomItems(arr, numItems) {
  // Create a copy of the array to avoid modifying the original array
  const arrayCopy = [...arr]
  const randomItems = []

  // Ensure numItems does not exceed the length of the array
  const itemsToSelect = Math.min(numItems, arrayCopy.length)

  for (let i = 0; i < itemsToSelect; i++) {
    // Get a random index
    const randomIndex = Math.floor(Math.random() * arrayCopy.length)
    // Remove the item at the random index and add it to the randomItems array
    randomItems.push(arrayCopy.splice(randomIndex, 1)[0])
  }

  return randomItems
}
