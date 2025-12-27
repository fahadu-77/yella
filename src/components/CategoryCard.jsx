import Link from 'next/link';

export default function CategoryCard({ name, icon, href, image }) {
    return (
        <Link href={href || `/shop?category=${encodeURIComponent(name)}`}>
            <div className="card card-hover text-center cursor-pointer group">
                {/* Icon or Image */}
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    {image ? (
                        <img src={image} alt={name} className="w-10 h-10 object-contain" />
                    ) : icon ? (
                        <span className="text-3xl">{icon}</span>
                    ) : (
                        <div className="w-10 h-10 bg-emerald-500/30 rounded-full" />
                    )}
                </div>

                {/* Category Name */}
                <h3 className="text-sm font-semibold text-slate-50 group-hover:text-emerald-400 transition-colors">
                    {name}
                </h3>
            </div>
        </Link>
    );
}
