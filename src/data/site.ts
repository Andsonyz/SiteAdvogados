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

export interface MediaAsset { src: string; alt: string; width: number; height: number; srcSet?: string; sizes?: string }
export interface AttendanceStep { title: string; summary: string; detail: string; illustration: MediaAsset }
export interface Review { id: string; author: string; text: string; context?: string }

const brandSignature = { alt: 'Iara Santos — Advocacia e Assessoria Jurídica', width: 1283, height: 567 }
export const brandAssets = {
  light: { ...brandSignature, src: '/images/marca-iara-marfim-384.webp', srcSet: '/images/marca-iara-marfim-192.webp 192w, /images/marca-iara-marfim-384.webp 384w, /images/marca-iara-marfim-768.webp 768w', sizes: '(max-width: 1023px) 192px, 224px' },
  header: { ...brandSignature, src: '/images/marca-iara-marfim-384.webp', srcSet: '/images/marca-iara-marfim-192.webp 192w, /images/marca-iara-marfim-384.webp 384w, /images/marca-iara-marfim-768.webp 768w', sizes: '(max-width: 639px) 124px, 144px' },
  ink: { ...brandSignature, src: '/images/marca-iara-vinho-384.webp', srcSet: '/images/marca-iara-vinho-192.webp 192w, /images/marca-iara-vinho-384.webp 384w, /images/marca-iara-vinho-768.webp 768w', sizes: '(max-width: 639px) 96px, 112px' },
} satisfies Record<string, MediaAsset>

export const artwork = {
  retirement: { src: '/images/documento-relogio.webp', alt: 'Documento e relógio em uma composição âmbar', width: 900, height: 600, srcSet: '/images/documento-relogio-320.webp 320w, /images/documento-relogio-640.webp 640w, /images/documento-relogio.webp 900w', sizes: '(max-width: 1023px) 144px, 192px' },
  care: { src: '/images/acolhimento.webp', alt: 'Mãos acolhendo figuras humanas', width: 900, height: 600, srcSet: '/images/acolhimento-320.webp 320w, /images/acolhimento-640.webp 640w, /images/acolhimento.webp 900w', sizes: '(max-width: 1023px) 144px, 192px' },
  conversation: { src: '/images/conversa.webp', alt: 'Balões de conversa que representam o atendimento online', width: 900, height: 600, srcSet: '/images/conversa-320.webp 320w, /images/conversa-640.webp 640w, /images/conversa.webp 900w', sizes: '(max-width: 1023px) 96px, 104px' },
  books: { src: '/images/livros-caneta.webp', alt: 'Livros jurídicos em couro e caneta-tinteiro', width: 1100, height: 550, srcSet: '/images/livros-caneta-320.webp 320w, /images/livros-caneta-640.webp 640w, /images/livros-caneta.webp 1100w', sizes: '(max-width: 639px) 120px, (max-width: 1023px) 160px, 224px' },
  scales: { src: '/images/balanca.webp', alt: 'Balança da Justiça em latão envelhecido', width: 850, height: 777, srcSet: '/images/balanca-320.webp 320w, /images/balanca-640.webp 640w, /images/balanca.webp 850w', sizes: '(max-width: 639px) 112px, 208px' },
  gavel: { src: '/images/martelo.webp', alt: 'Martelo de julgamento em madeira de nogueira', width: 1100, height: 550, srcSet: '/images/martelo-320.webp 320w, /images/martelo-640.webp 640w, /images/martelo.webp 1100w', sizes: '(max-width: 1023px) 144px, 208px' },
  justice: { src: '/images/justica.webp', alt: 'Estátua da Justiça em bronze, com balança e espada', width: 800, height: 1200, srcSet: '/images/justica-320.webp 320w, /images/justica-640.webp 640w, /images/justica.webp 800w', sizes: '(max-width: 639px) 112px, 208px' },
  collection: { src: '/images/conjunto-juridico.webp', alt: 'Composição de balança jurídica, livros e caneta-tinteiro', width: 1100, height: 563, srcSet: '/images/conjunto-juridico-320.webp 320w, /images/conjunto-juridico-640.webp 640w, /images/conjunto-juridico.webp 1100w', sizes: '(max-width: 1023px) 192px, 240px' },
} satisfies Record<string, MediaAsset>

