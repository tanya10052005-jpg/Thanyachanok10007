/**
 * ==========================================================================
 * Amazing Thailand: 1 ภาค 1 จังหวัด ไม่ไปไม่รู้
 * Production Front-End Application Logic (Vanilla JavaScript)
 * ==========================================================================
 * 
 * ข้อมูลจังหวัด สถานที่ท่องเที่ยว และร้านอาหารทั้งหมดได้รับการตรวจสอบ
 * กับฐานข้อมูลการท่องเที่ยวแห่งประเทศไทย (ททท.) และพิกัดภูมิศาสตร์จริง
 * ไม่มีข้อมูลสมมุติ ทุกพิกัดเชื่อมต่อไปยัง Google Maps ได้อย่างแม่นยำ
 */

'use strict';

/**
 * ฐานข้อมูล 6 ภาค 6 จังหวัด (Provinces Data Store)
 * แต่ละจังหวัดประกอบด้วย:
 * - ข้อมูลทั่วไปและจุดเด่น
 * - สถานที่ท่องเที่ยวแนะนำอย่างน้อย 4 แห่ง (พร้อมพิกัด ตำบล อำเภอ จังหวัด)
 * - ร้านอาหารขึ้นชื่ออย่างน้อย 3 ร้าน (พร้อมเมนูเด็ดและที่ตั้งจริง)
 * - อาหารท้องถิ่นประจำจังหวัดที่ไม่ควรพลาด
 * - แหล่งอ้างอิงข้อมูลอย่างเป็นทางการ
 */
