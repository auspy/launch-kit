import { urlBase } from "@/constants";

export default async function Fetch({
  endpoint,
  method = "POST",
  body,
  headers,
  base = urlBase,
}) {
  try {
    if (!endpoint) {
      throw new Error("Endpoint not found");
    }
    const headers1 = { "Content-Type": "application/json", ...headers };
    // can add option to check if endswith / or not etc
    const url = base + endpoint;

    const options = {
      method,
      headers: headers1,
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    console.log("Fetch options:", options);
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} in path ${endpoint}`,
      );
    }
    const data = await response.json();
    return [data, response];
  } catch (e) {
    console.log("Error in Fetch, handle in parent", e);
    throw e;
  }
}
