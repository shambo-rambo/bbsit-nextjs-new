// components/LoadingSpinner.tsx

export function LoadingSpinner() {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-950 bg-opacity-50 z-50">
        <div className="box"></div>
      </div>
    );
  }