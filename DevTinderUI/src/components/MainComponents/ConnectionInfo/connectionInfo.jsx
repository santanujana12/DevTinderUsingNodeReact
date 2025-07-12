import { SideNavPanel } from "../../SubComponents/SideNavPanel/SideNavPanel"

export const ConnectionInfo = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <SideNavPanel />
            {/* Main content area - adjust margin based on sidebar state */}
            <div className="ml-64 pt-16 min-h-screen">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Connection Information</h1>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-gray-600">This is the main content area. The sidebar is now fixed and won't overlap with the navbar.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
