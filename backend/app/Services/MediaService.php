<?php

namespace App\Services;

use App\Models\MediaAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class MediaService
{
    public function __construct(
        private CloudinaryService $cloudinaryService
    ) {}

    /**
     * Upload files and create media attachments for an entity.
     *
     * @param array<UploadedFile>|UploadedFile $files
     * @param string $entityType POST, COMMENT, MESSAGE
     * @param int $entityId
     * @param string $folder Cloudinary folder
     * @return Collection<MediaAttachment>
     */
    public function uploadForEntity(
        array|UploadedFile $files,
        string $entityType,
        int $entityId,
        string $folder = 'uploads'
    ): Collection {
        $files = is_array($files) ? $files : [$files];
        $attachments = collect();

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $result = $this->cloudinaryService->upload($file, $folder);

            if ($result['success']) {
                $attachment = MediaAttachment::create([
                    'url' => $result['url'],
                    'file_type' => $this->cloudinaryService->detectFileType($file),
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'created_at' => now(),
                ]);

                $attachments->push($attachment);
            }
        }

        return $attachments;
    }

    /**
     * Get all attachments for an entity.
     *
     * @param string $entityType
     * @param int $entityId
     * @return Collection<MediaAttachment>
     */
    public function getForEntity(string $entityType, int $entityId): Collection
    {
        return MediaAttachment::forEntity($entityType, $entityId)->get();
    }

    /**
     * Delete all attachments for an entity.
     *
     * @param string $entityType
     * @param int $entityId
     * @return int Number of deleted attachments
     */
    public function deleteForEntity(string $entityType, int $entityId): int
    {
        $attachments = $this->getForEntity($entityType, $entityId);
        $count = 0;

        foreach ($attachments as $attachment) {
            if ($this->deleteAttachment($attachment)) {
                $count++;
            }
        }

        return $count;
    }

    /**
     * Delete a single attachment.
     *
     * @param MediaAttachment $attachment
     * @return bool
     */
    public function deleteAttachment(MediaAttachment $attachment): bool
    {
        // Extract public_id from URL for Cloudinary deletion
        $publicId = $this->extractPublicId($attachment->url);
        $resourceType = $this->mapFileTypeToResource($attachment->file_type);

        if ($publicId) {
            $this->cloudinaryService->delete($publicId, $resourceType);
        }

        return $attachment->delete();
    }

    /**
     * Delete attachment by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteById(int $id): bool
    {
        $attachment = MediaAttachment::find($id);

        if (!$attachment) {
            return false;
        }

        return $this->deleteAttachment($attachment);
    }

    /**
     * Extract public_id from Cloudinary URL.
     */
    private function extractPublicId(string $url): ?string
    {
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
        if (preg_match('/\/upload\/(?:v\d+\/)?(.+)\.\w+$/', $url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Map file type to Cloudinary resource type.
     */
    private function mapFileTypeToResource(string $fileType): string
    {
        return match ($fileType) {
            'IMAGE' => 'image',
            'VIDEO' => 'video',
            default => 'raw',
        };
    }
}
