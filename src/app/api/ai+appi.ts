import OpenAi from "openai";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { exerciseName } = await request.json();

  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 404 },
    );
  }

  const prompt = `
  You are a fitness coach.
  You are given na exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required.
  
  Explain the exercise in detail and for a baginner.
  
  The exercise name is: ${exerciseName}

  Keep it short and concise. Use markdown formatting.

  Use the following format:

  ## Equipment Required

  ## Instructions

  ## Tips

  ## Variations

  ## Safety

  Keep spacing between the headings and the content.

  Always use headings and subheadings.
  `;
}
