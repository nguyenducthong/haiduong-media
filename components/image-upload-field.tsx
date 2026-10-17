"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, LoaderCircle, CheckCircle2, AlertCircle, X } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Client-side image processor: compresses and resizes image to max 1200px for optimal speed and reliability
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return reject(new Error("Không thể đọc file ảnh."));

      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(rawDataUrl);

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.82);
        resolve(compressed);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error("Lỗi khi đọc file ảnh từ máy."));
    reader.readAsDataURL(file);
  });
}

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "Dán link ảnh (https://...) hoặc bấm tải từ máy tính",
}: ImageUploadFieldProps) {
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setStatusMsg(null);

    try {
      const dataUrl = await processImageFile(file);
      onChange(dataUrl);
      setStatusMsg({ type: "success", text: "Đã nạp ảnh thành công từ máy tính!" });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Lỗi khi xử lý file ảnh.",
      });
    } finally {
      setProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="image-upload-field-container">
      <div className="image-upload-header">
        <label className="image-upload-label">{label}</label>
        <span className="image-upload-subtext">Hỗ trợ cả link mạng (https://...) và chọn ảnh trực tiếp từ máy</span>
      </div>

      <div className="image-upload-controls">
        <div className="image-upload-input-wrapper">
          <input
            type="text"
            className="image-upload-text-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {value && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => onChange("")}
              title="Xóa link ảnh"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="image-upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={processing}
        >
          {processing ? (
            <>
              <LoaderCircle size={15} className="spin-icon" /> Đang xử lý...
            </>
          ) : (
            <>
              <UploadCloud size={15} /> Tải từ máy tính
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {statusMsg && (
        <div className={`image-upload-status ${statusMsg.type}`}>
          {statusMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Live Preview Image */}
      {value && (
        <div className="image-upload-preview-card">
          <img
            src={value}
            alt="Xem trước"
            className="image-upload-preview-img"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
            onLoad={(e) => {
              (e.target as HTMLElement).style.display = "block";
            }}
          />
          <div className="image-upload-preview-info">
            <span className="preview-tag">✓ Ảnh đang chọn (sẵn sàng hiển thị)</span>
            <small className="preview-url-text">
              {value.startsWith("data:") ? "Ảnh tải từ thiết bị (Đã tối ưu hóa)" : value}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
