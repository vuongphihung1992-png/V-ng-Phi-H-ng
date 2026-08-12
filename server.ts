import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  let aiClient: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // System instruction for Pơng Drang Commune Police AI Assistant
  const SYSTEM_INSTRUCTION = `Bạn là Trợ lý ảo AI chính thức của Công an xã Pơng Drang, tỉnh Đắk Lắk.
Nhiệm vụ của bạn là giải đáp thắc mắc của người dân một cách lịch sự, chính xác, ngắn gọn, dễ hiểu và chu đáo.

THÔNG TIN ĐƠN VỊ CÔNG AN XÃ PƠNG DRANG:
- Địa chỉ trụ sở: Thôn 3, xã Pơng Drang, tỉnh Đắk Lắk.
- Số điện thoại Trực ban Công an xã: 02623539777 (Tiếp nhận tin báo ANTT, sự cố khẩn cấp 24/7)
- Số điện thoại Trực ban Hình sự: 02623608839 (Tố giác tội phạm khẩn cấp)
- Cứu hỏa khẩn cấp: 114 | Cấp cứu y tế: 115
- Lịch tiếp công dân làm thủ tục hành chính: Thứ 2 đến Thứ 6 (Sáng 07h30 - 11h30, Chiều 13h30 - 17h00). Thứ 7, Chủ Nhật và ngày Lễ: Duy trì trực ban an ninh trật tự 24/24h.
- Địa bàn quản lý: Gồm 12 Thôn (Thôn 1, Thôn 2, Thôn 3, Thôn 4, Thôn 5, Thôn 6, Thôn 7, Thôn 8, Thôn Ea Nur, Thôn Ea Tút, Thôn Cư Blang, Thôn Tâng Mai).

HƯỚNG DẪN THỦ TỤC HÀNH CHÍNH PHỔ BIẾN:
1. Đăng ký tạm trú / thường trú: Cần CCCD gắn chip, giấy tờ chứng minh chỗ ở hợp pháp (sổ đỏ/hợp đồng thuê nhà/xác nhận chủ hộ). Nộp trực tiếp tại Công an xã hoặc trực tuyến qua Cổng dịch vụ công Bộ Công an.
2. Giấy xác nhận thông tin về cư trú (Mẫu CT07): Nộp hồ sơ trên Cổng dịch vụ công Bộ Công an hoặc đến Công an xã mang theo CCCD.
3. Kích hoạt tài khoản VNeID mức 2: Mang theo CCCD gắn chip đến trụ sở Công an xã trong giờ hành chính để cán bộ thu nhận vân tay, chụp ảnh khuôn mặt.
4. Cấp đổi CCCD / Thẻ Căn cước: Thực hiện tại Bộ phận một cửa Công an huyện Krông Búk hoặc điểm lưu động Công an xã.
5. Phản ánh ANTT khẩn cấp: Gọi ngay 02623539777 hoặc gửi qua tính năng "Gửi phản ánh ANTT" trên website.

QUY TẮC TRẢ LỜI:
- Luôn giữ thái độ tôn trọng, chuẩn mực CAND ("Kính chào Ông/Bà...", "Trợ lý AI Công an xã Pơng Drang xin giải đáp...").
- Trả lời đúng trọng tâm, trình bày rõ ràng từng bước.
- Cung cấp kèm số điện thoại liên hệ khẩn cấp khi cần thiết.
- Khuyên người dân cảnh giác với các chiêu trò lừa đảo qua mạng (không chuyển tiền cho người lạ, không truy cập đường link lạ).`;

  // API Route for AI Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Nội dung tin nhắn không hợp lệ." });
      }

      // Check if Gemini API key exists
      if (!aiClient) {
        const fallbackReply = generateFallbackResponse(message);
        return res.json({ reply: fallbackReply, source: "knowledge_base" });
      }

      // Prepare contents payload with conversation history if available
      const contentsPayload: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach((item: { sender: string; text: string }) => {
          contentsPayload.push({
            role: item.sender === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        });
      }
      contentsPayload.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contentsPayload,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Xin lỗi, hiện tại trợ lý AI chưa thể xử lý câu hỏi này. Quý dân vui lòng liên hệ Trực ban Công an xã qua SĐT 02623539777.";
      return res.json({ reply: replyText, source: "gemini" });
    } catch (error: any) {
      console.error("Gemini API Chat Error:", error);
      const fallbackReply = generateFallbackResponse(req.body?.message || "");
      return res.json({
        reply: fallbackReply,
        source: "knowledge_base_fallback",
      });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Công an xã Pơng Drang" });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Công an xã Pơng Drang running at http://localhost:${PORT}`);
  });
}

