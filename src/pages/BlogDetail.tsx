import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getBlogBySlugFromDB } from '../lib/supabase';
import type { BlogPost } from '../types';

export function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setIsLoading(true);
      const data = await getBlogBySlugFromDB(slug);
      setPost(data);
      setIsLoading(false);
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-2xl rounded-3xl bg-white shadow-xl border border-slate-200 p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Artikel tidak ditemukan</h1>
          <p className="text-slate-600 mb-8">
            Maaf, kami tidak dapat menemukan artikel yang Anda cari. Silakan kembali ke halaman blog.
          </p>
          <Link to="/blog" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={`${post.title} | Blog Rental Mobil`}
        description={post.excerpt}
      />

      <section className="relative overflow-hidden bg-white pb-20">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-blue-600 to-transparent opacity-80" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="rounded-[2rem] bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <img src={post.image} alt={post.title} className="h-80 w-full object-cover" />
            <div className="p-10 lg:p-14">
              <div className="flex flex-wrap gap-3 mb-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-6">{post.title}</h1>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 mb-10">
                <span>Oleh {post.author}</span>
                <span>{post.date} · {post.readingTime}</span>
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-12">
                <Link
                  to="/blog"
                  className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                >
                  Kembali ke Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
