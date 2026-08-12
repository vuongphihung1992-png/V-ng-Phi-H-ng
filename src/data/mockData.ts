import { Announcement, NewsItem, Procedure, FAQItem, HotlineNumber, HamletOfficer } from '../types';

export const HAMLETS = [
  { id: '1', name: 'Thôn 1' },
  { id: '2', name: 'Thôn 2' },
  { id: '3', name: 'Thôn 3' },
  { id: '4', name: 'Thôn 4' },
  { id: '5', name: 'Thôn 5' },
  { id: '6', name: 'Thôn 6' },
  { id: '7', name: 'Thôn 7' },
  { id: '8', name: 'Thôn 8' },
  { id: '9', name: 'Thôn Ea Nur' },
  { id: '10', name: 'Thôn Ea Tút' },
  { id: '11', name: 'Thôn Cư Blang' },
  { id: '12', name: 'Thôn Tâng Mai' },
];

export const MOCK_HAMLET_OFFICERS: HamletOfficer[] = [
  {
    id: 'off-1',
    hamletId: '1',
    hamletName: 'Thôn 1',
    fullName: 'Nguyễn Văn An',
    rank: 'Đại úy CAND',
    position: 'Cảnh sát khu vực phụ trách Thôn 1',
    phone: '0988.123.451',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    notes: 'Trực ban khu vực Thôn 1, hỗ trợ công tác Cư trú & VNeID'
  },
  {
    id: 'off-2',
    hamletId: '2',
    hamletName: 'Thôn 2',
    fullName: 'Trần Quốc Bảo',
    rank: 'Thiếu tá CAND',
    position: 'Cán bộ phụ trách địa bàn Thôn 2',
    phone: '0912.345.672',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    notes: 'Phụ trách ANTT & Quản lý địa bàn Thôn 2'
  },
  {
    id: 'off-3',
    hamletId: '3',
    hamletName: 'Thôn 3',
    fullName: 'Lê Minh Cường',
    rank: 'Thượng úy CAND',
    position: 'Cảnh sát khu vực phụ trách Thôn 3',
    phone: '0973.888.333',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    notes: 'Khu vực Chợ Pơng Drang & Trụ sở Công an xã'
  },
  {
    id: 'off-4',
    hamletId: '4',
    hamletName: 'Thôn 4',
    fullName: 'Phạm Đức Dũng',
    rank: 'Đại úy CAND',
    position: 'Cán bộ phụ trách Thôn 4',
    phone: '0935.444.554',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    notes: 'Tổ trưởng tổ công tác tuần tra Thôn 4'
  },
  {
    id: 'off-5',
    hamletId: '5',
    hamletName: 'Thôn 5',
    fullName: 'Hoàng Thị Yến',
    rank: 'Thượng úy CAND',
    position: 'Cảnh sát khu vực Thôn 5',
    phone: '0918.777.555',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    notes: 'Hỗ trợ thủ tục đăng ký cư trú & tạm trú'
  },
  {
    id: 'off-6',
    hamletId: '6',
    hamletName: 'Thôn 6',
    fullName: 'Vũ Hải Đăng',
    rank: 'Trung úy CAND',
    position: 'Cán bộ phụ trách địa bàn Thôn 6',
    phone: '0905.666.886',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    notes: 'Phụ trách tuần tra đảm bảo trật tự Thôn 6'
  },
  {
    id: 'off-7',
    hamletId: '7',
    hamletName: 'Thôn 7',
    fullName: 'Bùi Văn Gia',
    rank: 'Thiếu tá CAND',
    position: 'Cảnh sát khu vực Thôn 7',
    phone: '0983.112.233',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    notes: 'Tổ trưởng tổ phong trào Toàn dân bảo vệ ANTQ'
  },
  {
    id: 'off-8',
    hamletId: '8',
    hamletName: 'Thôn 8',
    fullName: 'Đặng Tiến Huy',
    rank: 'Đại úy CAND',
    position: 'Cán bộ phụ trách địa bàn Thôn 8',
    phone: '0944.555.777',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    notes: 'Cán bộ trực tiếp giải quyết phản ánh ANTT Thôn 8'
  },
  {
    id: 'off-9',
    hamletId: '9',
    hamletName: 'Thôn Ea Nur',
    fullName: 'Đỗ Mạnh Hùng',
    rank: 'Thượng úy CAND',
    position: 'Cảnh sát khu vực Thôn Ea Nur',
    phone: '0979.123.999',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    notes: 'Phụ trách khu vực rẫy và đường liên thôn Ea Nur'
  },
  {
    id: 'off-10',
    hamletId: '10',
    hamletName: 'Thôn Ea Tút',
    fullName: 'Nghiêm Xuân Khải',
    rank: 'Đại úy CAND',
    position: 'Cán bộ phụ trách địa bàn Thôn Ea Tút',
    phone: '0913.888.010',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    notes: 'Cảnh sát phụ trách mô hình Camera an ninh Thôn Ea Tút'
  },
  {
    id: 'off-11',
    hamletId: '11',
    hamletName: 'Thôn Cư Blang',
    fullName: 'Ngô Tấn Long',
    rank: 'Trung úy CAND',
    position: 'Cảnh sát khu vực Thôn Cư Blang',
    phone: '0989.111.011',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    notes: 'Tổ công tác lưu động hỗ trợ VNeID Thôn Cư Blang'
  },
  {
    id: 'off-12',
    hamletId: '12',
    hamletName: 'Thôn Tâng Mai',
    fullName: 'Phan Văn Minh',
    rank: 'Thiếu tá CAND',
    position: 'Cán bộ phụ trách địa bàn Thôn Tâng Mai',
    phone: '0938.999.012',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    notes: 'Phụ trách công tác ANTT khu vực giáp ranh Thôn Tâng Mai'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Lịch tiếp công dân hàng tuần của Ban Chỉ huy Công an xã Pơng Drang',
    category: 'Tiếp công dân',
    date: '10/08/2026',
    isNew: true,
    important: true,
    summary: 'Công an xã Pơng Drang thông báo lịch tiếp công dân định kỳ giải quyết thủ tục cư trú, căn cước và phản ánh ANTT.',
    content: `Công an xã Pơng Drang trân trọng thông báo đến toàn thể nhân dân trên địa bàn xã về lịch tiếp công dân định kỳ:

1. Thời gian tiếp công dân:
- Buổi sáng: Từ 07h30 đến 11h30 (Thứ 2 đến Thứ 6 hàng tuần).
- Buổi chiều: Từ 13h30 đến 17h00 (Thứ 2 đến Thứ 6 hàng tuần).
- Thứ 7: Tiếp nhận và trả kết quả thủ tục hành chính buổi sáng từ 08h00 đến 11h00.

2. Địa điểm:
- Bộ phận Tiếp công dân - Trụ sở Công an xã Pơng Drang, Tỉnh Đắk Lắk.

3. Nội dung giải quyết:
- Đăng ký thường trú, tạm trú, thông báo lưu trú.
- Cấp tài khoản định danh điện tử VNeID mức 2.
- Tiếp nhận phản ánh, kiến nghị về an ninh trật tự và tình hình tội phạm trên địa bàn.

Rất mong nhân dân nắm bắt để thuận tiện liên hệ công tác.`
  },
  {
    id: 'ann-2',
    title: 'Cảnh báo phương thức lừa đảo chiếm đoạt tài sản qua mạng viễn thông & mạng xã hội',
    category: 'Cảnh báo',
    date: '08/08/2026',
    isNew: true,
    important: true,
    summary: 'Thủ đoạn giả danh cán bộ Công an, Viện kiểm sát yêu cầu chuyển tiền hoặc cài đặt ứng dụng lạ chứa mã độc.',
    content: `Thời gian gần đây, trên địa bàn xuất hiện một số đối tượng giả danh cán bộ Công an, Tòa án, Viện kiểm sát gọi điện thoại cho người dân với các chiêu thức:

1. Thông báo người dân liên quan đến vụ án ma túy, rửa tiền, yêu cầu chuyển tiền vào tài khoản "tạm giữ" để kiểm tra.
2. Yêu cầu tải ứng dụng Dịch vụ công giả mạo (file .APK) để cập nhật thông tin Căn cước/VNeID, từ đó chiếm quyền điều khiển điện thoại và rút sạch tiền trong tài khoản ngân hàng.

CÔNG AN XÃ PƠNG DRANG KHUYẾN CÁO:
- Cơ quan Công an KHÔNG làm việc qua điện thoại, KHÔNG yêu cầu người dân chuyển tiền vào tài khoản cá nhân hay bất kỳ tài khoản nào.
- Tuyệt đối không nhấp vào đường link lạ, không cài đặt phần mềm không rõ nguồn gốc.
- Khi gặp trường hợp nghi vấn, bà con hãy báo ngay cho Công an xã Pơng Drang qua đường dây nóng.`
  },
  {
    id: 'ann-3',
    title: 'Kế hoạch ra quân đảm bảo an toàn giao thông và an ninh trật tự mùa thu hoạch nông sản',
    category: 'An ninh',
    date: '05/08/2026',
    isNew: false,
    summary: 'Tăng cường tuần tra đêm, kiểm soát các tuyến đường liên thôn, phòng ngừa trộm cắp nông sản và vi phạm giao thông.',
    content: `Thực hiện chỉ đạo của Công an tỉnh Đắk Lắk, Công an xã Pơng Drang triển khai kế hoạch cao điểm bảo vệ an ninh trật tự và an toàn giao thông trên địa bàn xã:

- Tăng cường tuần tra lưu động 24/24h tại các tuyến đường huyết mạch, khu vực nương rẫy, kho bãi tập kết nông sản.
- Kiểm tra, xử lý nghiêm các trường hợp điều khiển xe máy nẹt bô, không đội mũ bảo hiểm, vi phạm nồng độ cồn.
- Đề nghị bà con nông dân nâng cao cảnh giác, tự bảo vệ tài sản, gia cố kho tàng và lắp đặt camera an ninh gia đình.`
  },
  {
    id: 'ann-4',
    title: 'Hướng dẫn kích hoạt tài khoản Định danh điện tử VNeID Mức 2 tại nhà',
    category: 'Hành chính',
    date: '01/08/2026',
    isNew: false,
    summary: 'Bà con đã làm thủ tục tại Công an xã có thể tự kích hoạt tài khoản VNeID qua ứng dụng trên điện thoại di động.',
    content: `Để giúp bà con dễ dàng sử dụng các dịch vụ công trực tuyến, Công an xã Pơng Drang hướng dẫn các bước kích hoạt tài khoản VNeID mức 2:

Bước 1: Tải ứng dụng VNeID chính thức từ Google Play Store hoặc Apple App Store.
Bước 2: Chọn "Kích hoạt tài khoản định danh điện tử".
Bước 3: Nhập số Căn cước công dân và số điện thoại đã đăng ký.
Bước 4: Nhập mã OTP gửi về tin nhắn SMS và thiết lập passcode cùng câu hỏi bảo mật.

Nếu gặp khó khăn, bà con hãy mang điện thoại di động và CCCD đến Trụ sở Công an xã để cán bộ hỗ trợ trực tiếp.`
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Công an xã Pơng Drang tuyên truyền pháp luật và phòng chống tội phạm cho đoàn viên thanh niên',
    category: 'Tuyên truyền',
    date: '09/08/2026',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    summary: 'Buổi sinh hoạt chuyên đề thu hút hơn 150 đoàn viên, người dân tham gia tìm hiểu về Luật An ninh mạng và ATGT.',
    content: `Vừa qua, Công an xã Pơng Drang phối hợp với Đoàn Thanh niên xã tổ chức buổi tuyên truyền pháp luật, phòng chống tệ nạn xã hội và an toàn giao thông cho nhân dân trên địa bàn.

Tại buổi tuyên truyền, báo cáo viên Công an xã đã thông tin về tình hình an ninh trật tự thời gian qua, các phương thức thủ đoạn hoạt động của tội phạm trộm cắp, tội phạm công nghệ cao. Đồng thời, phổ biến các quy định của Luật Giao thông đường bộ, kỹ năng ứng xử khi tham gia giao thông.

Hoạt động góp phần nâng cao ý thức chấp hành pháp luật và tinh thần cảnh giác của nhân dân, xây dựng phong trào Toàn dân bảo vệ an ninh Tổ quốc ngày càng vững mạnh.

(Lưu ý: Đây là bài viết minh họa trong phiên bản demo)`
  },
  {
    id: 'news-2',
    title: 'Bắt giữ đối tượng có hành vi trộm cắp tài sản trên địa bàn thôn 3, xã Pơng Drang',
    category: 'Hoạt động',
    date: '06/08/2026',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    summary: 'Nhờ tin báo nhanh chóng của người dân qua cổng phản ánh an ninh, lực lượng Công an xã đã kịp thời ngăn chặn vụ trộm.',
    content: `Nhận được tin báo của quần chúng nhân dân qua hệ thống tiếp nhận phản ánh, Tổ tuần tra Công an xã Pơng Drang đã khẩn trương triển khai lực lượng, bắt quả tang đối tượng N.V.A (SN 1995) khi đang thực hiện hành vi trộm cắp tài sản tại một hộ dân thuộc thôn 3.

Tại cơ quan Công an, đối tượng đã khai nhận toàn bộ hành vi vi phạm. Hiện Công an xã đang củng cố hồ sơ xử lý theo quy định.

Công an xã Pơng Drang biểu dương tinh thần cảnh giác và sự phối hợp tích cực của nhân dân trong công tác đấu tranh phòng chống tội phạm.

(Lưu ý: Dữ liệu mẫu minh họa)`
  },
  {
    id: 'news-3',
    title: 'Hướng dẫn người dân đăng ký tạm trú trực tuyến qua Cổng dịch vụ công Quốc gia',
    category: 'Thủ tục HC',
    date: '03/08/2026',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    summary: 'Giải pháp nộp hồ sơ đăng ký tạm trú nhanh chóng, tiết kiệm thời gian đi lại mà không cần xếp hàng.',
    content: `Nhằm đẩy mạnh chuyển đổi số trong thủ tục hành chính, Công an xã Pơng Drang hướng dẫn người dân quy trình nộp hồ sơ đăng ký tạm trú trực tuyến:

1. Truy cập Cổng dịch vụ công Bộ Công an hoặc Cổng Dịch vụ công Quốc gia.
2. Đăng nhập bằng tài khoản VNeID Mức 2.
3. Chọn dịch vụ "Đăng ký tạm trú", điền đầy đủ thông tin vào tờ khai điện tử.
4. Đính kèm bản quét/ảnh chụp các giấy tờ pháp lý (Hợp đồng thuê nhà, giấy tờ tùy thân).
5. Theo dõi tiến độ và nhận kết quả giải quyết trực tiếp hoặc qua bưu điện.

(Lưu ý: Dữ liệu mẫu minh họa)`
  },
  {
    id: 'news-4',
    title: 'Diễn tập phương án PCCC và cứu nạn cứu hộ tại Chợ Pơng Drang',
    category: 'Cảnh báo tội phạm',
    date: '28/07/2026',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    summary: 'Nâng cao kỹ năng thoát hiểm và sử dụng bình chữa cháy tại chỗ cho tiểu thương và nhân dân.',
    content: `Công an xã Pơng Drang đã phối hợp với Ban quản lý Chợ Pơng Drang tổ chức buổi thực tập phương án chữa cháy và cứu nạn cứu hộ với sự tham gia của hơn 80 tiểu thương.

Các lực lượng đã thực hành thao tác sử dụng bình chữa cháy vòi rồng, xử lý sự cố rò rỉ khí gas và kỹ năng sơ cứu người bị nạn. Buổi diễn tập giúp tiểu thương chủ động ứng phó khi có sự cố cháy nổ xảy ra, bảo vệ an toàn tính mạng và tài sản.

(Lưu ý: Dữ liệu mẫu minh họa)`
  },
  {
    id: 'news-5',
    title: 'Phát động phong trào "Mô hình Camera an ninh thôn xóm" tại xã Pơng Drang',
    category: 'Hoạt động',
    date: '22/07/2026',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    summary: 'Xã hội hóa việc lắp đặt hệ thống camera giám sát tại các ngã ba, ngã tư và khu vực trọng điểm về ANTT.',
    content: `Công an xã Pơng Drang phát động mô hình "Camera an ninh" huy động nguồn lực xã hội hóa từ các cơ sở kinh doanh và người dân. Hệ thống camera sẽ kết nối thông tin về trung tâm điều hành Công an xã giúp phát hiện kịp thời các hành vi vi phạm pháp luật.

(Lưu ý: Dữ liệu mẫu minh họa)`
  },
  {
    id: 'news-6',
    title: 'Tổ công tác lưu động hỗ trợ người lớn tuổi và gia đình chính sách làm CCCD/VNeID',
    category: 'Tuyên truyền',
    date: '15/07/2026',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    summary: 'Đến tận nhà người già yếu, bệnh tật để thu nhận hồ sơ cấp Căn cước và tài khoản định danh.',
    content: `Thể hiện tinh thần "Chủ động - Gần dân - Vì Nhân dân phục vụ", Công an xã Pơng Drang thành lập tổ công tác lưu động mang trang thiết bị thu nhận vân tay, ảnh chụp đến tận từng hộ gia đình có người lớn tuổi, thương bệnh binh để thực hiện thủ tục.

(Lưu ý: Dữ liệu mẫu minh họa)`
  }
];

