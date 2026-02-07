# YourForm Node.js SDK

The official developer SDK for [YourForm](https://yourform.live). Use YourForm APIs directly in your own applications.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Authentication](#authentication)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Forms API](#forms-api)
  - [Fields API](#fields-api)
  - [Responses API](#responses-api)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)
- [Security Best Practices](#security-best-practices)
- [Reference](#reference)

## Installation

```bash
npm install @yourform/sdk
```

## Features

- **Typed SDK**: Full TypeScript support with detailed interfaces.
- **Fail Fast Validation**: Strictly validates question types and form styles on the client-side.
- **Auto-Retries**: Robust handling of network flickers and transient server errors.
- **Clean Error Hierarchy**: Specific error types for Rate Limits, Authentication, and Validation.

## Authentication

Developers generate API keys from the **YourForm Dashboard**. Initialize the SDK like this:

```javascript
import { YourForm } from "@yourform/sdk";

const yourform = new YourForm({
  apiKey: process.env.YOURFORM_API_KEY
});
```

## Quick Start

```javascript
import { YourForm } from "@yourform/sdk";

const yourform = new YourForm({ apiKey: "your_api_key" });

async function run() {
  const forms = await yourform.forms.list();
  console.log(forms);
}

run();
```

## Usage

### Forms API

```javascript
// Create a new form
const form = await yourform.forms.create({
  title: "Feedback Form",
  description: "Customer feedback",
  style: "step" // Optional. Defaults to "step". Supported: classic, step, multi_step, chat, card, survey.
});

// List all forms
const forms = await yourform.forms.list();

// Get a single form
const myForm = await yourform.forms.get("form_id");

// Update form
await yourform.forms.update("form_id", { title: "New Title" });

// Publish form
await yourform.forms.publish("form_id");

// Delete form
await yourform.forms.delete("form_id");
```

### Fields API

```javascript
// Add a single field
await yourform.fields.add("form_id", {
  type: "short_text",
  title: "Your name",
  required: true
});

// Add multiple fields at once (bulk)
await yourform.fields.add("form_id", [
  { type: "email", title: "Email Address", required: true },
  { type: "long_text", title: "Your Message" }
]);

// Update a single field
await yourform.fields.update("form_id", "field_id", {
  title: "Full Name"
});

// Update multiple fields at once (bulk)
await yourform.fields.update("form_id", [
  { id: "field_1", title: "New Label 1" },
  { id: "field_2", required: true }
]);

// Remove a field
await yourform.fields.remove("form_id", "field_id");
```

### Responses API

```javascript
// Submit a response
await yourform.responses.submit("form_id", {
  name: "Hemu",
  rating: 5
});

// List responses
const submissions = await yourform.responses.list("form_id");

// Get a single response
const submission = await yourform.responses.get("form_id", "response_id");
```

## Error Handling

The SDK provides clean, typed errors:

```javascript
try {
  await yourform.forms.create(...)
} catch (err) {
  if (err.isRateLimitError) {
    console.log(`Rate limit reached. Try again after ${err.retryAfter}ms`);
  } else if (err.name === 'AuthenticationError') {
    console.error('Invalid API Key');
  }
}
```

## Rate Limits

The SDK handles rate limits automatically with **exponential backoff**. If the max retry limit is reached, a `RateLimitError` is thrown, exposing the following properties:
- `limit`: total requests allowed
- `remaining`: requests left in the current window
- `reset`: time when the limit resets

## Security Best Practices

- **Never** hardcode your API keys in source code.
- Use environment variables (e.g., `process.env.YOURFORM_API_KEY`).
- Don't use the SDK in client-side code (browsers) as it exposes your API key.
- Keep your SDK version updated.

## Reference

### Supported Question Types
`short_text`, `long_text`, `dropdown`, `checkboxes`, `email`, `phone`, `number`, `date`, `rating`, `opinion_scale`, `yes_no`, `file_upload`, `website`, `matrix`, `multiple_choice`

### Supported Form Styles
`classic`, `step`, `multi_step`, `chat`, `card`, `survey`
