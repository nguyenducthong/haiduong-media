"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  List,
  Image as ImageIcon,
  UploadCloud,
  Link as LinkIcon,
  Eye,
  Edit3,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { ArticleContentRenderer } from "./article-content-renderer";

interface AdminRichEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

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

export function AdminRichEditor({
  label,
  value,
  onChange,
  rows = 10,
}: AdminRichEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showGuide, setShowGuide] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorFileInputRef = useRef<HTMLInputElement>(null);

  const handleEditorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const dataUrl = await processImageFile(file);
      const alt = prompt("Nhập chú thích cho ảnh vừa tải lên:", file.name.replace(/\.[^/.]+$/, "")) || "Ảnh minh họa";
      insertSyntax(`\n\n![${alt}](${dataUrl})\n\n`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi khi xử lý ảnh.");
    } finally {
      setUploadingImage(false);
      if (editorFileInputRef.current) {
        editorFileInputRef.current.value = "";
      }
    }
  };

  // Helper to insert or wrap text at current cursor position
  const insertSyntax = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${before}${selectedText}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertSampleTemplate = () => {
    if (
      value.trim() &&
      !confirm("Bài viết đang có nội dung. Bạn có muốn chèn mẫu bài chuẩn báo chí vào không?")
    ) {
      return;
    }

    const template = `[justify]Trong bối cảnh nền kinh tế số và kỷ nguyên truyền thông đa kênh bùng nổ, việc định vị thương hiệu và xây dựng niềm tin với khách hàng là yếu tố sống còn của mọi doanh nghiệp Việt Nam.[/justify]

## 1. Vị thế dẫn đầu và chiến lược khác biệt

[justify]Doanh nghiệp không chỉ cần sản phẩm tốt mà còn cần một câu chuyện thương hiệu chạm đến trái tim người tiêu dùng. Thông qua hệ thống truyền thông chính thống và các khung giờ phát sóng truyền hình quốc gia, thông điệp uy tín được lan tỏa mạnh mẽ.[/justify]

![Hình ảnh lễ vinh danh thương hiệu và ký kết xúc tiến thương mại](/images/posts/post-thuong-hieu-manh.png)

## 2. Cam kết giá trị và kết nối quốc tế

> "Chất lượng là nền tảng, uy tín là chìa khóa mở cánh cửa hội nhập kinh tế toàn cầu."

[justify]Để hiện thực hóa tầm nhìn chiến lược, các chương trình xúc tiến thương mại quốc tế đã mở ra nhiều cơ hội hợp tác thiết thực:[/justify]

- Kết nối giao thương trực tiếp với hơn 100 đối tác quốc tế.
- Tăng cường nhận diện thương hiệu trên các kênh truyền hình trung ương và báo điện tử hàng đầu.
- Nâng cao năng lực cạnh tranh và phát triển bền vững trong giai đoạn mới.

[center]**Liên hệ tư vấn giải pháp truyền thông độc quyền cùng Hải Dương Media ngay hôm nay!**[/center]

[right]*Ban Biên Tập Hải Dương Media - Tháng 10/2026*[/right]`;

    onChange(template);
  };

  return (
    <div className="admin-rich-editor-wrapper">
      <div className="admin-rich-header">
        <label className="admin-rich-label">{label}</label>

        <div className="admin-rich-tabs">
          <button
            type="button"
            className={`admin-rich-tab-btn ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            <Edit3 size={14} /> Soạn thảo
          </button>
          <button
            type="button"
            className={`admin-rich-tab-btn ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            <Eye size={14} /> Xem trước hiển thị
          </button>
          <button
            type="button"
            className="admin-rich-template-btn"
            onClick={insertSampleTemplate}
            title="Chèn khung bài viết chuẩn báo chí mẫu"
          >
            <Sparkles size={14} /> Chèn bài mẫu
          </button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <div className="admin-rich-editor-container">
          {/* Căn chỉnh và định dạng Toolbar */}
          <div className="admin-rich-toolbar">
            <div className="toolbar-group">
              <button
                type="button"
                className="toolbar-btn"
                title="In đậm (Ctrl+B)"
                onClick={() => insertSyntax("**", "**", "chữ in đậm")}
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="In nghiêng (Ctrl+I)"
                onClick={() => insertSyntax("*", "*", "chữ in nghiêng")}
              >
                <Italic size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button
                type="button"
                className="toolbar-btn text-btn"
                title="Tiêu đề mục chính (H2)"
                onClick={() => insertSyntax("\n\n## ", "\n", "Tiêu đề mục")}
              >
                <Heading2 size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn text-btn"
                title="Tiêu đề mục phụ (H3)"
                onClick={() => insertSyntax("\n\n### ", "\n", "Tiêu đề phụ")}
              >
                <Heading3 size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Các nút Căn chỉnh lề */}
            <div className="toolbar-group">
              <button
                type="button"
                className="toolbar-btn"
                title="Căn giữa nội dung"
                onClick={() => insertSyntax("\n\n[center]", "[/center]\n\n", "Nội dung căn giữa")}
              >
                <AlignCenter size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Căn phải (Ký tên tác giả, ngày tháng...)"
                onClick={() => insertSyntax("\n\n[right]", "[/right]\n\n", "*Tác giả / Ngày đăng*")}
              >
                <AlignRight size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Căn đều hai bên (Chuẩn báo chí)"
                onClick={() => insertSyntax("\n\n[justify]", "[/justify]\n\n", "Đoạn văn căn đều hai mép...")}
              >
                <AlignJustify size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button
                type="button"
                className="toolbar-btn"
                title="Trích dẫn lời nói lãnh đạo / phát biểu"
                onClick={() => insertSyntax("\n\n> ", "\n\n", "Câu trích dẫn nổi bật")}
              >
                <Quote size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Danh sách gạch đầu dòng"
                onClick={() => insertSyntax("\n\n- ", "\n- Ý thứ hai\n- Ý thứ ba\n\n", "Ý thứ nhất")}
              >
                <List size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Dán link ảnh từ mạng (URL bất kỳ https://...)"
                onClick={() => {
                  const url = prompt(
                    "Dán link ảnh từ trên mạng (https://...) hoặc đường dẫn ảnh:",
                    "https://"
                  );
                  if (url && url !== "https://") {
                    const alt = prompt("Nhập chú thích ảnh:", "Ảnh minh họa");
                    insertSyntax(`\n\n![${alt || "Ảnh minh họa"}](${url})\n\n`);
                  }
                }}
              >
                <ImageIcon size={15} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Tải ảnh từ máy tính chèn trực tiếp vào bài"
                onClick={() => editorFileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <UploadCloud size={15} />
              </button>
              <input
                ref={editorFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleEditorFileUpload}
              />
              <button
                type="button"
                className="toolbar-btn"
                title="Chèn đường liên kết"
                onClick={() => {
                  const url = prompt("Nhập đường link:", "https://");
                  if (url) {
                    insertSyntax("[", `](${url})`, "Tên liên kết");
                  }
                }}
              >
                <LinkIcon size={15} />
              </button>
            </div>

            <button
              type="button"
              className="toolbar-help-toggle"
              onClick={() => setShowGuide(!showGuide)}
              title="Xem hướng dẫn căn chỉnh nhanh"
            >
              <HelpCircle size={15} /> Hướng dẫn
            </button>
          </div>

          {/* Quick Guide Popup/Banner */}
          {showGuide && (
            <div className="admin-rich-guide-box">
              <strong>💡 Hướng dẫn căn chỉnh & định dạng nhanh:</strong>
              <ul>
                <li><code>[justify]Văn bản...[/justify]</code>: Căn đều 2 mép chữ cho đẹp như báo giấy.</li>
                <li><code>[center]Văn bản...[/center]</code>: Căn giữa (thường dùng cho thông điệp, slogan).</li>
                <li><code>[right]Văn bản...[/right]</code>: Căn lề phải (thường dùng cho ký tên tác giả).</li>
                <li><code>## Tiêu đề lớn</code> / <code>### Tiêu đề phụ</code>: Tạo đề mục bài viết.</li>
                <li><code>**Chữ in đậm**</code>, <code>*Chữ in nghiêng*</code>.</li>
                <li><code>![Chú thích ảnh](/images/posts/anh.png)</code>: Chèn ảnh giữa các đoạn văn.</li>
                <li><code>&gt; "Câu nói"</code>: Tạo ô trích dẫn nổi bật.</li>
              </ul>
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="admin-rich-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder="Nhập nội dung bài viết... Bạn có thể bôi đen chữ rồi bấm các nút căn chỉnh ở thanh công cụ phía trên."
          />
        </div>
      ) : (
        <div className="admin-rich-preview-box">
          <div className="preview-header-bar">
            <span>👁️ BẢN XEM TRƯỚC (HIỂN THỊ THỰC TẾ TRÊN BÀI VIẾT)</span>
            <small>Căn chỉnh lề, ảnh, trích dẫn hiển thị chuẩn xác như ngoài web</small>
          </div>
          <div className="preview-content-area">
            {value.trim() ? (
              <ArticleContentRenderer content={value} />
            ) : (
              <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
                Chưa có nội dung. Chuyển sang tab "Soạn thảo" để bắt đầu viết bài.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
