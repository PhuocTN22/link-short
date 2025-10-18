<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // FE chạy trên https://localhost qua Nginx
    'allowed_origins' => ['https://localhost'],
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],
    'exposed_headers' => [],

    'max_age' => 0,

    // Để false nếu không dùng cookie; true nếu cần gửi cookie/credentials
    'supports_credentials' => false,
];
