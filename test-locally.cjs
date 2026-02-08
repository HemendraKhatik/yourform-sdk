const { YourForm } = require("./dist/index");

// 1. Set your local configuration
// For local testing, ensure your 'openform' backend is running on http://localhost:3000
const yourform = new YourForm({
  apiKey: "yf_live_4d2c049e14b29ebf035394c00be9ade2421ecf42b47efce4", // Use a test API key for local development
  baseUrl: "http://localhost:3000/api/v1",
});

async function testLocalFlow() {
  console.log("🚀 Starting Local Integration Test...");

  try {
    console.log("\nStep 1: Creating a feedback form...");
    const form = await yourform.forms.create({
      title: "Local Test Form",
      description: "Testing form creation from local SDK",
      style: "classic",
      questions: [
        { type: "short_text", title: "Name", required: true },
        { type: "email", title: "Email", required: true },
      ],
    });

    console.log("✅ Success! Form Created:");
    console.log(`   ID: ${form.id}`);
    console.log(`   Title: ${form.title}`);
    console.log(`   Questions: ${form.questions.length}`);

    console.log("\nStep 2: Listing all forms...");
    const forms = await yourform.forms.list();
    console.log(`✅ Success! Found ${forms.length} forms.`);
  } catch (err) {
    if (err.isYourFormError) {
      console.log("\n❌ SDK Error Catch:");
      console.log(`   Name: ${err.name}`);
      console.log(`   Message: ${err.message}`);
      if (err.details)
        console.log("   Details:", JSON.stringify(err.details, null, 2));
    } else {
      console.error("\n❌ Unexpected Error:", err);
    }
    process.exit(1);
  }
}

testLocalFlow();
