<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $id   = $request->query('urlId');
        $slug = $request->query('slug');
        $full = $request->query('url'); // cho phép truyền cả short URL đầy đủ

        // Nếu có url=... thì parse slug từ /r/{slug}
        if ($full && !$slug) {
            try {
                $p = parse_url($full, PHP_URL_PATH) ?? '';
                $parts = array_values(array_filter(explode('/', $p)));
                $rIdx  = array_search('r', $parts, true);
                if ($rIdx !== false && isset($parts[$rIdx+1])) {
                    $slug = $parts[$rIdx+1];
                } elseif (!empty($parts)) {
                    $slug = end($parts);
                }
            } catch (\Throwable $e) {
                // bỏ qua, sẽ 422 bên dưới nếu không tìm được
            }
        }

        if ($id) {
            $url = Url::findOrFail((int)$id);
        } elseif ($slug) {
            $url = Url::where('slug', $slug)->firstOrFail();
        } else {
            abort(422, 'Require one of: urlId, slug, or url');
        }
        // Nếu có cột clicks_count thì dùng, không thì COUNT(*)
                $count = Schema::hasColumn('urls', 'clicks_count')
                    ? (int) $url->clicks_count
                    : (int) $url->clicks()->count();

        $recent = $url->clicks()
            ->latest('created_at')
            ->limit(20)
            ->get(['id','ip','user_agent','referrer','country','created_at']);

        return response()->json([
            'url'           => ['id'=>$url->id,'slug'=>$url->slug,'target_url'=>$url->target_url],
            'clicks_count'  => $count,
            'recent_clicks' => $recent,
        ]);
    }
}
