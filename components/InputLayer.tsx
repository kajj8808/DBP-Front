import React, { useEffect, useState, DragEvent, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import io from "socket.io-client";

const SEVER_URL = process.env.SOCKET_SERVER;
const socket = io(SEVER_URL);

const chunkSize = 500000; // 500 KB stream에서 한번에 전송가능한 용량

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface IUploadDatas {
  name: string;
  data: string;
  isLast: boolean;
}

export default function InPutLayer({ className, children }: LayoutProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<
    number | null
  >(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(
    null
  );
  /// socket 은 파일을 업로드할떄만 사용되게 chat 부분에서
  // activate 되는것을 context 으로 가져올 예정.
  const readAndUploadCurrentChunk = () => {
    const reader = new FileReader();
    const file = files[currentFileIndex!];
    if (!file) {
      return;
    }
    // check 의 위치 0 3mb 업로드의 시작지점 으로 파일잘라서
    const from = currentChunkIndex! * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    // 렌더링 처리
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadChunk = (e: ProgressEvent<FileReader>) => {
    const file = files[currentFileIndex!];
    const data = e.target?.result;
    console.log("upload check");
    // 파일의 마지막 크기인지 확인
    const isLast = currentChunkIndex! * chunkSize + chunkSize >= file.size;

    // 동일한 사람이 한번에 보낼수 있으니.. 그건 사람이름과 보낼때의 시간으로
    socket.emit("upload", {
      name: file.name,
      data,
      isLast: false,
      currentChunkIndex,
    } as IUploadDatas);

    if (isLast) {
      // 마지막이면 다음 파일로
      setLastUploadedFileIndex(currentFileIndex);
      setCurrentFileIndex(null);
    } else {
      // 아니면 다음 청크로
      setCurrentChunkIndex(currentChunkIndex! + 1);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      setFiles([file, ...files]);
    });
  }, []);

  useEffect(() => {
    // 업로드할 file 이 하나라도 있으면 업로드 시작
    if (files.length > 0) {
      setCurrentFileIndex(
        lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
      );
    }
  }, [files]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      // 업로드를 위해 체크 사이즈를 처음으로 0
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      // 파일 업로드 시작
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div className={`${className}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      {/* <div>{onProcessBar ? <h1>{progress} %</h1> : null}</div>
      <span>fileURL : {fileURL}</span> */}
      {children}
    </div>
  );
}
