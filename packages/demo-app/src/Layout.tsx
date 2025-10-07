import { Activity, Info, Layers, Search, Settings } from "lucide-react";
import { type FC, type PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-white text-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-64 flex-col bg-gray-100">
          <div className="p-4">
            <div className="mb-6 flex items-center space-x-2">
              <div className="size-8 rounded bg-gradient-to-br from-orange-500 to-red-500"></div>
              <span className="font-semibold">AI APP</span>
            </div>

            <div className="space-y-1">
              <div className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                Workspace
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-200">
                <Layers className="size-4" />
                <span className="text-sm">Dashboard</span>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <div className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                Tools
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-200">
                <Activity className="size-4" />
                <span className="text-sm">Logs</span>
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-200">
                <Search className="size-4" />
                <span className="text-sm">Detections</span>
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded bg-gray-200 p-2">
                <Layers className="size-4" />
                <span className="text-sm">Traces</span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-2 border-t border-gray-200 p-4">
            <div className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-200">
              <Info className="size-4" />
              <span className="text-sm">Docs</span>
            </div>
            <div className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-200">
              <Settings className="size-4" />
              <span className="text-sm">Account Settings</span>
            </div>
            <div className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-200">
              <span className="text-sm">Feedback</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white p-6">{children}</div>
      </div>
    </div>
  );
};
