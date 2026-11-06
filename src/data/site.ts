export interface Service {
  slug: 'aposentadorias' | 'bpc'
  number: string
  category: string
  title: string
  shortTitle: string
  description: string
  linkLabel: string
  introduction: string
  heading: string
  paragraphs: string[]
  topics: string[]
  note: string
}

export interface MediaAsset { src: string; alt: string; width: number; height: number }
export interface Review { id: string; author: string; text: string; context?: string }

export const artwork = {
  retirement: { src: '/images/documento-relogio.webp', alt: 'Documento e relógio em uma composição âmbar', width: 900, height: 600 },
  care: { src: '/images/acolhimento.webp', alt: 'Mãos acolhendo figuras humanas', width: 900, height: 600 },
  conversation: { src: '/images/conversa.webp', alt: 'Balões de conversa que representam o atendimento online', width: 900, height: 600 },
  books: { src: '/images/livros-caneta.webp', alt: 'Livros jurídicos em couro e caneta-tinteiro', width: 1100, height: 550 },
  scales: { src: '/images/balanca.webp', alt: 'Balança da Justiça em latão envelhecido', width: 850, height: 777 },
  gavel: { src: '/images/martelo.webp', alt: 'Martelo de julgamento em madeira de nogueira', width: 1100, height: 550 },
  justice: { src: '/images/justica.webp', alt: 'Estátua da Justiça em bronze, com balança e espada', width: 800, height: 1200 },
  collection: { src: '/images/conjunto-juridico.webp', alt: 'Composição de balança jurídica, livros e caneta-tinteiro', width: 1100, height: 563 },
} satisfies Record<string, MediaAsset>

interface SiteContent {
  professional: {
    name: string
    specialty: string
    oab: string
    experience: string
    location: string
    logo: { src: string; alt: string; width: number; height: number }
    portrait: { src: string; alt: string; width: number; height: number }
  }
  contact: { whatsapp: string; phone: string; message: string; instagram: string; instagramLabel: string; cta: string; region: string; online: string }
  navigation: { label: string; id: string }[]
  hero: { eyebrow: string; description: string; editorial: string; discover: string; experienceLabel: string }
  about: { label: string; title: string; paragraphs: string[]; signature: string }
  areas: { label: string; title: string; description: string }
  services: Service[]
  attendance: { label: string; title: string; description: string; steps: { title: string; description: string }[] }
  faq: { label: string; title: string; description: string; items: { question: string; answer: string }[]; disclaimer: string }
  reviews: { label: string; title: string; empty: string; items: Review[] }
  closing: { label: string; title: string; description: string }
  footer: { rights: string }
  ui: { skip: string; openMenu: string; closeMenu: string; contact: string; back: string; home: string; notFoundLabel: string; notFoundTitle: string; notFoundText: string; serviceLabel: string; serviceContact: string; previous: string; next: string; railHint: string; servicesRail: string; reviewsRail: string }
  seo: { title: string; description: string }
}

