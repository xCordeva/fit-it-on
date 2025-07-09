"use client";

import { Button } from "@/components/ui/button";
import { LuDownload } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { useDownloadTryOnResult } from "@/hooks/useDownloadResult";
import { useAuth } from "@/app/Provider";
import { useState, type RefObject } from "react";

interface DownloadButtonProps {
  result: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function DownloadButton({
  result,
  canvasRef,
  onClick,
}: DownloadButtonProps) {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const isProUser = (userData?.plan ?? "free") !== "free";

  const handleDownload = useDownloadTryOnResult(
    isProUser,
    canvasRef,
    result,
    setLoading
  );

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open && onClick) {
          const fakeEvent = {
            stopPropagation: () => {},
          } as React.MouseEvent<HTMLButtonElement>;
          onClick(fakeEvent);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary" disabled={loading}>
          <LuDownload className="mr-2 h-4 w-4" />
          Download
          <IoIosArrowDown className="ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleDownload("low")}
          className="flex items-center gap-4 cursor-pointer"
        >
          <FaEye />
          <div>
            <p className="font-semibold">Low Quality</p>{" "}
            <p className="text-gray-500">512 x 512</p>
          </div>
          <span className="bg-gray-100 px-2 text-gray-800 rounded-md justify-self-end ml-auto">
            Free
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload("high")}
          className="flex items-center gap-4 cursor-pointer"
        >
          <LuCrown className="text-yellow-500" />
          <div>
            <p className="font-semibold">Max Quality</p>{" "}
            <p className="text-gray-500">Original Resolution</p>{" "}
            {/* Updated description */}
          </div>
          <span className="bg-yellow-500 px-2 text-gray-800 rounded-md">
            Premium
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
