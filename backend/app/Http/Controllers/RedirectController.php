<?php

namespace App\Http\Controllers;

use App\Models\Click;
use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RedirectController extends Controller
{
    public function __invoke(Request $request, string $slug)
    {
        $url = Url::where('slug', $slug)->firstOrFail();

        DB::transaction(function () use ($request, $url) {
            // Ghi 1 bản ghi chi tiết
            Click::create([
                'url_id'     => $url->id,
                'ip'         => $request->ip(),
                'user_agent' => substr($request->userAgent() ?? '', 0, 1024),
                'referrer'   => substr($request->headers->get('referer', ''), 0, 1024),
                'country'    => null, // nếu có geoip thì set ở đây
            ]);
            $url->increment('clicks_count');
        });

        return redirect()->away($url->target_url, 302);
    }
}
