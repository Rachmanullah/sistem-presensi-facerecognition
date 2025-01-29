import { CircularProgress } from "@/app/shared/components";
export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="flex flex-col items-center">
                <CircularProgress size={60} />
                <p className="text-white mt-4 text-lg font-semibold">Training Model, Please Wait...</p>
            </div>
        </div>
    )
};