// Fallback intelligent response generator if API key is not present or offline
function generateFallbackResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();

  if (lower.includes("sđt") || lower.includes("số điện thoại") || lower.includes("hotline") || lower.includes("gọi") || lower.includes("trực ban")) {
    return `Kính chào Ông/Bà, Công an xã Pơng Drang xin thông báo các số điện thoại liên hệ trực ban khẩn cấp 24/7:\n\n📞 **Trực ban Công an xã**: 02623539777 (Tiếp nhận tin báo ANTT)\n🚨 **Trực ban Hình sự**: 02623608839 (Tố giác tội phạm)\n🚒 **Cứu hỏa, cứu hộ**: 114\n\nTrụ sở Công an xã nằm tại: Thôn 3, xã Pơng Drang, tỉnh Đắk Lắk.`;
  }

  if (lower.includes("địa chỉ") || lower.includes("ở đâu") || lower.includes("vị trí") || lower.includes("trụ sở")) {
    return `Kính chào Ông/Bà, **Trụ sở Công an xã Pơng Drang** tọa lạc tại:\n\n📍 **Địa chỉ**: Thôn 3, xã Pơng Drang, tỉnh Đắk Lắk.\n⏰ **Lịch tiếp công dân**: Thứ 2 - Thứ 6 (07h30 - 11h30 & 13h30 - 17h00).\n\nÔng/Bà có thể bấm vào mục **"Trụ sở Công an xã"** trên giao diện ứng dụng để xem bản đồ chỉ đường Google Maps trực quan!`;
  }

  if (lower.includes("ct07") || lower.includes("xác nhận cư trú") || lower.includes("giấy cư trú")) {
    return `Kính chào Ông/Bà, để xin **Giấy xác nhận thông tin về cư trú (Mẫu CT07)** tại Công an xã Pơng Drang, Ông/Bà thực hiện như sau:\n\n1️⃣ **Hồ sơ gồm**: Thẻ CCCD gắn chip (hoặc tài khoản VNeID mức 2).\n2️⃣ **Nộp trực tuyến**: Truy cập Cổng dịch vụ công Bộ Công an chọn "Xác nhận thông tin về cư trú".\n3️⃣ **Nộp trực tiếp**: Đến trụ sở Công an xã (Thôn 3) gặp Cán bộ Đăng ký cư trú trong giờ hành chính.\n⏱️ Thời gian giải quyết: 1 - 3 ngày làm việc.`;
  }

  if (lower.includes("vneid") || lower.includes("định danh") || lower.includes("mức 2")) {
    return `Kính chào Ông/Bà, hướng dẫn đăng ký & kích hoạt **Tài khoản định danh điện tử VNeID mức 2**:\n\n1️⃣ **Địa điểm**: Trụ sở Công an xã Pơng Drang (Thôn 3).\n2️⃣ **Giấy tờ mang theo**: CCCD gắn chip (có thể mang thêm Giấy phép lái xe, Đăng ký xe, BHYT để tích hợp).\n3️⃣ **Quy trình**: Cán bộ thu nhận lăn vân tay, chụp ảnh chân dung và gửi yêu cầu cấp tài khoản.\n📞 Hỗ trợ hotline: 02623539777.`;
  }

  if (lower.includes("lịch") || lower.includes("giờ làm việc") || lower.includes("thời gian")) {
    return `Kính chào Ông/Bà, **Thời gian tiếp công dân** tại Công an xã Pơng Drang:\n\n🗓️ **Các ngày làm việc**: Từ Thứ 2 đến Thứ 6.\n⏰ **Giờ buổi sáng**: 07h30 – 11h30.\n⏰ **Giờ buổi chiều**: 13h30 – 17h00.\n🚨 **Thứ 7, CN, Lễ Tết**: Lực lượng Công an xã duy trì ca trực an ninh trật tự và tiếp nhận tin báo khẩn cấp 24/24h.`;
  }

  if (lower.includes("tạm trú") || lower.includes("thường trú") || lower.includes("khai báo")) {
    return `Kính chào Ông/Bà, hướng dẫn thủ tục **Đăng ký Tạm trú / Thường trú**:\n\n1️⃣ **Giấy tờ cần có**: Tờ khai thay đổi thông tin cư trú (CT01), CCCD, Giấy tờ chứng minh chỗ ở hợp pháp.\n2️⃣ **Cách thức**: Nộp qua Cổng dịch vụ công Bộ Công an hoặc trực tiếp tại Công an xã Pơng Drang (Thôn 3).\n📞 Thắc mắc xin gọi Trực ban: 02623539777.`;
  }

  return `Kính chào Ông/Bà, Trợ lý ảo AI Công an xã Pơng Drang xin ghi nhận câu hỏi. \n\nÔng/Bà có thể tra cứu nhanh các thông tin sau:\n- 📞 **SĐT Trực ban**: 02623539777\n- 🚨 **Trực ban Hình sự**: 02623608839\n- 📍 **Địa chỉ**: Thôn 3, xã Pơng Drang, tỉnh Đắk Lắk\n\nHoặc nộp câu hỏi chi tiết để được cán bộ hỗ trợ tư vấn trực tiếp!`;
}

startServer();
