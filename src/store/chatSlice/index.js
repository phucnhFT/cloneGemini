import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
import DOMPurify from "dompurify";

const initData = { // trạng thái khởi tạo ban đầu
  data: [], // data rỗng
};
/*
mảng data trên chứa các nội dung trò chuyện với cấu trúc như sau
data:[
    {
        id: 1,
        title: 'qweqweqw,
        messages: [
            {id: 1, text: 'react là gì', isBot: false},
            {id: 2, text: 'react là lib của js', isBot: true},
        ]
        
    }
]


*/

const ChatSlice = createSlice({ //slice new với tên chat được khởi tạo với initialData
  name: "chat",
  initialState: initData,
  reducers: { //  Chứa các hàm xử lý để cập nhật trạng thái của slice.
    addChat: (state) => { // thêm cuộc trò chuyện vào mảng
      state.data.push({
        id: uuidv4(), // giá trị duy nhất
        title: "Chat",
        messages: [], // mảng rỗng -> chứa tin nhắn
      });
    },
    addMessage: (state, action) => { // Thêm tin nhắn từ người dùng và bot vào một cuộc trò chuyện đã có.
      const { idChat, userMess, botMess } = action.payload; // dữ liệu được truyền vào reducer
      const chat = state.data.find((chat) => chat.id === idChat); // tìm cuộc trò chuyện có id trùng với chat
      if (chat) {
        // nếu tìm thấy cuộc trò chuyện, tạo một mãng newchat chứa user và bot
        const messageFormat = marked.parse(botMess); // Chuyển đổi tin nhắn của bot từ Markdown sang HTML.
        const safeChat = DOMPurify.sanitize(messageFormat); // Làm sạch nội dung HTML để tránh các mã độc.
        const newMessage = [
          ...chat.messages,
          { id: uuidv4(), text: userMess, isBot: false }, // Tin nhắn của người dùng, với isBot là false.
          { id: uuidv4(), text: safeChat, isBot: true }, // Tin nhắn của bot, với nội dung đã được làm sạch và isBot là true.
        ];

        chat.messages = newMessage; //cập nhật tin nhắn cho cuộc trò chuyện.
      }
    },
    removeChat: (state, action) => {
      //Hàm này xóa một cuộc trò chuyện khỏi danh sách state.data dựa trên id.
      state.data = state.data.filter((chat) => chat.id !== action.payload); // lọc ds các cuộc trò chuyện và trả về ds mới
      //bao gồm tất cả các cuộc trò chuyện có id khác với id được truyền vào từ action.payload. Những cuộc trò chuyện có id khớp sẽ bị loại bỏ.
    },
    setNameChat: (state, action) => {
      const { newTitle, chatId } = action.payload;
      const chat = state.data.find((chat) => chat.id === chatId);
      if (chat) {
        chat.title = newTitle;
      }
    },
  },
});

export const { addChat, removeChat, addMessage, setNameChat } =
  ChatSlice.actions;

export default ChatSlice.reducer;
