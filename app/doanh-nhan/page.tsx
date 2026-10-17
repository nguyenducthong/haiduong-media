import Link from "next/link";
import { ArrowRight, Award, Mic, Quote, Sparkles, Tv, UserCheck, Users } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function DoanhNhanPage() {
  const content = await loadSiteContent();

  const leaders = [
    {
      role: "DOANH NHÂN TIÊU BIỂU",
      name: "Doanh nhân & Lãnh đạo Đổi Mới Sáng Tạo",
      field: "Chuyển đổi số & Kinh tế xanh",
      quote: "Đưa bản sắc và trí tuệ doanh nhân Việt vươn tầm bản đồ kinh tế khu vực thông qua sức mạnh truyền thông chính thống.",
      desc: "Phóng sự nhân vật phát sóng trên chuyên mục Doanh Nhân & Hội Nhập VTV1 và các ấn phẩm chuyên khảo.",
      channels: ["VTV1 Thời sự", "VnExpress Phỏng vấn", "HTV9"],
    },
    {
      role: "NỮ LÃNH ĐẠO TIÊN PHONG",
      name: "Diễn Đàn Nữ Doanh Nhân Khát Vọng Tỏa Sáng",
      field: "Thương mại, Dịch vụ & Chăm sóc sức khỏe",
      quote: "Sự kiên định và trách nhiệm xã hội chính là chìa khóa vàng giúp doanh nghiệp vượt qua mọi biến động thị trường.",
      desc: "Chương trình tôn vinh các nữ lãnh đạo bản lĩnh, dẫn dắt doanh nghiệp phát triển bền vững và đóng góp cho cộng đồng.",
      channels: ["Báo Dân Trí", "VTV3 Khởi nghiệp", "CafeF"],
    },
    {
      role: "DOANH NHÂN TOÀN CẦU",
      name: "Đoàn Đại Biểu Doanh Nhân Giao Thương Quốc Tế",
      field: "Xuất nhập khẩu & Đầu tư nước ngoài",
      quote: "Mở rộng liên kết B2B song phương Việt Nam - Hàn Quốc, Singapore và đón đầu làn sóng vốn ngoại chất lượng cao.",
      desc: "Tham gia các diễn đàn kinh tế quốc tế tại Seoul, Tokyo và ký kết biên bản ghi nhớ hợp tác thương mại đa phương.",
      channels: ["Diễn đàn Seoul", "Thông tấn xã Việt Nam", "VTV4"],
    },
  ];

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="TÔN VINH BẢN LĨNH & TẦM NHÌN"
          title="Doanh Nhân & Câu Chuyện Truyền Cảm Hứng"
          description="Hải Dương Media tự hào là cầu nối tôn vinh những doanh nhân tiên phong, các nhà lãnh đạo tài ba đang ngày đêm cống hiến xây dựng nền kinh tế Việt Nam vững mạnh."
        />

        <section className="section">
          <div className="site-container">
            {/* Value pillars */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                marginBottom: "48px",
              }}
            >
              {[
                {
                  icon: Tv,
                  title: "Phóng sự nhân vật VTV & HTV",
                  desc: "Xây dựng hình ảnh người thuyền trưởng doanh nghiệp bản lĩnh trên các bản tin kinh tế và chương trình chuyên đề.",
                },
                {
                  icon: Mic,
                  title: "Phỏng vấn độc quyền báo chí lớn",
                  desc: "Chuyên mục trò chuyện cùng CEO, nhà sáng lập trên VnExpress, CafeF, VietnamNet và Dân Trí.",
                },
                {
                  icon: Award,
                  title: "Vinh danh Doanh nhân Châu Á",
                  desc: "Trao tặng bảng vàng tôn vinh và cúp vàng Doanh nhân tiêu biểu trong các sự kiện xúc tiến thương mại quốc tế.",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: "16px",
                      padding: "28px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "rgba(212,32,39,0.08)",
                        color: "#d42027",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{item.title}</h3>
                    <p style={{ fontSize: "13.5px", color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Featured stories */}
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow" style={{ color: "#d42027" }}>CHUYÊN ĐỀ DOANH NHÂN</span>
                <h2>Gương Mặt Lãnh Đạo & Diễn Đàn Tiêu Biểu</h2>
              </div>
              <p>Mỗi phóng sự là bài học quản trị sâu sắc và nguồn cảm hứng bất tận cho thế hệ khởi nghiệp trẻ.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "32px" }}>
              {leaders.map((lead, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--line)",
                    borderRadius: "20px",
                    padding: "32px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "24px",
                    alignItems: "center",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                  }}
                >
                  <div>
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
                      {lead.role}
                    </span>
                    <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "12px 0 6px" }}>{lead.name}</h3>
                    <small style={{ color: "#64748b", fontWeight: 700, fontSize: "13px" }}>Lĩnh vực: {lead.field}</small>
                    <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, marginTop: "12px" }}>{lead.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                      {lead.channels.map((ch, cIdx) => (
                        <span
                          key={cIdx}
                          style={{
                            background: "#f1f5f9",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#334155",
                            padding: "4px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "linear-gradient(135deg, #0f172a, #1e293b)",
                      borderRadius: "16px",
                      padding: "28px",
                      color: "#fff",
                      position: "relative",
                    }}
                  >
                    <Quote size={32} style={{ color: "#ff6b35", opacity: 0.8, marginBottom: "12px" }} />
                    <p style={{ fontSize: "15px", lineHeight: 1.7, fontStyle: "italic", color: "#f8fafc" }}>
                      &ldquo;{lead.quote}&rdquo;
                    </p>
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <Link
                        href="/lien-he"
                        style={{ color: "#ff6b35", fontWeight: 800, fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        Đăng ký phóng sự doanh nhân <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials quote from clients */}
            <div style={{ marginTop: "48px" }}>
              <div className="section-heading centered">
                <span className="eyebrow" style={{ color: "#d42027" }}>CẢM NHẬN TỪ ĐỐI TÁC</span>
                <h2>Lãnh Đạo Nói Về Hải Dương Media</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "28px" }}>
                {content.testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    }}
                  >
                    <p style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: 1.6, fontStyle: "italic", marginBottom: "16px" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#d42027",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {t.avatarText}
                      </div>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>{t.name}</strong>
                        <small style={{ color: "var(--muted)", fontSize: "12px" }}>{t.title} - {t.company}</small>
                      </div>
                    </div>
                  </div>
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
