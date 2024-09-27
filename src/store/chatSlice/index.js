import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
import DOMPurify from "dompurify";


const initialData = { // trạng thái khởi tạo
 data: [], //
};

/*
mảng chứa các cuộc trò chuyện có cấu trúc như sau (giá trị khởi tạo lúc đầu của data là một mảng rỗng)
data:[
    {
        id: 1,
        title: 'qweqweqw,
        messages: [
            {id: 1, text: 'MernStack là gì', isBot: false},
            {id: 2, text: 'MernStack là bộ combo công nghệ', isBot: true},
        ]
        
    }
]

*/

const ChatSlice = createSlice({
  // khởi tạo 1 slice mới với tên chat và được khởi tạo với initialData
  name: "chat",
  initialState: initialData,
  reducers: {
    // chứa các hàm xử lý để cập nhật trạng thái của slice
    addChat: (state) => {
      // function: thêm một cuộc trò chuyện mới vào mảng
      state.data.push({
        // thêm một phần tử mới vào mảng
        id: uuidv4(), // giá trị duy nhất được tạo bởi uuidv4(),
        title: "chat",
        messages: [], // mảng rỗng chứa tin nhắn
      });
    },
    addChatMessage: (state, action) => {
      //  Thêm tin nhắn từ người dùng và bot vào một cuộc trò chuyện đã có
      const { idChat, userMess, botMess } = action.payload; // dữ liệu truyền vào reducer
      /**
       * idChat: ID của cuộc trò chuyện mà bạn muốn thêm tin nhắn.
       * userMess: Tin nhắn từ người dùng.
       * botMess: Tin nhắn từ bot (ở đây là nội dung đã được định dạng Markdown).
       */
      const chat = state.data.find((chat) => chat.id === idChat); // tìm cuộc trò chuyện với id trùng với idchat
      if (chat) {
        const messageFormat = marked.parse(botMess); // chuyển đổi tin nhắn của bot từ Markdown sang HTML.
        const safeChat = DOMPurify.sanitize(messageFormat); // làm sạch nội dung HTML để tránh các mã độc.
        const newMessage = [
          ...chat.messages,
          { id: uuidv4(), text: userMess, isBot: false }, // tin nhắn của người dùng, với isBot là false.
          { id: uuidv4(), text: safeChat, isBot: true }, // tin nhắn của bot, với nội dung đã được làm sạch và isBot là true.
        ];
      }

      chat.messages = newMessage; // gán và cập nhật tin nhắn trò chuyện
    },
  },
  // thay đổi tiêu đề của cuộc trò chuyện có id trùng với chatId.
  removeChat: (state, action) => {
    const { newTilte, chatId } = action.payload; // nhận newTilte, chatId là 2 tham số đầu vào
    const chat = state.data.find((chat) => chat.id === chatId); // tìm kiếm id cuộc trò chuyện
    if (chat) {
      chat.title = newTilte; //nếu tìm thấy thì cập nhật chat.title với newTilte.
    }
  },
});

// xuất các hành động và reducer
export const { addChat, removeChat, addMessage, setNameChat } =
  ChatSlice.actions;

export default ChatSlice.reducer;