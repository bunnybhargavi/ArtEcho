
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Image URL is required', { status: 400 });
  }

  try {
    // Fetch the image from the external URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    // Get the image data as a blob
    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Convert the blob to a base64 data URI
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    // Return the data URI in the response
    return NextResponse.json({ dataUri });

  } catch (error) {
    console.error('Error in proxy-image API route:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to proxy image', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

