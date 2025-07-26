import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Get API key from header
        const apiKey = request.headers.get('X-API-Key')

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key is required' },
                { status: 401 }
            )
        }

        // Create FormData for the backend request
        const formData = await request.formData()

        // Forward the request to the backend
        const backendResponse = await fetch('https://be.eksportal.my.id/api/chatbot/ask/', {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey,
                // Include Authorization if present
                ...(request.headers.get('Authorization') && {
                    'Authorization': request.headers.get('Authorization')!
                })
            },
            body: formData
        })

        const responseData = await backendResponse.json()

        // Return the backend response with proper CORS headers
        return NextResponse.json(responseData, {
            status: backendResponse.status,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
            }
        })

    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Handle preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
        },
    })
}
