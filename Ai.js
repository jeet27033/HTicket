import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const Ai = async (input) => {
    const response = await client.responses.create({
        model: "gpt-4o",
        input: input
    });
    return response.output_text;
}

export default Ai;