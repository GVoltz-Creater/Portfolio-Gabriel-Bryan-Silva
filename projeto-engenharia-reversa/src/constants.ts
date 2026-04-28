import { Dilemma, PhilosophicalTradition } from './types';

export const DILEMMAS: Dilemma[] = [
  {
    id: 1,
    title: "O Bonde",
    category: "Ética Clássica",
    scenario: "Um bonde desgovernado avança em direção a cinco trabalhadores. Você pode acionar uma alavanca e desviá-lo para outro trilho — onde há apenas um trabalhador. Você aciona a alavanca?",
    imageUrl: "https://images.unsplash.com/photo-1635331730009-880996168e27?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Sim — desvio o bonde para salvar cinco, sacrificando um.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 2 }
      },
      {
        id: 'B',
        text: "Não — não sou responsável pelo desastre; não devo intervir.",
        scores: { [PhilosophicalTradition.DEONTOLOGY]: 1, [PhilosophicalTradition.CONTRACTUALISM]: 1 }
      }
    ]
  },
  {
    id: 2,
    title: "O Homem na Ponte",
    category: "Ética Clássica",
    scenario: "O mesmo bonde desgovernado. Desta vez você está em uma passarela com um homem corpulento. Se o empurrar, ele cairá nos trilhos e seu corpo parará o bonde, salvando cinco. Você o empurra?",
    imageUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Sim — matematicamente salvo cinco vidas.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 2, [PhilosophicalTradition.PLURALISM]: 1 }
      },
      {
        id: 'B',
        text: "Não — usar o corpo de alguém como instrumento é diferente.",
        scores: { [PhilosophicalTradition.DEONTOLOGY]: 2, [PhilosophicalTradition.CONTRACTUALISM]: 1 }
      }
    ]
  },
  {
    id: 3,
    title: "O Transplante dos Órgãos",
    category: "Ética Médica",
    scenario: "Você é médico. Cinco pacientes morrerão sem transplante. Um paciente saudável chega para exame de rotina — seus órgãos são compatíveis com todos os cinco. Se o matar e distribuir seus órgãos, salvará cinco vidas. Ninguém saberá. O que faz?",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Sacrifico o paciente saudável para salvar os cinco.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 2, [PhilosophicalTradition.PLURALISM]: 1 }
      },
      {
        id: 'B',
        text: "Não. Um médico não pode matar um paciente, jamais.",
        scores: { [PhilosophicalTradition.DEONTOLOGY]: 2, [PhilosophicalTradition.CONTRACTUALISM]: 2 }
      }
    ]
  },
  {
    id: 4,
    title: "O Véu da Ignorância",
    category: "Justiça Distributiva",
    scenario: "Você deve projetar a sociedade em que viverá — mas não sabe quem você será nela: rico ou pobre, saudável ou doente, maioria ou minoria. Por trás deste 'véu da ignorância', qual sistema você escolhe?",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Uma sociedade meritocrática, onde cada um colhe o que semeia — mesmo com grandes desigualdades.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 1, [PhilosophicalTradition.PLURALISM]: 2 }
      },
      {
        id: 'B',
        text: "Uma sociedade que maximiza o bem-estar dos mais vulneráveis, mesmo que limite as recompensas do topo.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 1, [PhilosophicalTradition.DEONTOLOGY]: 1, [PhilosophicalTradition.CONTRACTUALISM]: 2 }
      }
    ]
  },
  {
    id: 5,
    title: "O Carro Autônomo",
    category: "Ética da IA",
    scenario: "Um carro autônomo perde os freios. Pode: seguir em frente e atropelar um idoso fora da faixa, ou desviar e atropelar uma criança na calçada. Você é o engenheiro que programa a decisão. O que o carro deve fazer?",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Seguir em frente — o carro não deve fazer julgamentos morais sobre vidas.",
        scores: { [PhilosophicalTradition.DEONTOLOGY]: 2, [PhilosophicalTradition.CONTRACTUALISM]: 1, [PhilosophicalTradition.PLURALISM]: 1 }
      },
      {
        id: 'B',
        text: "Desviar para salvar a criança — o futuro potencial de uma vida mais longa pesa mais.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 2, [PhilosophicalTradition.PLURALISM]: 1 }
      }
    ]
  },
  {
    id: 6,
    title: "O Juiz e o Inocente",
    category: "Relativismo Moral",
    scenario: "Uma cidade está à beira de um linchamento que matará 20 inocentes. Você, the juiz, sabe que o réu é inocente — mas se o condenar falsamente, a multidão se dispersa. Você pode fabricar evidências. O que faz?",
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Condeno o inocente para salvar 20 vidas — o resultado justifica o meio.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 2, [PhilosophicalTradition.PLURALISM]: 1 }
      },
      {
        id: 'B',
        text: "Absolvo o inocente e aceito as consequências — a lei não pode ser corrompida.",
        scores: { [PhilosophicalTradition.DEONTOLOGY]: 2, [PhilosophicalTradition.CONTRACTUALISM]: 2 }
      }
    ]
  },
  {
    id: 7,
    title: "A Geração Futura",
    category: "Ética Ambiental",
    scenario: "Uma corporação pode lançar resíduos em um rio agora, gerando empregos para 10.000 pessoas. Porém, tornará o rio inutilizável por 200 anos, prejudicando gerações futuras que não podem votar nem protestar. O que deve prevalecer?",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
    choices: [
      {
        id: 'A',
        text: "Os interesses das pessoas vivas e presentes têm prioridade sobre gerações hipotéticas futuras.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 1, [PhilosophicalTradition.PLURALISM]: 2 }
      },
      {
        id: 'B',
        text: "As gerações futuras têm direitos que devemos proteger, mesmo a um custo presente real.",
        scores: { [PhilosophicalTradition.UTILITARIANISM]: 1, [PhilosophicalTradition.DEONTOLOGY]: 1, [PhilosophicalTradition.CONTRACTUALISM]: 2 }
      }
    ]
  }
];

