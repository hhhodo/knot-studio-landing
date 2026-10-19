export interface Product {
  id: number;
  name: string;
  category: 'yarn' | 'pattern';
  subCategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBest?: boolean;
}

export const productCategories = [
  { id: 'all', label: '전체' },
  { id: 'yarn', label: '실' },
  { id: 'pattern', label: '도안' },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: '메리노 울 100% 베이직 실',
    category: 'yarn',
    subCategory: '대바늘용',
    price: 12000,
    image: 'https://readdy.ai/api/search-image?query=soft%20merino%20wool%20yarn%20ball%20in%20warm%20cream%20beige%20color%2C%20minimalist%20product%20photography%20on%20clean%20white%20background%2C%20cozy%20knitting%20material%2C%20natural%20fiber%20texture%20close%20up&width=400&height=400&seq=yarn001&orientation=squarish',
    description: '100% 메리노 울로 만든 부드럽고 따뜻한 기본 실입니다. 초보자도 다루기 쉬운 굵기로 다양한 작품에 활용 가능합니다.',
    tags: ['메리노울', '대바늘', '기초'],
    stock: 50,
    rating: 4.8,
    reviewCount: 124,
    isBest: true,
  },
  {
    id: 2,
    name: '코튼 혼방 여름 실',
    category: 'yarn',
    subCategory: '코바늘용',
    price: 9500,
    image: 'https://readdy.ai/api/search-image?query=cotton%20blend%20yarn%20ball%20in%20soft%20pastel%20mint%20green%20color%2C%20clean%20white%20background%2C%20summer%20knitting%20crochet%20material%2C%20smooth%20texture%20product%20shot&width=400&height=400&seq=yarn002&orientation=squarish',
    description: '코튼 60% + 아크릴 40% 혼방 실. 여름 소품과 가방 제작에 최적화된 실입니다.',
    tags: ['코튼', '코바늘', '여름'],
    stock: 35,
    rating: 4.6,
    reviewCount: 89,
    isNew: true,
  },
  {
    id: 3,
    name: '알파카 블렌드 고급 실',
    category: 'yarn',
    subCategory: '대바늘용',
    price: 18000,
    originalPrice: 22000,
    image: 'https://readdy.ai/api/search-image?query=luxurious%20alpaca%20blend%20yarn%20skein%20in%20dusty%20rose%20pink%20color%2C%20elegant%20product%20photography%20on%20white%20background%2C%20premium%20soft%20fiber%2C%20knitting%20wool&width=400&height=400&seq=yarn003&orientation=squarish',
    description: '알파카 30% + 메리노 울 70% 고급 혼방 실. 극도로 부드럽고 보온성이 뛰어납니다.',
    tags: ['알파카', '고급', '대바늘'],
    stock: 20,
    rating: 4.9,
    reviewCount: 67,
    isBest: true,
  },
  {
    id: 4,
    name: '레인보우 그라데이션 실',
    category: 'yarn',
    subCategory: '코바늘용',
    price: 14000,
    image: 'https://readdy.ai/api/search-image?query=colorful%20gradient%20rainbow%20yarn%20ball%20with%20smooth%20color%20transition%20from%20warm%20to%20cool%20tones%2C%20white%20background%2C%20vibrant%20knitting%20crochet%20material&width=400&height=400&seq=yarn004&orientation=squarish',
    description: '자연스러운 그라데이션 컬러 실. 별도의 색 배합 없이도 아름다운 작품을 만들 수 있습니다.',
    tags: ['그라데이션', '컬러풀', '코바늘'],
    stock: 28,
    rating: 4.7,
    reviewCount: 103,
    isNew: true,
  },
  {
    id: 5,
    name: '베이직 니트 스웨터 도안',
    category: 'pattern',
    subCategory: '의류',
    price: 8000,
    image: 'https://readdy.ai/api/search-image?query=knitting%20pattern%20booklet%20for%20basic%20sweater%2C%20flat%20lay%20on%20white%20background%2C%20handmade%20craft%20instruction%20manual%2C%20minimalist%20design%20with%20yarn%20samples&width=400&height=400&seq=pattern001&orientation=squarish',
    description: '초보자도 따라할 수 있는 베이직 라운드넥 스웨터 도안. 상세한 설명과 사진이 포함되어 있습니다.',
    tags: ['스웨터', '대바늘', '입문'],
    stock: 100,
    rating: 4.5,
    reviewCount: 156,
    isBest: true,
  },
  {
    id: 6,
    name: '코바늘 가방 도안 세트',
    category: 'pattern',
    subCategory: '소품',
    price: 12000,
    image: 'https://readdy.ai/api/search-image?query=crochet%20bag%20pattern%20booklet%20set%2C%20flat%20lay%20on%20white%20background%2C%20handcraft%20instruction%20with%20finished%20bag%20photo%2C%20clean%20minimal%20product%20photography&width=400&height=400&seq=pattern002&orientation=squarish',
    description: '토트백, 버킷백, 클러치 3종 도안 세트. 여름 시즌에 딱 맞는 코바늘 가방 도안입니다.',
    tags: ['가방', '코바늘', '세트'],
    stock: 80,
    rating: 4.8,
    reviewCount: 92,
    isNew: true,
  },
  {
    id: 7,
    name: '아미구루미 동물 도안 모음',
    category: 'pattern',
    subCategory: '인형',
    price: 15000,
    originalPrice: 18000,
    image: 'https://readdy.ai/api/search-image?query=amigurumi%20animal%20crochet%20pattern%20book%20with%20cute%20bear%20rabbit%20bunny%20illustrations%2C%20white%20background%2C%20handmade%20toy%20craft%20instruction%20booklet&width=400&height=400&seq=pattern003&orientation=squarish',
    description: '곰, 토끼, 고양이 등 10가지 동물 아미구루미 도안 모음집. 선물용으로도 인기 있는 도안입니다.',
    tags: ['아미구루미', '인형', '코바늘'],
    stock: 60,
    rating: 4.9,
    reviewCount: 201,
    isBest: true,
  },
  {
    id: 8,
    name: '레이스 숄 도안',
    category: 'pattern',
    subCategory: '의류',
    price: 10000,
    image: 'https://readdy.ai/api/search-image?query=delicate%20lace%20shawl%20knitting%20pattern%20booklet%2C%20elegant%20craft%20instruction%20on%20white%20background%2C%20fine%20lacework%20design%20illustration%2C%20premium%20handmade%20fashion&width=400&height=400&seq=pattern004&orientation=squarish',
    description: '우아한 레이스 패턴의 숄 도안. 중급 이상 수준에 적합하며 완성 후 고급스러운 작품이 됩니다.',
    tags: ['레이스', '숄', '대바늘', '중급'],
    stock: 45,
    rating: 4.7,
    reviewCount: 78,
  },
];
