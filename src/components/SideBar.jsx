import PropType from "prop-types";
import IconPlus from "../assets/plusIcon.png";
import IconChat from "../assets/chat.png";
import IconTrash from "../assets/delete.svg";
import IconMenu from "../assets/menu.png";
import { useDispatch, useSelector } from "react-redux";
import { addChat, removeChat } from "../store/chatSlice";
import { Link, useNavigate } from "react-router-dom";


export const SideBar = ({ onToggle }) => {
    const dispatch = useDispatch()
    const {data} = useSelector((state) => state.chat);
    const navigate = useNavigate()

    const handleNewChat = () => {
        dispatch(addChat());
    }

    const handleRemoveChat = (id) => {
        dispatch(removeChat(id));
        navigate(`/`)
    }

    return(
        <div className="">
            <button>
                <img />
            </button>
        </div>
    )
}
SideBar.propTypes = {
  onToggle: PropType.func,
};

