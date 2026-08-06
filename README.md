# Dinner AI — Tối nay nhà mình ăn gì?

Dinner AI là ứng dụng web trợ lý ẩm thực thông minh, giúp người dùng giải quyết nhanh chóng câu hỏi "Tối nay ăn gì?". Dựa trên số lượng người ăn, ngân sách, thời gian nấu và sở thích cá nhân, hệ thống tự động thiết lập thực đơn bữa tối hoàn chỉnh với công thức chi tiết, tính toán dinh dưỡng và danh sách đi chợ tiết kiệm.

## Tính năng chính

- **Gợi ý thực đơn tối ưu bằng AI**: Tự động cân đối các món mặn, món xào, món canh phù hợp với mâm cơm Việt Nam hoặc các phong cách ẩm thực khác (Nhật, Hàn, Trung, Thái, Ý, Mỹ).
- **Tùy chỉnh linh hoạt**:
  - Chọn chính xác số lượng món chính (2 món, 3 món, 4 món hoặc AI tự động đề xuất).
  - Nhập món ăn mong muốn có trong thực đơn.
  - Tùy chọn nguyên liệu sẵn có tại nhà để tận dụng tối đa.
  - Loại bỏ các nguyên liệu cần tránh hoặc dị ứng.
  - Thiết lập chế độ ăn (Lành mạnh, Nhiều đạm, Chay, Ít tinh bột) và dịp ăn uống (Gia đình, Hẹn hò, Cuối tuần).
- **Món phụ và đồ ăn kèm**: Tự động đề xuất các món phụ (cơm trắng, dưa chua, cà muối, nước chấm...) tận dụng nguồn nguyên liệu có sẵn tại nhà để không phát sinh chi phí.
- **Công thức & Dinh dưỡng chi tiết**:
  - Hướng dẫn chế biến từng bước rõ ràng.
  - Định lượng nguyên liệu chính xác.
  - Ước tính calo, đạm (protein), tinh bột (carbs) và chất béo (fat).
  - Tích hợp liên kết tìm kiếm công thức trên YouTube và Google.
- **Danh sách đi chợ hợp nhất**: Tự động tổng hợp và phân loại nguyên liệu thành hai mục "Cần mua" và "Đã có sẵn tại nhà".
- **Xuất ảnh thực đơn**: Tải thực đơn hoàn chỉnh dưới dạng file ảnh PNG chất lượng cao để lưu trực tiếp vào máy điện thoại hoặc máy tính.
- **Quản lý lịch sử thông minh**: Lưu thực đơn gần nhất và quản lý lịch sử theo từng ngày. Khi người dùng tạo lại thực đơn trong cùng một ngày, hệ thống sẽ tự động cập nhật bản mới nhất.

## Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Styling**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **AI Engine**: Google GenAI SDK (`@google/genai` sử dụng mô hình Gemini 2.5 Flash)
- **Validation**: Zod & Zod JSON Schema (Đảm bảo cấu trúc dữ liệu trả về từ Gemini AI)
- **Xuất ảnh**: `html-to-image`
- **Testing**: Vitest, React Testing Library, Testing Library User Event

## Cấu trúc dự án

```text
cooking/
├── app/                  # Route handlers và Layouts (App Router)
│   ├── api/generate/     # API Route xử lý streaming thực đơn từ Gemini
│   ├── globals.css       # Style toàn cục
│   ├── layout.tsx        # Root Layout và cấu hình Metadata / OpenGraph
│   └── page.tsx          # Trang chính ứng dụng
├── components/           # Các React Component
│   ├── ui/               # Custom UI controls (Select, Alert, Modal)
│   ├── dish-card.tsx     # Thẻ hiển thị món ăn và công thức
│   ├── history-bar.tsx   # Thanh hiển thị lịch sử món đã nấu
│   ├── menu-export-card.tsx # Bố cục xuất ảnh thực đơn
│   ├── menu-result.tsx   # Hiển thị kết quả thực đơn
│   ├── preference-form.tsx # Form nhập tùy chọn thực đơn
│   └── shopping-list.tsx # Danh sách đi chợ
├── lib/                  # Thư viện và hàm bổ trợ
│   ├── export-image.ts   # Hàm xử lý xuất ảnh PNG
│   ├── format.ts         # Định dạng tiền tệ VNĐ và chuỗi
│   ├── history.ts        # Quản lý lưu trữ localStorage
│   ├── links.ts          # Tạo URL tìm kiếm YouTube và Google
│   ├── prompt.ts         # System instruction và generator prompt cho Gemini
│   ├── rate-limit.ts     # Giới hạn tần suất gọi API
│   └── schema.ts         # Định nghĩa Zod Schemas và Gemini JSON Schema
├── public/               # Tài nguyên tĩnh (Favicon, App Icons, Manifest, OG Images)
└── docs/                 # Tài liệu thiết kế và kế hoạch triển khai
```

## Cài đặt và khởi chạy

### 1. Yêu cầu hệ thống

- Node.js version 18.x trở lên
- Yarn package manager

### 2. Cài đặt Dependencies

```bash
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc của dự án và điền Gemini API Key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SITE_URL=https://dinner-ai.vercel.app
```

### 4. Khởi chạy môi trường phát triển

```bash
yarn dev
```

Mở trình duyệt và truy cập: `http://localhost:3000`

### 5. Chạy bộ kiểm thử (Unit Tests)

```bash
yarn test
```

### 6. Biên dịch ứng dụng cho Production

```bash
yarn build
```

Chạy bản build Production:

```bash
yarn start
```

## Giấy phép

Dự án được phát triển riêng bởi `@yun.khngn`.