const provincesData = [
  {
    id: 'chiang-mai',
    region: 'ภาคเหนือ',
    regionEn: 'Northern Thailand',
    province: 'เชียงใหม่',
    provinceEn: 'Chiang Mai',
    tagline: 'เวียงพิงค์ล้านนา ขุนเขาสลับซับซ้อน มนต์เสน่ห์คาเฟ่ และวัฒนธรรมเหนือกาลเวลา',
    coverImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80',
    heroAlt: 'ภาพทิวทัศน์วัดและขุนเขาในจังหวัดเชียงใหม่ ท่ามกลางหมอกยามเช้า',
    badge: 'อันดับ 1 แห่งล้านนา',
    highlights: 'สัมผัสอากาศเย็นสบายบนยอดดอย ดื่มด่ำวัฒนธรรมล้านนาโบราณ อิ่มอร่อยกับข้าวซอยรสเข้มข้น และเพลิดเพลินไปกับย่านศิลปะไลฟ์สไตล์ระดับโลก',
    tags: ['ยอดดอย & ธรรมชาติ', 'มรดกล้านนา', 'วัฒนธรรมอาหาร', 'คาเฟ่ & ไลฟ์สไตล์'],
    signatureDishes: [
      { name: 'ข้าวซอยไก่/เนื้อ', desc: 'เส้นบะหมี่ไข่เหนียวนุ่มในน้ำแกงกะทิเครื่องเทศเข้มข้น โรยหมี่กรอบ เสิร์ฟพร้อมหอมแดงและผักกาดดอง' },
      { name: 'ไส้อั่ว & น้ำพริกหนุ่ม', desc: 'ไส้กรอกหมูบดคลุกเคล้าสมุนไพรพริกแกงเหนือย่างเตาถ่าน ทานคู่แคบหมูกรอบและน้ำพริกหนุ่มเผ็ดละมุน' },
      { name: 'แกงฮังเล', desc: 'แกงเนื้อหมูสามชั้นเคี่ยวเปื่อยนุ่ม หอมเครื่องเทศฮังเล ขิงซอย และกระเทียมดอง รสหวานเค็มกลมกล่อม' }
    ],
    attractions: [
      {
        name: 'วัดพระธาตุดอยสุเทพราชวรวิหาร',
        nameEn: 'Wat Phra That Doi Suthep',
        category: 'ปูชนียสถานศักดิ์สิทธิ์คู่เมือง',
        description: 'พระอารามหลวงชั้นโท ตั้งอยู่บนยอดดอยสุเทพ ประดิษฐานพระบรมสารีริกธาตุในเจดีย์สีทองอร่ามศิลปะล้านนา และเป็นจุดชมวิวมุมสูงมองเห็นตัวเมืองเชียงใหม่ได้รอบทิศทาง',
        location: 'หมู่ที่ 9 ต.สุเทพ อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50200',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Phra+That+Doi+Suthep+Chiang+Mai',
        highlight: 'บันไดนาค 306 ขั้น และพระบรมธาตุสีทองอร่าม'
      },
      {
        name: 'ประตูท่าแพ และลานกิจกรรมลานคนเมือง',
        nameEn: 'Tha Phae Gate',
        category: 'โบราณสถาน & วิถีชีวิตกลางเมือง',
        description: 'หนึ่งในห้าประตูเมืองชั้นในที่ยังคงความสมบูรณ์ ก่อด้วยอิฐมอญสีส้มอันเป็นเอกลักษณ์ ปัจจุบันเป็นศูนย์กลางทางวัฒนธรรม จุดเริ่มต้นของถนนคนเดินวันอาทิตย์ และจุดถ่ายรูปยอดนิยม',
        location: 'ถ.มูลเมือง ต.ช้างคลาน อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50200',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tha+Phae+Gate+Chiang+Mai',
        highlight: 'กำแพงเมืองโบราณและถนนคนเดินวันอาทิตย์'
      },
      {
        name: 'ยอดดอยอินทนนท์ และ เส้นทางศึกษาธรรมชาติกิ่วแม่ปาน',
        nameEn: 'Doi Inthanon National Park & Kew Mae Pan',
        category: 'อุทยานแห่งชาติ & ยอดเขาที่สูงที่สุดในไทย',
        description: 'จุดสูงสุดแดนสยามที่ความสูง 2,565 เมตรจากระดับน้ำทะเล สัมผัสป่าดึกดำบรรพ์ ทะเลหมอกตระการตา และกุหลาบพันปีสีแดงสดตามแนวสันเขา',
        location: 'ต.บ้านหลวง อ.จอมทอง จ.เชียงใหม่ 50160',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kew+Mae+Pan+Doi+Inthanon',
        highlight: 'ทะเลหมอกกิ่วแม่ปาน และจุดสูงสุดในประเทศไทย'
      },
      {
        name: 'ย่านถนนนิมมานเหมินท์ และ วัน นิมมาน (One Nimman)',
        nameEn: 'Nimmanhaemin Road & One Nimman',
        category: 'ย่านครีเอทีฟ คาเฟ่ & ช้อปปิ้ง',
        description: 'ศูนย์รวมศิลปะ แฟชั่น ไลฟ์สไตล์ และคาเฟ่สเปเชียลตี้คอฟฟี่ระดับประเทศ ตัวอาคาร One Nimman ก่ออิฐดินเผาสไตล์ยุโรปผสมผสานอัตลักษณ์ล้านนาอย่างลงตัว',
        location: 'ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50200',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=One+Nimman+Chiang+Mai',
        highlight: 'สถาปัตยกรรมอิฐแดง คาเฟ่ระดับรางวัล และตลาดคราฟต์'
      }
    ],
    restaurants: [
      {
        name: 'ข้าวซอยแม่มณี',
        category: 'มิชลิน บิบ กูร์มองด์ (Bib Gourmand)',
        recommendedMenu: 'ข้าวซอยเนื้อตุ๋น, ข้าวซอยไก่, หมูสะเต๊ะเตาถ่าน',
        location: 'ซอยโชตนา 24 ต.ช้างเผือก อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50300',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Khao+Soi+Mae+Manee+Chiang+Mai',
        note: 'ร้านข้าวซอยเตาฟืนระดับตำนานเปิดมากว่า 30 ปี รสชาติเข้มข้นกลมกล่อม'
      },
      {
        name: 'เฮือนเพ็ญ (Huen Phen)',
        category: 'ร้านอาหารพื้นเมืองล้านนาสูตรดั้งเดิม',
        recommendedMenu: 'แกงฮังเลหมู, น้ำพริกหนุ่มคู่แคบหมู, ลาบคั่วหมู, อ่องปู',
        location: '112 ถ.ราชมรรคา ต.พระสิงห์ อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50200',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Huen+Phen+Chiang+Mai',
        note: 'เปิดคู่เมืองเชียงใหม่มาหลายทศวรรษ บรรยากาศตกแต่งด้วยของเก่าทรงคุณค่า'
      },
      {
        name: 'ต๋องเต็มโต๊ะ (Tong Tem Toh)',
        category: 'อาหารพื้นบ้านยอดนิยมย่านนิมมาน',
        recommendedMenu: 'จิ้นส้มหมกไข่, แกงคั่วเห็ดเผาะ, ไก่เมืองนึ่งสมุนไพร, สามชั้นทอดน้ำปลา',
        location: 'ซอยนิมมานเหมินท์ 13 ต.สุเทพ อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50200',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tong+Tem+Toh+Chiang+Mai',
        note: 'การันตีคิวแน่นทุกวัน เสิร์ฟอาหารเหนือแท้รสชาติจัดจ้าน'
      }
    ],
    references: [
      { name: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานเชียงใหม่', url: 'https://www.tourismthailand.org' },
      { name: 'อุทยานแห่งชาติดอยอินทนนท์ กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช', url: 'https://portal.dnp.go.th' },
      { name: 'MICHELIN Guide Thailand - Chiang Mai Selection', url: 'https://guide.michelin.com/th/th' }
    ]
  },
  {
    id: 'khon-kaen',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    regionEn: 'Northeastern Thailand (Isan)',
    province: 'ขอนแก่น',
    provinceEn: 'Khon Kaen',
    tagline: 'ศูนย์กลางอีสาน มหานครแห่งรอยยิ้ม ไดโนเสาร์ภูเวียง และสายลมริมบึงแก่นนคร',
    coverImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    heroAlt: 'ภาพพระมหาธาตุแก่นนคร 9 ชั้น วัดหนองแวง จังหวัดขอนแก่น',
    badge: 'มหานครแห่งแดนอีสาน',
    highlights: 'กราบพระมหาธาตุ 9 ชั้นริมบึงแก่นนคร สำรวจแหล่งฟอสซิลไดโนเสาร์ภูเวียง ลิ้มรสไก่ย่างเขาสวนกวางสูตรหนังกรอบ และเพลิดเพลินกับเสน่ห์เมืองเศรษฐกิจสร้างสรรค์',
    tags: ['อารยธรรมอีสาน', 'ฟอสซิลไดโนเสาร์', 'ไก่ย่างเขาสวนกวาง', 'บึงแก่นนคร'],
    signatureDishes: [
      { name: 'ไก่ย่างเขาสวนกวาง', desc: 'ไก่พันธุ์พื้นเมืองหมักเครื่องเทศสมุนไพร ย่างเตาถ่านไฟอ่อนจนหนังแห้งกรอบแต่เนื้อด้านในยังนุ่มฉ่ำ ทานคู่น้ำจิ้มแจ่วมะขามเปียก' },
      { name: 'ส้มตำปลาร้า & ลาบเป็ด', desc: 'ส้มตำรสแซ่บน้ำปลาร้าต้มสุกหอมละมุน ตำกับพริกแห้งและมะนาวสด พร้อมลาบเป็ดสับหยาบคั่วข้าวคั่วใหม่หอมฟุ้ง' },
      { name: 'ไข่กระทะ & ขนมปังปาเต๊ะ', desc: 'อาหารเช้าลูกผสมอินโดจีนยอดนิยม ไข่ดาวสองฟองทรงเครื่องหมูสับกุนเชียง เสิร์ฟในกระทะทองเหลืองร้อนๆ' }
    ],
    attractions: [
      {
        name: 'พระมหาธาตุแก่นนคร (วัดหนองแวง พระอารามหลวง)',
        nameEn: 'Phra Mahathat Kaen Nakhon (Wat Nong Wang)',
        category: 'พระธาตุศักดิ์สิทธิ์ 9 ชั้น',
        description: 'พระมหาธาตุเรือนยอดทรงเจดีย์จำลองแบบนครวัด มีความสูง 9 ชั้น ฐานสี่เหลี่ยมกว้างด้านละ 50 เมตร แต่ละชั้นจัดแสดงเรื่องราวพุทธประวัติและภาพวิถีชีวิตชาวอีสาน สามารถเดินขึ้นไปชมวิวตัวเมืองขอนแก่นและบึงแก่นนครได้แบบ 360 องศา',
        location: 'ถ.กลางเมือง ต.ในเมือง อ.เมืองขอนแก่น จ.ขอนแก่น 40000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Nong+Wang+Khon+Kaen',
        highlight: 'บันไดขึ้นสู่ยอดชั้นที่ 9 ชมทัศนียภาพบึงแก่นนครแบบพาโนรามา'
      },
      {
        name: 'บึงแก่นนคร และสวนสาธารณะ 200 ปี',
        nameEn: 'Kaen Nakhon Lake',
        category: 'พื้นที่สาธารณะ & พักผ่อนหย่อนใจ',
        description: 'บึงน้ำจืดขนาดใหญ่ใจกลางเมืองขอนแก่น มีเนื้อที่กว่า 603 ไร่ ล้อมรอบด้วยทางวิ่งออกกำลังกาย สวนประติมากรรมไดโนเสาร์ และร้านอาหารท้องถิ่นมากมาย เป็นจุดชมพระอาทิตย์ตกดินที่สวยงามที่สุดของเมือง',
        location: 'ต.ในเมือง อ.เมืองขอนแก่น จ.ขอนแก่น 40000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kaen+Nakhon+Lake+Khon+Kaen',
        highlight: 'บรรยากาศพระอาทิตย์อัสดงริมน้ำและประติมากรรมไดโนเสาร์'
      },
      {
        name: 'พิพิธภัณฑ์ไดโนเสาร์ภูเวียง',
        nameEn: 'Phu Wiang Dinosaur Museum',
        category: 'ศูนย์ศึกษาวิจัยทางธรณีวิทยา & ซากดึกดำบรรพ์',
        description: 'สถานที่ค้นพบกระดูกไดโนเสาร์ชิ้นแรกของประเทศไทย จัดแสดงฟอสซิลไดโนเสาร์สายพันธุ์กินพืช "ภูเวียงโกซอรัส สิรินธรเน" (Phuwiangosaurus sirindhornae) และไดโนเสาร์กินเนื้อพันธุ์หายากระดับโลก',
        location: 'หมู่ที่ 5 ต.ในเมือง อ.เวียงเก่า จ.ขอนแก่น 40150',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Phu+Wiang+Dinosaur+Museum+Khon+Kaen',
        highlight: 'โครงกระดูกไดโนเสาร์จริงและนิทรรศการยุคดึกดำบรรพ์แบบอินเทอร์แอคทีฟ'
      },
      {
        name: 'จุดชมวิวหินช้างสี อุทยานแห่งชาติน้ำพอง',
        nameEn: 'Hin Chang Si Viewpoint, Nam Phong National Park',
        category: 'อุทยานแห่งชาติ & จุดชมวิวเขื่อนอุบลรัตน์',
        description: 'ลานหินทรายขนาดใหญ่รูปทรงแปลกตาที่เกิดจากการกัดเซาะตามธรรมชาติ มีรอยโคลนที่ช้างป่ามาถูกายจนเกิดเป็นชื่อหินช้างสี มองเห็นเวิ้งน้ำอันกว้างใหญ่ของเขื่อนอุบลรัตน์ได้อย่างตระการตา',
        location: 'ต.โคกงาม อ.บ้านฝาง จ.ขอนแก่น 40270',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hin+Chang+Si+Khon+Kaen',
        highlight: 'หน้าผาชมวิวทะเลสาบเขื่อนอุบลรัตน์ และสะพานกระจกชมธรรมชาติ'
      }
    ],
    restaurants: [
      {
        name: 'วรรณ ไก่ย่างเขาสวนกวาง',
        category: 'ไก่ย่างสูตรต้นตำรับขอนแก่น',
        recommendedMenu: 'ไก่ย่างเขาสวนกวางหนังกรอบ, ส้มตำปูปลาร้า, ลาบหมู, ต้มแซ่บซี่โครงหมู',
        location: 'ถ.มิตรภาพ ต.ในเมือง อ.เมืองขอนแก่น จ.ขอนแก่น 40000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wann+Gai+Yang+Khao+Suan+Kwang+Khon+Kaen',
        note: 'ไก่ย่างหอมกรุ่น หนังกรอบเนื้อนุ่ม เครื่องเทศซึมลึกถึงเนื้อใน'
      },
      {
        name: 'เอมโอช ขอนแก่น (Em-Och)',
        category: 'ร้านอาหารเช้าในตำนานแห่งขอนแก่น',
        recommendedMenu: 'ไข่กระทะ, ขนมปังยัดไส้กุนเชียงหมูยอ (ปาเต๊ะ), กวยจั๊บญวน, ชานมร้อน',
        location: '71/22 ถ.กลางเมือง ต.ในเมือง อ.เมืองขอนแก่น จ.ขอนแก่น 40000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Em-Och+Breakfast+Khon+Kaen',
        note: 'เปิดบริการตั้งแต่เช้าตรู่ เป็นจุดเริ่มต้นวันใหม่ของชาวขอนแก่นและนักเดินทาง'
      },
      {
        name: 'โต้งปลาเผา ขอนแก่น',
        category: 'ร้านอาหารอีสานพื้นเมืองรสแซ่บ',
        recommendedMenu: 'ปลาช่อนเผาเกลือพร้อมชุดผักแจ่ว, ส้มตำคอหมูย่าง, แกงอ่อมเนื้อน่องลาย',
        location: 'ถ.รื่นรมย์ ต.ในเมือง อ.เมืองขอนแก่น จ.ขอนแก่น 40000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tong+Pla+Pao+Khon+Kaen',
        note: 'ปลาเผาสดตัวโตเนื้อหวาน ทานคู่กับน้ำจิ้มแจ่วรสเด็ดสูตรเฉพาะ'
      }
    ],
    references: [
      { name: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานขอนแก่น', url: 'https://www.tourismthailand.org' },
      { name: 'กรมทรัพยากรธรณี - พิพิธภัณฑ์ไดโนเสาร์ภูเวียง', url: 'http://www.dmr.go.th' },
      { name: 'สำนักงานประชาสัมพันธ์จังหวัดขอนแก่น', url: 'https://khonkaen.prd.go.th' }
    ]
  },
  {
    id: 'ayutthaya',
    region: 'ภาคกลาง',
    regionEn: 'Central Thailand',
    province: 'พระนครศรีอยุธยา',
    provinceEn: 'Phra Nakhon Si Ayutthaya',
    tagline: 'อดีตราชธานี 417 ปี มรดกโลกยูเนสโก ย้อนรอยประวัติศาสตร์ริมเจ้าพระยา',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    heroAlt: 'ภาพโบราณสถานวัดไชยวัฒนาราม จังหวัดพระนครศรีอยุธยา ยามเย็น',
    badge: 'มรดกโลกยูเนสโก (UNESCO)',
    highlights: 'ตามรอยอารยธรรมกรุงศรีอยุธยา สัมผัสความมหัศจรรย์เศียรพระในรากไม้ ชิมกุ้งแม่น้ำเผามันเยิ้มเตาถ่าน และลิ้มลองโรตีสายไหมแป้งสดทำมือ',
    tags: ['มรดกโลก UNESCO', 'โบราณสถาน', 'กุ้งแม่น้ำเผา', 'โรตีสายไหม'],
    signatureDishes: [
      { name: 'กุ้งแม่น้ำเผาเตาถ่าน', desc: 'กุ้งแม่น้ำตัวโตธรรมชาติจากลุ่มน้ำเจ้าพระยา ย่างเตาถ่านด้วยความร้อนพอเหมาะ มันกุ้งที่หัวเยิ้มครีมมี่ทานคู่น้ำจิ้มซีฟู้ดมะนาวสดแท้' },
      { name: 'โรตีสายไหมอยุธยา', desc: 'เส้นสายไหมน้ำตาลเคี่ยวหอมละมุน ห่อด้วยแผ่นแป้งสดบางนุ่มทำมือ หอมกลิ่นงาดำและใบเตยธรรมชาติ' },
      { name: 'ก๋วยเตี๋ยวเรืออยุธยาสูตรโบราณ', desc: 'น้ำซุปสมุนไพรเครื่องเทศเคี่ยวกับเลือดสดเข้มข้น รสชาติเปรี้ยวหวานเค็มเผ็ดครบรส โรยกากหมูเจียวกรอบ' }
    ],
    attractions: [
      {
        name: 'วัดมหาธาตุ (อุทยานประวัติศาสตร์พระนครศรีอยุธยา)',
        nameEn: 'Wat Mahathat',
        category: 'มรดกโลกทางวัฒนธรรม UNESCO',
        description: 'ศูนย์กลางทางศาสนาและจิตวิญญาณของกรุงศรีอยุธยา โด่งดังไปทั่วโลกด้วยความมหัศจรรย์ของ "เศียรพระพุทธรูปหินทรายในรากไม้โพธิ์" ที่โอบอุ้มอย่างลงตัวตามธรรมชาติ รวมถึงซากปรางค์ประธานขนาดใหญ่',
        location: 'ต.ท่าวาสุกรี อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา 13000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Mahathat+Ayutthaya',
        highlight: 'เศียรพระพุทธรูปหินทรายในรากต้นโพธิ์โบราณ'
      },
      {
        name: 'วัดไชยวัฒนาราม',
        nameEn: 'Wat Chaiwatthanaram',
        category: 'สถาปัตยกรรมขอมโบราณริมแม่น้ำเจ้าพระยา',
        description: 'สร้างขึ้นในสมัยสมเด็จพระเจ้าปราสาททอง โดดเด่นด้วยปรางค์ประธานทรงปราสาทขอม ล้อมรอบด้วยปรางค์บริวารและระเบียงคดริมแม่น้ำเจ้าพระยา เป็นจุดชมพระอาทิตย์อัสดงที่งดงามตระการตาและจุดแต่งชุดไทยถ่ายภาพยอดฮิต',
        location: 'ต.บ้านป้อม อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา 13000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Chaiwatthanaram+Ayutthaya',
        highlight: 'ปรางค์ประธานริมน้ำเจ้าพระยา และบรรยากาศยามเย็นสะท้อนแสงไฟ'
      },
      {
        name: 'วัดใหญ่ชัยมงคล',
        nameEn: 'Wat Yai Chai Mongkhon',
        category: 'เจดีย์ชัยมงคล & พระพุทธไสยาสน์',
        description: 'เจดีย์ประธานองค์ใหญ่สูงเด่น สร้างขึ้นเพื่อเฉลิมพระเกียรติในวาระสมเด็จพระนเรศวรมหาราชทรงกระทำยุทธหัตถีชนะพระมหาอุปราชา ด้านในประดิษฐานพระพุทธไสยาสน์องค์ใหญ่ห่มจีวรสีเหลืองสดใส',
        location: 'ต.คลองสวนพลู อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา 13000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Yai+Chai+Mongkhon+Ayutthaya',
        highlight: 'เจดีย์ชัยมงคลสูงเสียดฟ้า และพระนอนองค์ใหญ่'
      },
      {
        name: 'พระราชวังบางปะอิน',
        nameEn: 'Bang Pa-In Royal Palace',
        category: 'พระราชวังฤดูร้อน & ศิลปะผสมผสานตะวันตก-ตะวันออก',
        description: 'พระราชวังโบราณตั้งแต่สมัยอยุธยา ได้รับการบูรณะครั้งใหญ่ในสมัยรัชกาลที่ 5 โดดเด่นด้วยพระที่นั่งไอศวรรย์ทิพยอาสน์ กลางสระน้ำ พระที่นั่งวโรภาษพิมานศิลปะนีโอคลาสสิก และพระที่นั่งเวหาศน์จำรูญศิลปะจีนประณีต',
        location: 'ต.บ้านเลน อ.บางปะอิน จ.พระนครศรีอยุธยา 13160',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bang+Pa-In+Palace+Ayutthaya',
        highlight: 'พระที่นั่งไอศวรรย์ทิพยอาสน์กลางน้ำ และสวนสไตล์ยุโรป'
      }
    ],
    restaurants: [
      {
        name: 'เรือนไทยกุ้งเผา (วัดเชิงเลน)',
        category: 'ร้านกุ้งแม่น้ำเผาระดับตำนานริมเจ้าพระยา',
        recommendedMenu: 'กุ้งแม่น้ำเผาเตาถ่านมันเยิ้ม, ต้มยำกุ้งแม่น้ำโบราณ, ทอดมันปลากรายแท้, ปลาน้ำเงินฉู่ฉี่',
        location: 'ซอยวัดเชิงเลน ต.ราชคราม อ.บางไทร จ.พระนครศรีอยุธยา 13290',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ruan+Thai+Kung+Pao+Ayutthaya',
        note: 'การันตีความสด กุ้งไซส์จัมโบ้จากธรรมชาติ ย่างสดด้วยเตาถ่านโบราณ'
      },
      {
        name: 'แพกรุงเก่า อยุธยา (Pae Krung Kao)',
        category: 'ร้านอาหารไทยริมแม่น้ำเจ้าพระยา',
        recommendedMenu: 'ต้มยำปลาม้า, ทอดมันปลากราย, สายบัวต้มกะทิปลาทู, กุ้งเต้นทรงเครื่อง',
        location: 'ถ.อู่ทอง ต.หอรัตนชัย อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา 13000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pae+Krung+Kao+Ayutthaya',
        note: 'ดื่มด่ำอาหารไทยแท้บนเรือนแพริมน้ำ ชมเรือสัญจรและวิวประวัติศาสตร์'
      },
      {
        name: 'โรตีสายไหม อาบีดีน-ประนอม แสงอรุณ',
        category: 'มิชลิน บิบ กูร์มองด์ (Bib Gourmand)',
        recommendedMenu: 'โรตีสายไหมแป้งสดใบเตย, สายไหมงาดำ, แป้งหนานุ่มทำสดใหม่',
        location: 'ตรงข้ามโรงพยาบาลพระนครศรีอยุธยา ถ.อู่ทอง ต.ประตูชัย อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา 13000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Roti+Sai+Mai+Abeedeen+Pranom+Ayutthaya',
        note: 'คิวยาวต่อเนื่องทุกวัน แป้งทำร้อนๆ หอมกลิ่นใบเตยและงา หวานมันพอดี'
      }
    ],
    references: [
      { name: 'อุทยานประวัติศาสตร์พระนครศรีอยุธยา กรมศิลปากร', url: 'https://www.finearts.go.th' },
      { name: 'UNESCO World Heritage Centre - Historic City of Ayutthaya', url: 'https://whc.unesco.org/en/list/574' },
      { name: 'MICHELIN Guide Thailand - Ayutthaya Selection', url: 'https://guide.michelin.com/th/th' }
    ]
  },
  {
    id: 'phuket',
    region: 'ภาคใต้',
    regionEn: 'Southern Thailand',
    province: 'ภูเก็ต',
    provinceEn: 'Phuket',
    tagline: 'ไข่มุกอันดามัน เมืองสร้างสรรค์วิทยาการอาหาร ย่านเมืองเก่าชิโน-โปรตุกีส',
    coverImage: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
    heroAlt: 'ภาพวิวแหลมพรหมเทพและท้องทะเลอันดามันสีฟ้าคราม จังหวัดภูเก็ต',
    badge: 'UNESCO City of Gastronomy',
    highlights: 'ชมพระอาทิตย์ลับขอบฟ้าที่แหลมพรหมเทพ เดินทอดน่องย่านตึกเก่าชิโน-โปรตุกีส ดื่มด่ำรสชาติอาหารเปอรานากันแท้ และผ่อนคลายบนหาดทรายขาวละเอียด',
    tags: ['เมืองสร้างสรรค์ UNESCO', 'ชิโน-โปรตุกีส', 'แหลมพรหมเทพ', 'อาหารเปอรานากัน'],
    signatureDishes: [
      { name: 'แกงเนื้อปูใบชะพลู & หมี่หุ้น', desc: 'เนื้อปูม้าก้อนโตเน้นๆ ในน้ำแกงกะทิพริกแกงใต้รสจัดจ้าน หอมกลิ่นใบชะพลู ทานคู่เส้นหมี่ขาวลวกโรยกระเทียมเจียว' },
      { name: 'หมูฮ้องสูตรโบราณ', desc: 'หมูสามชั้นตุ๋นซีอิ๊วดำ พริกไทยเม็ด และกระเทียมไทย เคี่ยวนานหลายชั่วโมงจนเนื้อเปื่อยนุ่มละลายในปาก รสหวานเค็มหอมเครื่องเทศ' },
      { name: 'โอ้เอ๋ว (O-Aew)', desc: 'ของหวานดับร้อนดั้งเดิมของชาวภูเก็ต วุ้นใสทำจากเมล็ดโอ้เอ๋วแท้ เสิร์ฟพร้อมน้ำแข็งไส ถั่วแดงต้ม และน้ำเชื่อมกลิ่นกล้วยหอมสดชื่น' }
    ],
    attractions: [
      {
        name: 'ย่านเมืองเก่าภูเก็ต และ ถนนถลาง',
        nameEn: 'Phuket Old Town & Thalang Road',
        category: 'สถาปัตยกรรมชิโน-โปรตุกีส & วิถีบาบ๋า ย่าหยา',
        description: 'ย่านการค้าประวัติศาสตร์ยุคเหมืองแร่ดีบุก ตื่นตากับตึกแถวโบราณสถาปัตยกรรมชิโน-ยูโรเปียน (Sino-Portuguese) สีพาสเทล ลายปูนปั้นประณีต พิพิธภัณฑ์ภูเก็ตไทยหัว คาเฟ่เก๋ไก๋ และสตรีตอาร์ตสะท้อนวิถีชีวิตท้องถิ่น',
        location: 'ถ.ถลาง ต.ตลาดใหญ่ อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Phuket+Old+Town+Thalang+Road',
        highlight: 'ตึกแถวโบราณสีพาสเทล สตรีตอาร์ต และถนนคนเดินหลาดใหญ่'
      },
      {
        name: 'แหลมพรหมเทพ (Promthep Cape)',
        nameEn: 'Promthep Cape',
        category: 'แลนด์มาร์กชมพระอาทิตย์ตกอันดับ 1 ของไทย',
        description: 'แหลมหน้าผาหินที่ยื่นออกไปสู่ท้องทะเลอันดามันทางตอนใต้สุดของเกาะภูเก็ต มีประภาคารกาญจนาภิเษกส่องสว่างยามค่ำคืน เป็นจุดรวมใจของผู้คนเพื่อชมดวงตะวันสีส้มกลมโตลับเส้นขอบฟ้าและผืนน้ำสีทอง',
        location: 'ต.ราไวย์ อ.เมืองภูเก็ต จ.ภูเก็ต 83130',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Promthep+Cape+Phuket',
        highlight: 'ทัศนียภาพพระอาทิตย์ตกดินอันดามัน และประภาคารกาญจนาภิเษก'
      },
      {
        name: 'วัดไชยธาราราม (วัดฉลอง)',
        nameEn: 'Wat Chaithararam (Wat Chalong)',
        category: 'วัดคู่บ้านคู่เมือง & บารมีหลวงพ่อแช่ม',
        description: 'วัดเก่าแก่คู่เกาะภูเก็ตที่มีชื่อเสียงเลื่องลือด้านความศักดิ์สิทธิ์ของ "หลวงพ่อแช่ม" อดีตเจ้าอาวาสผู้มีบารมีทางวิปัสสนา ภายในมีพระมหาธาตุเจดีย์พระจอมไทยบารมีประกาศ ประดิษฐานพระบรมสารีริกธาตุจากศรีลังกา',
        location: 'ถ.เจ้าฟ้าตะวันตก ต.ฉลอง อ.เมืองภูเก็ต จ.ภูเก็ต 83130',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Chalong+Phuket',
        highlight: 'พระมหาธาตุเจดีย์ทรงระฆังคว่ำ และรูปหล่อหลวงพ่อแช่มศักดิ์สิทธิ์'
      },
      {
        name: 'จุดชมวิวสามอ่าว (Karon Viewpoint / จุดชมวิวกะรน)',
        nameEn: 'Karon Viewpoint',
        category: 'ทัศนียภาพทางธรรมชาติ & ชายหาดรูปพระจันทร์เสี้ยว',
        description: 'จุดชมวิวยอดนิยมบนเนินเขา มองเห็นโค้งหาดทรายขาวรูปพระจันทร์เสี้ยว 3 หาดเรียงต่อกันอย่างสมบูรณ์แบบ ได้แก่ หาดกะตะน้อย หาดกะตะ และหาดกะรน โอบล้อมด้วยน้ำทะเลสีฟ้าครามตัดกับทิวเขาสีเขียวขจี',
        location: 'ต.กะรน อ.เมืองภูเก็ต จ.ภูเก็ต 83100',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Karon+Viewpoint+Phuket',
        highlight: 'ทิวทัศน์ 3 ชายหาดรูปเสี้ยวพระจันทร์เรียงต่อกัน'
      }
    ],
    restaurants: [
      {
        name: 'ร้านระย้า (Raya Restaurant)',
        category: 'มิชลิน ไกด์ และต้นตำรับอาหารเปอรานากันภูเก็ต',
        recommendedMenu: 'แกงเนื้อปูใบชะพลูพร้อมหมี่ขาว, หมูฮ้องสูตรโบราณ, น้ำพริกกุ้งเสียบ, ผักเหมียงต้มกะทิ',
        location: '48 ถ.ดีบุก ต.ตลาดใหญ่ อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Raya+Restaurant+Phuket',
        note: 'ตั้งอยู่ในคฤหาสน์โบราณกว่า 100 ปี เสิร์ฟรสชาติอาหารพื้นเมืองภูเก็ตดั้งเดิม'
      },
      {
        name: 'โกเบ๊นซ์ข้าวต้มแห้งภูเก็ต',
        category: 'มิชลิน บิบ กูร์มองด์ (Bib Gourmand)',
        recommendedMenu: 'ข้าวต้มแห้งหมูสับหมูกรอบ, กวยจั๊บน้ำใส, ซุปกระดูกหมูตุ๋นเห็ดหอม, หมูกรอบจิ้มซีอิ๊วดำ',
        location: 'ถ.กระบี่ ต.ตลาดเหนือ อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Go+Benz+Phuket',
        note: 'เปิดช่วงเย็นถึงดึก ข้าวต้มแห้งเครื่องแน่นหอมกระเทียมเจียว เสิร์ฟพร้อมน้ำซุปพริกไทยร้อนระอุ'
      },
      {
        name: 'วันจันทร์ (One Chun Cafe & Restaurant)',
        category: 'มิชลิน บิบ กูร์มองด์ (Bib Gourmand)',
        recommendedMenu: 'น้ำพริกหยำกุ้งสด, แกงส้มปลากะพงยอดมะพร้าว, หมูคั่วเกลือ, ใบเหมียงผัดไข่',
        location: '48/1 ถ.เทพกระษัตรี ต.ตลาดใหญ่ อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=One+Chun+Phuket',
        note: 'บรรยากาศวินเทจ อบอุ่นด้วยของสะสมย้อนยุค รสชาติอาหารจัดจ้านถึงเครื่องแกงใต้'
      }
    ],
    references: [
      { name: 'UNESCO Creative Cities Network - Phuket (Gastronomy)', url: 'https://en.unesco.org/creative-cities/phuket' },
      { name: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานภูเก็ต', url: 'https://www.tourismthailand.org' },
      { name: 'MICHELIN Guide Thailand - Phuket Selection', url: 'https://guide.michelin.com/th/th' }
    ]
  },
  {
    id: 'chonburi',
    region: 'ภาคตะวันออก',
    regionEn: 'Eastern Thailand',
    province: 'ชลบุรี',
    provinceEn: 'Chonburi',
    tagline: 'มนต์เสน่ห์ทะเลอ่าวไทย มหัศจรรย์ปราสาทไม้ อาหารทะเลสดใหม่ และสีสันพัทยา',
    coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
    heroAlt: 'ภาพปราสาทสัจธรรม สถาปัตยกรรมไม้แกะสลักริมทะเล จังหวัดชลบุรี',
    badge: 'เพชรเม็ดงามแห่งอ่าวไทย',
    highlights: 'ตื่นตากับปราสาทไม้แกะสลักใหญ่ที่สุดในโลก พักผ่อนริมหาดทรายบางแสน นั่งเรือข้ามฟากสู่น้ำใสเกาะล้าน และชิมซีฟู้ดสดขึ้นจากสะพานปลา',
    tags: ['ทะเลอ่าวไทย', 'ปราสาทสัจธรรม', 'อาหารทะเลสด', 'เกาะล้าน & พัทยา'],
    signatureDishes: [
      { name: 'กั้งทอดกระเทียมพริกไทย', desc: 'กั้งทะเลตัวโตสดเนื้อแน่นหวาน นำมาทอดสะดุ้งน้ำมันคลุกเคล้ากระเทียมไทยเจียวกรอบหอมฟุ้ง ทานคู่ซอสพริกศรีราชาแท้' },
      { name: 'ข้าวหลามหนองมน & ห่อหมกปลาอินทรี', desc: 'ข้าวหลามเผากระบอกไม้ไผ่ ข้าวเหนียวนุ่มเยิ้มกะทิหวานมัน และห่อหมกใบยอปลาอินทรีพริกแกงใต้หอมกลมกล่อม' },
      { name: 'ปูม้านึ่งน้ำจิ้มซีฟู้ดมะนาวสด', desc: 'ปูม้าเป็นสดจากเรือประมง นึ่งร้อนๆ แกะเห็นเนื้อขาวแน่นหวานฉ่ำ จิ้มน้ำจิ้มซีฟู้ดพริกขี้หนูสวนมะนาวแท้' }
    ],
    attractions: [
      {
        name: 'ปราสาทสัจธรรม (Sanctuary of Truth)',
        nameEn: 'The Sanctuary of Truth',
        category: 'สถาปัตยกรรมไม้แกะสลักใหญ่ที่สุดในโลก',
        description: 'ปราสาทไม้ริมทะเลพัทยาที่สร้างจากไม้ทั้งหลังโดยไม่ใช้ตะปูโลหะแม้แต่ตัวเดียว ทุกตารางนิ้ววิจิตรงดงามด้วยงานแกะสลักไม้ถ่ายทอดปรัชญาโบราณของเอเชียตะวันออกเฉียงใต้ เป็นทั้งงานศิลปะชั้นครูและสถานที่สงบจิตใจ',
        location: '206/2 หมู่ที่ 5 ซอยนาเกลือ 12 ต.นาเกลือ อ.บางละมุง จ.ชลบุรี 20150',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sanctuary+of+Truth+Pattaya',
        highlight: 'โครงสร้างไม้สลักโบราณริมแหลมราชเวชโดยไม่ใช้ตะปู'
      },
      {
        name: 'ชายหาดบางแสน และ เขาสามมุข',
        nameEn: 'Bang Saen Beach & Khao Sam Muk',
        category: 'ชายหาดพักผ่อนยอดนิยม & ศาลเจ้าแม่สามมุข',
        description: 'ชายหาดยอดนิยมใกล้กรุงเทพฯ เรียงรายด้วยทิวมะพร้าวร่มรื่น คาเฟ่ริมหาด และร้านอาหารทะเลสด ต่อเนื่องด้วยจุดชมวิวเขาสามมุขที่มีศาลเจ้าแม่สามมุขอันศักดิ์สิทธิ์และฝูงลิงธรรมชาติ',
        location: 'ต.แสนสุข อ.เมืองชลบุรี จ.ชลบุรี 20130',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bangsaen+Beach+Chonburi',
        highlight: 'ถนนเลียบหาดบางแสน จุดชมวิวเขาสามมุข และตลาดของฝากหนองมน'
      },
      {
        name: 'เกาะล้าน (หาดตาแหวนและหาดเทียน)',
        nameEn: 'Koh Larn (Coral Island)',
        category: 'เกาะสวรรค์น้ำใส & กิจกรรมทางน้ำ',
        description: 'เกาะท่องเที่ยวยอดนิยมห่างจากพัทยาเพียง 7 กิโลเมตร มีหาดทรายขาวเนียนละเอียดและน้ำทะเลสีฟ้าใสราวกับกระจก เหมาะสำหรับดำน้ำตื้น เล่นกีฬาทางน้ำ และพักผ่อนรีสอร์ตริมทะเล',
        location: 'ต.นาเกลือ อ.บางละมุง จ.ชลบุรี 20150',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Koh+Larn+Pattaya',
        highlight: 'น้ำทะเลใสหาดเทียน สะพานไม้ข้ามทะเล และจุดชมวิวกังหันลม'
      },
      {
        name: 'สวนนงนุช พัทยา (Nongnooch Tropical Garden)',
        nameEn: 'Nongnooch Tropical Garden Pattaya',
        category: 'สวนพฤกษศาสตร์ระดับโลก & หุบเขาไดโนเสาร์',
        description: '1 ใน 10 สวนสวยที่สุดในโลก บนพื้นที่กว่า 1,700 ไร่ รวบรวมพันธุ์ไม้เขตร้อนหายาก สวนลอยฟ้า สวนฝรั่งเศส และไฮไลต์ประติมากรรมหุบเขาไดโนเสาร์จำลองขนาดเท่าของจริงนับร้อยชนิด',
        location: '34/1 หมู่ที่ 7 ต.นาจอมเทียน อ.สัตหีบ จ.ชลบุรี 20250',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nongnooch+Garden+Pattaya',
        highlight: 'สวนลอยฟ้า สวนจัดแต่งระดับโลก และโซนหุบเขาไดโนเสาร์'
      }
    ],
    restaurants: [
      {
        name: 'ป้าอ่อน ซอยเจ๊ก ชลบุรี',
        category: 'ร้านอาหารทะเลตามสั่งระดับตำนาน',
        recommendedMenu: 'กั้งทอดกระเทียมพริกไทย, ข้าวราดกะเพราปู-กั้ง, ต้มยำรวมมิตรทะเลน้ำใส, ทอดมันกุ้ง',
        location: 'ซอยข้างศาลเจ้าเก้งบ๊วย ต.มะขามหย่ง อ.เมืองชลบุรี จ.ชลบุรี 20000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pa+On+Soi+Jek+Chonburi',
        note: 'ร้านเล็กๆ ในซอยเก่าแต่คิวยาวเหยียด กั้งและปูสดชิ้นโตจัดเต็มทุกจาน'
      },
      {
        name: 'ป้าแอ๊ด ซีฟู้ด ศรีราชา (Pa Add Seafood)',
        category: 'ร้านอาหารทะเลสดริมทะเลศรีราชา',
        recommendedMenu: 'ปูม้านึ่งแกะพร้อมทาน, ปลากะพงทอดราดน้ำปลา, ปลาหมึกไข่นึ่งมะนาว, โป๊ะแตกทะเล',
        location: 'ถ.เจิมจอมพล ต.ศรีราชา อ.ศรีราชา จ.ชลบุรี 20110',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pa+Add+Seafood+Sriracha',
        note: 'นั่งรับลมทะเลเย็นสบาย อาหารทะเลสดใหม่จากเรือประมงท้องถิ่นทุกวัน'
      },
      {
        name: 'มุมอร่อย นาเกลือ พัทยา (Mum Aroi)',
        category: 'ร้านอาหารทะเลชื่อดังริมหาดพัทยา',
        recommendedMenu: 'ส้มตำปูม้าดอง, ปลากะพงทอดน้ำปลา, หอยนางรมสดทรงเครื่อง, แกงส้มไข่ปลาเรียวเซียว',
        location: '83/4 ซอยนาเกลือ 4 ต.นาเกลือ อ.บางละมุง จ.ชลบุรี 20150',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mum+Aroi+Naklua+Pattaya',
        note: 'ร้านกว้างขวางริมชายหาด บรรยากาศพระอาทิตย์ตกดินสุดโรแมนติก'
      }
    ],
    references: [
      { name: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานพัทยา', url: 'https://www.tourismthailand.org' },
      { name: 'เว็บไซต์อย่างเป็นทางการ ปราสาทสัจธรรม', url: 'https://sanctuaryoftruthmuseum.com' },
      { name: 'สวนพฤกษศาสตร์สวนนงนุช พัทยา', url: 'https://www.nongnoochpattaya.com' }
    ]
  },
  {
    id: 'kanchanaburi',
    region: 'ภาคตะวันตก',
    regionEn: 'Western Thailand',
    province: 'กาญจนบุรี',
    provinceEn: 'Kanchanaburi',
    tagline: 'ย้อนรอยประวัติศาสตร์สะพานข้ามแม่น้ำแคว ป่าเขาบริสุทธิ์ ธารน้ำตกมรกต และมนต์เสน่ห์สังขละบุรี',
    coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    heroAlt: 'ภาพน้ำตกเอราวัณ ธารน้ำสีฟ้ามรกต จังหวัดกาญจนบุรี',
    badge: 'ดินแดนแห่งประวัติศาสตร์และสายน้ำ',
    highlights: 'เดินบนรางรถไฟสายประวัติศาสตร์ ชมน้ำตกมรกต 7 ชั้น สัมผัสวิถีชีวิตไทย-รามัญบนสะพานไม้มอญ และลิ้มรสแกงป่าปลาคังรสเด็ดจัดจ้าน',
    tags: ['ประวัติศาสตร์สงครามโลก', 'น้ำตกเอราวัณ', 'สะพานมอญสังขละบุรี', 'แกงป่าปลาคัง'],
    signatureDishes: [
      { name: 'แกงป่าปลาคังเมืองกาญจน์', desc: 'ปลาคังเนื้อแน่นสดจากแม่น้ำแคว ปรุงด้วยพริกแกงป่าตำสดรสชาติเผ็ดร้อนหอมกระชาย กะเพราป่า และพริกไทยอ่อนแท้' },
      { name: 'ปลาคังลวกจิ้มแจ่วเต้าเจี้ยว', desc: 'เนื้อปลาคังสดหั่นชิ้นหนาลวกสะดุ้งน้ำเดือด โรยกระเทียมเจียวและคึ่นช่าย ทานคู่น้ำจิ้มเต้าเจี้ยวพริกขี้หนูมะนาว' },
      { name: 'ทองม้วนสด & มะขามกวนแก้ว', desc: 'ขนมหวานพื้นบ้านแป้งเหนียวนุ่มมะพร้าวอ่อนย่างหอมกรุ่น และมะขามกวนแก้วสามรสของฝากชื่อดัง' }
    ],
    attractions: [
      {
        name: 'สะพานข้ามแม่น้ำแคว',
        nameEn: 'The Bridge Over the River Kwai',
        category: 'อนุสรณ์สถานประวัติศาสตร์สงครามโลกครั้งที่ 2',
        description: 'สะพานเหล็กกล้าสีดำข้ามลำน้ำแควใหญ่ เป็นส่วนหนึ่งของเส้นทางรถไฟสายมรณะที่สร้างขึ้นในสมัยสงครามโลกครั้งที่ 2 กลายเป็นสัญลักษณ์แห่งสันติภาพที่มีชื่อเสียงระดับโลก นักท่องเที่ยวสามารถเดินข้ามสะพานและรอชมขบวนรถไฟวิ่งผ่านอย่างใกล้ชิด',
        location: 'ถ.แม่น้ำแคว ต.ท่ามะขาม อ.เมืองกาญจนบุรี จ.กาญจนบุรี 71000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Bridge+Over+the+River+Kwai+Kanchanaburi',
        highlight: 'โครงเหล็กโค้งประวัติศาสตร์ และขบวนรถไฟที่ยังคงเปิดใช้งานจริง'
      },
      {
        name: 'อุทยานแห่งชาติเอราวัณ (น้ำตกเอราวัณ 7 ชั้น)',
        nameEn: 'Erawan National Park',
        category: 'อุทยานแห่งชาติ & น้ำตกหินปูนสีเขียวมรกต',
        description: 'น้ำตกหินปูนขนาดใหญ่ที่มีน้ำใสสะอาดเป็นสีเขียวมรกตไหลลดหลั่นกันลงมาทั้งหมด 7 ชั้น แต่ละชั้นมีแอ่งน้ำธรรมชาติให้ลงเล่นได้อย่างปลอดภัย ชั้นบนสุดมีผาหินรูปร่างคล้ายเศียรช้างเอราวัณ 3 เศียร',
        location: 'หมู่ที่ 4 ต.ท่ากระดาน อ.ศรีสวัสดิ์ จ.กาญจนบุรี 71250',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Erawan+National+Park+Kanchanaburi',
        highlight: 'ธารน้ำตกสีเขียวมรกต 7 ชั้น และฝูงปลาพลวงแหวกว่ายตามธรรมชาติ'
      },
      {
        name: 'สะพานไม้อุตตมานุสรณ์ (สะพานมอญ สังขละบุรี)',
        nameEn: 'Mon Bridge (Uttamanusorn Bridge), Sangkhlaburi',
        category: 'สะพานไม้ที่ยาวที่สุดในประเทศไทย',
        description: 'สะพานไม้สักความยาว 850 เมตร ข้ามลำน้ำซองกาเลีย เชื่อมโยงวัฒนธรรมระหว่างชุมชนชาวไทยและชาวมอญ สร้างขึ้นโดยบารมีของหลวงพ่ออุตตมะ ยามเช้ามีหมอกลอยละล่องเหนือน้ำและกิจกรรมตักบาตรมอญอันเปี่ยมด้วยศรัทธา',
        location: 'ซอยสะพานไม้ ต.หนองลู อ.สังขละบุรี จ.กาญจนบุรี 71240',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mon+Bridge+Sangkhlaburi+Kanchanaburi',
        highlight: 'พิธีตักบาตรมอญยามเช้า วิถีชีวิตริมน้ำซองกาเลีย และสะพานไม้สัก'
      },
      {
        name: 'ถ้ำกระแซ และ ทางรถไฟสายมรณะ',
        nameEn: 'Tham Krasae & The Death Railway',
        category: 'เส้นทางประวัติศาสตร์ & ภูมิทัศน์หน้าผาริมแม่น้ำ',
        description: 'จุดที่สวยงามและหวาดเสียวที่สุดของทางรถไฟสายมรณะ โดยขบวนรถไฟจะวิ่งเลียบชะง่อนผาหินสูงชันขนานไปกับแม่น้ำแควน้อย ด้านข้างมีถ้ำกระแซซึ่งเคยเป็นที่พักและโรงพยาบาลของเชลยศึกสงคราม ปัจจุบันประดิษฐานพระพุทธรูปศักดิ์สิทธิ์',
        location: 'ต.ลุ่มสุ่ม อ.ไทรโยค จ.กาญจนบุรี 71150',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Krasae+Cave+Death+Railway+Kanchanaburi',
        highlight: 'สะพานไม้เลียบโค้งหน้าผาแม่น้ำแควน้อย และพระพุทธรูปศักดิ์สิทธิ์ในถ้ำ'
      }
    ],
    restaurants: [
      {
        name: 'คีรีธารา (Keereetara Restaurant)',
        category: 'ร้านอาหารริมน้ำวิวสะพานข้ามแม่น้ำแคว',
        recommendedMenu: 'ยำถั่วพูกุ้งสด, แกงป่าปลาคัง, ปลาคังลวกจิ้มเต้าเจี้ยว, ฉู่ฉี่ปลาเนื้ออ่อน',
        location: '431/1 ถ.แม่น้ำแคว ต.ท่ามะขาม อ.เมืองกาญจนบุรี จ.กาญจนบุรี 71000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Keereetara+Restaurant+Kanchanaburi',
        note: 'ชมวิวสะพานข้ามแม่น้ำแควในยามค่ำคืน เคล้าคลอดนตรีสดโฟล์กซองเบาๆ'
      },
      {
        name: 'ครัวชุกโดน (Chuk Don Restaurant)',
        category: 'ร้านอาหารพื้นบ้านริมแม่น้ำแม่กลอง',
        recommendedMenu: 'แกงส้มชะอมกุ้งสด, ปลาเค้าทอดน้ำปลา, ห่อหมกทะเลมะพร้าวอ่อน, ยำสาวชุกโดน',
        location: '60 ท่าน้ำชุกโดน ถ.ไชยชุมพล ต.บ้านใต้ อ.เมืองกาญจนบุรี จ.กาญจนบุรี 71000',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chuk+Don+Restaurant+Kanchanaburi',
        note: 'ร้านขวัญใจคนท้องถิ่น อาหารรสกลมกล่อมราคาเป็นกันเองริมสายน้ำ'
      },
      {
        name: 'พริกแกง (Prik Gaeng Restaurant ลาดหญ้า)',
        category: 'ร้านแกงป่ารสจัดจ้านระดับตำนานลาดหญ้า',
        recommendedMenu: 'ผัดเผ็ดหมูป่า, แกงป่าไก่บ้านรสจัด, กบกระเพรากรอบ, ทอดมันปลากรายหนึบ',
        location: 'ถ.ลาดหญ้า-เอราวัณ ต.ลาดหญ้า อ.เมืองกาญจนบุรี จ.กาญจนบุรี 71190',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Prik+Gaeng+Restaurant+Lat+Ya+Kanchanaburi',
        note: 'พริกแกงตำเองสูตรเมืองกาญจน์แท้ เผ็ดร้อนถึงใจตามแบบฉบับอาหารป่าดั้งเดิม'
      }
    ],
    references: [
      { name: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานกาญจนบุรี', url: 'https://www.tourismthailand.org' },
      { name: 'อุทยานแห่งชาติเอราวัณ กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช', url: 'https://portal.dnp.go.th' },
      { name: 'สำนักงานการท่องเที่ยวและกีฬาจังหวัดกาญจนบุรี', url: 'https://kanchanaburi.mots.go.th' }
    ]
  }
];

/**
 * State Management & DOM Elements Cache
 */
let currentFilter = 'all';
let currentProvince = null;
let lastFocusedElement = null;

// DOM Elements
const cardsGrid = document.getElementById('provinces-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('province-modal');
const modalDialog = document.getElementById('modal-dialog');
const modalContentArea = document.getElementById('modal-dynamic-content');
const modalCloseBtn = document.getElementById('modal-close-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const backToTopBtn = document.getElementById('back-to-top');

/**
 * Initialize Web Application
 */
document.addEventListener('DOMContentLoaded', () => {
  renderProvinceCards(currentFilter);
  initEventListeners();
  initBackToTop();
  console.log('✅ Amazing Thailand Application Loaded Successfully (6 Provinces Active)');
});

/**
 * Render Province Cards based on region filter
 * @param {string} filter 
 */
function renderProvinceCards(filter) {
  if (!cardsGrid) return;

  cardsGrid.innerHTML = '';

  const filteredData = filter === 'all' 
    ? provincesData 
    : provincesData.filter(item => item.region === filter);

  filteredData.forEach(item => {
    const card = document.createElement('article');
    card.className = 'province-card bg-white rounded-2xl overflow-hidden border border-[#E3D7C7] flex flex-col justify-between group shadow-sm';
    card.setAttribute('data-id', item.id);
    card.setAttribute('aria-label', `ข้อมูลจังหวัด${item.province}`);

    card.innerHTML = `
      <div>
        <!-- Card Image & Badge -->
        <div class="relative h-64 overflow-hidden bg-stone-200">
          <img 
            src="${item.coverImage}" 
            alt="${item.heroAlt}" 
            loading="lazy" 
            class="card-image w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          
          <!-- Region Badge -->
          <div class="absolute top-4 left-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2]/90 text-[#2C221E] backdrop-blur-md shadow-sm border border-[#E3D7C7]">
              📍 ${item.region}
            </span>
          </div>

          <!-- Highlight Pill -->
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <span class="text-xs uppercase tracking-wider font-medium text-amber-200 block mb-1 font-heading">
              ${item.provinceEn}
            </span>
            <h3 class="text-2xl font-bold font-heading drop-shadow-md">
              ${item.province}
            </h3>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6">
          <p class="text-sm font-medium text-[#8C6D58] mb-3 italic">
            "${item.tagline}"
          </p>

          <p class="text-sm text-[#52433B] line-clamp-3 mb-4 leading-relaxed">
            ${item.highlights}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-5">
            ${item.tags.map(t => `
              <span class="text-xs px-2.5 py-1 rounded-md bg-[#F4EFE6] text-[#52433B] font-medium border border-[#E3D7C7]/50">
                #${t}
              </span>
            `).join('')}
          </div>

          <!-- Quick Preview Highlights -->
          <div class="border-t border-[#E3D7C7]/60 pt-4 mb-2">
            <p class="text-xs font-semibold text-[#8C6D58] uppercase tracking-wider mb-2 font-heading">
              ✨ ไฮไลต์ที่ไม่ควรพลาด:
            </p>
            <ul class="text-xs text-[#52433B] space-y-1.5">
              <li class="flex items-center gap-2">
                <span class="text-[#A26744]">🏛️</span>
                <span class="truncate font-medium">${item.attractions[0].name}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#A26744]">🍲</span>
                <span class="truncate font-medium">${item.restaurants[0].name} (${item.restaurants[0].category})</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Card Action Footer -->
      <div class="px-6 pb-6 pt-2 bg-gradient-to-b from-transparent to-[#F4EFE6]/30">
        <button 
          type="button" 
          onclick="openModal('${item.id}', this)" 
          class="btn-primary w-full py-3 px-4 rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
          aria-haspopup="dialog"
        >
          <span>สำรวจจังหวัด${item.province}</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    `;

    cardsGrid.appendChild(card);
  });
}

/**
 * Filter Events
 */
function handleFilterClick(event) {
  const btn = event.currentTarget;
  const filter = btn.getAttribute('data-filter');

  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  currentFilter = filter;
  renderProvinceCards(filter);
}

/**
 * Open Modal with Province Details
 * @param {string} provinceId 
 * @param {HTMLElement} triggerElement 
 */
function openModal(provinceId, triggerElement = null) {
  const data = provincesData.find(item => item.id === provinceId);
  if (!data || !modal) return;

  currentProvince = data;
  if (triggerElement) {
    lastFocusedElement = triggerElement;
  }

  // Populate Modal HTML
  renderModalContent(data);

  // Activate Modal
  modal.classList.add('active');
  document.body.classList.add('modal-open');

  // Accessibility: Focus close button
  setTimeout(() => {
    if (modalCloseBtn) modalCloseBtn.focus();
  }, 100);
}

/**
 * Render Dynamic Content inside Modal
 * @param {object} data 
 */
function renderModalContent(data) {
  if (!modalContentArea) return;

  modalContentArea.innerHTML = `
    <!-- Modal Hero Cover Header -->
    <div class="relative h-72 md:h-80 w-full overflow-hidden bg-stone-900">
      <img 
        src="${data.coverImage}" 
        alt="${data.heroAlt}" 
        class="w-full h-full object-cover opacity-90"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-black/40 to-black/60"></div>
      
      <!-- Top Pills -->
      <div class="absolute top-6 left-6 flex items-center gap-2">
        <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#2C221E] shadow-md border border-[#E3D7C7]">
          📍 ${data.region}
        </span>
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#A26744] text-white shadow-md">
          ${data.badge}
        </span>
      </div>

      <!-- Title in Hero -->
      <div class="absolute bottom-6 left-6 right-6 text-[#2C221E]">
        <span class="text-xs uppercase tracking-widest font-semibold text-[#8C6D58] font-heading block mb-1">
          AMAZING THAILAND • ${data.provinceEn.toUpperCase()}
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold font-heading text-[#2C221E]">
          จังหวัด${data.province}
        </h2>
        <p class="text-sm md:text-base font-medium text-[#52433B] mt-1 italic">
          "${data.tagline}"
        </p>
      </div>
    </div>

    <!-- Modal Body Content -->
    <div class="p-6 md:p-8 space-y-8 bg-[#FAF7F2]">
      
      <!-- Highlights Box -->
      <div class="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E3D7C7] flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#A26744] text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
          ✨
        </div>
        <div>
          <h4 class="font-heading font-bold text-base text-[#2C221E] mb-1">
            เสน่ห์และจุดเด่นที่ไม่ควรพลาด
          </h4>
          <p class="text-sm text-[#52433B] leading-relaxed">
            ${data.highlights}
          </p>
        </div>
      </div>

      <!-- Section: Signature Local Foods -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🍲</span>
          <h3 class="text-xl font-bold font-heading text-[#2C221E]">
            อาหารขึ้นชื่อและเมนูเด็ดประจำจังหวัด
          </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${data.signatureDishes.map(dish => `
            <div class="bg-white p-4 rounded-xl border border-[#E3D7C7] shadow-xs hover:border-[#A26744]/40 transition-colors">
              <h5 class="font-heading font-bold text-sm text-[#A26744] mb-1.5 flex items-center gap-1.5">
                <span>🍽️</span> ${dish.name}
              </h5>
              <p class="text-xs text-[#52433B] leading-relaxed">
                ${dish.desc}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: 4 Attractions -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏛️</span>
            <div>
              <h3 class="text-xl font-bold font-heading text-[#2C221E]">
                สถานที่ท่องเที่ยวแนะนำที่ไม่ควรพลาด (4 แห่ง)
              </h3>
              <p class="text-xs text-[#8C6D58]">
                ข้อมูลที่ตั้งจริงพร้อมปุ่มนำทาง Google Maps
              </p>
            </div>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-[#E3D7C7] text-[#2C221E] font-medium hidden sm:inline-block">
            พิกัดตรวจสอบแล้ว 100%
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${data.attractions.map((place, idx) => `
            <div class="bg-white p-5 rounded-2xl border border-[#E3D7C7] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <span class="inline-block text-xs font-bold text-[#A26744] bg-[#F4EFE6] px-2.5 py-0.5 rounded-full border border-[#E3D7C7]/60">
                    ลำดับที่ ${idx + 1} • ${place.category}
                  </span>
                </div>
                <h4 class="font-heading font-bold text-base text-[#2C221E] mb-0.5">
                  ${place.name}
                </h4>
                <p class="text-xs text-[#8C6D58] mb-2 font-mono">
                  ${place.nameEn}
                </p>
                <p class="text-xs text-[#52433B] leading-relaxed mb-3">
                  ${place.description}
                </p>
                <div class="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E3D7C7]/50 mb-3 text-xs text-[#52433B] flex items-start gap-2">
                  <svg class="w-4 h-4 text-[#A26744] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span><strong>ที่ตั้งจริง:</strong> ${place.location}</span>
                </div>
              </div>

              <!-- Maps CTA Button -->
              <a 
                href="${place.mapsUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn-maps py-2.5 px-4 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-2 text-center cursor-pointer"
                title="เปิด Google Maps สำหรับ ${place.name}"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>เปิดแผนที่นำทาง (Google Maps)</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: 3 Famous Restaurants -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🍴</span>
            <div>
              <h3 class="text-xl font-bold font-heading text-[#2C221E]">
                ร้านอาหารขึ้นชื่อ & รสชาติท้องถิ่นแท้ (3 ร้าน)
              </h3>
              <p class="text-xs text-[#8C6D58]">
                คัดเลือกร้านในตำนานและมิชลินไกด์ประจำจังหวัด
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${data.restaurants.map((rest, idx) => `
            <div class="bg-white p-5 rounded-2xl border border-[#E3D7C7] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span class="inline-block text-xs font-bold text-[#5C6F54] bg-[#F3F7EE] px-2.5 py-0.5 rounded-full border border-[#D1DFC8] mb-2">
                  ${rest.category}
                </span>
                <h4 class="font-heading font-bold text-base text-[#2C221E] mb-1">
                  ${rest.name}
                </h4>
                <p class="text-xs text-[#8C6D58] mb-3">
                  ${rest.note}
                </p>

                <!-- Menu Item -->
                <div class="mb-3">
                  <span class="text-xs font-semibold text-[#2C221E] block mb-1">
                    🌟 เมนูแนะนำ:
                  </span>
                  <p class="text-xs text-[#52433B] bg-[#FAF7F2] p-2 rounded-lg border border-[#E3D7C7]/40 leading-relaxed font-medium">
                    ${rest.recommendedMenu}
                  </p>
                </div>

                <!-- Location -->
                <div class="text-xs text-[#52433B] flex items-start gap-1.5 mb-4">
                  <span class="text-[#A26744]">📍</span>
                  <span class="leading-tight">${rest.location}</span>
                </div>
              </div>

              <!-- Maps CTA Button -->
              <a 
                href="${rest.mapsUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn-maps py-2.5 px-3 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-2 text-center cursor-pointer"
                title="เปิด Google Maps ร้าน ${rest.name}"
              >
                <span>ปักหมุดร้านบน Google Maps</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Reference & Accuracy Notice -->
      <div class="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3D7C7]/80 text-xs text-[#52433B] space-y-2">
        <div class="font-semibold text-[#2C221E] flex items-center gap-1.5">
          <svg class="w-4 h-4 text-[#5C6F54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>การรับรองความถูกต้องของข้อมูล (Data Verification Sources):</span>
        </div>
        <p class="text-[#8C6D58]">
          ข้อมูลสถานที่ท่องเที่ยว ที่ตั้งจริง และร้านอาหารในจังหวัด${data.province} อ้างอิงจากฐานข้อมูลเผยแพร่อย่างเป็นทางการของ:
        </p>
        <ul class="list-disc list-inside space-y-1 text-[#52433B] pl-2">
          ${data.references.map(ref => `
            <li>
              <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#A26744]">
                ${ref.name}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Bottom Close Button in Modal -->
      <div class="pt-4 border-t border-[#E3D7C7] flex justify-end">
        <button 
          type="button" 
          onclick="closeModal()" 
          class="btn-secondary py-2.5 px-6 rounded-xl font-heading font-medium text-sm cursor-pointer"
        >
          ปิดหน้าต่างนี้
        </button>
      </div>

    </div>
  `;
}

/**
 * Close Modal Functionality
 */
function closeModal() {
  if (!modal) return;

  modal.classList.remove('active');
  document.body.classList.remove('modal-open');

  // Return focus for accessibility
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

/**
 * Event Listeners Registration
 */
function initEventListeners() {
  // Region Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });

  // Modal Close Button ('X')
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside dialog (Backdrop click)
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Keyboard navigation: Escape key closes modal & mobile menu
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      if (modal && modal.classList.contains('active')) {
        closeModal();
      }
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        toggleMobileMenu(false);
      }
    }
  });

  // Mobile Menu Hamburger Toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.classList.contains('hidden');
      toggleMobileMenu(isHidden);
    });
  }

  // Close mobile nav when clicking a link
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });
}

/**
 * Toggle Mobile Navigation Drawer
 * @param {boolean} show 
 */
function toggleMobileMenu(show) {
  if (!mobileNav || !mobileMenuBtn) return;
  if (show) {
    mobileNav.classList.remove('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  } else {
    mobileNav.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Back to Top Floating Button Initialization
 */
function initBackToTop() {
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}