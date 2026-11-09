export interface FacebookServiceItem {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  isHot?: boolean;
  shortDesc: string;
  iconName: string;
  tags: string[];
}

export const FACEBOOK_SERVICES: FacebookServiceItem[] = [
  {
    id: "fb-1",
    slug: "lay-lai-facebook",
    number: 1,
    title: "Lấy lại Facebook",
    subtitle: "Dịch vụ lấy lại tài khoản Facebook uy tín",
    isHot: true,
    shortDesc: "Khôi phục tài khoản Facebook bị khóa, checkpoint, quên pass hoặc tranh chấp quyền sở hữu. Làm trước trả tiền sau, bảo mật tuyệt đối.",
    iconName: "KeyRound",
    tags: ["Khôi phục tài khoản", "Mở khóa nhanh", "Không cọc"],
  },
  {
    id: "fb-2",
    slug: "facebook-khoa-956-ket-sat-tim",
    number: 2,
    title: "Facebook khóa 956",
    subtitle: "Két sắt tím, xác minh danh tính/bạn bè/mã gửi về",
    isHot: false,
    shortDesc: "Mở khóa lỗi két sắt tím đuôi link ...956. Vượt qua bước xác minh ngày sinh, mã về số điện thoại cũ hoặc email không còn dùng được.",
    iconName: "ShieldAlert",
    tags: ["Két sắt tím", "Checkpoint 956", "Mã xác minh"],
  },
  {
    id: "fb-3",
    slug: "vo-hieu-hoa-facebook-282-faq",
    number: 3,
    title: "Vô hiệu hóa Facebook",
    subtitle: "Treo 282, FAQ, vi phạm tiêu chuẩn cộng đồng",
    isHot: false,
    shortDesc: "Mở khóa tài khoản bị vô hiệu hóa dạng 282 (yêu cầu gửi ảnh mặt/CCCD), FAQ 030, FAQ 583 vi phạm bản quyền hoặc tiêu chuẩn cộng đồng.",
    iconName: "Lock",
    tags: ["Treo 282", "FAQ", "Tiêu chuẩn cộng đồng"],
  },
  {
    id: "fb-4",
    slug: "lay-lai-facebook-bi-hack",
    number: 4,
    title: "Lấy lại Facebook bị Hack",
    subtitle: "Hacker đổi email, SĐT, gài mã 2FA lạ",
    isHot: true,
    shortDesc: "Cứu tài khoản bị hacker tấn công đổi thông tin đăng nhập, gỡ số lạ, xóa email lạ, bypass mã xác thực 2 yếu tố hacker cài vào.",
    iconName: "ShieldOff",
    tags: ["Bị hack", "Hacker đổi thông tin", "Gỡ mã 2FA lạ"],
  },
  {
    id: "fb-5",
    slug: "ma-dang-nhap-facebook-loi-2fa",
    number: 5,
    title: "Mã đăng nhập Facebook",
    subtitle: "Lỗi không nhận mã SMS, mất Google Authenticator",
    isHot: false,
    shortDesc: "Xử lý triệt để lỗi Facebook không gửi mã xác nhận SMS về điện thoại, mất app Authenticator khi đổi điện thoại hoặc reset máy.",
    iconName: "Smartphone",
    tags: ["Lỗi 2FA", "Không nhận SMS", "Mất Authenticator"],
  },
  {
    id: "fb-6",
    slug: "lay-lai-facebook-mat-mat-khau",
    number: 6,
    title: "Lấy lại Facebook mất mật khẩu",
    subtitle: "Mất cả SĐT & Email đăng ký",
    isHot: false,
    shortDesc: "Khôi phục tài khoản lâu năm bị quên mật khẩu mà không còn quyền truy cập vào số điện thoại và hòm thư email đăng ký ban đầu.",
    iconName: "HelpCircle",
    tags: ["Mất mật khẩu", "Mất SĐT & Email", "Khôi phục chính chủ"],
  },
  {
    id: "fb-7",
    slug: "bao-mat-facebook-chong-rip-dame",
    number: 7,
    title: "Bảo mật Facebook",
    subtitle: "Chống rip, chống dame nick, chống giả mạo",
    isHot: false,
    shortDesc: "Cài đặt gói bảo vệ đa tầng chống bị đối thủ báo cáo mạo danh (rip nick), chống dame bản quyền ác ý, tạo khiên an toàn cho nick bán hàng.",
    iconName: "ShieldCheck",
    tags: ["Chống Rip nick", "Chống dame", "Bảo mật tài khoản"],
  },
  {
    id: "fb-8",
    slug: "dich-vu-len-tich-xanh-facebook",
    number: 8,
    title: "Dịch vụ lên tích xanh Facebook",
    subtitle: "Profile cá nhân & Fanpage chính chủ",
    isHot: true,
    shortDesc: "Tư vấn và thực hiện hồ sơ chuẩn Meta Verified hoặc tích xanh bảo hộ thương hiệu/người nổi tiếng cho doanh nhân, người có sức ảnh hưởng.",
    iconName: "BadgeCheck",
    tags: ["Tích xanh", "Meta Verified", "Xác thực thương hiệu"],
  },
  {
    id: "fb-9",
    slug: "bao-ve-ban-quyen-facebook-rights-manager",
    number: 9,
    title: "Dịch vụ bảo vệ bản quyền",
    subtitle: "Đăng ký Rights Manager, quét gỡ reup",
    isHot: true,
    shortDesc: "Đăng ký Trình quản lý bản quyền (Rights Manager) bảo vệ video, hình ảnh, bài hát. Tự động truy quét và đánh gỡ các video reup vi phạm.",
    iconName: "Copyright",
    tags: ["Rights Manager", "Bảo vệ bản quyền", "Gỡ vi phạm reup"],
  },
  {
    id: "fb-10",
    slug: "xu-ly-khung-hoang-facebook",
    number: 10,
    title: "Xử lý khủng hoảng Facebook",
    subtitle: "Xử lý bài bóc phốt xấu, chặn bão 1 sao Fanpage",
    isHot: true,
    shortDesc: "Can thiệp xử lý các bài viết bôi nhọ, bóc phốt sai sự thật, công kích hạ bệ uy tín thương hiệu; khắc phục tình trạng bão đánh giá 1 sao Fanpage.",
    iconName: "AlertTriangle",
    tags: ["Khủng hoảng truyền thông", "Gỡ bài bóc phốt", "Cứu đánh giá Fanpage"],
  },
];