export const site: SiteContent = {
  professional: {
    name: 'Iara Santos',
    specialty: 'Advocacia Previdenciária',
    oab: '', // Preencher somente com o registro correto, incluindo UF. Ex.: valor confirmado pela advogada.
    experience: '10 anos',
    location: 'Mossoró/RN',
    logo: { src: '/images/iara-santos-logo.webp', alt: 'Iara Santos — Advocacia Especializada', width: 512, height: 433 },
    portrait: {
      src: '/images/iara-santos.webp', // Conversão sem perdas do retrato original; PNG preservado ao lado.
      alt: 'Iara Santos, advogada com atuação em Direito Previdenciário',
      width: 1050,
      height: 1498,
    },
  },
  contact: {
    whatsapp: '5584981363772',
    phone: '(84) 98136-3772',
    message: 'Olá, Iara! Conheci seu site e gostaria de informações sobre o atendimento.',
    instagram: 'https://www.instagram.com/iarasantosadv/',
    instagramLabel: '@iarasantosadv',
    cta: 'Falar pelo WhatsApp',
    region: 'Presencial em Mossoró/RN e região',
    online: 'Online pelo WhatsApp',
  },
  navigation: [
    { label: 'Sobre', id: 'sobre' },
    { label: 'Áreas de atuação', id: 'atuacao' },
    { label: 'Atendimento', id: 'atendimento' },
    { label: 'Dúvidas', id: 'duvidas' },
    { label: 'Avaliações', id: 'avaliacoes' },
  ],
  hero: {
    eyebrow: 'Sua história merece atenção',
    description: 'Orientação em aposentadorias e BPC, com atenção à sua história.',
    editorial: 'Clareza para o próximo passo.',
    discover: 'Conheça minha atuação',
    experienceLabel: 'de experiência',
  },
  about: {
    label: 'Sobre a advogada',
    title: 'Antes de tudo,\na sua história.',
    paragraphs: [
      'Sou Iara Santos, advogada com 10 anos de experiência e atuação voltada ao Direito Previdenciário. Auxilio pessoas que buscam orientação sobre aposentadorias e o Benefício de Prestação Continuada (BPC), com atenção às particularidades de cada situação.',
      'Meu atendimento busca tornar as informações mais claras, esclarecer dúvidas e orientar cada pessoa sobre os próximos passos.',
      'Atendo presencialmente em Mossoró/RN e região e também online, pelo WhatsApp.',
    ],
    signature: 'Atenção a cada história. Clareza em cada orientação.',
  },
  areas: {
    label: 'Áreas de atuação',
    title: 'Orientação para\ncada momento.',
    description: 'Direito Previdenciário com uma escuta atenta às particularidades da sua situação.',
  },
  services: [
    {
      slug: 'aposentadorias', number: '01', category: 'Direito previdenciário',
      title: 'Aposentadorias', shortTitle: 'Aposentadorias',
      description: 'Orientação para compreender o histórico de contribuições, os requisitos aplicáveis e os próximos passos para solicitar a aposentadoria.',
      linkLabel: 'Conhecer aposentadorias',
      introduction: 'Sua trajetória de trabalho merece ser compreendida com atenção.',
      heading: 'Compreender sua história é o primeiro passo.',
      paragraphs: [
        'A aposentadoria pode trazer dúvidas sobre o histórico de contribuições e os requisitos aplicáveis. Uma orientação individual ajuda a compreender a sua situação e os próximos passos.',
        'No atendimento, você pode apresentar sua trajetória e esclarecer dúvidas. A orientação considera as particularidades do seu caso, sem antecipar conclusões antes dessa análise.',
      ],
      topics: ['Seu histórico de contribuições', 'Os requisitos aplicáveis à sua situação', 'Os próximos passos e documentos necessários'],
      note: 'As informações são gerais. A orientação sobre os requisitos aplicáveis depende da análise individual do caso.',
    },
    {
      slug: 'bpc', number: '02', category: 'Benefício assistencial',
      title: 'Benefício de Prestação Continuada', shortTitle: 'Benefício de Prestação Continuada — BPC',
      description: 'Orientação sobre o benefício assistencial para pessoas idosas e pessoas com deficiência, considerando os requisitos e as particularidades de cada situação.',
      linkLabel: 'Conhecer o BPC',
      introduction: 'Informação clara para compreender o BPC e seus requisitos.',
      heading: 'Um olhar atento para cada situação.',
      paragraphs: [
        'O Benefício de Prestação Continuada (BPC) é um benefício assistencial destinado a pessoas idosas a partir de 65 anos e pessoas com deficiência de qualquer idade, desde que atendidos os requisitos legais.',
        'O BPC não é uma aposentadoria: não exige contribuições ao INSS, não paga décimo terceiro e não gera pensão por morte. A concessão depende do cumprimento dos requisitos e da análise da situação individual.',
        'No atendimento, você pode apresentar sua situação, esclarecer dúvidas e receber orientação sobre os próximos passos e documentos necessários.',
      ],
      topics: ['A situação que motiva a busca pelo benefício', 'Os requisitos e a análise socioeconômica', 'Os próximos passos e documentos necessários'],
      note: 'As informações são gerais. O atendimento não representa garantia de concessão do benefício.',
    },
  ],
  attendance: {
    label: 'Como funciona o atendimento',
    title: 'O primeiro passo\né uma conversa.',
    description: 'Um atendimento próximo, com espaço para ouvir sua história e esclarecer suas dúvidas.',
    steps: [
      { title: 'Entre em contato', description: 'Inicie uma conversa pelo WhatsApp e conte brevemente o que você precisa.' },
      { title: 'Compartilhe sua situação', description: 'Apresente sua história e suas dúvidas para que sua necessidade seja compreendida.' },
      { title: 'Entenda os próximos passos', description: 'Receba orientação sobre os próximos passos e os documentos necessários.' },
    ],
  },
  faq: {
    label: 'Dúvidas frequentes', title: 'Informação que\ntraz clareza.',
    description: 'Algumas respostas para ajudar você a começar.',
    items: [
      { question: 'Como saber se já posso me aposentar?', answer: 'É necessário analisar seu histórico de contribuições, sua idade e as regras aplicáveis ao seu caso. No atendimento, você poderá apresentar sua situação e receber orientação sobre os próximos passos.' },
      { question: 'O BPC é uma aposentadoria?', answer: 'Não. O Benefício de Prestação Continuada (BPC) é um benefício assistencial destinado a pessoas idosas a partir de 65 anos e pessoas com deficiência de qualquer idade, desde que atendidos os requisitos legais. Ele não exige contribuições ao INSS, não paga décimo terceiro e não gera pensão por morte.' },
      { question: 'Nunca contribuí para o INSS. Posso solicitar o BPC?', answer: 'Sim, é possível solicitar mesmo sem ter contribuído. A concessão depende do cumprimento dos requisitos, incluindo a análise da situação socioeconômica e, para pessoas com deficiência, das avaliações exigidas.' },
      { question: 'Como funciona o atendimento online?', answer: 'O contato é realizado pelo WhatsApp. Envie uma mensagem contando brevemente sua necessidade para receber informações sobre como funciona o atendimento.' },
      { question: 'Existe atendimento presencial?', answer: 'Sim. Há atendimento presencial em Mossoró/RN e região. Entre em contato pelo WhatsApp para consultar a disponibilidade e combinar o atendimento.' },
      { question: 'Como entrar em contato?', answer: 'Clique em ‘Falar pelo WhatsApp’ ou envie uma mensagem para (84) 98136-3772.' },
    ],
    disclaimer: 'As informações desta seção são gerais. A orientação sobre cada situação depende da análise individual do caso.',
  },
  reviews: {
    label: 'Avaliações',
    title: 'Cada história importa.',
    empty: 'Ainda não há avaliações publicadas.',
    items: [], // Adicionar somente relatos reais com autorização. Ver README.
  },
  closing: {
    label: 'Vamos conversar?', title: 'Sua história é o\nponto de partida.',
    description: 'Entre em contato para tirar dúvidas sobre o atendimento e dar o próximo passo.',
  },
  footer: { rights: 'Todos os direitos reservados.' },
  ui: {
    skip: 'Pular para o conteúdo', openMenu: 'Abrir menu', closeMenu: 'Fechar menu', contact: 'Entre em contato',
    back: 'Voltar ao início', home: 'Página inicial', notFoundLabel: 'Página não encontrada · 404',
    notFoundTitle: 'Vamos encontrar o caminho de volta.',
    notFoundText: 'Este endereço não está disponível. Volte à página inicial para conhecer a atuação de Iara Santos ou entre em contato pelo WhatsApp.',
    serviceLabel: 'O que podemos conversar no atendimento', serviceContact: 'Converse sobre a sua situação.',
    previous: 'Item anterior', next: 'Próximo item', railHint: 'Deslize ou arraste para explorar. Use também as setas do teclado.',
    servicesRail: 'Áreas de atuação — serviços', reviewsRail: 'Avaliações publicadas',
  },
  seo: {
    title: 'Iara Santos | Advocacia Previdenciária',
    description: 'Iara Santos, advogada com 10 anos de experiência. Orientação em aposentadorias e BPC. Atendimento online e presencial em Mossoró/RN e região.',
  },
}

export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(site.contact.message)}`