interface SiteContent {
  professional: {
    name: string
    specialty: string
    oab: string
    experience: string
    location: string
    logo: MediaAsset
    portrait: MediaAsset
  }
  contact: { whatsapp: string; phone: string; message: string; instagram: string; instagramLabel: string; cta: string; region: string; online: string }
  navigation: { label: string; id: string }[]
  hero: { title: string; eyebrow: string; description: string; editorial: string; discover: string; experienceLabel: string }
  approach: { label: string; items: { title: string; description: string; illustration: MediaAsset }[] }
  about: { label: string; title: string; quote: string; paragraphs: string[]; signature: string }
  areas: { label: string; title: string; description: string }
  services: Service[]
  attendance: { label: string; title: string; description: string; expandLabel: string; collapseLabel: string; steps: AttendanceStep[] }
  faq: { label: string; title: string; description: string; items: { question: string; answer: string }[]; disclaimer: string }
  reviews: { label: string; title: string; empty: string; items: Review[] }
  closing: { label: string; title: string; description: string }
  footer: { rights: string; disclaimer: string }
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
    logo: brandAssets.light,
    portrait: {
      src: '/images/iara-santos-1050.webp', // Derivados do original preservado, sem alteração da aparência.
      srcSet: '/images/iara-santos-360.webp 360w, /images/iara-santos-480.webp 480w, /images/iara-santos-640.webp 640w, /images/iara-santos-1050.webp 1050w',
      sizes: '(max-width: 359px) calc(75vw - 30px), (max-width: 639px) calc(75vw - 36px), (max-width: 1023px) 60vw, 700px',
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
    cta: 'Agendar uma conversa pelo WhatsApp',
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
    title: 'Seus direitos previdenciários, tratados com dignidade e escuta.',
    eyebrow: 'Advocacia previdenciária humanizada · Mossoró/RN',
    description: 'Orientação jurídica em aposentadorias e BPC para compreender seus direitos e definir os próximos passos com clareza.',
    editorial: 'Dignidade, responsabilidade e atenção à sua trajetória.',
    discover: 'Conhecer a atuação',
    experienceLabel: 'de atuação e dedicação',
  },
  approach: {
    label: 'Princípios do atendimento',
    items: [
      { title: 'Escuta antes da análise', description: 'Cada pessoa apresenta uma trajetória singular. O atendimento parte da compreensão de sua história, de suas dúvidas e de suas necessidades.', illustration: { ...artwork.conversation, sizes: '(max-width: 639px) 200px, (max-width: 1023px) 320px, 480px' } },
      { title: 'Clareza em cada etapa', description: 'Informações jurídicas apresentadas de forma acessível, para que você compreenda os requisitos aplicáveis e os próximos passos de sua situação.', illustration: { ...artwork.books, sizes: '(max-width: 639px) 200px, (max-width: 1023px) 320px, 480px' } },
      { title: 'Acompanhamento próximo', description: 'Um atendimento individualizado, com espaço para esclarecer dúvidas e receber orientações que considerem as particularidades de cada caso.', illustration: { ...artwork.care, sizes: '(max-width: 639px) 200px, (max-width: 1023px) 320px, 480px' } },
    ],
  },
  about: {
    label: 'Sobre a advogada',
    title: 'Por trás de cada processo, existe uma vida inteira de trabalho.',
    quote: 'Advocacia previdenciária é, antes de tudo, cuidar de pessoas.',
    paragraphs: [
      'Sou Iara Santos, advogada com 10 anos de experiência e atuação voltada ao Direito Previdenciário. Dedico meu trabalho à orientação sobre aposentadorias e o Benefício de Prestação Continuada (BPC), com responsabilidade técnica e respeito à trajetória de cada pessoa.',
      'A análise de uma situação previdenciária exige atenção ao histórico apresentado e às circunstâncias individuais. Por isso, meu atendimento valoriza a escuta, o esclarecimento de dúvidas e a apresentação de informações compreensíveis.',
      'Meu compromisso é oferecer uma orientação responsável sobre os próximos passos, considerando as particularidades de cada caso. O atendimento é realizado online, pelo WhatsApp, e presencialmente em Mossoró/RN e região.',
    ],
    signature: 'Iara Santos · Advocacia Previdenciária',
  },
  areas: {
    label: 'Áreas de atuação',
    title: 'Proteção social para os momentos que mais importam.',
    description: 'Atuação concentrada em aposentadorias e BPC, com orientação jurídica individualizada e atenção às particularidades de cada situação.',
  },
  services: [
    {
      slug: 'aposentadorias', number: '01', category: 'Direito previdenciário',
      title: 'Aposentadorias', shortTitle: 'Aposentadorias',
      description: 'Orientação para compreender seu histórico de contribuições, identificar os requisitos aplicáveis e organizar os próximos passos para o pedido de aposentadoria.',
      linkLabel: 'Conhecer aposentadorias',
      introduction: 'Uma trajetória de trabalho merece análise cuidadosa e orientação jurídica responsável.',
      heading: 'Informação para compreender os próximos passos de sua aposentadoria.',
      paragraphs: [
        'A análise da aposentadoria considera o histórico de contribuições, a idade e as regras aplicáveis à situação apresentada. Esses elementos devem ser avaliados em conjunto, respeitando as particularidades de cada trajetória.',
        'No atendimento, você poderá apresentar seu histórico e esclarecer dúvidas sobre os requisitos e os próximos passos. A orientação sobre documentos é individualizada e depende das informações analisadas.',
      ],
      topics: ['Análise do histórico de contribuições apresentado', 'Esclarecimento dos requisitos aplicáveis', 'Orientação sobre próximos passos e documentos'],
      note: 'As informações são gerais. A orientação sobre os requisitos aplicáveis depende da análise individual do caso.',
    },
    {
      slug: 'bpc', number: '02', category: 'Benefício assistencial',
      title: 'Benefício de Prestação Continuada', shortTitle: 'Benefício de Prestação Continuada — BPC',
      description: 'Orientação sobre o benefício assistencial destinado a pessoas idosas e pessoas com deficiência, observados os requisitos legais e as circunstâncias de cada situação.',
      linkLabel: 'Conhecer o BPC',
      introduction: 'Orientação responsável para compreender o benefício assistencial e os requisitos de acesso.',
      heading: 'Proteção assistencial com atenção às circunstâncias de cada pessoa.',
      paragraphs: [
        'O Benefício de Prestação Continuada (BPC) é um benefício assistencial destinado a pessoas idosas a partir de 65 anos e pessoas com deficiência de qualquer idade, desde que atendidos os requisitos legais.',
        'O BPC não é uma aposentadoria: não exige contribuições ao INSS, não paga décimo terceiro e não gera pensão por morte. A concessão depende do cumprimento dos requisitos e da análise da situação individual.',
        'O atendimento permite esclarecer dúvidas sobre os requisitos, apresentar as circunstâncias individuais e receber orientação sobre os próximos passos e os documentos pertinentes à análise.',
      ],
      topics: ['Esclarecimento dos requisitos do benefício', 'Orientação sobre a análise socioeconômica', 'Atenção às particularidades e aos documentos do caso'],
      note: 'As informações são gerais. O atendimento não representa garantia de concessão do benefício.',
    },
  ],
  attendance: {
    label: 'Como funciona o atendimento',
    title: 'Um atendimento que começa pela escuta.',
    description: 'Sem respostas padronizadas. Cada orientação considera as informações apresentadas e as particularidades de sua situação.',
    expandLabel: 'Ver detalhes',
    collapseLabel: 'Fechar detalhes',
    steps: [
      { title: 'Primeiro contato', summary: 'Envie uma mensagem pelo WhatsApp e apresente, de forma breve, a orientação de que necessita.', detail: 'O contato inicial permite obter informações sobre o atendimento online ou presencial em Mossoró/RN e região e apresentar o motivo de sua procura.', illustration: { src: '/images/atendimento-contato.webp', alt: '', width: 480, height: 360 } },
      { title: 'Escuta e análise', summary: 'Compartilhe sua trajetória e suas dúvidas para uma compreensão individualizada da situação.', detail: 'A orientação considera o histórico e as informações apresentados. As dúvidas sobre aposentadorias ou BPC são examinadas de acordo com as particularidades de cada caso.', illustration: { src: '/images/atendimento-conversa.webp', alt: '', width: 480, height: 360 } },
      { title: 'Orientação transparente', summary: 'Compreenda os próximos passos e os documentos pertinentes à análise de seu caso.', detail: 'Após a apresentação da situação, a orientação esclarece os próximos passos e a documentação necessária. Não há antecipação de resultados ou garantia de concessão de benefício.', illustration: { src: '/images/atendimento-documentos.webp', alt: '', width: 480, height: 360 } },
    ],
  },
  faq: {
    label: 'Dúvidas frequentes', title: 'Informação também é uma forma de proteção.',
    description: 'Reunimos respostas às principais dúvidas sobre aposentadorias, BPC e as modalidades de atendimento.',
    items: [
      { question: 'Como saber se já posso me aposentar?', answer: 'A verificação depende da análise de sua idade, de seu histórico de contribuições e das regras aplicáveis à situação apresentada. No atendimento, esses elementos poderão ser examinados para orientar os próximos passos.' },
      { question: 'O BPC é uma aposentadoria?', answer: 'Não. O Benefício de Prestação Continuada (BPC) é um benefício assistencial destinado a pessoas idosas a partir de 65 anos e pessoas com deficiência de qualquer idade, desde que atendidos os requisitos legais. Ele não exige contribuições ao INSS, não paga décimo terceiro e não gera pensão por morte.' },
      { question: 'Nunca contribuí para o INSS. Posso solicitar o BPC?', answer: 'A contribuição prévia ao INSS não é requisito para solicitar o BPC. A concessão depende do atendimento aos requisitos legais, da análise socioeconômica e, para pessoas com deficiência, das avaliações exigidas.' },
      { question: 'Como funciona o atendimento online?', answer: 'O atendimento online é realizado pelo WhatsApp. Apresente brevemente sua necessidade para receber informações sobre o atendimento e a forma de encaminhar sua situação.' },
      { question: 'Existe atendimento presencial?', answer: 'Sim. O atendimento presencial ocorre em Mossoró/RN e região. Consulte a disponibilidade e combine o atendimento por meio do WhatsApp.' },
      { question: 'Como iniciar o atendimento?', answer: 'Utilize o botão de WhatsApp disponível nesta página ou envie uma mensagem para (84) 98136-3772. O contato inicial permite apresentar sua necessidade e obter informações sobre o atendimento.' },
    ],
    disclaimer: 'Não há promessa de resultado. Cada situação exige análise individual e orientação jurídica adequada às suas particularidades.',
  },
  reviews: {
    label: 'Avaliações',
    title: 'Cada história importa.',
    empty: 'Ainda não há avaliações publicadas.',
    items: [], // Adicionar somente relatos reais com autorização. Ver README.
  },
  closing: {
    label: 'Vamos conversar?', title: 'Você não precisa buscar seus direitos sozinho.',
    description: 'O primeiro passo é uma conversa. Entre em contato para obter informações sobre o atendimento e apresentar sua situação.',
  },
  footer: { rights: 'Todos os direitos reservados.', disclaimer: 'Conteúdo de caráter informativo. A orientação jurídica depende da análise individual de cada situação.' },
  ui: {
    skip: 'Pular para o conteúdo', openMenu: 'Abrir menu', closeMenu: 'Fechar menu', contact: 'Entre em contato',
    back: 'Voltar ao início', home: 'Página inicial', notFoundLabel: 'Página não encontrada · 404',
    notFoundTitle: 'Vamos encontrar o caminho de volta.',
    notFoundText: 'Este endereço não está disponível. Volte à página inicial para conhecer a atuação de Iara Santos ou entre em contato pelo WhatsApp.',
    serviceLabel: 'Pontos abordados na orientação', serviceContact: 'Apresente sua situação.',
    previous: 'Item anterior', next: 'Próximo item', railHint: 'Deslize ou arraste para explorar. Use também as setas do teclado.',
    servicesRail: 'Áreas de atuação — serviços', reviewsRail: 'Avaliações publicadas',
  },
  seo: {
    title: 'Iara Santos | Advocacia Previdenciária',
    description: 'Iara Santos, advogada com 10 anos de experiência. Orientação responsável em aposentadorias e BPC, online e em Mossoró/RN e região.',
  },
}

export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(site.contact.message)}`

export const hasPublishedReviews = () => site.reviews.items.length > 0
export const visibleNavigation = () => site.navigation.filter(item => item.id !== 'avaliacoes' || hasPublishedReviews())
