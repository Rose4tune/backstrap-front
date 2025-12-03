export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-[20px] h-[20px] rounded-full border-[2px] border-t-white border-r-white border-b-transparent border-l-white animate-spin" />
    </div>
  );
}
