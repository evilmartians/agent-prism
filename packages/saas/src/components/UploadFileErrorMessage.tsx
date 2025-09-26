import { type FC } from "react";

type Props = {
  message: string;
};

export const UploadFileErrorMessage: FC<Props> = ({ message }) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-start space-x-2">
        <div>
          <p className="font-medium text-red-700 dark:text-red-400">
            Upload failed
          </p>

          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
