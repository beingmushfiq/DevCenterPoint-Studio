<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminMediaController extends Controller
{
    /**
     * Upload an image to public storage.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // max 5MB (raster only to prevent SVG script execution)
        ]);

        $file = $request->file('file');
        $safeExtension = $file->extension() ?: 'jpg';
        $safeBase = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'upload';
        $filename = time() . '_' . $safeBase . '.' . $safeExtension;

        $destinationPath = public_path('uploads');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $filename);
        $url = asset('uploads/' . $filename);

        return response()->json([
            'success' => true,
            'url' => $url,
            'filename' => $filename,
        ]);
    }
}
