import { DIETS, type GenerateRequest } from "@/lib/schema";

const CUISINE_VI: Record<GenerateRequest["cuisine"], string> = {
  vietnamese: "Việt Nam",
  japanese: "Nhật Bản",
  korean: "Hàn Quốc",
  chinese: "Trung Hoa",
  thai: "Thái Lan",
  italian: "Ý",
  american: "Mỹ",
  mixed: "Kết hợp nhiều nền ẩm thực",
};

const DIET_VI: Record<(typeof DIETS)[number], string> = {
  regular: "Bình thường",
  healthy: "Lành mạnh",
  "high-protein": "Nhiều đạm",
  vegetarian: "Chay",
  "low-carb": "Ít tinh bột",
};

const OCCASION_VI: Record<NonNullable<GenerateRequest["occasion"]>, string> = {
  family: "Bữa cơm gia đình",
  date: "Bữa tối hẹn hò",
  weekend: "Bữa tối cuối tuần",
  friends: "Tụ tập bạn bè",
  comfort: "Món ăn an ủi",
};

/**
 * Frozen: no interpolation, no timestamps. Keeping this constant makes
 * responses reproducible and keeps the prefix cacheable.
 */
export const SYSTEM_INSTRUCTION = `Bạn là một người nội trợ Việt Nam giàu kinh nghiệm, nấu ăn ngon và biết tính toán chi tiêu.

Nhiệm vụ: đề xuất một thực đơn bữa tối hoàn chỉnh, kèm công thức và danh sách đi chợ.

Thứ tự ưu tiên khi chọn món:
1. Ngon và hấp dẫn.
2. Thực tế để nấu tại nhà.
3. Nằm trong ngân sách.
4. Cân bằng: có món mặn, có rau, và có canh khi phù hợp.
5. Tái sử dụng nguyên liệu giữa các món, giảm tối đa số nguyên liệu cần mua.
6. Đề xuất các món ăn phụ / đồ ăn kèm (sideDishes) như cơm trắng, dưa chua, cà muối, kim chi, nước chấm... ưu tiên tận dụng các đồ sẵn có tại nhà (gạo, cơm, dưa chua đã muối...) để không phát sinh chi phí.
7. Tổng thời gian nấu không vượt quá giới hạn được yêu cầu.
8. Ước tính dinh dưỡng hợp lý.

Quy tắc bắt buộc:
- Toàn bộ nội dung trả về bằng tiếng Việt.
- Tên thực đơn (menuName) viết theo cú pháp tiếng Việt chuẩn (viết hoa chữ cái đầu tiên, không viết hoa từng chữ kiểu Title Case).
- Chỉ dùng nguyên liệu dễ mua ở siêu thị và chợ Việt Nam.
- Giá tính theo VNĐ, sát giá thị trường Việt Nam, làm tròn thành số nguyên.
- Các món phải hợp nhau trong cùng một mâm cơm, không phải ba món rời rạc.
- Số lượng món chính tự quyết định từ 2 đến 4, tuỳ số người ăn và ngân sách. Nếu người dùng yêu cầu số món chính cụ thể, danh sách món trong dishes phải có đúng số lượng món chính đó.
- Tuyệt đối không tạo ra URL hay đường link bất kỳ.
- Mọi con số về giá và dinh dưỡng đều là ước tính.`;

export function buildUserPrompt(input: GenerateRequest): string {
  const lines: string[] = [
    `Số người ăn: ${input.people}`,
    `Ngân sách tối đa: ${input.budget} VNĐ`,
    `Ẩm thực: ${CUISINE_VI[input.cuisine]}`,
    `Thời gian nấu tối đa: ${input.maxCookTime} phút`,
  ];

  if (input.mainDishCount) {
    lines.push(`Số lượng món chính yêu cầu: đúng ${input.mainDishCount} món.`);
  }

  if (input.diet?.length) {
    lines.push(`Chế độ ăn: ${input.diet.map((d) => DIET_VI[d]).join(", ")}`);
  }
  if (input.occasion) lines.push(`Dịp: ${OCCASION_VI[input.occasion]}`);

  if (input.availableIngredients?.length) {
    lines.push(
      `Nguyên liệu sẵn có (ưu tiên dùng, và xếp vào mục "đã có" thay vì "cần mua"): ${input.availableIngredients.join(", ")}`,
    );
  }

  if (input.avoidIngredients?.length) {
    lines.push(`Nguyên liệu cần tránh: ${input.avoidIngredients.join(", ")}`);
  }

  if (input.desiredDishes?.length) {
    lines.push(
      `Món ăn ưu tiên có trong thực đơn (hãy đưa các món này vào thực đơn nếu phù hợp ngân sách và thời gian): ${input.desiredDishes.join(", ")}`,
    );
  }

  if (input.recentDishes?.length) {
    lines.push(
      `Tránh lặp lại những món đã nấu trong tuần vừa rồi: ${input.recentDishes.join(", ")}`,
    );
  }

  if (input.note?.trim()) {
    lines.push(`Ghi chú thêm từ người dùng: ${input.note.trim()}`);
  }

  return lines.join("\n");
}
