import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";

export type ServiceItem = { title: string; description: string };

export type NewsItem = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image: string;
  author?: string;
  link?: string;
  active?: boolean;
};

export type HomepageSection = {
  id: string;
  name: string;
  enabled: boolean;
};

export type BannerSlide = {
  id?: string;
  tag?: string;
  title?: string;
  highlight?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  badge?: string;
  bgImage?: string;
  active?: boolean;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  status?: string;
  tag: string;
  image: string;
  summary: string;
  description: string;
  agenda?: string[];
  benefits?: string[];
  contactPerson?: string;
  active?: boolean;
};

export type VtvCommercial = {
  id?: string;
  channel: string;
  program: string;
  title: string;
  timeSlot: string;
  youtubeId: string;
  description: string;
  active?: boolean;
};

export type KnowledgeItem = {
  id?: string;
  slug?: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  image?: string;
  link: string;
  active?: boolean;
};

export type PressItem = {
  id?: string;
  newspaper: string;
  title: string;
  quote: string;
  date: string;
  link: string;
  active?: boolean;
};

export type BrandItem = {
  id?: string;
  name: string;
  category: string;
  description: string;
  url: string;
  active?: boolean;
};

export type TestimonialItem = {
  id?: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  avatarText: string;
  active?: boolean;
};

export type ProcessStep = {
  title: string;
  desc: string;
};

