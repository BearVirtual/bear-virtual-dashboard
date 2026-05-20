// netlify/functions/claude.js
//
// Serverless proxy — sits between your dashboard and the Anthropic API.
// The browser calls /.netlify/functions/claude (or /api/claude via redirect).
// This function adds your secret API key server-side and forwards the request.
// Your API key never touches the browser.
//
// SETUP:
//   1. Add ANTHROPIC_API_KEY to Netlify → Site config → Environment variables
//   2. This file lives at: netlify/functions/claude.js
//   3. netlify.toml redirects /api/claude → /.netlify/functions/claude

exports.handler = async (event) => {

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Check the API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY environment variable is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API key not configured. Add ANTHROPIC_API_KEY to Netlify environment variables."
      }),
    };
  }

  // Parse the request body from the dashboard
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  // Forward the request to Anthropic with the secret key
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // If Anthropic returned an error, pass it through with the right status code
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    // Return the successful response to the dashboard
    return {
      statusCode: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to reach Anthropic API" }),
    };
  }
};
