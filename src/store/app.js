import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";

const store = configureStore({ // nhận một object với nhiều tuỳ chọn -> reducer quan trọng nhất
    reducer:{
        chat: chatReducer // quản lý trạng thái cho slice chat
    }
});


export default store;