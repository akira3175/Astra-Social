<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function __construct(
        private GeminiService $geminiService
    ) {}

    /**
     * Improve the text content of a post.
     *
     * POST /ai/improve-text
     * Body: { "text": "..." }
     */
    public function improveText(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string|min:5|max:5000',
        ]);

        try {
            $improved = $this->geminiService->improveText($request->input('text'));

            return response()->json([
                'success' => true,
                'data'    => ['text' => $improved],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate a post caption from uploaded images.
     *
     * POST /ai/generate-caption
     * Body: { "images": ["base64...", ...], "mime_types": ["image/jpeg", ...] }
     */
    public function generateCaption(Request $request): JsonResponse
    {
        $request->validate([
            'images'            => 'required|array|min:1|max:4',
            'images.*'          => 'required|string',
            'mime_types'        => 'sometimes|array',
            'mime_types.*'      => 'string',
        ]);

        try {
            $caption = $this->geminiService->generateCaptionFromImages(
                $request->input('images'),
                $request->input('mime_types', [])
            );

            return response()->json([
                'success' => true,
                'data'    => ['text' => $caption],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