export type SiteContent = {
  brandName: string;
  brandKicker: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  aboutTitle: string;
  aboutBody: string;
  trustTitle: string;
  trustBody: string;
  services: ServiceItem[];
  news: NewsItem[];
  hotline: string;
  hotlineHref: string;
  email: string;
  address: string;
  zaloUrl: string;
  facebookUrl: string;
  mapUrl: string;
  footerNote: string;
  bannerSlides: BannerSlide[];
  upcomingEvents: EventItem[];
  vtvCommercials: VtvCommercial[];
  knowledge: KnowledgeItem[];
  press: PressItem[];
  brands: BrandItem[];
  testimonials: TestimonialItem[];
  partners: string[];
  clients: string[];
  homepageSections: HomepageSection[];
  processEyebrow?: string;
  processTitle?: string;
  processSteps?: ProcessStep[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
};

export const defaultSiteContent: SiteContent = {
  brandName: "HẢI DƯƠNG MEDIA",
  brandKicker: "Dịch vụ Quảng Cáo và Xây Dựng Thương Hiệu Toàn Diện",
  heroEyebrow: "Đồng hành cùng doanh nghiệp trong kỷ nguyên số",
  heroTitle: "Giải pháp truyền thông giúp thương hiệu được nhìn thấy và ghi nhớ",
  heroDescription: "Chuyên tư vấn chiến lược xây dựng thương hiệu, booking quảng cáo báo mạng, truyền hình VTV/HTV, sản xuất phim quảng cáo TVC, tổ chức sự kiện và xúc tiến thương mại quốc tế.",
  primaryCta: "Nhận tư vấn ngay",
  secondaryCta: "Khám phá dịch vụ",
  aboutTitle: "Hơn 11 năm đồng hành xây dựng hệ sinh thái thương hiệu vững mạnh",
  aboutBody: "Hải Dương Media kết nối chiến lược, báo chí truyền thông, truyền hình quốc gia và nền tảng số để mọi doanh nghiệp truyền tải thông điệp chuẩn xác, tạo niềm tin vững chắc tới hàng triệu khách hàng mục tiêu.",
  trustTitle: "Tập trung vào kết quả có thể đo lường và kiểm chứng",
  trustBody: "Mỗi chiến dịch được chuẩn bị kỹ lưỡng từ kịch bản, kiểm duyệt phát sóng của đài truyền hình, chỉ số tiếp cận đến bảo trợ truyền thông toàn diện.",
  services: [
    { title: "Booking quảng cáo truyền hình VTV/HTV", description: "Lập kế hoạch và booking phát sóng khung giờ vàng trên các kênh VTV1, VTV3, HTV7, HTV9, THVL với thủ tục kiểm duyệt nhanh gọn." },
    { title: "Sản xuất TVC & Phim doanh nghiệp", description: "Sản xuất phim tự giới thiệu, TVC quảng cáo, video viral, phóng sự truyền hình đạt chuẩn phát sóng 4K UHD đài truyền hình quốc gia." },
    { title: "Booking PR & Báo chí online", description: "Phủ sóng thương hiệu trên hơn 200+ đầu báo điện tử uy tín hàng đầu: VnExpress, Dân Trí, Tuổi Trẻ, CafeF, Vietnamnet, Thanh Niên..." },
    { title: "Tổ chức sự kiện & Xúc tiến thương mại", description: "Chương trình vinh danh thương hiệu uy tín, hội nghị thượng đỉnh kinh tế tại Hàn Quốc, Singapore, Philippines, Hồng Kông..." },
    { title: "Tư vấn chiến lược thương hiệu 1:1", description: "Tư vấn định vị thương hiệu công ty, xây dựng thương hiệu cá nhân cho CEO thời AI và xử lý khủng hoảng truyền thông." },
    { title: "Thiết kế & Digital Marketing", description: "Bộ nhận diện thương hiệu, logo, profile, landing page và kế hoạch truyền thông đa kênh tối ưu chi phí." },
  ],
  news: [
    {
      id: "news-1",
      slug: "thuong-hieu-manh-quoc-gia-2027",
      category: "Sự kiện doanh nhân",
      title: "Chương trình Thương hiệu mạnh Quốc Gia 2027 và Tết doanh nhân 2027",
      excerpt: "Chương trình thường niên tôn vinh các thương hiệu tiêu biểu, kết nối giao thương giữa cộng đồng doanh nghiệp Việt Nam và quốc tế.",
      content: `[justify]Chương trình **Thương Hiệu Mạnh Quốc Gia 2027** và **Tết Doanh Nhân 2027** là sự kiện uy tín quy mô lớn, tạo cầu nối xúc tiến thương mại vững chắc cho các nhãn hàng vươn lên tầm cao mới sau một năm nỗ lực sản xuất và kinh doanh.[/justify]

## Khẳng định uy tín và bản lĩnh doanh nghiệp Việt

[justify]Trải qua nhiều kỳ tổ chức thành công, chương trình đã vinh danh hàng trăm doanh nghiệp tiêu biểu có đóng góp tích cực cho nền kinh tế, tiên phong đổi mới công nghệ và thực hiện tốt trách nhiệm xã hội. Đây là dịp để lãnh đạo các doanh nghiệp cùng nhìn lại chặng đường đã qua và mở rộng mạng lưới liên kết.[/justify]

![Lễ ký kết xúc tiến thương mại và trao chứng nhận Thương hiệu mạnh Quốc gia](/images/posts/post-thuong-hieu-manh.png)

## Quyền lợi truyền thông nổi bật dành cho doanh nghiệp tham dự

> "Một chiến dịch truyền thông thành công là khi giá trị thực của sản phẩm chạm đến niềm tin bền vững của người tiêu dùng."

- **Phát sóng truyền hình:** Được ghi hình và phát sóng phóng sự trên các khung giờ vàng VTV1, VTV3 và HTV9.
- **Bảo trợ báo chí:** Bài viết PR xuất hiện trang trọng trên hơn 50 đầu báo điện tử hàng đầu như VnExpress, CafeF, Dân Trí.
- **Biểu trưng danh giá:** Trao tặng Cúp vàng và Giấy chứng nhận Thương hiệu Mạnh Quốc Gia 2027.

[center]**Liên hệ ngay để nhận gói hỗ trợ truyền thông độc quyền từ Hải Dương Media!**[/center]

[right]*Ban Biên Tập Hải Dương Media - 16.10.2026*[/right]`,
      date: "16.10.2026",
      image: "/images/posts/post-thuong-hieu-manh.png",
      author: "Ban Biên Tập Hải Dương Media",
      link: "/tin-tuc/thuong-hieu-manh-quoc-gia-2027",
    },
    {
      id: "news-2",
      slug: "tet-ba-mien-chao-xuan-2027",
      category: "Tin hoạt động",
      title: "Tết Ba Miền – Chào Xuân 2027: Kết nối cộng đồng doanh nhân, lan tỏa giá trị thương hiệu Việt",
      excerpt: "Sự kiện quy tụ hơn 500 doanh nghiệp hàng đầu tham gia giao lưu, chia sẻ bài học vượt sóng và đón đầu cơ hội năm mới.",
      content: "Đại hội giao thương Tết Ba Miền 2027 sẽ diễn ra tại Trung tâm Hội nghị Quốc gia Hà Nội với nhiều nội dung đặc sắc: tọa đàm kinh tế vĩ mô, biểu diễn nghệ thuật mùa xuân và vinh danh thương hiệu tiêu biểu ASEAN.",
      date: "12.10.2026",
      image: "/images/posts/post-tet-3-mien.png",
      author: "Ban Sự Kiện",
      link: "/tin-tuc/tet-ba-mien-chao-xuan-2027",
    },
    {
      id: "news-3",
      slug: "hai-duong-media-11-nam-he-sinh-thai",
      category: "Dấu ấn",
      title: "HẢI DƯƠNG MEDIA – 11 năm từ đam mê đến hệ sinh thái thương hiệu uy tín",
      excerpt: "Hành trình 11 năm đồng hành cùng hơn 3.000 thương hiệu trong nước và quốc tế khẳng định vị thế dẫn đầu trong ngành truyền thông.",
      content: "Được thành lập từ tình yêu cháy bỏng với con chữ và nghệ thuật kể chuyện thương hiệu, Hải Dương Media hôm nay đã trở thành tổ hợp truyền thông đa phương tiện sở hữu các ấn phẩm nổi tiếng và đối tác của hàng loạt đài truyền hình lớn.",
      date: "08.10.2026",
      image: "/images/posts/post-lens-11-nam.png",
      author: "Ban Giám Đốc Hải Dương Media",
      link: "/tin-tuc/hai-duong-media-11-nam-he-sinh-thai",
    },
    {
      id: "news-4",
      slug: "hai-duong-media-dong-hanh-vimf-2026",
      category: "Hội chợ quốc tế",
      title: "Hải Dương Media đồng hành cùng doanh nghiệp tại triển lãm công nghiệp VIMF & VIAF 2026 Bắc Ninh",
      excerpt: "Hỗ trợ truyền thông và kết nối đối tác công nghệ, công nghiệp phụ trợ giữa các nhà máy trong và ngoài nước.",
      content: "Sự kiện công nghiệp chế tạo hàng đầu phía Bắc thu hút hàng ngàn khách tham quan và chuyên gia, là dịp để các giải pháp truyền thông doanh nghiệp bộc lộ sức mạnh kết nối B2B mạnh mẽ.",
      date: "04.10.2026",
      image: "/images/posts/post-marketing-trend.jpeg",
      author: "Team Hải Dương Media",
      link: "/tin-tuc/hai-duong-media-dong-hanh-vimf-2026",
    },
  ],
  hotline: "090 377 2086",
  hotlineHref: "+84903772086",
  email: "contact@haiduongmedia.com",
  address: "64 Võ Thị Sáu, P. Tân Định, Quận 1, TP. Hồ Chí Minh | Chi nhánh: BT7-4 KĐT Văn Khê, Hà Đông, Hà Nội",
  zaloUrl: "https://zalo.me/84903772086",
  facebookUrl: "https://www.facebook.com/haiduongmedia",
  mapUrl: "https://maps.google.com/?q=64+Vo+Thi+Sau+Tan+Dinh+Quan+1+HCM",
  footerNote: "Hải Dương Media - Đơn vị tư vấn chiến lược truyền thông, sản xuất phim quảng cáo và booking báo đài uy tín hàng đầu Việt Nam.",
  bannerSlides: [
    {
      id: "banner-1",
      tag: "VTV BROADCAST",
      title: "Sản Xuất Phim Quảng Cáo & Phát Sóng Trên VTV",
      highlight: "Đưa thương hiệu lên sóng truyền hình quốc gia VTV1, VTV3, VTV6",
      description: "Trọn gói từ kịch bản, sản xuất TVC chuẩn 4K, thông qua kiểm duyệt băng đài đến phát sóng các khung giờ vàng trước Thời sự 19h và Chuyển động 24h.",
      ctaText: "Xem bảng giá VTV",
      ctaHref: "#vtv-commercials",
      badge: "CHUẨN PHÁT SÓNG VTV",
      bgImage: "/images/vtv-studio.jpg",
      active: true,
    },
    {
      id: "banner-2",
      tag: "BOOKING PR / ADS",
      title: "Booking Quảng Cáo Báo Mạng Toàn Quốc",
      highlight: "Ưu đãi chiết khấu lên đến 51% tại các đầu báo hàng đầu",
      description: "Booking bài viết PR trên VnExpress, Dân Trí, Tuổi Trẻ, CafeF, VietnamNet. Giúp thương hiệu phủ sóng rộng khắp với chi phí tối ưu nhất.",
      ctaText: "Nhận báo giá báo mạng",
      ctaHref: "/lien-he",
      badge: "CHIẾT KHẤU ĐẾN 51%",
      bgImage: "/images/vtv-tvc.jpg",
      active: true,
    },
    {
      id: "banner-3",
      tag: "SỰ KIỆN QUỐC TẾ",
      title: "Diễn Đàn Xúc Tiến Thương Mại & Tôn Vinh Thương Hiệu",
      highlight: "Kết nối doanh nghiệp Việt Nam - Hàn Quốc, ASEAN 2026 - 2027",
      description: "Cơ hội đưa sản phẩm và dịch vụ vươn tầm thị trường Châu Á, gặp gỡ lãnh đạo các bộ ngành và tập đoàn đa quốc gia.",
      ctaText: "Khám phá sự kiện",
      ctaHref: "#upcoming-events",
      badge: "KẾT NỐI TOÀN CẦU",
      bgImage: "/images/event-stage.jpg",
      active: true,
    },
  ],
  upcomingEvents: [
    {
      id: "event-1",
      slug: "le-cong-bo-thuong-hieu-uy-tin-hang-dau-chau-a-2026",
      title: "LỄ CÔNG BỐ THƯƠNG HIỆU UY TÍN HÀNG ĐẦU CHÂU Á 2026",
      date: "18/12/2026",
      time: "08:30 - 17:30",
      location: "Seoul, Hàn Quốc",
      status: "",
      tag: "Diễn đàn Việt - Hàn",
      image: "/images/events/event-korea.png",
      summary: "Vietnam – Korea Business Forum 2026 tại Seoul: Kết nối doanh nghiệp Việt Nam – Hàn Quốc và Lễ công bố Thương hiệu uy tín hàng đầu Châu Á 2026.",
      description: `[justify]**Vietnam - Korea Business Forum 2026** và **Lễ công bố Thương Hiệu Uy Tín Hàng Đầu Châu Á 2026** là sự kiện xúc tiến thương mại quốc tế uy tín do Hải Dương Media phối hợp cùng các tổ chức kinh tế và cơ quan truyền thông Hàn Quốc tổ chức tại thủ đô Seoul.[/justify]

## Cầu nối giao thương chiến lược Việt Nam - Hàn Quốc

[justify]Sự kiện mở ra cơ hội vàng cho các doanh nhân, doanh nghiệp Việt mở rộng chuỗi cung ứng, tìm kiếm đại lý phân phối và nâng cao uy tín thương hiệu trên trường quốc tế. Chương trình có sự tham dự của đại diện Đại sứ quán, các hiệp hội doanh nghiệp và hơn 150 lãnh đạo tập đoàn hàng đầu.[/justify]

> "Vươn ra biển lớn đòi hỏi sự chuẩn bị bài bản về thương hiệu, chứng nhận uy tín và sự đồng hành của các kênh truyền thông chính thống."

[center]**Hạn chót tiếp nhận hồ sơ tham gia đoàn đại biểu: 30/11/2026**[/center]`,
      agenda: [
        "08:30 - 09:00: Đón tiếp đại biểu, VIP và báo chí quốc tế tại khách sạn 5 sao Seoul",
        "09:00 - 11:30: Phiên thảo luận: Cơ hội hợp tác thương mại Việt - Hàn thời kỳ mới",
        "13:30 - 15:30: Bàn tròn xúc tiến đầu tư B2B Matching & Ký kết hợp tác song phương",
        "15:30 - 17:30: Lễ vinh danh Thương Hiệu Uy Tín Hàng Đầu Châu Á 2026 & Gala Dinner",
      ],
      benefits: [
        "Được ghi hình phát sóng trên VTV1 Thời Sự & Báo chí uy tín (VnExpress, Dân Trí, CafeF)",
        "Trao cúp vinh danh và Giấy chứng nhận Thương hiệu Uy tín Hàng đầu Châu Á 2026",
        "Gặp gỡ trực tiếp hơn 100 đối tác nhà phân phối và nhà đầu tư Hàn Quốc",
        "Tài trợ gói truyền thông quảng bá thương hiệu quốc tế độc quyền từ Hải Dương Media",
      ],
      contactPerson: "Hotline Ban Tổ Chức: 090 377 2086",
    },
    {
      id: "event-2",
      slug: "tet-ba-mien-chao-xuan-2027",
      title: "TẾT BA MIỀN CHÀO XUÂN 2027 & THƯƠNG HIỆU TIÊU BIỂU ASEAN",
      date: "16/01/2027",
      time: "17:00 - 21:30",
      location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
      status: "Sắp diễn ra",
      tag: "Gala Chào Xuân",
      image: "/images/events/event-tet.png",
      summary: "Đại hội doanh nhân Tết Ba Miền quy tụ hơn 500 nhà lãnh đạo, tôn vinh các thương hiệu tiêu biểu ASEAN và chào đón năm mới 2027.",
      description: "Tết Ba Miền – Chào Xuân 2027 là sự kiện văn hóa - kinh tế thường niên lớn nhất của cộng đồng doanh nhân Việt Nam. Chương trình quy tụ các chuyên gia kinh tế đầu ngành, nghệ sĩ nổi tiếng và hơn 500 chủ doanh nghiệp nhằm tổng kết một năm bứt phá, vinh danh các cống hiến xuất sắc và khai xuân đón tài lộc.",
      agenda: [
        "17:00 - 18:00: Thảm đỏ đón khách, triển lãm sản phẩm OCOP & giao lưu B2B kết nối",
        "18:00 - 19:30: Khai mạc, biểu diễn nghệ thuật chào xuân & Lễ tôn vinh Thương hiệu tiêu biểu ASEAN",
        "19:30 - 21:30: Tiệc Gala Doanh Nhân & Giao lưu chúc Tết, bốc thăm may mắn đầu năm",
      ],
      benefits: [
        "Bảo trợ phát sóng truyền hình quốc gia VTV và đài HTV",
        "Cơ hội quảng bá trực tiếp tới 500+ chủ doanh nghiệp tham dự",
        "Xuất hiện trang trọng trên ấn phẩm Tết Ngôi Sao Doanh Nhân phát hành toàn quốc",
        "Nhận biểu trưng danh giá cho sự cống hiến vượt bậc của doanh nghiệp",
      ],
      contactPerson: "Hotline Ban Tổ Chức: 090 377 2086",
    },
    {
      id: "event-3",
      slug: "dien-dan-van-hoa-khoa-hoc-hop-tac-chau-a-2026",
      title: "DIỄN ĐÀN VĂN HÓA KHOA HỌC & HỢP TÁC CHÂU Á 2026",
      date: "28-30/11/2026",
      time: "3 ngày 2 đêm",
      location: "Hồng Kông",
      status: "Số lượng có hạn",
      tag: "Hợp tác Châu Á",
      image: "/images/events/event-hongkong.jpeg",
      summary: "Hội nghị thượng đỉnh văn hóa kinh tế và ứng dụng công nghệ truyền thông mới, mở rộng thị trường tại trung tâm tài chính Hồng Kông.",
      description: "Diễn đàn Văn Hóa Khoa Học và Hợp Tác Châu Á 2026 tại Hồng Kông là không gian kết nối đỉnh cao giữa các doanh nhân, nhà khoa học và tổ chức văn hóa Châu Á, cùng thảo luận về chuyển đổi số, kinh tế xanh và thương mại quốc tế.",
      agenda: [
        "Ngày 1: Check-in, khảo sát thực tế trung tâm tài chính & công nghệ Hồng Kông",
        "Ngày 2: Phiên toàn thể Diễn đàn Khoa học & Hợp tác Châu Á 2026",
        "Ngày 3: Gặp gỡ các quỹ đầu tư mạo hiểm và doanh nghiệp đối tác quốc tế",
      ],
      benefits: [
        "Tiếp cận thị trường tài chính và đối tác quốc tế tại Hồng Kông",
        "Chứng nhận tham gia diễn đàn khoa học & xúc tiến thương mại Châu Á",
        "Quảng bá profile doanh nghiệp trên các kênh truyền thông đối tác tại Hong Kong",
      ],
      contactPerson: "Hotline Ban Tổ Chức: 090 377 2086",
    },
    {
      id: "event-4",
      slug: "le-cong-bo-thuong-hieu-uy-tin-hang-dau-asean-2026",
      title: "LỄ CÔNG BỐ THƯƠNG HIỆU UY TÍN HÀNG ĐẦU ASEAN 2026",
      date: "11-14/11/2026",
      time: "4 ngày 3 đêm",
      location: "Manila, Philippines",
      status: "Chốt danh sách",
      tag: "Xúc tiến ASEAN",
      image: "/images/events/event-philippines.jpeg",
      summary: "Diễn đàn Xúc tiến Thương mại và Đầu tư Việt Nam – Philippines 2026, kết nối đối tác và mở rộng thị trường khu vực ASEAN.",
      description: "Diễn đàn nhằm hỗ trợ các thương hiệu Việt Nam tiếp cận thị trường tiêu dùng tiềm năng hơn 115 triệu dân của Philippines và chuỗi cung ứng khu vực Đông Nam Á, thúc đẩy giao thương hàng hóa và dịch vụ.",
      agenda: [
        "Ngày 1: Bay đến Manila, tiệc chào mừng đại biểu đoàn Việt Nam",
        "Ngày 2: Diễn đàn xúc tiến đầu tư thương mại song phương Việt Nam - Philippines",
        "Ngày 3: Lễ công bố Thương Hiệu Uy Tín Hàng Đầu ASEAN 2026 & B2B matching",
        "Ngày 4: Thăm quan thực tế hệ thống bán lẻ và trở về Việt Nam",
      ],
      benefits: [
        "Tiếp cận trực tiếp các nhà bán lẻ và phân phối tại thị trường Philippines",
        "Vinh danh và trao chứng nhận Thương hiệu Uy tín Hàng đầu ASEAN",
        "Phóng sự ghi hình và phát sóng trên các đài truyền hình uy tín",
      ],
      contactPerson: "Hotline Ban Tổ Chức: 090 377 2086",
    },
  ],
  vtvCommercials: [
    {
      channel: "VTV1",
      program: "Chuyển Động 24h",
      title: "VTV1 | Chuyển Động 24h | Nhộn nhịp mua sắm thời trang đón Tết",
      timeSlot: "Trưa 11:15 & Tối 18:30",
      youtubeId: "QEBI8sjWxdQ",
      description: "Phóng sự doanh nghiệp phát sóng trong bản tin triệu người xem, giúp nhãn hàng tạo uy tín đột phá ngay dịp cao điểm mua sắm.",
    },
    {
      channel: "VTV3",
      program: "Thông Tin 260 / Cafe Sáng",
      title: "Thông Tin 260 VTV3 | ELSA Speak | App học tiếng Anh thông minh",
      timeSlot: "Khung giờ vàng buổi sáng",
      youtubeId: "bsBNIbqe3fc",
      description: "TVC giới thiệu sản phẩm công nghệ với kịch bản sinh động, kiểm duyệt nghiêm ngặt đạt chuẩn kỹ thuật phát sóng đài quốc gia.",
    },
    {
      channel: "VTV1",
      program: "Thời Sự & Diễn Đàn Kinh Tế",
      title: "VTV1 | Diễn đàn hợp tác kinh tế Việt Nam - ASEAN & Thương hiệu mạnh",
      timeSlot: "Bản tin kinh tế VTV1",
      youtubeId: "tnKmhBowV8c",
      description: "Đưa tin lễ vinh danh thương hiệu tại Singapore, bảo trợ truyền thông cấp quốc gia cho các doanh nghiệp xuất khẩu.",
    },
    {
      channel: "HTV9 & HTV7",
      program: "Chương Trình 60 Giây",
      title: "HTV7 & HTV9 | Thời sự 60s | Phong cách truyền thống và hiện đại",
      timeSlot: "Khung giờ vàng 18:30",
      youtubeId: "3K7LZhYJkog",
      description: "Chương trình tin tức có tỷ suất người xem cao nhất miền Nam, tiếp cận nhanh chóng hàng triệu người tiêu dùng năng động.",
    },
  ],
  knowledge: [
    {
      id: "know-1",
      slug: "top-10-marketing-trend-2026",
      category: "Chiến lược Marketing",
      title: "Top 10 Marketing Trends 2026 và những điều doanh nghiệp cần chuẩn bị",
      excerpt: "Phản ánh những chuyển dịch mạnh mẽ từ AI content, video ngắn đến kết hợp TVC truyền hình và mạng xã hội để tối ưu ngân sách.",
      date: "14.10.2026",
      readTime: "5 phút đọc",
      image: "/images/posts/post-marketing-trend.jpeg",
      link: "/tin-tuc",
    },
    {
      id: "know-2",
      slug: "xay-dung-thuong-hieu-ca-nhan-thoi-ai",
      category: "Thương hiệu cá nhân",
      title: "Xây dựng thương hiệu cá nhân thời AI: Chiến lược theo chuẩn E-E-A-T cho CEO",
      excerpt: "Hướng dẫn lãnh đạo doanh nghiệp định vị hình ảnh chuyên gia, gia tăng mức độ tín nhiệm và tạo sức ảnh hưởng bền vững.",
      date: "10.10.2026",
      readTime: "6 phút đọc",
      image: "/images/posts/post-ceo-branding.png",
      link: "/tin-tuc",
    },
    {
      id: "know-3",
      slug: "dich-vu-dua-tin-thoi-su-vtv-uy-tin",
      category: "Quảng cáo truyền hình",
      title: "Dịch vụ đưa tin thời sự VTV uy tín và quy trình kiểm duyệt giấy phép đài",
      excerpt: "Tổng hợp các hồ sơ cần thiết, tiêu chuẩn âm thanh EBU R128 và lưu ý kịch bản để được phê duyệt phát sóng ngay lần đầu tiên.",
      date: "05.10.2026",
      readTime: "7 phút đọc",
      image: "/images/posts/post-thoi-su-vtv.png",
      link: "/tin-tuc",
    },
    {
      id: "know-4",
      slug: "bao-gia-vnexpress-2026",
      category: "Báo chí PR",
      title: "Báo giá VnExpress 2026 và kinh nghiệm chọn chuyên mục tiếp cận đúng tệp khách hàng",
      excerpt: "Checklist vàng giúp doanh nghiệp chọn đúng trang Kinh Doanh, Đời Sống hay Số Hóa để tối đa hóa tỷ lệ chuyển đổi liên hệ.",
      date: "01.10.2026",
      readTime: "4 phút đọc",
      image: "/images/posts/post-thuong-hieu-manh.png",
      link: "/tin-tuc",
    },
  ],
  press: [
    {
      newspaper: "CafeF",
      title: "CEO Hải Dương Media và hành trình 11 năm đồng hành cùng doanh nghiệp xây dựng thương hiệu",
      quote: "Muốn ra thế giới, trước tiên thương hiệu phải đứng vững bằng giá trị thật và thông điệp chuẩn mực trên những kênh truyền thông chính thống.",
      date: "Tháng 06/2025",
      link: "/tin-tuc",
    },
    {
      newspaper: "Báo Phụ Nữ Việt Nam",
      title: "Một tấm lòng – Ngàn hy vọng: Khi yêu thương hóa thành mùa hoa sau lũ",
      quote: "Đồng hành cùng các dự án cộng đồng và lan tỏa tinh thần tương thân tương ái của các doanh nhân Việt khắp mọi miền tổ quốc.",
      date: "Tháng 11/2025",
      link: "/tin-tuc",
    },
    {
      newspaper: "Báo Tuổi Trẻ & Dân Trí",
      title: "Giải pháp truyền thông tích hợp: Kết hợp sức mạnh TVC truyền hình và lan tỏa đa kênh",
      quote: "Hải Dương Media mở ra cánh cửa cho doanh nghiệp vừa và nhỏ tiếp cận khung giờ vàng truyền hình với chi phí hợp lý và hiệu quả cao.",
      date: "Tháng 01/2026",
      link: "/tin-tuc",
    },
  ],
  brands: [
    { name: "Ngôi Sao Doanh Nhân", category: "Tạp chí & Cổng thông tin", description: "Ấn phẩm chuyên sâu hàng đầu dành cho các CEO, nhà sáng lập và cộng đồng doanh nhân Việt.", url: "https://ngoisaodoanhnhan.vn" },
    { name: "The Woman", category: "Thương hiệu phụ nữ", description: "Không gian truyền cảm hứng về phong cách sống, bản lĩnh người phụ nữ hiện đại và lãnh đạo.", url: "https://thewoman.vn" },
    { name: "Doanh Nhân & Sao Việt", category: "Giải trí & Kinh doanh", description: "Nhịp cầu kết nối giữa giới doanh nhân và các nghệ sĩ, người có tầm ảnh hưởng tích cực.", url: "https://doanhnhansaoviet.net" },
    { name: "The Best In Vietnam", category: "Bảng xếp hạng & Vinh danh", description: "Hệ thống tôn vinh các sản phẩm, dịch vụ và thương hiệu dẫn đầu uy tín tại thị trường Việt Nam.", url: "https://thebestvietnam.vn" },
    { name: "Điểm Hẹn Du Lịch", category: "Truyền thông lữ hành", description: "Quảng bá các điểm đến văn hóa, danh lam thắng cảnh và hệ sinh thái khách sạn nghỉ dưỡng cao cấp.", url: "https://diemhendulich.vn" },
    { name: "KOLS Vietnam", category: "Mạng lưới Influencers", description: "Hệ sinh thái kết nối các chuyên gia, KOLs, KOCs phù hợp với từng mục tiêu chiến dịch thương hiệu.", url: "https://kolsvietnam.vn" },
  ],
  testimonials: [
    {
      name: "Ông Hồ Quang Minh",
      title: "Chủ tịch BCA Group, BNI Vietnam, ActionCOACH và CC Vietnam",
      company: "BNI Vietnam",
      quote: "Dịch vụ tư vấn chiến lược xây dựng thương hiệu và truyền thông của Hải Dương Media rất tốt. Các chiến lược được đầu tư nghiên cứu kỹ lưỡng phù hợp với từng thương hiệu, giúp doanh nghiệp phát triển bền vững.",
      avatarText: "HQM",
    },
    {
      name: "Ông Hoàng Đức Huy",
      title: "Phó Tổng Giám Đốc Tập đoàn Hoa Sen",
      company: "Hoa Sen Group",
      quote: "Các sản phẩm truyền thông của Hải Dương Media rất chất lượng cả về nội dung lẫn hình thức. Sự chỉn chu và tác phong chuyên nghiệp giúp chúng tôi hoàn toàn yên tâm trong mọi chiến dịch lớn.",
      avatarText: "HĐH",
    },
    {
      name: "Bà Mai Thu Huyền",
      title: "Đạo diễn - Diễn viên điện ảnh – CEO Tincom Media",
      company: "Tincom Media",
      quote: "Tôi rất ấn tượng với năng lực sản xuất phim và dịch vụ truyền thông của Hải Dương Media. Cảm ơn đội ngũ đã luôn tận tâm đồng hành cùng các dự án nghệ thuật và điện ảnh của chúng tôi.",
      avatarText: "MTH",
    },
    {
      name: "Bà Hoàng Thị Bích Duyên",
      title: "Thẩm Phán - Cố Vấn Pháp Lý Doanh Nghiệp",
      company: "Tòa án & Pháp luật",
      quote: "Tôi rất ấn tượng bởi sự chỉn chu trong từng câu chữ, tính chuẩn xác thông tin và thiết kế sang trọng, chuyên nghiệp của các ấn phẩm Hải Dương Media phát hành.",
      avatarText: "HBD",
    },
  ],
  partners: [
    "Đài Truyền hình Việt Nam (VTV)",
    "Đài Truyền hình TP.HCM (HTV)",
    "Báo VnExpress",
    "Báo Dân Trí",
    "Báo Tuổi Trẻ",
    "Báo Thanh Niên",
    "Báo VietnamNet",
    "CafeF",
    "Đài Tiếng nói Việt Nam (VOV)",
  ],
  clients: [
    "Tập đoàn Hoa Sen",
    "BNI Vietnam",
    "CMC Telecom",
    "Tincom Media",
    "Hồ Mây Park",
    "ActionCOACH",
    "Vũ Garden",
    "Vườn Xoài Ecotourism",
    "Westcor VN",
    "PM International",
  ],
  homepageSections: [
    { id: "banner", name: "Banner Slider nổi bật", enabled: true },
    { id: "trust", name: "Chỉ số niềm tin & Thành tựu", enabled: true },
    { id: "vtv", name: "Sản xuất phim quảng cáo trên VTV", enabled: true },
    { id: "events", name: "Danh mục sự kiện sắp diễn ra", enabled: true },
    { id: "services", name: "Dịch vụ & Sản phẩm chủ lực", enabled: true },
    { id: "news", name: "Tin mới & Kiến thức", enabled: true },
    { id: "about", name: "Về chúng tôi (Giới thiệu Hải Dương Media)", enabled: true },
    { id: "press", name: "Báo chí, Thương hiệu & Đối tác", enabled: true },
    { id: "process", name: "Quy trình triển khai 4 bước", enabled: true },
    { id: "cta", name: "Khối kêu gọi hợp tác (CTA)", enabled: true },
  ],
  processEyebrow: "QUY TRÌNH CHUẨN MỰC",
  processTitle: "Đơn Giản, Minh Bạch & Đúng Tiến Độ Phát Sóng",
  processSteps: [
    { title: "Nghiên cứu & Định vị", desc: "Phân tích thương hiệu, khách hàng mục tiêu và chọn kênh truyền thông tối ưu." },
    { title: "Xây kịch bản & Ý tưởng", desc: "Sáng tạo nội dung chạm cảm xúc, kịch bản TVC đạt chuẩn kiểm duyệt của nhà đài." },
    { title: "Sản xuất & Duyệt băng đài", desc: "Quay phim điện ảnh 4K, xử lý hậu kỳ và hoàn tất thủ tục cấp phép phát sóng." },
    { title: "Phát sóng & Đo lường", desc: "Bàn giao chứng thư phát sóng, đo lường chỉ số tiếp cận và lan tỏa đa kênh." },
  ],
  ctaEyebrow: "BẮT ĐẦU CHIẾN DỊCH TRUYỀN THÔNG MỚI",
  ctaTitle: "Đưa thương hiệu của bạn tỏa sáng trên sóng truyền hình quốc gia và báo chí hàng đầu.",
  ctaButtonText: "Liên hệ tư vấn ngay",
  ctaButtonHref: "/lien-he",
};

let tableEnsured = false;
async function ensureDbTable() {
  if (tableEnsured) return;
  try {
    await getDb().run(sql`CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_by TEXT,
      updated_at INTEGER NOT NULL
    )`);
    tableEnsured = true;
  } catch {
    // Continue if running offline or table already initialized
  }
}

export async function loadSiteContent(): Promise<SiteContent> {
  try {
    await ensureDbTable();
    const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, "main")).limit(1);
    return row ? normalizeContent(JSON.parse(row.data)) : defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const content = await loadSiteContent();
  return content.upcomingEvents.find((e) => e.slug === slug) || null;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const content = await loadSiteContent();
  return content.news.find((n) => n.slug === slug) || null;
}

