import React from 'react';
import { Award, Compass, Heart, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function About() {
  const values = [
    { icon: <Award className="text-luxury-gold" size={24} />, title: "Artisan Heritage", desc: "We source authentic handblock prints, Bagh dyes, and Chanderi straight from craft weavers, maintaining standard pay parameters." },
    { icon: <Compass className="text-luxury-gold" size={24} />, title: "Curated Selection", desc: "Every thread count, GSM scale, and color-fastness rating is checked before adding a fabric roll to our showroom racks." },
    { icon: <ShieldCheck className="text-luxury-gold" size={24} />, title: "Wholesale Value", desc: "By bypassing intermediaries, we supply fine boutique-grade raw fabrics at competitive wholesale rates across Central India." },
    { icon: <Heart className="text-luxury-gold" size={24} />, title: "Boutique Support", desc: "We support over 250+ independent fashion designers, tailoring units, and home retailers with samples and custom batches." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-16">
      
      {/* Editorial Branding Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-600">The Boutique Roots</span>
            <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-navy-900 leading-tight">ANUMEET KATPIECE</h1>
            <h2 className="text-base md:text-lg font-bold text-luxury-gold uppercase tracking-wider">Fine Fabrics House since years of trust in Bhopal</h2>
            <div className="h-0.5 w-12 bg-luxury-gold"></div>
          </div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Located in the heart of Bhopal at Makan No. 13, Subhash Nagar, ANUMEET KATPIECE began with a simple vision: to bridge the gap between regional handloom weavers and modern fashion boutiques. Sourcing finest quality dress materials, Rayons, Roman Silks, Bagh block prints, and detailed border laces, we became a trusted household name for garment manufacturers and fashion designers alike.
          </p>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Whether you are crafting a single custom lehenga or cutting fabric volumes for a regional fashion startup, our dual pricing metrics (Retail + B2B Wholesale) allow buyers to sample swatches easily and purchase custom volumes without massive investment outlays.
          </p>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-slate-100 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800" 
              alt="Fabric Loom Showroom" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Gold badge ornament */}
          <div className="absolute -bottom-6 -left-6 bg-navy-900 text-white border border-luxury-gold p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-extrabold text-sm text-luxury-gold leading-none">Bhopal's Best</p>
              <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-1">Fabric Wholesale Sourcing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-600">Company Blueprint</span>
          <h3 className="text-xl md:text-3xl font-extrabold uppercase text-navy-900 tracking-wide">Our Brand Values</h3>
          <div className="h-0.5 w-12 bg-luxury-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <div key={idx} className="space-y-3 text-center md:text-left">
              <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto md:mx-0 shadow-sm">
                {val.icon}
              </div>
              <h4 className="font-bold text-xs uppercase text-navy-900 tracking-wider">{val.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bhopal Showroom section details */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-navy-950 text-white p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-red-600/10 blur-[100px] rounded-full"></div>
        <div className="space-y-4 relative z-10 text-center lg:text-left">
          <span className="bg-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-red-500/20 inline-block">
            Showroom Destination
          </span>
          <h3 className="text-xl md:text-3xl font-extrabold uppercase tracking-tight">Visit Us in Bhopal</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Our physical flag store displays over 1,000+ ready fabric rolls, design borders, laces, and suit materials. Drop by to feel the fabric weights, test color runs, and plan your custom boutique orders directly with our managers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs">
            <span className="flex items-center justify-center lg:justify-start gap-2 text-slate-300">
              <MapPin size={14} className="text-luxury-gold shrink-0" />
              Makan No. 13, Subhash Nagar Bhopal
            </span>
          </div>
        </div>
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative z-10 shadow-lg bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=800" 
            alt="Bhopal Showroom Interior" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </section>

    </div>
  );
}
