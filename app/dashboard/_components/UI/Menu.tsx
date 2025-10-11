"use client";

import { Divider, Drawer } from "antd";
import {
  InfoCircleOutlined,
  HomeOutlined,
  SettingFilled,
  CloudOutlined,
  UserAddOutlined,
  BranchesOutlined,
  NodeIndexOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/app/components/UI/Button";
import { removeAuth } from "@/app/lib/auth";

export default function DashboardMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const route = useRouter();
  const menuItems = [
    { icon: <InfoCircleOutlined />, title: "اطلاعات پایه", color: "text-blue-500", page: "/dashboard", active: true },
    {
      icon: <UserAddOutlined />,
      title: "اطلاعات اشخاص",
      color: "text-purple-500",
      page: "/dashboard/owners",
      active: true,
    },
    {
      icon: <HomeOutlined />,
      title: "اطلاعات گلخانه ها",
      color: "text-orange-500",
      page: "/dashboard/greenhouse",
      active: true,
    },
    {
      icon: <BranchesOutlined />,
      title: "اطلاعات پایه گیاهی",
      color: "text-green-500",
      page: "/dashboard/plants",
      active: true,
    },
    {
      icon: <NodeIndexOutlined />,
      title: "اطلاعات گونه گیاهی",
      color: "text-green-500",
      page: "/dashboard/plantvarities",
      active: true,
    },
    {
      icon: <CloudUploadOutlined />,
      title: "مراحل رشد گیاه",
      color: "text-sky-500",
      page: "/dashboard/growthstages",
      active: true,
    },
    {
      icon: <CloudOutlined />,
      title: "اطلاعات کاشت",
      color: "text-slate-500",
      page: "/dashboard/planting",
      active: true,
    },
    {
      icon: <CloudOutlined />,
      title: "پایش رشد گیاه",
      color: "text-slate-500",
      page: "/dashboard/growthdaily",
      active: true,
    },
  ];

  const handleItems = (page: string) => {
    onClose();
    route.push(page);
  };

  const handleLogout = async () => {
    onClose();
    await removeAuth();
  };

  return (
    <Drawer
      title={
        <div className="flex justify-end cursor-pointer" onClick={onClose}>
          <SettingFilled />
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
      styles={{
        body: { padding: "20px 16px", backgroundColor: "#fafafa" },
        header: { backgroundColor: "#fff", borderBottom: "1px solid #f0f0f0" },
      }}
    >
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="group flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 
                       hover:shadow-md hover:border-gray-200 hover:bg-gray-50 
                       transition-all duration-300 cursor-pointer"
            style={{ opacity: item.active ? 1 : 0.5, pointerEvents: item.active ? "auto" : "none" }}
            onClick={() => (item.active ? handleItems(item.page) : null)}
          >
            <div className={`text-xl ml-4 ${item.color} group-hover:scale-110 transition-transform duration-200`}>
              {item.icon}
            </div>
            <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{item.title}</span>
            <div className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      <Divider />
      <div className="w-full flex justify-center">
        <PrimaryButton onclick={handleLogout} text="خروج از پنل" />
      </div>
    </Drawer>
  );
}
