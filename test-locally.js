const { YourForm } = require("./dist/index");

// Replace with your actual local API key if you have a running backend
const yourform = new YourForm({
  apiKey: "test_key_123",
  baseUrl: "http://localhost:3000/api", // Point to your local server
});

async function testDrive() {
  console.log("Starting SDK Local Test...");

  try {
    console.log("\n1. Listing Forms...");
    // This will probably fail if the backend isn't running, which is expected
    const forms = await yourform.forms.list();
    console.log("Success:", forms);
  } catch (err) {
    if (err.isYourFormError) {
      console.log(
        "Caught SDK Error (Expected if backend is off):",
        err.name,
        "-",
        err.message,
      );
    } else {
      console.error("Unexpected Error:", err);
    }
  }

  console.log(
    "\nTest script finished. You can now use 'npm link' to test in other projects!",
  );
}

testDrive();
