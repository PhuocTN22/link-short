# 🔗 URL Shortener (Laravel + Next.js + Docker)

Ứng dụng **rút gọn link** có tính năng **thống kê số lượt click**.

Dự án gồm hai phần:

- 🧱 **Backend:** Laravel (PHP 8.2, PostgreSQL, Redis, MinIO)
- 💻 **Frontend:** Next.js (React 18, TailwindCSS)
- 🐳 **Triển khai toàn bộ bằng Docker Compose**

---

## ✨ Tính năng

✅ Rút gọn link (tạo slug ngắn như `/r/qnxqetx`)  
✅ Thống kê tổng số lượt click và chi tiết từng lần truy cập (IP, thời gian, user agent)  
✅ Hỗ trợ HTTPS local qua Nginx reverse proxy  
✅ MinIO làm S3 object storage tương thích AWS  
✅ Redis dùng cho cache & queue  

---

## 🧩 Kiến trúc hệ thống
```bash
Docker Compose
├── laravel (Backend API – Laravel 11)
├── nextjs (Frontend – Next.js 14)
├── postgres (CSDL chính)
├── redis (Cache + queue)
├── minio (Giả lập AWS S3)
└── nginx (Reverse proxy HTTPS cho frontend & backend)
```
yaml
Copy code

---

## ⚙️ Cách chạy bằng Docker

### 1️⃣ Clone dự án

```bash
git clone https://github.com/<your-username>/link-short.git
cd link-short
```
### 2️⃣ Tạo file .env cho backend
```bash
Tạo file .env trong thư mục backend/ (hoặc sao chép .env.example):
env
Copy code
APP_NAME="URL Shortener"
APP_ENV=production
APP_KEY=base64:o9TzU9JYvWgC2Pv2E+S+KkuqvDy5xO7K8bR3vO20eNE=
APP_DEBUG=false
APP_URL=https://localhost

LOG_CHANNEL=stack
LOG_LEVEL=info

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=appdb
DB_USERNAME=app
DB_PASSWORD=app_password

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minio
AWS_SECRET_ACCESS_KEY=minio12345
AWS_DEFAULT_REGION=auto
AWS_BUCKET=uploads
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```
### 3️⃣ Build & khởi động toàn bộ stack
```bash
Copy code
docker compose build
docker compose up -d
```
### 4️⃣ Sinh key cho Laravel
```bash
Copy code
docker compose exec laravel php artisan key:generate --force
```
### 5️⃣ Chạy migration
```bash
Copy code
docker compose exec laravel php artisan migrate --force
```
### 6️⃣ Truy cập ứng dụng
```bash
Thành phần	URL
🌐 Frontend	https://localhost
⚙️ Backend API	https://localhost/api
💾 MinIO Console	http://localhost:9001
🐘 PostgreSQL	postgresql://app:app_password@localhost:5432/appdb

⚠️ Nếu trình duyệt cảnh báo chứng chỉ tự ký → chọn “Advanced → Proceed anyway” để tiếp tục.

💻 Frontend – Next.js
📁 Cấu trúc
Toàn bộ mã giao diện nằm trong thư mục frontend/.

Cách cài đặt và chạy (thủ công, không dùng Docker)
bash
Copy code
# Di chuyển vào thư mục frontend
cd frontend

# Cài dependencies
npm install

# Sao chép file cấu hình mẫu
cp .env.example .env

# ⚙️ Chỉnh biến API nếu backend chạy port khác
# VITE_API_BASE=https://localhost/api

# Chạy môi trường dev (hot reload)
npm run dev

# Build production và chạy thử preview
npm run build && npm run preview
Dev mode: http://localhost:3000

Production (qua nginx): https://localhost

📊 Giao diện thống kê
Giao diện hiển thị:

Tổng số lượt click

Lịch sử click gần nhất (thời gian, IP, trình duyệt)

🧰 Một số lệnh hữu ích
Lệnh	Mô tả
docker compose up -d	Chạy toàn bộ hệ thống
docker compose down	Dừng container
docker compose exec laravel php artisan migrate	Chạy migration
docker compose exec laravel php artisan tinker	Chạy Tinker
docker compose logs laravel	Xem log Laravel
docker compose logs nginx --since 5m	Xem log nginx gần đây
docker compose restart nginx laravel	Khởi động lại web service
```

### 📂 Cấu trúc thư mục
```bash
Copy code
.
├── 📁 backend/               # 🧱 Laravel app (Backend)
│   ├── 📁 app/Models/
│   ├── 📁 database/migrations/
│   ├── 📄 routes/web.php
│   ├── ⚙️ .env
│   └── 📄 composer.json
│
├── 💻 frontend/              # 🌐 Next.js app (Frontend)
│   ├── 📁 app/
│   ├── 📁 components/
│   ├── 📁 lib/api.ts
│   ├── 📄 package.json
│   └── ⚙️ tailwind.config.js
│
├── 🐳 docker/
│   ├── 📄 laravel/Dockerfile
│   └── 📄 nginx/Dockerfile
|   └── 📄 frontend/Dockerfile
|   └── 📁 cert
|        └── 📄fullchain.pem
|        └── 📄privatekey.pem
│
├── ⚙️ docker-compose.yml
└── 📘 README.md
```
