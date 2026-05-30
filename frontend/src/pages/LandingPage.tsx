import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, Globe, ChevronRight, Loader2, Compass, Layers, CheckCircle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || 'demo_public_key';

interface Option {
  id: string;
  name: string;
  code: string;
}

export default function LandingPage() {
  const [countries, setCountries] = useState<Option[]>([{ id: 'IN', name: 'India', code: 'IN' }]);
  const [states, setStates] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [subDistricts, setSubDistricts] = useState<Option[]>([]);
  const [villages, setVillages] = useState<Option[]>([]);

  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  const [hasSearched, setHasSearched] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    subDistricts: false,
    villages: false,
  });

  const apiHeaders = { 'X-API-Key': API_KEY };

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    setLoading(prev => ({ ...prev, states: true }));
    try {
      const res = await axios.get(`${API_URL}/v1/states`, { headers: apiHeaders });
      if (res.data.success) setStates(res.data.data);
    } catch (err) {
      console.error('Failed to fetch states', err);
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const fetchDistricts = async (stateId: string) => {
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const res = await axios.get(`${API_URL}/v1/states/${stateId}/districts`, { headers: apiHeaders });
      if (res.data.success) setDistricts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch districts', err);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchSubDistricts = async (districtId: string) => {
    setLoading(prev => ({ ...prev, subDistricts: true }));
    try {
      const res = await axios.get(`${API_URL}/v1/districts/${districtId}/subdistricts`, { headers: apiHeaders });
      if (res.data.success) setSubDistricts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch sub-districts', err);
    } finally {
      setLoading(prev => ({ ...prev, subDistricts: false }));
    }
  };

  const fetchVillages = async (subDistrictId: string) => {
    setLoading(prev => ({ ...prev, villages: true }));
    try {
      const res = await axios.get(`${API_URL}/v1/subdistricts/${subDistrictId}/villages?limit=500`, { headers: apiHeaders });
      if (res.data.success) setVillages(res.data.data);
    } catch (err) {
      console.error('Failed to fetch villages', err);
    } finally {
      setLoading(prev => ({ ...prev, villages: false }));
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setHasSearched(false);
    
    setSelectedDistrict('');
    setSelectedSubDistrict('');
    setSelectedVillage('');
    setDistricts([]);
    setSubDistricts([]);
    setVillages([]);

    if (stateId) fetchDistricts(stateId);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setHasSearched(false);
    
    setSelectedSubDistrict('');
    setSelectedVillage('');
    setSubDistricts([]);
    setVillages([]);

    if (districtId) fetchSubDistricts(districtId);
  };

  const handleSubDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subDistrictId = e.target.value;
    setSelectedSubDistrict(subDistrictId);
    setHasSearched(false);
    
    setSelectedVillage('');
    setVillages([]);

    if (subDistrictId) fetchVillages(subDistrictId);
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVillage(e.target.value);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50 font-serif selection:bg-amber-600 selection:text-emerald-950 flex flex-col scroll-smooth">
      
      {/* Fully Responsive Navbar */}
      <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-600 flex items-center justify-center">
              <Compass className="text-emerald-950" size={18} strokeWidth={2} />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-widest text-emerald-50 uppercase truncate">
              IndiaExplore
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 font-sans">
            <a href="#about" className="text-emerald-200 hover:text-amber-500 font-medium transition-colors text-sm uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm">About</a>
            <a href="#destinations" className="text-emerald-200 hover:text-amber-500 font-medium transition-colors text-sm uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm">Directory</a>
            <Link to="/login" className="bg-amber-600 hover:bg-amber-500 text-emerald-950 px-6 py-2.5 font-bold transition-colors text-sm uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Sign In</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-emerald-50 hover:text-amber-500 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-emerald-950 border-b border-emerald-900 px-4 py-6 flex flex-col space-y-6 font-sans shadow-2xl">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-emerald-200 hover:text-amber-500 font-medium transition-colors text-base uppercase tracking-widest w-full text-center">About</a>
            <a href="#destinations" onClick={() => setMobileMenuOpen(false)} className="text-emerald-200 hover:text-amber-500 font-medium transition-colors text-base uppercase tracking-widest w-full text-center">Directory</a>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-amber-600 hover:bg-amber-500 text-emerald-950 px-6 py-3.5 font-bold transition-colors text-base uppercase tracking-widest w-full text-center">Sign In</Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        
        {/* Responsive Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 lg:pr-10 w-full text-center lg:text-left">
            <div className="inline-block border border-emerald-800 px-3 py-1 mb-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 font-sans">
              Geospatial Data Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-6 sm:mb-8 text-emerald-50 leading-[1.1] sm:leading-[1.1]">
              The Definitive <br className="hidden sm:block"/>
              <span className="italic text-amber-600">Directory</span> of <br className="hidden sm:block"/>
              Indian Villages.
            </h1>
            <p className="text-lg sm:text-xl text-emerald-200/80 mb-10 sm:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              Access perfectly structured geographical data. Designed for enterprises requiring absolute precision from the State level all the way down to remote villages.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 font-sans w-full">
              <a href="#destinations" className="bg-amber-600 hover:bg-amber-500 text-emerald-950 px-8 py-4 font-bold transition-colors w-full sm:w-auto text-center uppercase tracking-widest text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950">
                Access Directory
              </a>
              <Link to="/login" className="bg-transparent border border-emerald-700 text-emerald-100 hover:bg-emerald-900 px-8 py-4 font-bold transition-colors w-full sm:w-auto text-center uppercase tracking-widest text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950">
                Create Account
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="border p-2 sm:p-3 border-emerald-900 bg-emerald-950">
              <img 
                src="/hero-developer.png" 
                alt="Professional accessing the platform" 
                className="w-full h-auto object-cover opacity-80 sepia-[0.3]"
              />
            </div>
          </div>
        </section>

        {/* FLAT, LUXURY SEARCH MODULE (Responsive Grid) */}
        <section id="destinations" className="bg-emerald-900 py-20 sm:py-32 scroll-mt-16 text-emerald-50 font-sans border-y border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10 sm:mb-16 border-b border-emerald-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-normal font-serif text-amber-500">Location Index</h2>
                <p className="text-emerald-300 mt-2 text-base sm:text-lg font-light">Hierarchical structure navigation system.</p>
              </div>
              <div className="text-emerald-500 text-xs sm:text-sm font-mono uppercase tracking-widest">
                System Active // v1.0
              </div>
            </div>

            <div className="bg-emerald-950 text-emerald-50 border border-emerald-800 p-6 sm:p-8 md:p-12">
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-emerald-800 bg-emerald-900">
                
                {/* 1. Country */}
                <div className="border-b md:border-b-0 md:border-r border-emerald-800 bg-emerald-950 p-4 sm:p-6 relative">
                  <label className="block text-xs font-bold text-amber-600 mb-2 sm:mb-3 uppercase tracking-widest">Country</label>
                  <div className="relative">
                    <select 
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      aria-label="Select Country"
                      className="w-full py-2 bg-transparent border-b-2 border-emerald-800 focus:border-amber-600 outline-none transition-colors appearance-none cursor-pointer text-emerald-50 font-bold"
                    >
                      {countries.map(c => <option key={c.id} value={c.id} className="bg-emerald-950">{c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* 2. State */}
                <div className="border-b md:border-b-0 md:border-r border-emerald-800 bg-emerald-950 p-4 sm:p-6 relative">
                  <label className="block text-xs font-bold text-amber-600 mb-2 sm:mb-3 uppercase tracking-widest flex items-center">
                    State {loading.states && <Loader2 className="ml-2 h-3 w-3 animate-spin text-amber-500"/>}
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedState}
                      onChange={handleStateChange}
                      aria-label="Select State"
                      className={`w-full py-2 bg-transparent border-b-2 focus:border-amber-600 outline-none transition-colors appearance-none font-bold ${!selectedCountry ? 'border-emerald-900 text-emerald-700 cursor-not-allowed' : 'border-emerald-800 text-emerald-50 cursor-pointer'}`}
                      disabled={!selectedCountry}
                    >
                      <option value="" className="bg-emerald-950 text-emerald-500">Select State</option>
                      {states.map(s => <option key={s.id} value={s.id} className="bg-emerald-950">{s.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* 3. District */}
                <div className="border-b md:border-b-0 md:border-r border-emerald-800 bg-emerald-950 p-4 sm:p-6 relative">
                  <label className="block text-xs font-bold text-amber-600 mb-2 sm:mb-3 uppercase tracking-widest flex items-center">
                    District {loading.districts && <Loader2 className="ml-2 h-3 w-3 animate-spin text-amber-500"/>}
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      aria-label="Select District"
                      className={`w-full py-2 bg-transparent border-b-2 focus:border-amber-600 outline-none transition-colors appearance-none font-bold ${!selectedState ? 'border-emerald-900 text-emerald-700 cursor-not-allowed' : 'border-emerald-800 text-emerald-50 cursor-pointer'}`}
                      disabled={!selectedState}
                    >
                      <option value="" className="bg-emerald-950 text-emerald-500">Select District</option>
                      {districts.map(d => <option key={d.id} value={d.id} className="bg-emerald-950">{d.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* 4. Mandal */}
                <div className="border-b md:border-b-0 md:border-r border-emerald-800 bg-emerald-950 p-4 sm:p-6 relative">
                  <label className="block text-xs font-bold text-amber-600 mb-2 sm:mb-3 uppercase tracking-widest flex items-center">
                    Mandal {loading.subDistricts && <Loader2 className="ml-2 h-3 w-3 animate-spin text-amber-500"/>}
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedSubDistrict}
                      onChange={handleSubDistrictChange}
                      aria-label="Select Mandal"
                      className={`w-full py-2 bg-transparent border-b-2 focus:border-amber-600 outline-none transition-colors appearance-none font-bold ${!selectedDistrict ? 'border-emerald-900 text-emerald-700 cursor-not-allowed' : 'border-emerald-800 text-emerald-50 cursor-pointer'}`}
                      disabled={!selectedDistrict}
                    >
                      <option value="" className="bg-emerald-950 text-emerald-500">Select Mandal</option>
                      {subDistricts.map(sd => <option key={sd.id} value={sd.id} className="bg-emerald-950">{sd.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* 5. Village */}
                <div className="bg-emerald-950 p-4 sm:p-6 relative">
                  <label className="block text-xs font-bold text-amber-600 mb-2 sm:mb-3 uppercase tracking-widest flex items-center">
                    Village {loading.villages && <Loader2 className="ml-2 h-3 w-3 animate-spin text-amber-500"/>}
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedVillage}
                      onChange={handleVillageChange}
                      aria-label="Select Village"
                      className={`w-full py-2 bg-transparent border-b-2 focus:border-amber-600 outline-none transition-colors appearance-none font-bold ${!selectedSubDistrict ? 'border-emerald-900 text-emerald-700 cursor-not-allowed' : 'border-emerald-800 text-emerald-50 cursor-pointer'}`}
                      disabled={!selectedSubDistrict}
                    >
                      <option value="" className="bg-emerald-950 text-emerald-500">Select Village</option>
                      {villages.map(v => <option key={v.id} value={v.id} className="bg-emerald-950">{v.name}</option>)}
                    </select>
                  </div>
                </div>

              </div>

              {/* Search Button */}
              <div className="mt-8 flex justify-center md:justify-end">
                <button
                  onClick={() => setHasSearched(true)}
                  disabled={!selectedVillage}
                  className={`flex items-center justify-center w-full md:w-auto px-8 sm:px-12 py-4 font-bold text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${selectedVillage ? 'bg-amber-600 hover:bg-amber-500 text-emerald-950' : 'bg-emerald-900 text-emerald-700 cursor-not-allowed'}`}
                >
                  Retrieve Data
                  <ChevronRight className="ml-3" size={18} />
                </button>
              </div>

              {/* Success Output */}
              {selectedVillage && hasSearched && (
                <div className="mt-8 sm:mt-12 p-6 sm:p-8 border border-amber-600/30 bg-emerald-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="w-full">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-500 mb-3 flex items-center uppercase tracking-widest">
                      <CheckCircle size={18} className="mr-2 shrink-0" /> Match Verified
                    </h3>
                    <p className="text-emerald-50 text-base sm:text-lg font-serif">
                      <strong className="text-lg sm:text-xl text-amber-100">{villages.find(v => v.id === selectedVillage)?.name}</strong> — {subDistricts.find(sd => sd.id === selectedSubDistrict)?.name}, {districts.find(d => d.id === selectedDistrict)?.name}, {states.find(s => s.id === selectedState)?.name}.
                    </p>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${villages.find(v => v.id === selectedVillage)?.name}, ${districts.find(d => d.id === selectedDistrict)?.name}, ${states.find(s => s.id === selectedState)?.name}, India`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto justify-center px-6 py-3.5 bg-emerald-950 border border-emerald-800 hover:bg-emerald-800 text-amber-500 font-bold transition-colors inline-flex items-center text-sm uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <Globe size={18} className="mr-3" /> View Coordinate
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Responsive Feature Highlights */}
        <section id="about" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-16 bg-emerald-950">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 space-y-8 sm:space-y-12">
              <div className="border-b border-emerald-800 pb-6 sm:pb-8">
                <h2 className="text-3xl sm:text-4xl font-normal font-serif text-emerald-50 mb-4 sm:mb-6">Structural Integrity</h2>
                <p className="text-emerald-200/80 text-base sm:text-lg leading-relaxed font-sans font-light">
                  We've normalized and mapped the complex hierarchy of Indian geographical data into a clean, utilitarian interface.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 font-sans">
                <div className="border border-emerald-800 p-6 sm:p-8 bg-emerald-900/50">
                  <div className="mb-4 sm:mb-6">
                    <Layers className="text-amber-600" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-100 mb-2 sm:mb-3 uppercase tracking-widest">Comprehensive</h3>
                  <p className="text-emerald-300 leading-relaxed text-xs sm:text-sm">Our database incorporates millions of precision data points mapping every remote geographical sector.</p>
                </div>
                
                <div className="border border-emerald-800 p-6 sm:p-8 bg-emerald-900/50">
                  <div className="mb-4 sm:mb-6">
                    <Compass className="text-amber-600" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-100 mb-2 sm:mb-3 uppercase tracking-widest">Hierarchical</h3>
                  <p className="text-emerald-300 leading-relaxed text-xs sm:text-sm">Navigate strictly from Country down through States, Districts, Mandals, into highly specific Villages.</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center">
              <div className="border border-emerald-900 p-2 sm:p-3 bg-emerald-900/50 w-full">
                <img 
                  src="/feature-map.png" 
                  alt="Digital Map Interface" 
                  className="w-full h-auto object-cover opacity-80 sepia-[0.3]"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      
      {/* Responsive Footer */}
      <footer className="bg-emerald-900 border-t border-emerald-800 py-12 sm:py-16 text-emerald-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm uppercase tracking-widest gap-6 sm:gap-0">
          <div className="text-emerald-50 font-bold text-center sm:text-left w-full sm:w-auto">
            &copy; {new Date().getFullYear()} IndiaExplore
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto">
            <a href="#" className="hover:text-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Privacy</a>
            <a href="#" className="hover:text-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Terms</a>
            <a href="#" className="hover:text-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