export const MOCK_PROCEDURES: Procedure[] = [
  {
    id: 'proc-1',
    code: 'TT-01-KT',
    title: 'Đăng ký thường trú',
    category: 'Cư trú',
    processingTime: '07 ngày làm việc',
    fee: '20.000 VNĐ (Trực tuyến: 10.000 VNĐ)',
    requirements: [
      'Tờ khai thay đổi thông tin cư trú (Mẫu CT01)',
      'Giấy tờ, tài liệu chứng minh chỗ ở hợp pháp (Sổ đỏ, hợp đồng mua bán/thuê nhà)',
      'Căn cước công dân của các thành viên đăng ký'
    ],
    steps: [
      'Nộp hồ sơ trực tuyến qua Cổng dịch vụ công Bộ Công an hoặc trực tiếp tại Công an xã.',
      'Cán bộ tiếp nhận kiểm tra tính hợp lệ của hồ sơ.',
      'Nhận giấy hẹn và nộp lệ phí theo quy định.',
      'Nhận thông báo kết quả giải quyết qua tin nhắn SMS/VNeID hoặc trực tiếp.'
    ],
    formName: 'Mẫu CT01 - Tờ khai cư trú.pdf'
  },
  {
    id: 'proc-2',
    code: 'TT-02-TT',
    title: 'Đăng ký tạm trú',
    category: 'Cư trú',
    processingTime: '03 ngày làm việc',
    fee: '15.000 VNĐ',
    requirements: [
      'Tờ khai thay đổi thông tin cư trú (Mẫu CT01)',
      'Giấy tờ chứng minh chỗ ở hợp pháp hoặc sự đồng ý của chủ hộ/chủ nhà cho thuê',
      'Căn cước công dân/Chứng minh nhân dân'
    ],
    steps: [
      'Chuẩn bị hồ sơ đầy đủ theo quy định.',
      'Nộp hồ sơ trực tuyến hoặc gửi trực tiếp cho Công an xã Pơng Drang.',
      'Công an xã thẩm định và cập nhật vào Cơ sở dữ liệu quốc gia về dân cư.'
    ],
    formName: 'Mẫu CT01 - Tờ khai cư trú.pdf'
  },
  {
    id: 'proc-3',
    code: 'TT-03-VN',
    title: 'Kích hoạt & Cấp tài khoản Định danh điện tử (VNeID Mức 2)',
    category: 'CCCD/Định danh',
    processingTime: 'Giải quyết ngay trong ngày',
    fee: 'Miễn phí',
    requirements: [
      'Căn cước công dân gắn chíp còn hiệu lực',
      'Số điện thoại chính chủ',
      'Thư điện tử (Email - nếu có)'
    ],
    steps: [
      'Công dân mang CCCD đến trụ sở Công an xã Pơng Drang.',
      'Cán bộ thực hiện thu nhận vân tay, chụp ảnh khuôn mặt.',
      'Hệ thống gửi tin nhắn kích hoạt SMS từ "VNeID".',
      'Công dân đăng nhập app VNeID trên điện thoại để hoàn tất.'
    ]
  },
  {
    id: 'proc-4',
    code: 'TT-04-PC',
    title: 'Kiểm tra an toàn PCCC đối với hộ gia đình, nhà ở kết hợp kinh doanh',
    category: 'PCCC',
    processingTime: '05 ngày làm việc',
    fee: 'Miễn phí',
    requirements: [
      'Bản cam kết bảo đảm an toàn PCCC',
      'Sơ đồ lối thoát nạn và danh mục trang thiết bị chữa cháy tại chỗ'
    ],
    steps: [
      'Đăng ký kiểm tra tại Công an xã.',
      'Tổ công tác PCCC xã đến thực tế hướng dẫn và lập biên bản kiểm tra.'
    ]
  },
  {
    id: 'proc-5',
    code: 'TT-05-XC',
    title: 'Xác nhận thông tin về cư trú (Mẫu CT07)',
    category: 'Cư trú',
    processingTime: '01 ngày làm việc',
    fee: 'Miễn phí',
    requirements: [
      'Tờ khai thay đổi thông tin cư trú (Mẫu CT01)',
      'Thẻ CCCD/VNeID của người yêu cầu'
    ],
    steps: [
      'Nộp yêu cầu trên Cổng Dịch vụ công hoặc trực tiếp.',
      'Nhận văn bản xác nhận CT07 điện tử hoặc bản giấy.'
    ]
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Lịch làm việc',
    question: 'Khi nào người dân có thể liên hệ làm việc với Công an xã Pơng Drang?',
    answer: 'Công an xã Pơng Drang tiếp công dân làm thủ tục hành chính vào giờ hành chính các ngày từ Thứ 2 đến Thứ 6 và buổi sáng Thứ 7. Riêng lực lượng Trực ban An ninh hoạt động 24/24h tất cả các ngày trong tuần (kể cả ngày Lễ, Tết).'
  },
  {
    id: 'faq-2',
    category: 'An ninh',
    question: 'Làm thế nào để phản ánh tình hình an ninh trật tự hoặc trộm cắp?',
    answer: 'Người dân có thể phản ánh nhanh qua nút "Phản ánh ANTT" trên ứng dụng này, hoặc gọi trực tiếp Đường dây nóng Công an xã. Thông tin người phản ánh sẽ được bảo mật tuyệt đối theo quy định.'
  },
  {
    id: 'faq-3',
    category: 'An ninh',
    question: 'Làm gì khi phát hiện vụ việc nghi vấn hoặc tội phạm?',
    answer: 'Bà con hãy bình tĩnh, giữ khoảng cách an toàn, ghi nhớ đặc điểm nhận dạng của đối tượng, biển số xe và hướng di chuyển. Sau đó lập tức gọi điện cho Trực ban Công an xã hoặc gửi tin nhắn phản ánh kèm hình ảnh/video trên ứng dụng.'
  },
  {
    id: 'faq-4',
    category: 'Thủ tục',
    question: 'Tôi có thể đăng ký lịch làm việc trước khi đến trụ sở không?',
    answer: 'Có. Bà con sử dụng tính năng "Đặt lịch làm việc" trên cổng thông tin này để chọn ngày và khung giờ mong muốn, giúp giảm thời gian chờ đợi tại trụ sở.'
  },
  {
    id: 'faq-5',
    category: 'Thủ tục',
    question: 'Làm thủ tục cấp tài khoản VNeID Mức 2 cần mang theo giấy tờ gì?',
    answer: 'Bà con chỉ cần mang theo thẻ Căn cước công dân gắn chíp còn hiệu lực và mang theo điện thoại di động sử dụng số chính chủ để nhận mã kích hoạt OTP.'
  }
];

export const MOCK_HOTLINES: HotlineNumber[] = [
  {
    id: 'hl-1',
    title: 'Trực ban Công an xã Pơng Drang',
    number: '02623539777',
    description: 'Tiếp nhận tin báo an ninh trật tự, sự cố khẩn cấp 24/7',
    isEmergency: true
  },
  {
    id: 'hl-2',
    title: 'Trực ban hình sự',
    number: '02623608839',
    description: 'Đường dây nóng tiếp nhận tố giác tội phạm & tin báo hình sự khẩn cấp',
    isEmergency: true
  },
  {
    id: 'hl-3',
    title: 'Cảnh sát PCCC & CNCH (Toàn quốc)',
    number: '114',
    description: 'Cứu hỏa, cứu hộ khẩn cấp tai nạn sự cố 24/7',
    isEmergency: true
  },
  {
    id: 'hl-4',
    title: 'Công an Tỉnh Đắk Lắk',
    number: '0262 3876 222',
    description: 'Cơ quan công an cấp trên chỉ đạo trực tiếp',
    isEmergency: false
  }
];
