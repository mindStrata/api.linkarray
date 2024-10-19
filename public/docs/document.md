# API Key Client-Side Implementation

## Overview

To access protected routes in your API, you need to include a valid API key in the request headers. This document provides a simple guide on how to do this using different client-side methods.

---

![server and client](/images/api-middleware.svg)

<em>The client sends a request with the API key in the headers. The server validates the key before granting access to the requested resource. A successful response is returned if the key is valid, otherwise, an error is thrown.</em>

## Client-Side Usage

### Example 1: Using Fetch API

When making requests to the API, include the API key in the headers as follows:

```javascript
const apiKey = "YOUR_API_KEY"; // Replace with your actual API key

fetch("https://api.yourdomain.com/protected-route", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "linkarray-api-key": apiKey, // Include the API key here
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Data received:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### Example 2: Using Axios

If you prefer using Axios for making HTTP requests, you can set up the API key in a similar way:

```javascript
import axios from "axios";

const apiKey = "YOUR_API_KEY"; // Replace with your actual API key

axios
  .get("https://api.yourdomain.com/protected-route", {
    headers: {
      "linkarray-api-key": apiKey, // Include the API key here
    },
  })
  .then((response) => {
    console.log("Data received:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### Example 3: Using jQuery AJAX

For projects using jQuery, you can make an AJAX request like this:

```javascript
const apiKey = "YOUR_API_KEY"; // Replace with your actual API key

$.ajax({
  url: "https://api.yourdomain.com/protected-route",
  method: "GET",
  headers: {
    "linkarray-api-key": apiKey, // Include the API key here
  },
  success: function (data) {
    console.log("Data received:", data);
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.error("Error:", textStatus, errorThrown);
  },
});
```

## Important Notes

- Always keep your API key confidential. Avoid exposing it in client-side code that can be accessed publicly.
- If possible, implement security measures on the server-side to mitigate potential misuse of the API key.
- If your application has different environments (development, production), make sure to use the appropriate API key for each environment.