export const SYSTEM_PROMPT = `Você é o Motor Filosófico do Machine Moral, uma plataforma interativa de ética aplicada.

Seu papel é conduzir o usuário por dilemas morais clássicos da filosofia ocidental, analisar as escolhas feitas e, ao final, construir um perfil ético detalhado e personalizado.

---

## QUADRO TEÓRICO

Você avalia cada resposta segundo quatro tradições filosóficas:

1. **Utilitarismo** (Bentham, Mill, Singer)
   - Ações são corretas se maximizam bem-estar para o maior número.
   - Foco: consequências, cálculo agregado, custo-benefício.

2. **Deontologia** (Kant, Nozick)
   - Certas ações são intrinsecamente certas ou erradas, independentemente das consequências.
   - Foco: dever, direitos individuais, imperativo categórico, dignidade humana.

3. **Contratualismo** (Rawls, Scanlon)
   - Princípios morais são aqueles que nenhuma pessoa poderia razoavelmente rejeitar.
   - Foco: equidade, véu da ignorância, proteção dos mais vulneráveis.

4. **Pluralismo / Relativismo Contextual** (Berlin, Williams)
   - Valores morais genuínos podem entrar em conflito sem resolução única.
   - Foco: contexto, intuição, particularidade, resistência a teorias totalizantes.

---

## REGRAS DE CONDUTA

- Tom: intelectualmente rigoroso, mas acessível. Nunca condescendente.
- Nunca julgue uma escolha como "errada" ou "cruel".
- Cite filósofos pelo nome e obra quando relevante.
- Use dados reais quando pertinente.
- Responda sempre em português do Brasil.
- Seja conciso nas análises intermediárias (máx. 5 linhas). Reserve a profundidade para o perfil final.`;
