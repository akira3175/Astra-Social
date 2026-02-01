<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    private string $cloudName;
    private string $apiKey;
    private string $apiSecret;
    private string $uploadPreset;

    public function __construct()
    {
        $this->cloudName = config('services.cloudinary.cloud_name');
        $this->apiKey = config('services.cloudinary.api_key');
        $this->apiSecret = config('services.cloudinary.api_secret');
        $this->uploadPreset = config('services.cloudinary.upload_preset', '');
    }

    /**
     * Upload a file to Cloudinary.
     *
     * @param UploadedFile $file
     * @param string $folder Optional folder path
     * @return array{success: bool, url?: string, public_id?: string, resource_type?: string, error?: string}
     */
    public function upload(UploadedFile $file, string $folder = 'uploads'): array
    {
        try {
            $resourceType = $this->detectResourceType($file);
            $timestamp = time();
            
            // Build parameters for signature
            $params = [
                'folder' => $folder,
                'timestamp' => $timestamp,
            ];

            // Generate signature
            $signature = $this->generateSignature($params);

            // Prepare multipart form data
            $response = Http::attach(
                'file',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post($this->getUploadUrl($resourceType), [
                'api_key' => $this->apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'folder' => $folder,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'url' => $data['secure_url'] ?? $data['url'],
                    'public_id' => $data['public_id'],
                    'resource_type' => $data['resource_type'],
                ];
            }

            Log::error('Cloudinary upload failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'Upload failed: ' . ($response->json()['error']['message'] ?? 'Unknown error'),
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary upload exception', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete a file from Cloudinary.
     *
     * @param string $publicId
     * @param string $resourceType
     * @return bool
     */
    public function delete(string $publicId, string $resourceType = 'image'): bool
    {
        try {
            $timestamp = time();
            $params = [
                'public_id' => $publicId,
                'timestamp' => $timestamp,
            ];

            $signature = $this->generateSignature($params);

            $response = Http::post($this->getDeleteUrl($resourceType), [
                'public_id' => $publicId,
                'api_key' => $this->apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
            ]);

            return $response->successful() && ($response->json()['result'] === 'ok');
        } catch (\Exception $e) {
            Log::error('Cloudinary delete exception', [
                'message' => $e->getMessage(),
                'public_id' => $publicId,
            ]);
            return false;
        }
    }

    /**
     * Detect resource type from file MIME type.
     */
    public function detectResourceType(UploadedFile $file): string
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        return 'raw'; // For other files (docs, PDFs, etc.)
    }

    /**
     * Detect file type for database storage.
     */
    public function detectFileType(UploadedFile $file): string
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            return 'IMAGE';
        }

        if (str_starts_with($mimeType, 'video/')) {
            return 'VIDEO';
        }

        return 'FILE';
    }

    /**
     * Generate Cloudinary signature.
     */
    private function generateSignature(array $params): string
    {
        ksort($params);
        
        // Build query string manually without URL encoding
        // Cloudinary expects raw values like "folder=posts/1" not "folder=posts%2F1"
        $parts = [];
        foreach ($params as $key => $value) {
            $parts[] = $key . '=' . $value;
        }
        $toSign = implode('&', $parts);
        
        return sha1($toSign . $this->apiSecret);
    }

    /**
     * Get upload URL for resource type.
     */
    private function getUploadUrl(string $resourceType): string
    {
        return "https://api.cloudinary.com/v1_1/{$this->cloudName}/{$resourceType}/upload";
    }

    /**
     * Get delete URL for resource type.
     */
    private function getDeleteUrl(string $resourceType): string
    {
        return "https://api.cloudinary.com/v1_1/{$this->cloudName}/{$resourceType}/destroy";
    }
}
