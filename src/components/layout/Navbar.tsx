import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, X, ArrowRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { state } = useSimulation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/digital-twin', label: 'Digital Twin', badge: 'Live' },
    { path: '/impact', label: 'Impact & ROI' },
    { path: '/fleet', label: 'Fleet Hubs' },
    { path: '/pitch', label: 'Pitch One-Pager' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b-2 border-[#242424] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Solid Red Dot */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#E4002B] flex items-center justify-center text-white shadow-md">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                THERMO-BLOOM
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4002B] inline-block ml-0.5 animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold font-display uppercase tracking-wider transition-all border-2 ${
                    isActive
                      ? 'bg-[#E4002B] text-white border-[#E4002B]'
                      : 'bg-transparent text-white border-transparent hover:border-[#242424] hover:bg-[#161616]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Persistent Right CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right font-mono-code text-[11px] text-slate-400">
              <span className="text-white font-bold">{state.reactorWaterTemp}°C</span> Reactor |{' '}
              <span className="text-[#E4002B] font-bold">{state.coolingEnergyOffsetPercent}%</span> AC Cut
            </div>

            <Link
              to="/digital-twin"
              className="btn-red px-4 py-2 rounded-md text-xs uppercase tracking-wider font-display font-extrabold flex items-center gap-2 shadow-lg"
            >
              <span>Launch Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-[#161616] text-white border-2 border-[#242424]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b-2 border-[#242424] px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-xs font-bold font-display uppercase tracking-wider border-2 ${
                  isActive
                    ? 'bg-[#E4002B] text-white border-[#E4002B]'
                    : 'bg-[#161616] text-white border-[#242424]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/digital-twin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-red py-3 rounded-md text-xs uppercase tracking-wider font-display font-extrabold flex items-center justify-center gap-2"
            >
              <span>Launch Digital Twin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
