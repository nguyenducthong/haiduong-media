"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Eraser,
  Code,
  Eye,
  PenTool,
  RotateCcw,
  Upload,
  FolderOpen,
  X,
  Search,
  Check,
  Loader2,
  ExternalLink,
  FileText,
  FileDown,
  Paperclip,
  FileUp,
  Type,
  Maximize2,
  Minimize2,
} from "lucide-react";

const FONT_SIZES = [
  { label: "Cỡ chữ chuẩn (15px)", value: "" },
  { label: "12px - Rất nhỏ", value: "12px" },
  { label: "13px - Chú thích / Nhỏ", value: "13px" },
  { label: "14px - Nhỏ vừa", value: "14px" },
  { label: "15px - Chuẩn bài viết", value: "15px" },
  { label: "16px - Rõ nét", value: "16px" },
  { label: "18px - Điểm nhấn / Lớn", value: "18px" },
  { label: "20px - Tiêu đề nhỏ (H4)", value: "20px" },
  { label: "22px - Tiêu đề phụ", value: "22px" },
  { label: "24px - Tiêu đề vừa (H3)", value: "24px" },
  { label: "28px - Tiêu đề lớn (H2)", value: "28px" },
  { label: "32px - Tiêu đề rất lớn", value: "32px" },
  { label: "36px - Cỡ chữ đặc biệt", value: "36px" },
];

const FONT_SIZE_STEPS = ["12px", "13px", "14px", "15px", "16px", "18px", "20px", "22px", "24px", "28px", "32px", "36px"];

interface EnterpriseContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  onTitleSuggested?: (title: string) => void;
  minHeight?: string;
}

interface MediaImage {
  url: string;
  name: string;
}

// Dynamic PDF.js loader for client-side rendering
const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Môi trường không hỗ trợ."));
    }
    if ((window as any).pdfjsLib) {
      return resolve((window as any).pdfjsLib);
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjsLib);
      } else {
        reject(new Error("Không thể khởi tạo thư viện đọc PDF."));
      }
    };
    script.onerror = () => reject(new Error("Lỗi khi tải thư viện PDF.js từ CDN."));
    document.head.appendChild(script);
  });
};

