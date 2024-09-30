/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ //Gọi hàm để lấy mô hình Generative AI. sử dụng mô hình "gemini-1.5-flash"
  model: "gemini-1.5-flash",
});

const generationConfig = {
  // Cấu hình các tham số cho việc sinh nội dung từ AI
  temperature: 1, // giá trị nhiệt độ điều chỉnh sự ngẫu nhiên trong phản hồi. GT (1) tạo kQ ngẫu nhiên, GT thấp tạo ra kết quả có tính chắc chắn
  topP: 0.95, // Điều chỉnh xác suất tích lũy của các từ được chọn, giúp kiểm soát sự đa dạng trong các lựa chọn từ.
  //0.95 có nghĩa là sẽ chọn từ có xác suất cao nhất nhưng vẫn có chút ngẫu nhiên.
  topK: 64, //Chọn từ trong top 64 từ có xác suất cao nhất để tạo ra câu trả lời.
  maxOutputTokens: 8192, //Số lượng token tối đa mà mô hình có thể tạo ra trong một lần trả lời. 8192 token là một giới hạn khá cao.
  responseMimeType: "text/plain", // Định dạng của phản hồi. Ở đây, định dạng phản hồi là văn bản thuần
};

const safetySetting = [
  // ngăn chặn mô hình tạo ra các nội dung độc hại.
  /**
   * HarmBlockThreshold: Mức độ lọc nội dung có hại. 
   * BLOCK_LOW_AND_ABOVE có nghĩa là các nội dung có khả năng gây hại thấp trở lên đều sẽ bị chặn.
   */
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];
 
//gửi yêu cầu đầu vào và nhận phản hồi từ mô hình
async function run(textInput, chatHistory) {
  //nhận vào 2 tham số: textInput - chatHistory
  const history = (chatHistory || []).map((item) => {
    /**
     * istory = (chatHistory || []).map(...): Nếu chatHistory là mảng hợp lệ.
     * nó sẽ được chuyển thành định dạng yêu cầu với role là user.
     * hoặc model (tùy thuộc vào việc tin nhắn đến từ người dùng hay bot) và parts là văn bản của tin nhắn.
     */
    return {
      role: item.isBot ? "model" : "user",
      parts: [{ text: item.text }],
    };
  });
  /**
   * Gọi hàm startChat với cấu hình tạo văn bản (generationConfig), cài đặt an toàn (safetySetting). 
   * và lịch sử trò chuyện đã xử lý. Điều này sẽ bắt đầu một phiên làm việc với AI.
   */
  const chatSession = model.startChat({
    generationConfig,
    safetySetting,
    history: history,
  });

  const result = await chatSession.sendMessage(textInput); // Gửi tin nhắn từ textInput đến AI. Kết quả là một phản hồi được trả về.
  return result.response.text(); // Trả về phản hồi dưới dạng văn bản thuần túy từ AI.
}

export default run;