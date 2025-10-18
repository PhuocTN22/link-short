<?php
/**
 * POST /api/shorten
 * Validate URL, tạo slug 6-8 ký tự, lưu DB, trả short_url.
 */
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ShortenController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'url' => ['required', 'string', 'url'],
        ]);

        $slug = $this->uniqueSlug();

        $url = DB::transaction(function () use ($data, $slug) {
            return Url::create([
                'slug' => $slug,
                'target_url' => $data['url'],
            ]);
        });

        $base = config('app.url'); // APP_URL
        return response()->json([
            'id'        => $url->id,
            'slug'      => $url->slug,
            'short_url' => rtrim($base, '/') . '/r/' . $url->slug,
        ], 201);
    }

    private function uniqueSlug(): string
    {
        for ($i = 0; $i < 6; $i++) {
            $slug = Str::lower(Str::random(random_int(6, 8)));
            if (! Url::where('slug', $slug)->exists()) {
                return $slug;
            }
        }
        throw ValidationException::withMessages(['url' => 'Không thể sinh slug, vui lòng thử lại.']);
    }
}