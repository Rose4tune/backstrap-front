import AlarmMessageSend from "./AlarmMessageSend";

export default function MessageSend() {
    return (
        <div className="bg-white rounde-[16px]">
            <div className="text-left text-bold-20 text-gray-90 w-full h-[68px] flex items-center p-5">
                <span>쪽지</span>
            </div>
            <AlarmMessageSend />
        </div>
    )
}