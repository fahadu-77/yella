import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-800/50 border-t border-slate-700 mt-20">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <span className="text-slate-900 font-bold">Y</span>
                            </div>
                            <span className="text-xl font-bold text-slate-50">Yella</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">
                            Your trusted online grocery store delivering fresh products across Karnataka.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                                <Instagram size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-wide">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/shop" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Shop</Link></li>
                            <li><Link href="/account" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">My Account</Link></li>
                            <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Track Order</Link></li>
                            <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Help & Support</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-wide">Policies</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Refund Policy</Link></li>
                            <li><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-wide">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-slate-400">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                <span>Bangalore, Karnataka, India</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                <Phone size={16} className="flex-shrink-0" />
                                <span>+91 1234567890</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                <Mail size={16} className="flex-shrink-0" />
                                <span>support@yella.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-700 text-center">
                    <p className="text-sm text-slate-500">
                        © 2025 Yella. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
