import React from "react";

interface TimeRangeInputProps {
    startTime: string;
    endTime: string;
    setStartTime: (val: string) => void;
    setEndTime: (val: string) => void;
}

export default function TimeRangeInput({
    startTime,
    endTime,
    setStartTime,
    setEndTime,
}: TimeRangeInputProps) {
    const formatTime = (time: string) => {
        const digits = time.replace(/\D/g, "").slice(0, 4);
        if (digits.length < 3) return digits;
        return digits.slice(0, 2) + ":" + digits.slice(2, 4);
    };

    const handleTimeChange = (
        value: string,
        setter: (val: string) => void
    ) => {
        const raw = value.replace(":", "");
        if (/^\d{0,4}$/.test(raw)) {
            setter(raw);
        }
    };

    return (
        <div className="flex items-center gap-1 h-[52px]">
            <input
                type="text"
                value={formatTime(startTime)}
                onChange={(e) => handleTimeChange(e.target.value, setStartTime)}
                inputMode="numeric"
                maxLength={5}
                className="h-[52px] w-[91px] text-reg-14 text-gray-90 rounded-[12px] p-4 text-center bg-gray-20 rounded focus:outline-none"
                placeholder="09:00"
            />
            <span className="bg-gray-50 w-[8px] h-[2px]"></span>
            <input
                type="text"
                value={formatTime(endTime)}
                onChange={(e) => handleTimeChange(e.target.value, setEndTime)}
                inputMode="numeric"
                maxLength={5}
                className="h-[52px] w-[91px] text-reg-14 text-gray-90 rounded-[12px] p-4 text-center bg-gray-20 rounded focus:outline-none"
                placeholder="10:00"
            />
        </div>
    );
}
