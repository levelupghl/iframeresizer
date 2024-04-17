export function addQueryParam(
  url: string,
  paramName: string,
  paramValue: string
): string {
  try {
    // Create a URL object from the given string
    const urlObj = new URL(url)

    // Set the query parameter
    urlObj.searchParams.set(paramName, paramValue)

    // Return the updated URL string
    return urlObj.toString()
  } catch (error) {
    // Handle potential errors, such as invalid URL format
    console.error("Provided string is not a valid URL:", error)
    // Return the original url
    return url
  }
}
