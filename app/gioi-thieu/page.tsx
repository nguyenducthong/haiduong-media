import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await loadSiteContent();
  return {
    alternates: { canonical: "/gioi-thieu" },
    title: content.aboutTitle || "Giới Thiệu Đơn Vị Truyền Thông",
    description:
      content.aboutBody ||
      "THƯƠNG HIỆU HÀNG ĐẦU VIỆT NAM (thuonghieuhangdauvn) - Đơn vị tư vấn chiến lược truyền thông, sản xuất TVC chuyên nghiệp và kết nối doanh nghiệp với truyền hình, báo chí.",
  };
}

export default async function AboutPage() {
  const content = await loadSiteContent();
  const defaultValues = [
    { number: "01", title: "Hiểu doanh nghiệp", desc: "Mỗi quyết định đều bám sát mục tiêu và trải nghiệm của khách hàng." },
    { number: "02", title: "Sáng tạo có mục tiêu", desc: "Mỗi quyết định đều bám sát mục tiêu và trải nghiệm của khách hàng." },
    { number: "03", title: "Thực thi có trách nhiệm", desc: "Mỗi quyết định đều bám sát mục tiêu và trải nghiệm của khách hàng." },
    { number: "04", title: "Đồng hành dài hạn", desc: "Mỗi quyết định đều bám sát mục tiêu và trải nghiệm của khách hàng." },
  ];
  const values = content.aboutValues && content.aboutValues.length > 0 ? content.aboutValues : defaultValues;

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow={content.aboutEyebrow || "GIỚI THIỆU DOANH NGHIỆP"}
          title={content.aboutTitle || "Hơn 11 năm đồng hành xây dựng hệ sinh thái thương hiệu vững mạnh"}
          description={content.aboutBody || "Hải Dương Media kết nối chiến lược, báo chí truyền thông, truyền hình quốc gia và nền tảng số để mọi doanh nghiệp truyền tải thông điệp chuẩn xác, tạo niềm tin vững chắc tới hàng triệu khách hàng mục tiêu."}
        />
        <section className="section">
          <div className="site-container about-grid">
            <div className="about-panel">
              <span className="eyebrow">{content.trustEyebrow || "Cam kết"}</span>
              <h2>{content.trustTitle || "Tập trung vào kết quả có thể đo lường và kiểm chứng"}</h2>
              <p>{content.trustBody || "Mỗi chiến dịch được chuẩn bị kỹ lưỡng từ kịch bản, kiểm duyệt phát sóng của đài truyền hình, chỉ số tiếp cận đến bảo trợ truyền thông toàn diện."}</p>
            </div>
            <div className="values-grid">
              {values.map((v, idx) => (
                <div key={idx}>
                  <span>{v.number}</span>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