export async function saveSiteContent(content: SiteContent, updatedBy: string): Promise<SiteContent> {
  await ensureDbTable();
  const normalized = normalizeContent(content);
  const values = { key: "main", data: JSON.stringify(normalized), updatedBy, updatedAt: new Date() };
  await getDb().insert(siteContent).values(values).onConflictDoUpdate({ target: siteContent.key, set: values });
  return normalized;
}

function cleanBrandText(text: string): string {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/LENS GROUP\s*&\s*HẢI DƯƠNG MEDIA/gi, "HẢI DƯƠNG MEDIA")
    .replace(/LENS GROUP/gi, "HẢI DƯƠNG MEDIA")
    .replace(/Lens Group/gi, "Hải Dương Media")
    .replace(/Lens Media/gi, "Hải Dương Media")
    .replace(/lennguyenmedia@gmail\.com/gi, "contact@haiduongmedia.com")
    .replace(/https:\/\/www\.facebook\.com\/lennguyenmedia/gi, "https://www.facebook.com/haiduongmedia")
    .replace(/Đang mở đăng ký/gi, "")
    .replace(/đang mở đăng ký/gi, "")
    .replace(/Đăng ký tham dự/gi, "Tham gia");
}

function normalizeContent(value: Partial<SiteContent>): SiteContent {
  const read = (key: keyof SiteContent) => {
    const candidate = value[key];
    const raw = typeof candidate === "string" && candidate.trim() ? candidate.trim() : (defaultSiteContent[key] as string);
    return cleanBrandText(raw);
  };

  const services = Array.isArray(value.services) && value.services.length
    ? value.services.slice(0, 6).map((item, index) => ({
        title: cleanBrandText(item?.title?.trim() || defaultSiteContent.services[index]?.title || "Dịch vụ"),
        description: cleanBrandText(item?.description?.trim() || defaultSiteContent.services[index]?.description || "Nội dung đang cập nhật."),
      }))
    : defaultSiteContent.services;

  const news = Array.isArray(value.news) && value.news.length
    ? value.news.map((item, index) => ({
        id: item?.id || `news-${index + 1}`,
        slug: cleanBrandText(item?.slug || defaultSiteContent.news[index]?.slug || `tin-tuc-${index + 1}`).toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        category: item?.category?.trim() || defaultSiteContent.news[index]?.category || "Tin tức",
        title: cleanBrandText(item?.title?.trim() || defaultSiteContent.news[index]?.title || "Bài viết mới"),
        excerpt: cleanBrandText(item?.excerpt?.trim() || defaultSiteContent.news[index]?.excerpt || "Nội dung đang cập nhật."),
        content: cleanBrandText(item?.content || defaultSiteContent.news[index]?.content || item?.excerpt || ""),
        date: item?.date || defaultSiteContent.news[index]?.date || "17.10.2026",
        image: item?.image || defaultSiteContent.news[index]?.image || "/images/posts/post-thuong-hieu-manh.png",
        author: cleanBrandText(item?.author || defaultSiteContent.news[index]?.author || "Ban Biên Tập"),
        link: cleanBrandText(item?.slug ? `/tin-tuc/${item.slug}` : (item?.link || "/tin-tuc")),
        active: item?.active !== false,
      }))
    : defaultSiteContent.news;

  const upcomingEvents = Array.isArray(value.upcomingEvents) && value.upcomingEvents.length
    ? value.upcomingEvents.map((item, index) => ({
        id: item?.id || `event-${index + 1}`,
        slug: cleanBrandText(item?.slug || defaultSiteContent.upcomingEvents[index]?.slug || `su-kien-${index + 1}`).toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        title: cleanBrandText(item?.title?.trim() || defaultSiteContent.upcomingEvents[index]?.title || "Sự kiện"),
        date: item?.date?.trim() || defaultSiteContent.upcomingEvents[index]?.date || "2026",
        time: item?.time || defaultSiteContent.upcomingEvents[index]?.time || "Cả ngày",
        location: item?.location?.trim() || defaultSiteContent.upcomingEvents[index]?.location || "Việt Nam",
        status: "",
        tag: item?.tag?.trim() || defaultSiteContent.upcomingEvents[index]?.tag || "Sự kiện",
        image: item?.image || defaultSiteContent.upcomingEvents[index]?.image || "/images/events/event-korea.png",
        summary: cleanBrandText(item?.summary || defaultSiteContent.upcomingEvents[index]?.summary || ""),
        description: cleanBrandText(item?.description || defaultSiteContent.upcomingEvents[index]?.description || ""),
        agenda: (item?.agenda || defaultSiteContent.upcomingEvents[index]?.agenda || []).map(cleanBrandText),
        benefits: (item?.benefits || defaultSiteContent.upcomingEvents[index]?.benefits || []).map(cleanBrandText),
        contactPerson: cleanBrandText(item?.contactPerson || defaultSiteContent.upcomingEvents[index]?.contactPerson || "Hotline: 090 377 2086"),
        active: item?.active !== false,
      }))
    : defaultSiteContent.upcomingEvents;

  const bannerSlides = Array.isArray(value.bannerSlides) && value.bannerSlides.length
    ? value.bannerSlides.map((slide, index) => ({
        id: slide.id || `banner-${index + 1}`,
        tag: cleanBrandText(slide.tag || ""),
        title: cleanBrandText(slide.title || ""),
        highlight: cleanBrandText(slide.highlight || ""),
        description: cleanBrandText(slide.description || ""),
        ctaText: cleanBrandText(slide.ctaText || "Tìm hiểu thêm"),
        ctaHref: slide.ctaHref || "#",
        badge: cleanBrandText(slide.badge || ""),
        bgImage: slide.bgImage || "",
        active: slide.active !== false,
      }))
    : defaultSiteContent.bannerSlides;

  const homepageSections = Array.isArray(value.homepageSections) && value.homepageSections.length
    ? value.homepageSections.map((sec) => ({
        id: sec.id,
        name: sec.name || defaultSiteContent.homepageSections.find((s) => s.id === sec.id)?.name || sec.id,
        enabled: sec.enabled !== false,
      }))
    : defaultSiteContent.homepageSections;

  const vtvCommercials = Array.isArray(value.vtvCommercials) && value.vtvCommercials.length
    ? value.vtvCommercials.map((v, i) => ({
        id: v.id || `vtv-${i + 1}`,
        channel: cleanBrandText(v.channel || "VTV"),
        program: cleanBrandText(v.program || "Chương trình"),
        title: cleanBrandText(v.title || "Phim doanh nghiệp"),
        timeSlot: cleanBrandText(v.timeSlot || "Khung giờ vàng"),
        youtubeId: v.youtubeId || "QEBI8sjWxdQ",
        description: cleanBrandText(v.description || ""),
        active: v.active !== false,
      }))
    : defaultSiteContent.vtvCommercials;

  const knowledge = Array.isArray(value.knowledge) && value.knowledge.length
    ? value.knowledge.map((k, i) => ({
        id: k.id || `know-${i + 1}`,
        slug: cleanBrandText(k.slug || `kien-thuc-${i + 1}`).toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        title: cleanBrandText(k.title || "Kiến thức truyền thông"),
        category: cleanBrandText(k.category || "Kiến thức"),
        excerpt: cleanBrandText(k.excerpt || ""),
        date: k.date || "17.10.2026",
        readTime: k.readTime || "5 phút đọc",
        image: k.image || "/images/posts/post-marketing-trend.jpeg",
        link: k.link || "/tin-tuc",
        active: k.active !== false,
      }))
    : defaultSiteContent.knowledge;

  const press = Array.isArray(value.press) && value.press.length
    ? value.press.map((p, i) => ({
        id: p.id || `press-${i + 1}`,
        newspaper: cleanBrandText(p.newspaper || "Báo chí"),
        title: cleanBrandText(p.title || ""),
        quote: cleanBrandText(p.quote || ""),
        date: p.date || "2026",
        link: p.link || "/tin-tuc",
        active: p.active !== false,
      }))
    : defaultSiteContent.press;

  const brands = Array.isArray(value.brands) && value.brands.length
    ? value.brands.map((b, i) => ({
        id: b.id || `brand-${i + 1}`,
        name: cleanBrandText(b.name || "Thương hiệu"),
        category: cleanBrandText(b.category || "Ấn phẩm"),
        description: cleanBrandText(b.description || ""),
        url: b.url || "#",
        active: b.active !== false,
      }))
    : defaultSiteContent.brands;

  const testimonials = Array.isArray(value.testimonials) && value.testimonials.length
    ? value.testimonials.map((t, i) => ({
        id: t.id || `testi-${i + 1}`,
        name: cleanBrandText(t.name || "Khách hàng"),
        title: cleanBrandText(t.title || "Lãnh đạo doanh nghiệp"),
        company: cleanBrandText(t.company || "Công ty"),
        quote: cleanBrandText(t.quote || ""),
        avatarText: t.avatarText || "HD",
        active: t.active !== false,
      }))
    : defaultSiteContent.testimonials;

  const partners = Array.isArray(value.partners) && value.partners.length
    ? value.partners.map(cleanBrandText)
    : defaultSiteContent.partners;

  const clients = Array.isArray(value.clients) && value.clients.length
    ? value.clients.map(cleanBrandText)
    : defaultSiteContent.clients;

  const processSteps = Array.isArray(value.processSteps) && value.processSteps.length
    ? value.processSteps.map((step) => ({
        title: cleanBrandText(step.title || "Bước quy trình"),
        desc: cleanBrandText(step.desc || "Mô tả bước quy trình"),
      }))
    : (defaultSiteContent.processSteps || []);

  return {
    brandName: read("brandName"),
    brandKicker: read("brandKicker"),
    heroEyebrow: read("heroEyebrow"),
    heroTitle: read("heroTitle"),
    heroDescription: read("heroDescription"),
    primaryCta: read("primaryCta"),
    secondaryCta: read("secondaryCta"),
    aboutTitle: read("aboutTitle"),
    aboutBody: read("aboutBody"),
    trustTitle: read("trustTitle"),
    trustBody: read("trustBody"),
    services,
    news,
    hotline: read("hotline"),
    hotlineHref: read("hotlineHref"),
    email: read("email"),
    address: read("address"),
    zaloUrl: read("zaloUrl"),
    facebookUrl: read("facebookUrl"),
    mapUrl: read("mapUrl"),
    footerNote: read("footerNote"),
    bannerSlides,
    upcomingEvents,
    vtvCommercials,
    knowledge,
    press,
    brands,
    testimonials,
    partners,
    clients,
    homepageSections,
    processEyebrow: value.processEyebrow?.trim() || defaultSiteContent.processEyebrow || "QUY TRÌNH CHUẨN MỰC",
    processTitle: value.processTitle?.trim() || defaultSiteContent.processTitle || "Đơn Giản, Minh Bạch & Đúng Tiến Độ Phát Sóng",
    processSteps,
    ctaEyebrow: value.ctaEyebrow?.trim() || defaultSiteContent.ctaEyebrow || "BẮT ĐẦU CHIẾN DỊCH TRUYỀN THÔNG MỚI",
    ctaTitle: value.ctaTitle?.trim() || defaultSiteContent.ctaTitle || "Đưa thương hiệu của bạn tỏa sáng trên sóng truyền hình quốc gia và báo chí hàng đầu.",
    ctaButtonText: value.ctaButtonText?.trim() || defaultSiteContent.ctaButtonText || "Liên hệ tư vấn ngay",
    ctaButtonHref: value.ctaButtonHref?.trim() || defaultSiteContent.ctaButtonHref || "/lien-he",
  };
}
