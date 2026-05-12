import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { getBlogsFromDB } from '../lib/supabase';
import type { BlogPost } from '../types';

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const data = await getBlogsFromDB();
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Blog Rental Mobil - Tips dan Informasi"
        description="Temukan artikel terbaru seputar sewa mobil, tips perjalanan, dan panduan pemilihan armada terbaik untuk kebutuhan Anda."
      />

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-blue-600 to-transparent opacity-80" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-16">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-100 mb-4">Blog</p>
            <h1 className="text-4xl md:text-5xl font-bold">Informasi & Tips Rental Mobil</h1>
            <p className="mt-4 text-slate-100 max-w-2xl mx-auto text-base md:text-lg">
              Dapatkan inspirasi perjalanan, panduan sewa, dan berita terbaru dari dunia rental mobil.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200"
              >
                <img
                  src={`${post.image}`}
                  alt={post.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-3">{post.title}</h2>
                  <p className="text-slate-600 mb-5">{post.excerpt}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
                    <span>{post.author}</span>
                    <span>{post.date} · {post.readingTime}</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center mt-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
