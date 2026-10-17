import Link from "next/link";
import { ArrowRight, Award, Building2, CheckCircle2, Globe, Sparkles } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function DoanhNghiepPage() {
  const content = await loadSiteContent();

  const brandHighlights = [
    {
      name: "Tập đoàn Hoa Sen",
      industry: "Vật liệu xây dựng & Tôn thép",
      desc: "Hải Dương Media đồng hành sản xuất TVC quảng cáo và booking chiến dịch truyền thông thương hiệu trên sóng truyền hình quốc gia VTV1 và HTV9.",
      tag: "Thương hiệu Quốc gia",
    },
    {
      name: "BNI Vietnam",
      industry: "Tổ chức kết nối thương mại toàn cầu",
      desc: "Bảo trợ truyền thông, sản xuất video phóng sự đại hội BNI và kết nối truyền thông báo chí điện tử chính thống.",
      tag: "Đối tác chiến lược",
    },
    {
      name: "CMC Telecom",
      industry: "Hạ tầng Viễn thông & Công nghệ số",
      desc: "Phối hợp triển khai các phóng sự chuyên đề chuyển đổi số cho doanh nghiệp trên VTV và báo điện tử VnExpress, Dân Trí.",
      tag: "Tập đoàn Công nghệ",
    },
    {
      name: "Tincom Media",
      industry: "Điện ảnh & Truyền thông giải trí",
      desc: "Sản xuất phim, booking quảng cáo đa phương tiện và đồng tổ chức các sự kiện vinh danh doanh nhân tiêu biểu.",
      tag: "Đối tác truyền thông",
    },
    {
      name: "Hồ Mây Park",
      industry: "Du lịch, Sinh thái & Nghỉ dưỡng",
      desc: "Chiến dịch quảng bá điểm đến du lịch cao cấp tại Vũng Tàu trên khung giờ vàng VTV3 và chuyên mục du lịch báo Thanh Niên, Tuổi Trẻ.",
      tag: "Du lịch & Dịch vụ",
    },
    {
      name: "Westcor VN",
      industry: "Xúc tiến thương mại Quốc tế",
      desc: "Đại diện phối hợp xúc tiến thương mại song phương Việt Nam - Hàn Quốc và đưa các sản phẩm Việt thâm nhập thị trường Đông Á.",
      tag: "Thương mại Quốc tế",
    },
  ];

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="ĐỒNG HÀNH & NÂNG TẦM"
          title="Doanh Nghiệp & Thương Hiệu Tiêu Biểu"
          description="Hơn 3.000 thương hiệu hàng đầu Việt Nam đã lựa chọn Hải Dương Media để kiến tạo chiến lược truyền thông, nâng cao định vị và phủ sóng trên sóng truyền hình quốc gia."
        />

        <section className="section">
          <div className="site-container">
            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "48px",
              }}
            >
              {[
                { number: "3.000+", label: "Doanh nghiệp đồng hành" },
                { number: "150+", label: "TVC phát sóng VTV/HTV" },
                { number: "200+", label: "Đầu báo điện tử liên kết" },
                { number: "98%", label: "Khách hàng hài lòng & gia hạn" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <strong style={{ fontSize: "32px", fontWeight: 900, color: "#d42027", display: "block" }}>{stat.number}</strong>
                  <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Doanh nghiệp Cards */}
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow" style={{ color: "#d42027" }}>HỆ SINH THÁI KHÁCH HÀNG</span>
                <h2>Các Doanh Nghiệp Tiêu Biểu</h2>
              </div>
              <p>Mỗi câu chuyện thương hiệu là một hành trình khẳng định uy tín và giá trị vững bền cùng Hải Dương Media.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "32px" }}>
              {brandHighlights.map((b, idx) => (
                <article
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--line)",
                    borderRadius: "18px",
                    padding: "28px",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span
                      style={{
                        background: "rgba(212,32,39,0.08)",
                        color: "#d42027",
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      {b.tag}
                    </span>
                    <Building2 size={18} color="var(--muted)" />
                  </div>

                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>{b.name}</h3>
                  <small style={{ color: "#64748b", fontWeight: 600, fontSize: "12px", marginBottom: "12px", display: "block" }}>
                    {b.industry}
                  </small>
                  <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, flex: 1, marginBottom: "20px" }}>{b.desc}</p>

                  <div style={{ paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                    <Link href="/lien-he" className="text-link" style={{ fontSize: "13px" }}>
                      Tư vấn giải pháp cho doanh nghiệp →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Danh sách thương hiệu đối tác */}
            <div style={{ marginTop: "60px", background: "#f8fafc", borderRadius: "20px", padding: "36px", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", textAlign: "center" }}>
                Khách hàng & Doanh nghiệp hợp tác cùng Hải Dương Media
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
                {content.clients.map((client, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      padding: "8px 16px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
