//import axios from "axios";
import React, { useEffect, useState, DragEvent } from "react";
import axios from "axios";
const chunkSize = 1048576 * 3; // 3 MB

const SEVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER || "4000";
import io from "socket.io-client";

const socket = io(SEVER_URL);

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  senderId?: string | null | undefined;
  senderName?: string | null | undefined;
  roomName?: string | null | undefined;
  profile?: string | null | undefined;
}

interface IUploadMessage {
  fileName: string;
  sender: string;
}

export default function InPutLayer({
  children,
  className,
  senderId,
  senderName,
  roomName,
  profile,
}: LayoutProps) {
  const [dropzoneActive, setDropzoneActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [onProcessBar, setOnProcessBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<
    number | null
  >(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(
    null
  );
  const [fileURL, setFileURL] = useState("");

  const readAndUploadCurrentChunk = () => {
    const reader = new FileReader();
    1;
    const file = files[currentFileIndex!];
    if (!file) {
      return;
    }
    const from = currentChunkIndex! * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadChunk = (e: ProgressEvent<FileReader>) => {
    const file = files[currentFileIndex!];
    const data = e.target?.result;
    const params = new URLSearchParams();

    setProgress(
      Math.round((currentChunkIndex! / Math.ceil(file.size / chunkSize)) * 100)
    );
    params.set("name", file.name);
    params.set("size", file.size.toString());
    params.set("currentChuckIndex", currentChunkIndex!.toString());
    params.set("totalChucks", Math.ceil(file.size / chunkSize).toString());
    params.set("senderId", senderId!);
    params.set("senderName", senderName!);
    params.set("roomName", roomName!);
    params.set("profile_url", profile!);
    const headers = { "Content-Type": "application/octet-stream" };
    const url = `${SEVER_URL}/upload?${params.toString()}`;
    console.log(url);

    axios.post(url, data, { headers }).then((res) => {
      const file = files[currentFileIndex!];
      const fileSize = files[currentFileIndex!].size;

      const chunks = Math.ceil(fileSize / chunkSize) - 1;
      const isLastChunk = currentChunkIndex === chunks;
      setFileURL(
        res.data.finalFilename
          ? `${SEVER_URL}/uploads/${res.data.finalFilename}`
          : ""
      );
      if (isLastChunk) {
        //file.finalFilename =
        setLastUploadedFileIndex(currentFileIndex);
        setCurrentChunkIndex(null);

        socket.emit("upload_done", { fileName: file.name, sender: "me" });
      } else {
        setCurrentChunkIndex(currentChunkIndex! + 1);
      }
    });
  };

  useEffect(() => {
    if (files.length > 0) {
      setCurrentFileIndex(
        lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
      );
    }
  }, [files]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  const onDropHandelr = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setOnProcessBar(true);
    setFiles([...files, ...e.dataTransfer.files]);
  };

  return (
    <div
      className={`${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDropzoneActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDropzoneActive(false);
      }}
      onDrop={onDropHandelr}
    >
      {children}
    </div>
  );
}
