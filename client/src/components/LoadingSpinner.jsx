const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };

    const spinner = (
        <div className={`${sizes[size]} border-2 border-gray-700 border-t-primary-500 rounded-full animate-spin`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-3 border-gray-700 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
