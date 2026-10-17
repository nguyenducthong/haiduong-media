import Link from "@/components/link";
import { ArrowRight, CheckCircle2, Clapperboard, Megaphone, Palette, Phone, ShieldCheck, Sparkles, Tv } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const content = await loadSiteContent();

  const products = [
    {
      badge: "TRỌNG TÂM",
      title: "Sản xuất TVC & Phim Quảng Cáo Chuẩn Phát Sóng VTV",
      desc: "Trọn gói kịch bản, quay phim điện ảnh chuẩn 4K, hoàn thiện kiểm duyệt băng đài và phát sóng khung giờ vàng VTV1, VTV3, HTV9.",
      features: [
        "Kịch bản sáng tạo, đúng chuẩn thuần phong mỹ tục và kiểm duyệt nhà đài",
        "Trang thiết bị quay phim điện ảnh ARRI/RED chuẩn 4K/6K sắc nét",
        "Diễn viên, KOLs, MC truyền hình uy tín hàng đầu",
        "Cấp chứng thư phát sóng và nghiệm thu băng đài chính thức",
      ],
      price: "Tùy chọn theo thời lượng 15s / 30s",
      link: "/#vtv-commercials",
    },
    {
      badge: "TIẾT KIỆM ĐẾN 51%",
      title: "Booking Báo Điện Tử & Truyền Thông Toàn Quốc",
      desc: "Phủ sóng thương hiệu trên hơn 200 đầu báo mạng uy tín nhất Việt Nam với chính sách chiết khấu độc quyền từ Hải Dương Media.",
      features: [
        "Đăng bài trên VnExpress, Dân Trí, VietnamNet, CafeF, Tuổi Trẻ, Thanh Niên",
        "Hỗ trợ biên tập nội dung chuẩn SEO và tối ưu chuyển đổi khách hàng",
        "Cam kết link vĩnh viễn, gắn banner hoặc backlink website doanh nghiệp",
        "Báo cáo chỉ số tương tác và tiếp cận chi tiết sau chiến dịch",
      ],
      price: "Chiết khấu độc quyền đến 51%",
      link: "/lien-he",
    },
    {
      badge: "CHIẾN LƯỢC DÀI HẠN",
      title: "Tư Vấn Chiến Lược & Thiết Kế Nhận Diện Thương Hiệu",
      desc: "Xây dựng nền móng định vị thương hiệu vững chắc, chuẩn hóa hình ảnh nhận diện chuyên nghiệp giúp doanh nghiệp nâng cao sức cạnh tranh.",
      features: [
        "Nghiên cứu thị trường và định vị thương hiệu khác biệt",
        "Thiết kế Logo, Brand Guideline, Hồ sơ năng lực (Profile), Catalog",
        "Bảo hộ nhãn hiệu và sở hữu trí tuệ tại Cục Sở Hữu Trí Tuệ",
        "Đồng bộ nhận diện trên nền tảng số và ấn phẩm truyền thông thực tế",
      ],
      price: "Gói linh hoạt theo quy mô",
      link: "/lien-he",
    },
    {
      badge: "QUỐC TẾ & KHU VỰC",
      title: "Tổ Chức Sự Kiện & Vinh Danh Doanh Nghiệp Châu Á",
      desc: "Cầu nối xúc tiến thương mại quốc tế, tổ chức lễ công bố và vinh danh thương hiệu tại Hàn Quốc, Singapore, Hà Nội và TP.HCM.",
      features: [
        "Tổ chức chuyên nghiệp tại các khách sạn 5 sao quốc tế",
        "Giao thương B2B với hơn 150 đối tác xuất nhập khẩu nước ngoài",
        "Truyền hình đưa tin, phát sóng phóng sự tôn vinh doanh nhân, doanh nghiệp",
        "Cấp Cúp vàng vinh danh và Bằng chứng nhận Thương hiệu Uy tín Châu Á",
      ],
      price: "Theo từng kỳ diễn đàn",
      link: "/su-kien",
    },
  ];

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="SẢN PHẨM & DỊCH VỤ TRUYỀN THÔNG"
          title="Giải Pháp Truyền Thông & Xây Dựng Thương Hiệu Toàn Diện"
          description="Hải Dương Media cung cấp hệ sinh thái sản phẩm và dịch vụ đồng bộ từ sản xuất phim TVC, booking báo đài, tư vấn nhận diện đến tổ chức sự kiện quốc tế."
        />

        <section className="section">
          <div className="site-container">
            <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
              {products.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--line)",
                    borderRadius: "20px",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span
                      style={{
                        background: idx === 0 ? "rgba(212,32,39,0.1)" : "rgba(15,23,42,0.06)",
                        color: idx === 0 ? "#d42027" : "#0f172a",
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "5px 12px",
                        borderRadius: "999px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {item.badge}
                    </span>
                    <small style={{ color: "var(--muted)", fontWeight: 700 }}>Gói 0{idx + 1}</small>
                  </div>

                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "12px", lineHeight: 1.4 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                    {item.desc}
                  </p>

                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px", marginBottom: "24px", flex: 1 }}>
                    <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Quyền lợi nổi bật:
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                      {item.features.map((f, fIdx) => (
                        <li key={fIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13.5px", color: "#475569", lineHeight: 1.5 }}>
                          <CheckCircle2 size={16} color="#d42027" style={{ flexShrink: 0, marginTop: "3px" }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#d42027" }}>{item.price}</span>
                    <Link
                      href={item.link}
                      className="button button-primary"
                      style={{ padding: "10px 18px", fontSize: "13px", borderRadius: "10px" }}
                    >
                      Nhận báo giá <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotline banner */}
            <div
              style={{
                marginTop: "48px",
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                borderRadius: "20px",
                padding: "36px",
                color: "#fff",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <span style={{ color: "#ff6b35", fontWeight: 800, fontSize: "12px", letterSpacing: "1px" }}>TƯ VẤN TRỰC TIẾP 24/7</span>
                <h3 style={{ fontSize: "22px", fontWeight: 800, marginTop: "6px" }}>Bạn cần gói giải pháp truyền thông đo ni đóng giày?</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Đội ngũ chuyên gia Hải Dương Media sẽ lên kế hoạch và bảng dự toán chi tiết trong 2 giờ làm việc.</p>
              </div>
              <a
                href={`tel:${content.hotlineHref}`}
                className="button"
                style={{ background: "#d42027", color: "#fff", fontWeight: 800, padding: "14px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Phone size={18} /> Gọi ngay: {content.hotline}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
