import { useRouter } from "next/navigation"

export default function ErrorComponent({error}:{error:any}) {
    const router = useRouter()
    return (
            <div className="flex flex-col justify-center items-center p-8">
                <div className="text-red-500 text-center mb-4">
                    <span className="text-2xl mb-2 block">⚠️</span>
                    <span className="text-med-16">{error}</span>
                </div>
                <button
                    onClick={router.back}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    돌아가기
                </button>
            </div>
    )
}