export function EnterpriseContentEditor({
  value,
  onChange,
  onTitleSuggested,
  minHeight = "380px",
}: EnterpriseContentEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "preview" | "code">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);

  // Image Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalTab, setImageModalTab] = useState<"upload" | "library" | "url">("upload");
  const [libraryImages, setLibraryImages] = useState<MediaImage[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [searchLibrary, setSearchLibrary] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageCaption, setImageCaption] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Document (PDF / Word) Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docDisplayMode, setDocDisplayMode] = useState<"images" | "card" | "embed">("images");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docUploadProgress, setDocUploadProgress] = useState("");
  const [docUploadError, setDocUploadError] = useState("");

  // Word (.docx) Direct Import State
  const [isWordImportOpen, setIsWordImportOpen] = useState(false);
  const [selectedWordFile, setSelectedWordFile] = useState<File | null>(null);
  const [wordImportMode, setWordImportMode] = useState<"replace" | "append">("replace");
  const [isConvertingWord, setIsConvertingWord] = useState(false);
  const [wordConvertError, setWordConvertError] = useState("");

  // Font Size & View State
  const [selectedFontSize, setSelectedFontSize] = useState<string>("");
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const wordFileInputRef = useRef<HTMLInputElement>(null);

  // Sync value into contentEditable when activeTab is visual and not actively typing
  useEffect(() => {
    if (activeTab === "visual" && editorRef.current) {
      if (!isTypingRef.current || editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "<p><br></p>";
      }
    }
  }, [value, activeTab]);

  // Keep savedRangeRef updated whenever selection changes inside editor
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (
        sel &&
        sel.rangeCount > 0 &&
        editorRef.current &&
        editorRef.current.contains(sel.anchorNode)
      ) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();

        // Sync font-size dropdown with active selection if available
        try {
          let node: Node | null = sel.anchorNode;
          if (node && node.nodeType === Node.TEXT_NODE) {
            node = node.parentElement;
          }
          if (node && node instanceof HTMLElement && editorRef.current.contains(node)) {
            const inlineFs = node.style?.fontSize;
            if (inlineFs && FONT_SIZE_STEPS.includes(inlineFs)) {
              setSelectedFontSize(inlineFs);
            }
          }
        } catch {}
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(sel.anchorNode)
    ) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    isTypingRef.current = true;
    onChange(editorRef.current.innerHTML);
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  const exec = (command: string, arg?: string) => {
    if (activeTab !== "visual") setActiveTab("visual");
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFontSize = (sizePx: string) => {
    if (activeTab !== "visual") setActiveTab("visual");
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const sel = window.getSelection();
    const range = savedRangeRef.current;
    if (range && editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
      sel?.removeAllRanges();
      sel?.addRange(range);
    }

    if (!sel || sel.rangeCount === 0) return;

    if (sel.isCollapsed) {
      if (!sizePx) return;
      try {
        const curRange = sel.getRangeAt(0);
        const span = document.createElement("span");
        span.style.fontSize = sizePx;
        const zws = document.createTextNode("\u200B");
        span.appendChild(zws);
        curRange.insertNode(span);
        curRange.setStart(zws, 1);
        curRange.setEnd(zws, 1);
        sel.removeAllRanges();
        sel.addRange(curRange);
        saveSelection();
        if (editorRef.current) onChange(editorRef.current.innerHTML);
      } catch (e) {
        console.warn("Could not set font size at collapsed cursor", e);
      }
      return;
    }

    if (!sizePx) {
      document.execCommand("removeFormat", false);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
      return;
    }

    // Execute fontSize with unique marker size 7
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand("fontSize", false, "7");

    if (editorRef.current) {
      // Replace <font size="7"> with <span style="font-size: ${sizePx}">
      const fontNodes = Array.from(editorRef.current.querySelectorAll("font[size='7']"));
      fontNodes.forEach((font) => {
        const span = document.createElement("span");
        span.style.fontSize = sizePx;

        // Clean up child spans with font-size so new font size applies cleanly
        const innerSpans = font.querySelectorAll('span[style*="font-size"]');
        innerSpans.forEach((inner) => {
          (inner as HTMLElement).style.removeProperty("font-size");
        });

        while (font.firstChild) {
          span.appendChild(font.firstChild);
        }
        font.parentNode?.replaceChild(span, font);
      });

      // Also clean up browser styled spans if any
      const styledSpans = Array.from(
        editorRef.current.querySelectorAll('span[style*="xxx-large"], span[style*="xx-large"]')
      );
      styledSpans.forEach((s) => {
        (s as HTMLElement).style.fontSize = sizePx;
      });

      saveSelection();
      onChange(editorRef.current.innerHTML);
    }
  };

  const stepFontSizeUp = () => {
    const current = selectedFontSize || "15px";
    let idx = FONT_SIZE_STEPS.indexOf(current);
    if (idx === -1) idx = 3; // default 15px
    const nextIdx = Math.min(FONT_SIZE_STEPS.length - 1, idx + 1);
    const nextSize = FONT_SIZE_STEPS[nextIdx];
    setSelectedFontSize(nextSize);
    applyFontSize(nextSize);
  };

  const stepFontSizeDown = () => {
    const current = selectedFontSize || "15px";
    let idx = FONT_SIZE_STEPS.indexOf(current);
    if (idx === -1) idx = 3; // default 15px
    const prevIdx = Math.max(0, idx - 1);
    const prevSize = FONT_SIZE_STEPS[prevIdx];
    setSelectedFontSize(prevSize);
    applyFontSize(prevSize);
  };

  const handleFormatBlock = (tag: string) => {
    exec("formatBlock", tag);
  };

  const handleInsertLink = () => {
    saveSelection();
    const url = prompt("Nhập liên kết (URL):");
    if (url) {
      exec("createLink", url.trim());
    }
  };

  // Helper to insert HTML at cursor position
  const insertHtmlAtCursor = (html: string) => {
    if (activeTab !== "visual") {
      setActiveTab("visual");
    }

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }

      const sel = window.getSelection();
      const range = savedRangeRef.current;

      if (range && editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        sel?.removeAllRanges();
        sel?.addRange(range);
      }

      const success = document.execCommand("insertHTML", false, html);
      if (!success && editorRef.current) {
        editorRef.current.innerHTML += html;
      }

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  // --- IMAGE HANDLING ---
  const openImageModal = () => {
    saveSelection();
    setSelectedImage("");
    setImageCaption("");
    setUploadError("");
    setIsImageModalOpen(true);
    fetchLibraryImages();
  };

  const fetchLibraryImages = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = (await res.json()) as any;
        setLibraryImages(data.images || []);
      }
    } catch (e) {
      console.error("Failed to load images", e);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const insertImageAtCursor = (imageUrl: string, captionText?: string) => {
    if (!imageUrl) return;
    const cleanCaption = (captionText ?? imageCaption).trim();
    const captionHtml = cleanCaption
      ? `<figcaption style="font-size: 13px; color: #64748b; font-style: italic; margin-top: 8px; text-align: center;">${cleanCaption}</figcaption>`
      : "";

    const figureHtml = `<figure style="margin: 20px auto; text-align: center; display: block; max-width: 100%;"><img src="${imageUrl}" alt="${cleanCaption || "Ảnh bài viết"}" style="max-width: 100%; height: auto; border-radius: 8px; display: inline-block; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" />${captionHtml}</figure><p><br></p>`;

    insertHtmlAtCursor(figureHtml);
    setIsImageModalOpen(false);
    setSelectedImage("");
    setImageCaption("");
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    // Check image size (limit 10MB)
    const MAX_IMG_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_IMG_SIZE) {
      setUploadError(
        `⚠️ Ảnh quá lớn (${formatFileSize(file.size)}). Giới hạn tối đa cho ảnh là 10MB (khuyên dùng dưới 2MB) để trang tải nhanh cho độc giả.`
      );
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(`Dung lượng ảnh (${formatFileSize(file.size)}) vượt quá giới hạn cho phép của máy chủ.`);
        }
        throw new Error(data?.error || "Tải ảnh thất bại.");
      }

      insertImageAtCursor(data.url, imageCaption);
    } catch (err: any) {
      setUploadError(err.message || "Lỗi khi tải ảnh lên.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- DOCUMENT (PDF / WORD) HANDLING ---
  const openDocModal = () => {
    saveSelection();
    setSelectedDocFile(null);
    setDocTitle("");
    setDocDisplayMode("images");
    setDocUploadProgress("");
    setDocUploadError("");
    setIsDocModalOpen(true);
  };

  const handleSelectDocFile = (file: File) => {
    setDocUploadError("");
    setDocUploadProgress("");
    const MAX_DOC_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_DOC_SIZE) {
      setDocUploadError(
        `⚠️ File "${file.name}" quá lớn (${formatFileSize(file.size)}). Giới hạn tối đa cho tài liệu là 25MB. Vui lòng nén file hoặc chia nhỏ trước khi tải lên.`
      );
      setSelectedDocFile(null);
      return;
    }

    setSelectedDocFile(file);
    // Set default title to file name without extension
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setDocTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleUploadAndInsertDoc = async () => {
    if (!selectedDocFile) {
      setDocUploadError("Vui lòng chọn file tài liệu.");
      return;
    }

    const MAX_DOC_SIZE = 25 * 1024 * 1024;
    if (selectedDocFile.size > MAX_DOC_SIZE) {
      setDocUploadError(
        `⚠️ File tài liệu quá lớn (${formatFileSize(selectedDocFile.size)}). Giới hạn tối đa là 25MB.`
      );
      return;
    }

    setIsUploadingDoc(true);
    setDocUploadError("");
    setDocUploadProgress("Đang tải file gốc lên hệ thống...");

    const formData = new FormData();
    formData.append("file", selectedDocFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(`Dung lượng file (${formatFileSize(selectedDocFile.size)}) vượt quá giới hạn của máy chủ.`);
        }
        throw new Error(data?.error || "Tải tài liệu thất bại.");
      }

      const fileUrl = data.url;
      const fileName = data.fileName || selectedDocFile.name;
      const ext = (data.ext || "").toLowerCase() || (selectedDocFile.name.split(".").pop()?.toLowerCase() || "file");
      const isPdf = ext === "pdf";
      const isWord = ext === "doc" || ext === "docx";
      const badge = isPdf ? "PDF" : isWord ? "DOCX" : ext.toUpperCase();
      const title = docTitle.trim() || fileName;
      const sizeStr = formatFileSize(selectedDocFile.size);

      let docHtml = "";

      if (isPdf && docDisplayMode === "images") {
        setDocUploadProgress("Đang khởi động công cụ đọc PDF...");
        const pdfjsLib = await loadPdfJs();

        setDocUploadProgress("Đang phân tích các trang PDF...");
        const arrayBuffer = await selectedDocFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;

        const pageImages: { url: string; pageNum: number }[] = [];
        const baseNameSafe = fileName
          .toLowerCase()
          .replace(/\.pdf$/i, "")
          .replace(/[^a-z0-9_-]/g, "-")
          .slice(0, 30);

        for (let p = 1; p <= numPages; p++) {
          setDocUploadProgress(`Đang chuyển đổi trang ${p}/${numPages} thành ảnh sắc nét...`);
          const page = await pdfDoc.getPage(p);
          const viewport = page.getViewport({ scale: 1.75 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvasContext: ctx, viewport }).promise;

          const blob = await new Promise<Blob | null>((resolveBlob) =>
            canvas.toBlob(resolveBlob, "image/jpeg", 0.88)
          );
          if (!blob) continue;

          setDocUploadProgress(`Đang lưu ảnh trang ${p}/${numPages}...`);
          const pageFormData = new FormData();
          const pageFileName = `${baseNameSafe}-p${p}-${Date.now()}.jpg`;
          pageFormData.append("file", blob, pageFileName);

          const pageRes = await fetch("/api/upload", {
            method: "POST",
            body: pageFormData,
          });
          const pageData = (await pageRes.json().catch(() => null)) as any;
          if (pageRes.ok && pageData?.url) {
            pageImages.push({ url: pageData.url, pageNum: p });
          }
        }

        const pagesHtml = pageImages
          .map(
            (item) => `
            <figure style="margin: 0 auto; max-width: 960px; width: 100%; text-align: center; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; overflow: hidden;">
              <img src="${item.url}" alt="${title} - Trang ${item.pageNum}" style="width: 100%; height: auto; display: block;" loading="lazy" />
              <figcaption style="padding: 8px 16px; font-size: 12px; font-weight: 600; color: #64748b; background: #fafafa; border-top: 1px solid #f1f5f9; text-align: right;">
                Trang ${item.pageNum} / ${numPages}
              </figcaption>
            </figure>
          `
          )
          .join("\n");

        docHtml = `
          <div class="pdf-document-pages" style="margin: 32px 0; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; background: #f8fafc; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px;">PDF</span>
                <div>
                  <strong style="font-size: 15px; color: #0f172a; display: block; line-height: 1.3;">${title}</strong>
                  <span style="font-size: 12px; color: #64748b;">Tài liệu gồm ${numPages} trang • Dung lượng ${sizeStr}</span>
                </div>
              </div>
              <a href="${fileUrl}" download="${fileName}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #d42027; color: #fff; font-size: 13px; font-weight: 700; border-radius: 8px; text-decoration: none; box-shadow: 0 1px 3px rgba(212,32,39,0.2);">
                Tải file gốc (${sizeStr}) ⬇
              </a>
            </div>

            <div style="padding: 16px; display: flex; flex-direction: column; gap: 18px; background: #f1f5f9;">
              ${pagesHtml}
            </div>
          </div>
          <p><br></p>
        `;
      } else if (isPdf && docDisplayMode === "embed") {
        // Embed PDF viewer iframe
        docHtml = `
          <div style="margin: 28px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">PDF</span>
                <strong style="font-size: 14px; color: #0f172a;">${title}</strong>
              </div>
              <a href="${fileUrl}" download="${fileName}" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: #d42027; color: #fff; font-size: 12px; font-weight: 600; border-radius: 6px; text-decoration: none;">
                Tải file gốc (${sizeStr}) ⬇
              </a>
            </div>
            <iframe src="${fileUrl}" width="100%" height="650" style="border: none; display: block;" title="${title}"></iframe>
          </div>
          <p><br></p>
        `;
      } else {
        // Document Download & Preview Card
        const badgeBg = isPdf ? "#fee2e2" : isWord ? "#e0f2fe" : "#f1f5f9";
        const badgeColor = isPdf ? "#dc2626" : isWord ? "#0284c7" : "#475569";
        const accentBorder = isPdf ? "#dc2626" : isWord ? "#0284c7" : "#64748b";

        docHtml = `
          <div class="document-attachment-card" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 20px; margin: 24px 0; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid ${accentBorder}; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 14px; min-width: 240px; flex: 1;">
              <div style="width: 46px; height: 46px; border-radius: 10px; background: ${badgeBg}; color: ${badgeColor}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; flex-shrink: 0; letter-spacing: 0.5px;">
                ${badge}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 15px; color: #0f172a; line-height: 1.4;">
                  ${title}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                  Định dạng ${badge} • Dung lượng: ${sizeStr}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              ${
                isPdf
                  ? `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">Xem trực tuyến ↗</a>`
                  : ""
              }
              <a href="${fileUrl}" download="${fileName}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: ${
                isPdf ? "#d42027" : "#0284c7"
              }; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; color: #fff; text-decoration: none; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                Tải về máy ⬇
              </a>
            </div>
          </div>
          <p><br></p>
        `;
      }

      insertHtmlAtCursor(docHtml);
      setIsDocModalOpen(false);
      setSelectedDocFile(null);
      setDocTitle("");
      setDocUploadProgress("");
    } catch (err: any) {
      setDocUploadError(err.message || "Lỗi tải tài liệu lên.");
    } finally {
      setIsUploadingDoc(false);
      setDocUploadProgress("");
    }
  };

  // --- WORD (.DOCX) IMPORT HANDLER ---
  const handleConvertWord = async () => {
    if (!selectedWordFile) {
      setWordConvertError("Vui lòng chọn file Word (.docx).");
      return;
    }

    const MAX_DOC_SIZE = 25 * 1024 * 1024;
    if (selectedWordFile.size > MAX_DOC_SIZE) {
      setWordConvertError(
        `⚠️ File Word quá lớn (${formatFileSize(selectedWordFile.size)}). Giới hạn tối đa là 25MB.`
      );
      return;
    }

    setIsConvertingWord(true);
    setWordConvertError("");

    const formData = new FormData();
    formData.append("file", selectedWordFile);

    try {
      const res = await fetch("/api/convert-word", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(`File Word quá lớn (${formatFileSize(selectedWordFile.size)}). Máy chủ từ chối tiếp nhận.`);
        }
        throw new Error(data?.error || "Chuyển đổi file Word thất bại.");
      }

      const importedHtml = data.html || "<p></p>";

      if (wordImportMode === "replace") {
        onChange(importedHtml);
        if (editorRef.current) {
          editorRef.current.innerHTML = importedHtml;
        }
      } else {
        insertHtmlAtCursor(importedHtml);
      }

      if (data.suggestedTitle && onTitleSuggested) {
        onTitleSuggested(data.suggestedTitle);
      }

      if (activeTab !== "visual") {
        setActiveTab("visual");
      }

      setIsWordImportOpen(false);
      setSelectedWordFile(null);
    } catch (err: any) {
      setWordConvertError(err?.message || "Lỗi khi đọc file Word.");
    } finally {
      setIsConvertingWord(false);
    }
  };

  // Clipboard paste (Images)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          saveSelection();
          handleUploadFile(file);
          return;
        }
      }
    }
  };

  // Drag and drop files
  const handleDrop = (e: React.DragEvent) => {
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type.startsWith("image/")) {
      e.preventDefault();
      saveSelection();
      handleUploadFile(file);
    } else if (/\.(pdf|doc|docx)$/i.test(file.name)) {
      e.preventDefault();
      saveSelection();
      handleSelectDocFile(file);
      setIsDocModalOpen(true);
    }
  };

  const filteredLibrary = libraryImages.filter((img) =>
    img.name.toLowerCase().includes(searchLibrary.toLowerCase())
  );

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* STICKY TOP TOOLBAR & CONTROLS CONTAINER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 35,
          background: "#fff",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          borderBottom: "1px solid var(--line)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top Header: Tabs & Mode Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            background: "#f8fafc",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            borderBottom: "1px solid var(--line)",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {/* Mode Tabs */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: activeTab === "visual" ? "1px solid #d42027" : "1px solid transparent",
                background: activeTab === "visual" ? "#fff" : "transparent",
                color: activeTab === "visual" ? "#d42027" : "#64748b",
                cursor: "pointer",
                boxShadow: activeTab === "visual" ? "0 1px 4px rgba(212,32,39,0.12)" : "none",
              }}
            >
              <PenTool size={13} /> Soạn thảo trực quan (Word)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: activeTab === "preview" ? "1px solid #0284c7" : "1px solid transparent",
                background: activeTab === "preview" ? "#fff" : "transparent",
                color: activeTab === "preview" ? "#0284c7" : "#64748b",
                cursor: "pointer",
              }}
            >
              <Eye size={13} /> Xem trước
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("code")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: activeTab === "code" ? "1px solid #475569" : "1px solid transparent",
                background: activeTab === "code" ? "#fff" : "transparent",
                color: activeTab === "code" ? "#0f172a" : "#64748b",
                cursor: "pointer",
              }}
            >
              <Code size={13} /> Mã HTML
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
              {activeTab === "visual" && "Đặt con trỏ vào chữ và bấm 'Chèn ảnh' hoặc 'Đính kèm PDF/Word'"}
              {activeTab === "preview" && "Cách bài viết hiển thị trên website"}
              {activeTab === "code" && "Chế độ sửa mã nguồn HTML"}
            </span>

            {/* Toggle Scroll / Expand view */}
            <button
              type="button"
              onClick={() => setIsExpandedView(!isExpandedView)}
              title={isExpandedView ? "Thu gọn lại khung cuộn (540px) để thanh công cụ luôn cố định trên đầu" : "Mở rộng toàn bộ chiều dài bài viết"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 700,
                border: "1px solid #cbd5e1",
                background: isExpandedView ? "#f1f5f9" : "#fff",
                color: isExpandedView ? "#0f172a" : "#475569",
                cursor: "pointer",
              }}
            >
              {isExpandedView ? (
                <>
                  <Minimize2 size={12} /> Thu gọn cuộn (540px)
                </>
              ) : (
                <>
                  <Maximize2 size={12} /> Mở rộng chiều cao
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formatting Toolbar (Only in visual mode) */}
        {activeTab === "visual" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 12px",
              background: "#fff",
              flexWrap: "wrap",
            }}
          >
            {/* Headings */}
            <button
              type="button"
              title="Đoạn văn thường (P)"
              onMouseDown={saveSelection}
              onClick={() => handleFormatBlock("<p>")}
              style={btnStyle}
            >
              <Pilcrow size={14} />
            </button>
            <button
              type="button"
              title="Tiêu đề mục lớn (H2)"
              onMouseDown={saveSelection}
              onClick={() => handleFormatBlock("<h2>")}
              style={btnStyle}
            >
              <Heading2 size={14} />
            </button>
            <button
              type="button"
              title="Tiêu đề mục nhỏ (H3)"
              onMouseDown={saveSelection}
              onClick={() => handleFormatBlock("<h3>")}
              style={btnStyle}
            >
              <Heading3 size={14} />
            </button>

            <div style={separatorStyle} />

            {/* CỠ CHỮ (FONT SIZE CONTROLS) */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                background: "#f8fafc",
                padding: "2px 5px",
                borderRadius: "7px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Type size={13} style={{ color: "#64748b" }} />
              <select
                title="Chọn cỡ chữ cho đoạn văn bản đã bôi đen"
                value={selectedFontSize}
                onMouseDown={saveSelection}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedFontSize(val);
                  applyFontSize(val);
                }}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1e293b",
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  padding: "3px 6px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {FONT_SIZES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                title="Giảm cỡ chữ (A-)"
                onMouseDown={saveSelection}
                onClick={stepFontSizeDown}
                style={{
                  ...btnStyle,
                  padding: "2px 5px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#475569",
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  height: "22px",
                }}
              >
                A-
              </button>

              <button
                type="button"
                title="Tăng cỡ chữ (A+)"
                onMouseDown={saveSelection}
                onClick={stepFontSizeUp}
                style={{
                  ...btnStyle,
                  padding: "2px 5px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#475569",
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  height: "22px",
                }}
              >
                A+
              </button>
            </div>

            <div style={separatorStyle} />

            {/* Text Styles */}
            <button
              type="button"
              title="In đậm (Ctrl+B)"
              onMouseDown={saveSelection}
              onClick={() => exec("bold")}
              style={btnStyle}
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              title="In nghiêng (Ctrl+I)"
              onMouseDown={saveSelection}
              onClick={() => exec("italic")}
              style={btnStyle}
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              title="Gạch chân (Ctrl+U)"
              onMouseDown={saveSelection}
              onClick={() => exec("underline")}
              style={btnStyle}
            >
              <Underline size={14} />
            </button>

            <div style={separatorStyle} />

            {/* Lists */}
            <button
              type="button"
              title="Danh sách dấu chấm"
              onMouseDown={saveSelection}
              onClick={() => exec("insertUnorderedList")}
              style={btnStyle}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              title="Danh sách số thứ tự"
              onMouseDown={saveSelection}
              onClick={() => exec("insertOrderedList")}
              style={btnStyle}
            >
              <ListOrdered size={14} />
            </button>
            <button
              type="button"
              title="Trích dẫn (Quote)"
              onMouseDown={saveSelection}
              onClick={() => handleFormatBlock("<blockquote>")}
              style={btnStyle}
            >
              <Quote size={14} />
            </button>

            <div style={separatorStyle} />

            {/* Alignment */}
            <button
              type="button"
              title="Căn trái"
              onMouseDown={saveSelection}
              onClick={() => exec("justifyLeft")}
              style={btnStyle}
            >
              <AlignLeft size={14} />
            </button>
            <button
              type="button"
              title="Căn giữa"
              onMouseDown={saveSelection}
              onClick={() => exec("justifyCenter")}
              style={btnStyle}
            >
              <AlignCenter size={14} />
            </button>
            <button
              type="button"
              title="Căn phải"
              onMouseDown={saveSelection}
              onClick={() => exec("justifyRight")}
              style={btnStyle}
            >
              <AlignRight size={14} />
            </button>
            <button
              type="button"
              title="Căn đều hai bên"
              onMouseDown={saveSelection}
              onClick={() => exec("justifyFull")}
              style={btnStyle}
            >
              <AlignJustify size={14} />
            </button>

            <div style={separatorStyle} />

            {/* ACTION: Chèn ảnh trực quan */}
            <button
              type="button"
              title="Chèn ảnh vào vị trí con trỏ chuột"
              onMouseDown={saveSelection}
              onClick={openImageModal}
              style={{
                ...btnStyle,
                background: "#fee2e2",
                color: "#d42027",
                fontWeight: 700,
                padding: "5px 11px",
                border: "1px solid #fecaca",
              }}
            >
              <ImageIcon size={15} /> Chèn ảnh
            </button>

            {/* ACTION: ĐÍNH KÈM TÀI LIỆU PDF / WORD */}
            <button
              type="button"
              title="Đính kèm file PDF hoặc file Word vào bài viết"
              onMouseDown={saveSelection}
              onClick={openDocModal}
              style={{
                ...btnStyle,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontWeight: 700,
                padding: "5px 11px",
                border: "1px solid #bfdbfe",
              }}
            >
              <FileText size={15} /> Đính kèm PDF / Word
            </button>

            {/* ACTION: NHẬP BÀI VIẾT TỪ FILE WORD (.DOCX) */}
            <button
              type="button"
              title="Đọc toàn bộ nội dung từ file Word (.docx) đưa thẳng vào bài viết"
              onMouseDown={saveSelection}
              onClick={() => {
                setSelectedWordFile(null);
                setWordConvertError("");
                setWordImportMode(value && value.trim() !== "<p><br></p>" && value.trim() !== "" ? "replace" : "replace");
                setIsWordImportOpen(true);
              }}
              style={{
                ...btnStyle,
                background: "#f0fdf4",
                color: "#15803d",
                fontWeight: 700,
                padding: "5px 11px",
                border: "1px solid #bbf7d0",
              }}
            >
              <FileUp size={15} /> Nhập từ Word (.docx)
            </button>

            <button
              type="button"
              title="Chèn liên kết (Link)"
              onMouseDown={saveSelection}
              onClick={handleInsertLink}
              style={btnStyle}
            >
              <LinkIcon size={14} /> Link
            </button>

            <div style={separatorStyle} />

            {/* Clear format & Undo */}
            <button
              type="button"
              title="Xóa định dạng"
              onMouseDown={saveSelection}
              onClick={() => exec("removeFormat")}
              style={btnStyle}
            >
              <Eraser size={14} />
            </button>
            <button
              type="button"
              title="Hoàn tác (Undo)"
              onMouseDown={saveSelection}
              onClick={() => exec("undo")}
              style={btnStyle}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div
        style={{
          position: "relative",
          maxHeight: isExpandedView ? "none" : "540px",
          minHeight,
          overflowY: isExpandedView ? "visible" : "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f8fafc",
          background: "#fff",
        }}
      >
        {/* 1. Visual WYSIWYG Mode */}
        <div
          style={{
            display: activeTab === "visual" ? "block" : "none",
            minHeight,
            padding: "20px 24px",
            outline: "none",
            fontSize: "15px",
            lineHeight: 1.8,
            color: "#1e293b",
          }}
          className="article-detail-body"
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={() => {
              saveSelection();
              handleInput();
            }}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            onPaste={handlePaste}
            onDrop={handleDrop}
            style={{
              minHeight: "300px",
              outline: "none",
            }}
          />
        </div>

        {/* 2. Live Preview Mode */}
        {activeTab === "preview" && (
          <div
            style={{
              padding: "24px 28px",
              minHeight,
              background: "#fafafa",
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#0f172a",
            }}
            className="article-detail-body"
            dangerouslySetInnerHTML={{
              __html:
                value ||
                "<p style='color:#94a3b8;font-style:italic'>Chưa có nội dung...</p>",
            }}
          />
        )}

        {/* 3. Raw HTML Code Mode */}
        {activeTab === "code" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "100%",
              minHeight,
              padding: "16px",
              border: "none",
              outline: "none",
              fontFamily: "Consolas, Menlo, Monaco, monospace",
              fontSize: "13px",
              lineHeight: 1.6,
              background: "#0f172a",
              color: "#e2e8f0",
              resize: "vertical",
            }}
            placeholder="<p>Mã HTML của bài viết...</p>"
          />
        )}
      </div>

      {/* Editor Footer Help */}
      <div
        style={{
          padding: "8px 14px",
          background: "#f8fafc",
          borderTop: "1px solid var(--line)",
          fontSize: "12px",
          color: "#64748b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      >
        <span>
          💡 <strong>Tính năng:</strong> Bấm <strong>&quot;Chèn ảnh&quot;</strong> để thêm ảnh hoặc <strong>&quot;Đính kèm PDF / Word&quot;</strong> để người đọc xem online và tải tài liệu về máy. Hỗ trợ <strong>Ctrl+V</strong> dán ảnh và kéo thả file trực tiếp.
        </span>
        <span style={{ fontSize: "11px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          📌 <em>Thanh công cụ luôn ghim ở trên đầu khi cuộn bài viết</em>
        </span>
      </div>

      {/* MODAL 1: CHÈN ẢNH */}
      {isImageModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsImageModalOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  Chèn ảnh vào vị trí con trỏ
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Ảnh sẽ được chèn ngay tại vị trí bạn vừa đặt chuột trong bài viết
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #e2e8f0",
                background: "#fff",
                padding: "4px 16px 0",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() => setImageModalTab("upload")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderBottom: imageModalTab === "upload" ? "2px solid #d42027" : "2px solid transparent",
                  background: "transparent",
                  color: imageModalTab === "upload" ? "#d42027" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <Upload size={15} /> Tải ảnh từ máy tính
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab("library")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderBottom: imageModalTab === "library" ? "2px solid #d42027" : "2px solid transparent",
                  background: "transparent",
                  color: imageModalTab === "library" ? "#d42027" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <FolderOpen size={15} /> Chọn từ thư viện ảnh ({libraryImages.length})
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab("url")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderBottom: imageModalTab === "url" ? "2px solid #d42027" : "2px solid transparent",
                  background: "transparent",
                  color: imageModalTab === "url" ? "#d42027" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <ExternalLink size={15} /> Nhập link ảnh (URL)
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1, minHeight: "260px" }}>
              {imageModalTab === "upload" && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadFile(file);
                    }}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      padding: "40px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "#f8fafc",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d42027")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  >
                    {isUploading ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        <Loader2 size={32} className="animate-spin" style={{ color: "#d42027" }} />
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
                          Đang tải ảnh lên hệ thống...
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "#fee2e2",
                            color: "#d42027",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <Upload size={22} />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                          Bấm vào đây để chọn ảnh từ máy tính của bạn
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          Hỗ trợ định dạng JPG, PNG, WEBP, GIF (Tối đa 50MB)
                        </span>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "10px 14px",
                        background: "#fef2f2",
                        border: "1px solid #fee2e2",
                        borderRadius: "8px",
                        color: "#b91c1c",
                        fontSize: "13px",
                      }}
                    >
                      {uploadError}
                    </div>
                  )}

                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                      Chú thích ảnh (tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Ví dụ: Lễ đón nhận giải thưởng Doanh nghiệp tiêu biểu..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              )}

              {imageModalTab === "library" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                      position: "relative",
                    }}
                  >
                    <Search
                      size={15}
                      style={{ position: "absolute", left: "12px", color: "#94a3b8" }}
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên file ảnh..."
                      value={searchLibrary}
                      onChange={(e) => setSearchLibrary(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px 8px 36px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {isLoadingLibrary ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <Loader2 size={24} className="animate-spin" style={{ display: "inline-block", color: "#d42027", marginBottom: "8px" }} />
                      <p style={{ margin: 0, fontSize: "13px" }}>Đang tải danh sách ảnh...</p>
                    </div>
                  ) : filteredLibrary.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                      <p style={{ margin: 0, fontSize: "13px" }}>Không tìm thấy ảnh nào trong thư viện.</p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: "10px",
                        maxHeight: "260px",
                        overflowY: "auto",
                        padding: "4px",
                      }}
                    >
                      {filteredLibrary.map((img) => {
                        const isSelected = selectedImage === img.url;
                        return (
                          <div
                            key={img.url}
                            onClick={() => setSelectedImage(img.url)}
                            style={{
                              position: "relative",
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: isSelected ? "2px solid #d42027" : "1px solid #e2e8f0",
                              cursor: "pointer",
                              aspectRatio: "1",
                              background: "#f1f5f9",
                              boxShadow: isSelected ? "0 0 0 2px rgba(212,32,39,0.2)" : "none",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            {isSelected && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  background: "#d42027",
                                  color: "#fff",
                                  borderRadius: "50%",
                                  width: "20px",
                                  height: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Check size={12} />
                              </div>
                            )}
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "rgba(0,0,0,0.6)",
                                color: "#fff",
                                fontSize: "10px",
                                padding: "2px 4px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={img.name}
                            >
                              {img.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedImage && (
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                        Chú thích ảnh (tùy chọn):
                      </label>
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="Ví dụ: Hình ảnh hoạt động thực tế..."
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {imageModalTab === "url" && (
                <div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                      Đường dẫn ảnh (URL):
                    </label>
                    <input
                      type="url"
                      value={selectedImage}
                      onChange={(e) => setSelectedImage(e.target.value)}
                      placeholder="https://example.com/hinh-anh.jpg hoặc /uploads/..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                      Chú thích ảnh (tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Ví dụ: Lễ đón nhận giải thưởng..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                padding: "12px 20px",
                borderTop: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>

              {(imageModalTab === "library" || imageModalTab === "url") && (
                <button
                  type="button"
                  disabled={!selectedImage}
                  onClick={() => insertImageAtCursor(selectedImage, imageCaption)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: selectedImage ? "#d42027" : "#cbd5e1",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: selectedImage ? "pointer" : "not-allowed",
                  }}
                >
                  Chèn ảnh này vào bài
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ĐÍNH KÈM TÀI LIỆU PDF / WORD */}
      {isDocModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDocModalOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "580px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={18} style={{ color: "#1d4ed8" }} />
                  Đính kèm tài liệu (PDF / Word)
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Cho phép người đọc xem trực tuyến và tải tài liệu về máy tính/điện thoại
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              <input
                type="file"
                ref={docFileInputRef}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectDocFile(file);
                }}
              />

              {/* File Select Area */}
              <div
                onClick={() => docFileInputRef.current?.click()}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "28px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: selectedDocFile ? "#f0fdf4" : "#f8fafc",
                  borderColor: selectedDocFile ? "#86efac" : "#cbd5e1",
                  transition: "all 0.2s ease",
                  marginBottom: "16px",
                }}
              >
                {selectedDocFile ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: selectedDocFile.name.endsWith(".pdf") ? "#fee2e2" : "#e0f2fe",
                        color: selectedDocFile.name.endsWith(".pdf") ? "#dc2626" : "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "12px",
                      }}
                    >
                      {selectedDocFile.name.split(".").pop()?.toUpperCase()}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        {selectedDocFile.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                        {formatFileSize(selectedDocFile.size)} • Bấm để đổi file khác
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <Paperclip size={20} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                      Bấm vào đây để chọn file PDF hoặc file Word
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Hỗ trợ định dạng: .PDF, .DOCX, .DOC (Tối đa 50MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Title input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Tên hiển thị của tài liệu:
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ví dụ: Quyết định số 123/QĐ-UBND ban hành..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Options for PDF */}
              {selectedDocFile?.name.toLowerCase().endsWith(".pdf") && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                    Kiểu hiển thị trên bài viết:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    {/* Mode 1: Chuỗi ảnh sắc nét (KHUYÊN DÙNG) */}
                    <div
                      onClick={() => setDocDisplayMode("images")}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: docDisplayMode === "images" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                        background: docDisplayMode === "images" ? "#f0fdf4" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontSize: "22px", flexShrink: 0 }}>📸</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 800, fontSize: "13px", color: "#166534" }}>
                            Hiển thị chuỗi ảnh sắc nét
                          </span>
                          <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "10px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                            KHUYÊN DÙNG • KHÔNG DÙNG IFRAME
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#475569", marginTop: "3px", lineHeight: "1.4" }}>
                          Từng trang PDF được chuyển thành ảnh độ nét cao. Độc giả cuộn đọc trực tiếp trong bài mượt mà, xem hoàn hảo trên cả điện thoại và máy tính, kèm nút tải file gốc.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {/* Mode 2: Thẻ tải về */}
                      <div
                        onClick={() => setDocDisplayMode("card")}
                        style={{
                          padding: "12px",
                          borderRadius: "10px",
                          border: docDisplayMode === "card" ? "2px solid #0284c7" : "1px solid #cbd5e1",
                          background: docDisplayMode === "card" ? "#f0f9ff" : "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "2px" }}>
                          📄 Thẻ tài liệu đính kèm
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Gọn gàng, kèm nút mở xem trực tiếp tab mới & nút tải về máy
                        </div>
                      </div>

                      {/* Mode 3: Iframe */}
                      <div
                        onClick={() => setDocDisplayMode("embed")}
                        style={{
                          padding: "12px",
                          borderRadius: "10px",
                          border: docDisplayMode === "embed" ? "2px solid #d42027" : "1px solid #cbd5e1",
                          background: docDisplayMode === "embed" ? "#fff" : "#f8fafc",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "2px" }}>
                          📑 Khung đọc trực tiếp (iframe)
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Nhúng khung đọc PDF truyền thống trong bài viết
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {docUploadError && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#fef2f2",
                    border: "1px solid #fee2e2",
                    borderRadius: "8px",
                    color: "#b91c1c",
                    fontSize: "13px",
                    marginBottom: "12px",
                  }}
                >
                  {docUploadError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderTop: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <div style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>
                {isUploadingDoc && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Loader2 size={13} className="animate-spin text-green-600" />
                    {docUploadProgress || "Đang xử lý tài liệu..."}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  disabled={isUploadingDoc}
                  onClick={() => setIsDocModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: isUploadingDoc ? "not-allowed" : "pointer",
                  }}
                >
                  Hủy
                </button>

                <button
                  type="button"
                  disabled={!selectedDocFile || isUploadingDoc}
                  onClick={handleUploadAndInsertDoc}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: selectedDocFile ? (docDisplayMode === "images" ? "#16a34a" : "#1d4ed8") : "#cbd5e1",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: selectedDocFile && !isUploadingDoc ? "pointer" : "not-allowed",
                  }}
                >
                  {isUploadingDoc && <Loader2 size={14} className="animate-spin" />}
                  {isUploadingDoc
                    ? docDisplayMode === "images"
                      ? "Đang chuyển trang thành ảnh..."
                      : "Đang tải lên..."
                    : docDisplayMode === "images"
                    ? "Chuyển thành chuỗi ảnh & chèn vào bài"
                    : "Chèn tài liệu vào bài"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NHẬP NỘI DUNG TỪ FILE WORD (.DOCX) */}
      {isWordImportOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isConvertingWord) setIsWordImportOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "580px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileUp size={18} style={{ color: "#16a34a" }} />
                  Nhập bài viết từ file Word (.docx)
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Hệ thống tự động đọc tiêu đề, in đậm, in nghiêng, danh sách và bảng biểu
                </p>
              </div>

              <button
                type="button"
                disabled={isConvertingWord}
                onClick={() => setIsWordImportOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: isConvertingWord ? "not-allowed" : "pointer",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              <input
                type="file"
                ref={wordFileInputRef}
                accept=".docx"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedWordFile(file);
                    setWordConvertError("");
                  }
                }}
              />

              {/* File Select Area */}
              <div
                onClick={() => !isConvertingWord && wordFileInputRef.current?.click()}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "32px 20px",
                  textAlign: "center",
                  cursor: isConvertingWord ? "wait" : "pointer",
                  background: selectedWordFile ? "#f0fdf4" : "#f8fafc",
                  borderColor: selectedWordFile ? "#86efac" : "#cbd5e1",
                  transition: "all 0.2s ease",
                  marginBottom: "18px",
                }}
              >
                {selectedWordFile ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        background: "#e0f2fe",
                        color: "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "13px",
                      }}
                    >
                      DOCX
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        {selectedWordFile.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600, marginTop: "2px" }}>
                        {(selectedWordFile.size / 1024).toFixed(1)} KB • Bấm để chọn file Word khác
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "#dcfce7",
                        color: "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <FileUp size={22} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                      Bấm vào đây để chọn file Word (.docx) từ máy tính
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Hỗ trợ Microsoft Word định dạng .DOCX chuẩn
                    </span>
                  </div>
                )}
              </div>

              {/* Mode Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                  Tùy chọn cách đưa vào bài viết:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div
                    onClick={() => setWordImportMode("replace")}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: wordImportMode === "replace" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                      background: wordImportMode === "replace" ? "#f0fdf4" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "2px" }}>
                      📄 Thay thế toàn bộ nội dung
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                      Xóa nội dung cũ và lấy toàn bộ bài viết từ file Word (khuyên dùng cho bài mới)
                    </div>
                  </div>

                  <div
                    onClick={() => setWordImportMode("append")}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: wordImportMode === "append" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                      background: wordImportMode === "append" ? "#f0fdf4" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "2px" }}>
                      ➕ Chèn tiếp vào vị trí con trỏ
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                      Giữ nguyên nội dung đang viết và chèn nội dung file Word vào vị trí con trỏ
                    </div>
                  </div>
                </div>
              </div>

              {wordConvertError && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#fef2f2",
                    border: "1px solid #fee2e2",
                    borderRadius: "8px",
                    color: "#b91c1c",
                    fontSize: "13px",
                    marginBottom: "12px",
                  }}
                >
                  {wordConvertError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                padding: "12px 20px",
                borderTop: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <button
                type="button"
                disabled={isConvertingWord}
                onClick={() => setIsWordImportOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isConvertingWord ? "not-allowed" : "pointer",
                }}
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={!selectedWordFile || isConvertingWord}
                onClick={handleConvertWord}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: selectedWordFile && !isConvertingWord ? "#16a34a" : "#cbd5e1",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: selectedWordFile && !isConvertingWord ? "pointer" : "not-allowed",
                  boxShadow: selectedWordFile && !isConvertingWord ? "0 1px 3px rgba(22,163,74,0.2)" : "none",
                }}
              >
                {isConvertingWord && <Loader2 size={14} className="animate-spin" />}
                {isConvertingWord ? "Đang chuyển đổi..." : "Chuyển đổi & Đưa vào bài viết"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  padding: "5px 8px",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "6px",
  color: "#334155",
  fontSize: "12px",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const separatorStyle: React.CSSProperties = {
  width: "1px",
  height: "18px",
  background: "#e2e8f0",
  margin: "0 4px",
};
