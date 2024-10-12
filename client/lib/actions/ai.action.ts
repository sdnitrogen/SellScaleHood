import httpClient from "../httpClient"
import { parseStringify } from "../utils"

export const fetchPortfolioReview = async () => {
  try {
    const response = await httpClient.get(
      "http://localhost:5000/review-portfolio"
    )

    if (response.status === 200) {
      const data = response.data
      return parseStringify(data)
    }
  } catch (error) {
    console.error("Error", error)
  }
}
