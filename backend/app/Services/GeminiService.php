<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    /**
     * Improve the quality of existing post text.
     */
    public function improveText(string $text): string
    {
        $prompt = <<<PROMPT
Bạn là một trợ lý viết nội dung mạng xã hội. Hãy cải thiện bài đăng sau đây:
- Giữ nguyên ý nghĩa và giọng điệu gốc
- Viết tự nhiên, hấp dẫn hơn
- Thêm hashtag phù hợp ở cuối (tối đa 5 hashtag)
- Trả về chỉ nội dung bài đăng đã cải thiện, không giải thích gì thêm

Bài đăng gốc:
{$text}
PROMPT;

        return $this->callGemini([
            [
                'parts' => [['text' => $prompt]]
            ]
        ]);
    }

    /**
     * Generate a post caption from base64-encoded images.
     */
    public function generateCaptionFromImages(array $base64Images, array $mimeTypes = []): string
    {
        $parts = [];

        foreach ($base64Images as $index => $base64) {
            $mime = $mimeTypes[$index] ?? 'image/jpeg';
            $parts[] = [
                'inline_data' => [
                    'mime_type' => $mime,
                    'data'      => $base64,
                ]
            ];
        }

        $parts[] = [
            'text' => 'Dựa trên ảnh trên, hãy viết một bài đăng mạng xã hội bằng tiếng Việt. Nội dung phải hấp dẫn, tự nhiên và thêm hashtag phù hợp ở cuối (tối đa 5 hashtag). Chỉ trả về nội dung bài đăng, không giải thích thêm.'
        ];

        return $this->callGemini([
            ['parts' => $parts]
        ]);
    }

    /**
     * Send request to Gemini API.
     */
    private function callGemini(array $contents): string
    {
        $apiKey = config('services.gemini.api_key');

        // Fallback to env() in case config is stale
        if (empty($apiKey)) {
            $apiKey = env('GEMINI_API_KEY');
        }

        if (empty($apiKey)) {
            Log::error('Gemini API Key missing', [
                'config_val' => config('services.gemini.api_key'),
                'env_val' => env('GEMINI_API_KEY') ? 'exists' : 'null',
            ]);
            throw new \RuntimeException('GEMINI_API_KEY chưa được cấu hình. Hãy kiểm tra file .env và restart server.');
        }

        $response = Http::timeout(30)
            ->withQueryParameters(['key' => $apiKey])
            ->post($this->apiUrl, [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature'     => 0.8,
                    'maxOutputTokens' => 8192,
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new \RuntimeException('Gemini API lỗi: ' . $response->status());
        }

        $data = $response->json();
        $candidate = $data['candidates'][0] ?? null;

        if (!$candidate) {
            throw new \RuntimeException('Gemini API không trả về kết quả');
        }

        if (($candidate['finishReason'] ?? '') === 'MAX_TOKENS') {
            Log::warning('Gemini response truncated due to MAX_TOKENS');
        }

        return $candidate['content']['parts'][0]['text']
            ?? throw new \RuntimeException('Gemini API trả về dữ liệu không hợp lệ');
    }
}
