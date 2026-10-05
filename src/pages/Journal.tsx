import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const essays = [
  {
    n: '03',
    title: 'On the quiet dignity of things made by hand',
    date: 'October 12, MMXXVI',
    read: '8 minutes',
    excerpt: 'A visit to Nao Matsumoto’s pottery studio in the hills above Kyoto — where mistakes are called “conversation” and speed is quietly refused.',
    image: '/craft-workshop.jpg',
    tag: 'Craft',
  },
  {
    n: '02',
    title: 'A short manifesto against the beige aesthetic',
    date: 'September 20, MMXXVI',
    read: '5 minutes',
    excerpt: 'We love muted palettes. But there is a difference between quietness and absence. Notes from a room that finally learned to breathe.',
    image: '/editorial-bedroom.jpg',
    tag: 'Interior',
  },
  {
    n: '01',
    title: 'How to buy less and love more',
    date: 'August 03, MMXXVI',
    read: '4 minutes',
    excerpt: 'A practical guide to composing a home the way one composes a life — slowly, patiently, and with room to be surprised.',
    image: '/hero-interior.jpg',
    tag: 'Living',
  },
];

export default function Journal() {
  return (
    <div>
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-16">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-[color:var(--color-mud)]" />
          The Journal — Volume II
        </div>
        <h1 className="font-display text-6xl md:text-8xl lg:text-[144px] leading-[0.85] tracking-[-0.035em]">
          Words on <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">rooms</span>, <br />
          objects and the <span className="font-display-wonk italic">slow life</span>.
        </h1>
      </section>

      {/* Featured essay */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pb-24">
        <Link to="/journal" className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 aspect-[4/3] overflow-hidden bg-[color:var(--color-cream)]">
            <img src={essays[0].image} alt="" className="w-full h-full object-cover img-hover" />
          </div>
          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-5 flex items-center gap-3">
              <span className="tabular text-[color:var(--color-terracotta)]">Essay N°{essays[0].n}</span>
              <span className="w-6 h-px bg-[color:var(--color-mist)]" />
              <span>{essays[0].tag}</span>
            </div>
            <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight">
              {essays[0].title}
            </h2>
            <p className="mt-6 text-[color:var(--color-mud)] leading-relaxed max-w-lg">{essays[0].excerpt}</p>
            <div className="mt-8 flex items-center gap-6 text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">
              <span>{essays[0].date}</span>
              <span>{essays[0].read}</span>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] link-underline pb-1">
              Read the essay <ArrowUpRight strokeWidth={1.5} className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* Other essays */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {essays.slice(1).map((e) => (
            <Link to="/journal" key={e.n} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)]">
                <img src={e.image} alt="" className="w-full h-full object-cover img-hover" />
              </div>
              <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">
                <span className="tabular text-[color:var(--color-terracotta)]">N°{e.n}</span>
                <span className="w-6 h-px bg-[color:var(--color-mist)]" />
                <span>{e.tag}</span>
                <span>·</span>
                <span>{e.read}</span>
              </div>
              <h3 className="font-display text-3xl lg:text-4xl mt-3 leading-[1] tracking-tight max-w-md">
                {e.title}
              </h3>
              <p className="mt-4 text-[color:var(--color-mud)] leading-relaxed max-w-md">{e.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
