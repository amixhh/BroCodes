import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { code, language } = await request.json();
    const clientId = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // Ensure versionIndex is correct
    const versionIndexes = {
      python3: "3",
      cpp17: "0",
      java: "4",
      javascript: "4",
    };

    if (!versionIndexes[language]) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId,
        clientSecret,
        script: code,
        language,
        versionIndex: versionIndexes[language]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    console.error("JDoodle API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: "Failed to execute code",
        details: error.response?.data || error.message 
      },
      { status: 500 }
    );
  }
}